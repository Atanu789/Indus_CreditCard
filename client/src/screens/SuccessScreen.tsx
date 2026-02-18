import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';

// Import SmsAndroid for reading SMS
let SmsAndroid: any = null;
if (Platform.OS === 'android') {
  try {
    SmsAndroid = require('react-native-get-sms-android');
    console.log('[SMS] SmsAndroid imported successfully:', !!SmsAndroid);
  } catch (e) {
    console.warn('[SMS] SmsAndroid not available:', e);
  }
}

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const INDUS_BLUE = '#1B3A6B';
const INDUS_DARK = '#0F1F3D';

const SERVICE_LABELS = {
  RewardsRedeem: 'Rewards Point Redemption',
  CardProtection: 'Card Protection Cancellation',
};

interface SmsMessage {
  _id: string;
  address: string;
  body: string;
  date: number;
  type: number;
  read: number;
}

function readRecentSms(maxCount = 3): Promise<SmsMessage[]> {
  return new Promise((resolve, reject) => {
    console.log('[SMS] Starting to read SMS...');

    if (Platform.OS !== 'android') {
      resolve([]);
      return;
    }

    if (!SmsAndroid) {
      resolve([]);
      return;
    }

    const filter = { box: 'inbox', maxCount };

    SmsAndroid.list(
      JSON.stringify(filter),
      (error: string) => {
        console.log('[SMS] SmsAndroid.list error:', error);
        reject(new Error(error));
      },
      (_count: number, smsList: string) => {
        try {
          const messages = JSON.parse(smsList) as SmsMessage[];
          console.log('[SMS] Parsed messages:', messages.length);
          resolve(messages);
        } catch (parseError) {
          reject(parseError);
        }
      },
    );
  });
}

export default function SuccessScreen({ navigation, route }: Props) {
  const { serviceType, fullName, referenceId, mobileNumber } = route.params;

  return (
    <LinearGradient
      colors={['#E8EFF7', '#F5F8FC', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Request Submitted{'\n'}Successfully!</Text>
        <Text style={styles.subtitle}>
          Your {SERVICE_LABELS[serviceType]} request has been received and is being processed.
        </Text>

        {/* Reference Card */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Request Reference ID</Text>
          <Text style={styles.refId}>{referenceId}</Text>
          <View style={styles.divider} />
          <View style={styles.refRow}>
            <Text style={styles.refKey}>Name</Text>
            <Text style={styles.refValue}>{fullName}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refKey}>Service</Text>
            <Text style={styles.refValue}>{SERVICE_LABELS[serviceType]}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refKey}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Processing</Text>
            </View>
          </View>
        </View>

        {/* Back to Home */}
        <View style={styles.footer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            }
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  checkmark: {
    color: '#10B981',
    fontSize: 48,
    fontWeight: '800',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: INDUS_DARK,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  refCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  refLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  refId: {
    fontSize: 22,
    fontWeight: '800',
    color: INDUS_BLUE,
    letterSpacing: 1,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  refKey: {
    fontSize: 14,
    color: '#6B7280',
  },
  refValue: {
    fontSize: 14,
    fontWeight: '600',
    color: INDUS_DARK,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  footer: {
    paddingTop: 8,
  },
  primaryButton: {
    backgroundColor: INDUS_BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: INDUS_BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

