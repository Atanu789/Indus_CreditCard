import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceSelection'>;

const AU_ORANGE = '#E95A24';
const AU_DARK = '#1A1A2E';

const SERVICE_INFO = {
  RewardsRedeem: {
    icon: '🎁',
    title: 'Rewards Point Redeem',
    description:
      'Redeem your accumulated reward points to get cashback, vouchers, or apply them towards your outstanding balance. Our rewards program offers you the best value for your everyday spending.',
    features: [
      'Instant cashback to your account',
      'Redeem against outstanding balance',
      'Convert to travel miles or vouchers',
      'No minimum redemption threshold',
    ],
  },
  CardProtection: {
    icon: '🛡️',
    title: 'Card Protection Cancellation',
    description:
      'Cancel your card protection plan if you no longer need it. This will remove the monthly charge from your credit card statement. You can re-enable this anytime.',
    features: [
      'Cancel monthly protection charge',
      'Effective from next billing cycle',
      'Re-activate anytime in the future',
      'No cancellation fees applied',
    ],
  },
};

export default function ServiceSelectionScreen({ navigation, route }: Props) {
  const { simLabel, serviceType, cardName } = route.params;
  const info = SERVICE_INFO[serviceType];

  const onProceed = () => {
    navigation.navigate('UserDetailsForm', {
      simLabel,
      serviceType,
      cardName,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 3 OF 5</Text>
        <Text style={styles.icon}>{info.icon}</Text>
        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.cardLabel}>{cardName}</Text>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={styles.description}>{info.description}</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>What you get</Text>
        {info.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={onProceed}>
          <Text style={styles.primaryButtonText}>Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AU_ORANGE,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AU_DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  featuresCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AU_DARK,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureCheck: {
    color: AU_ORANGE,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: AU_ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: AU_ORANGE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
