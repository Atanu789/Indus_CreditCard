import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SimData from 'react-native-sim-data';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SimSelect'>;

type SimCard = {
  carrierName?: string;
  displayName?: string;
  phoneNumber?: string;
  number?: string;
  msisdn?: string;
  slotIndex?: number;
  simSlotIndex?: number;
};

const INDUS_BLUE = '#1B3A6B';
const INDUS_DARK = '#0F1F3D';

// Fallback SIM data if device doesn't provide SIM info
const MOCK_SIMS: SimCard[] = [
  { carrierName: 'Airtel', displayName: 'Airtel India', phoneNumber: '+91 98765 43210', slotIndex: 0 },
  { carrierName: 'Jio', displayName: 'Jio 4G', phoneNumber: '+91 87654 32109', slotIndex: 1 },
];

function extractSimCards(): SimCard[] {
  try {
    const info = SimData.getSimInfo() as { cards?: unknown };
    console.log('SIM Info received:', info);
    
    if (!info || !info.cards || !Array.isArray(info.cards) || info.cards.length === 0) {
      console.log('No real SIM cards found, using mock data');
      return MOCK_SIMS;
    }
    
    console.log('Real SIM cards found:', info.cards.length);
    return info.cards as SimCard[];
  } catch (error) {
    console.log('Error extracting SIM cards:', error);
    return MOCK_SIMS;
  }
}

export default function SimSelectScreen({ navigation }: Props) {
  const [selectedSimIndex, setSelectedSimIndex] = useState(0);
  const simCards = useMemo(() => extractSimCards(), []);

  const selectedSim = simCards[selectedSimIndex];
  const simLabel =
    selectedSim?.displayName ??
    selectedSim?.carrierName ??
    `SIM ${(selectedSim?.slotIndex ?? selectedSim?.simSlotIndex ?? selectedSimIndex) + 1}`;

  const onContinue = () => {
    navigation.navigate('CardServices', { simLabel });
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC', '#EEF2F6']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Select Your SIM</Text>
        <Text style={styles.subtitle}>
          Choose the SIM card for OTP verification
        </Text>
      </View>

      {/* SIM List */}
      {simCards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={styles.emptyText}>No SIM cards detected</Text>
          <Text style={styles.emptySubtext}>
            Please ensure your SIM is inserted properly
          </Text>
          <Pressable style={styles.primaryButton} onPress={onContinue}>
            <Text style={styles.primaryButtonText}>Continue Anyway</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.simList}>
            {simCards.map((sim, index) => {
              const label =
                sim.displayName ??
                sim.carrierName ??
                `SIM ${(sim.slotIndex ?? sim.simSlotIndex ?? index) + 1}`;
              const isSelected = selectedSimIndex === index;
              const phone = 'Auto detected';

              return (
                <Pressable
                  key={`${label}-${index}`}
                  style={[styles.simCard, isSelected && styles.simCardActive]}
                  onPress={() => setSelectedSimIndex(index)}
                >
                  <View style={styles.simCardContent}>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.simInfo}>
                      <Text style={[styles.simName, isSelected && styles.simNameActive]}>
                        {label}
                      </Text>
                      <Text style={styles.simPhone}>{phone}</Text>
                    </View>
                    <Text style={styles.slotBadge}>Slot {index + 1}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.primaryButton} onPress={onContinue}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          </View>
        </>
      )}
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
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: INDUS_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  simList: {
    gap: 14,
  },
  simCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  simCardActive: {
    borderColor: INDUS_BLUE,
    backgroundColor: '#F0F7FF',
    elevation: 4,
    shadowOpacity: 0.12,
  },
  simCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioActive: {
    borderColor: INDUS_BLUE,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: INDUS_BLUE,
  },
  simInfo: {
    flex: 1,
  },
  simName: {
    fontSize: 16,
    fontWeight: '700',
    color: INDUS_DARK,
  },
  simNameActive: {
    color: INDUS_BLUE,
  },
  simPhone: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  slotBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: INDUS_DARK,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
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

