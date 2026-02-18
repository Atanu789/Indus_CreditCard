import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CardServices'>;

const INDUS_BLUE = '#1B3A6B';
const INDUS_RED = '#D42B2B';
const INDUS_DARK = '#0F1F3D';

const CARD_NAME = 'IndusInd Bank Credit Card';

export default function CardServicesScreen({ navigation, route }: Props) {
  const { simLabel } = route.params;

  const onContinue = () => {
    navigation.navigate('UserDetailsForm', {
      simLabel,
      serviceType: 'CardProtection',
      cardName: CARD_NAME,
    });
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC', '#EEF2F6']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 2 OF 4</Text>
        <Text style={styles.title}>Your Credit Card</Text>
        <Text style={styles.subtitle}>Review your card details</Text>
      </View>

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        <LinearGradient
          colors={['#0F1F3D', '#1B3A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Image
              source={require('../../assets/indus.webp')}
              style={styles.cardBankLogo}
              resizeMode="contain"
            />
            <Text style={styles.cardType}>PLATINUM</Text>
          </View>
          <View style={styles.cardChip} />
          <Text style={styles.cardNumber}>••••  ••••  ••••  4589</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardHolderText}>YOUR NAME</Text>
            </View>
            <View style={styles.visaLogo}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Card Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💳 Card Verification</Text>
        <Text style={styles.infoText}>
          We'll verify your credit card details in the next step to ensure secure access to your account.
        </Text>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: INDUS_BLUE,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: INDUS_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  cardPreview: {
    marginBottom: 24,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardBankLogo: {
    width: 80,
    height: 40,
    borderRadius: 6,
  },
  cardChip: {
    width: 48,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    marginBottom: 24,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardHolderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  visaLogo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  visaText: {
    color: INDUS_BLUE,
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: INDUS_DARK,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
  },
footer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: INDUS_BLUE,
    borderRadius: 12,
    paddingVertical: 16,
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
});
