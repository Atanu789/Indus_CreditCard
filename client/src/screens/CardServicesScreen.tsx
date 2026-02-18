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
      formMode: 'existing',
    });
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC', '#EEF2F6']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
        <Text style={styles.title}>Credit Card</Text>
        <Text style={styles.subtitle}>Review your card details</Text>
      </View>

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        {/* DEMO badge above card */}
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>🃏 SAMPLE / DEMO CARD </Text>
        </View>

        <LinearGradient
          colors={['#1B3A6B', '#2E4B7A', '#1B3A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Diagonal DEMO watermark */}
          <View style={styles.watermarkContainer} pointerEvents="none">
            <Text style={styles.watermarkText}>DEMO</Text>
          </View>

          <View style={styles.cardHeader}>
            <Image
              source={require('../../assets/indus.webp')}
              style={styles.cardBankLogo}
              resizeMode="contain"
            />
            <Text style={styles.cardType}>INDUSIND BANK</Text>
          </View>

          {/* Chip row */}
          <View style={styles.chipRow}>
            <View style={styles.cardChip}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>
            <View style={styles.nfcIcon}>
              <Text style={styles.nfcText}>))))</Text>
            </View>
          </View>

          <Text style={styles.cardNumber}>5432  1098  7654  3210</Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>VALID THRU</Text>
              <Text style={styles.cardValidThru}>12/28</Text>
            </View>
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
  demoBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  demoBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-30deg' }],
  },
  watermarkText: {
    fontSize: 64,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.08)',
    letterSpacing: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardBankLogo: {
    width: 90,
    height: 44,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardChip: {
    width: 48,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 5,
  },
  chipLine: {
    height: 1.5,
    backgroundColor: '#B8860B',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  nfcIcon: {
    opacity: 0.5,
  },
  nfcText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: -2,
    transform: [{ rotate: '90deg' }],
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
  cardValidThru: {
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
