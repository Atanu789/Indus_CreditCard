import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi } from '../api/client';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetailsForm'>;

const INDUS_BLUE = '#1B3A6B';
const INDUS_DARK = '#0F1F3D';

export default function UserDetailsFormScreen({ navigation, route }: Props) {
  const { simLabel, serviceType, formMode } = route.params;

  // Common fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // Existing card fields
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardTotalLimit, setCardTotalLimit] = useState('');

  // New application fields
  const [panNumber, setPanNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApply = formMode === 'apply';

  const onSubmit = async () => {
    if (!fullName.trim()) { Alert.alert('Required', 'Please enter your full name.'); return; }
    if (mobileNumber.trim().length < 10) { Alert.alert('Required', 'Please enter a valid 10-digit mobile number.'); return; }
    if (!dob.trim()) { Alert.alert('Required', 'Please enter your date of birth.'); return; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('Required', 'Please enter a valid email address.'); return; }
    if (!city.trim()) { Alert.alert('Required', 'Please enter your city.'); return; }

    if (!isApply) {
      if (!cardHolderName.trim()) { Alert.alert('Required', 'Please enter the card holder name.'); return; }
      if (!cardTotalLimit.trim()) { Alert.alert('Required', 'Please enter your card total limit.'); return; }
    } else {
      if (!panNumber.trim() || panNumber.trim().length < 10) { Alert.alert('Required', 'Please enter a valid 10-character PAN number.'); return; }
      if (!annualIncome.trim()) { Alert.alert('Required', 'Please enter your annual income.'); return; }
      if (!employmentType.trim()) { Alert.alert('Required', 'Please select your employment type.'); return; }
    }

    setIsSubmitting(true);
    try {
      const result = await userApi.create({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        dob: dob.trim(),
        email: email.trim(),
        city: city.trim(),
        cardHolderName: isApply ? fullName.trim() : cardHolderName.trim(),
        cardTotalLimit: isApply ? annualIncome.trim() : cardTotalLimit.trim(),
        simLabel: isApply ? `PAN:${panNumber.trim()} | ${employmentType.trim()}` : simLabel,
      });

      if (result.success) {
        const referenceId = 'REF' + Date.now().toString().slice(-8);
        navigation.navigate('Success', {
          serviceType,
          fullName: fullName.trim(),
          referenceId,
          mobileNumber: mobileNumber.trim(),
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('[Form] Submit error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#E8EFF7', '#F5F8FC', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              {isApply ? 'ðŸ†• New Application' : 'ðŸ’³ Existing Cardholder'}
            </Text>
          </View>
          <Text style={styles.title}>{isApply ? 'Apply for Credit Card' : 'Your Card Details'}</Text>
          <Text style={styles.subtitle}>
            {isApply
              ? 'Fill in your details to apply for an IndusInd Bank credit card'
              : 'Enter your details to manage your existing card'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Section: Personal Info */}
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          {/* Section: Card / Application Specific */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
            {isApply ? 'Application Details' : 'Card Details'}
          </Text>

          {!isApply ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Holder Name *</Text>
                <TextInput
                  style={styles.input}
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  placeholder="Name as printed on card"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Total Limit *</Text>
                <TextInput
                  style={styles.input}
                  value={cardTotalLimit}
                  onChangeText={setCardTotalLimit}
                  placeholder="e.g. â‚¹ 1,00,000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PAN Number *</Text>
                <TextInput
                  style={styles.input}
                  value={panNumber}
                  onChangeText={(t) => setPanNumber(t.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Annual Income *</Text>
                <TextInput
                  style={styles.input}
                  value={annualIncome}
                  onChangeText={setAnnualIncome}
                  placeholder="e.g. â‚¹ 5,00,000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Employment Type *</Text>
                <View style={styles.chipRow}>
                  {['Salaried', 'Self-Employed', 'Business', 'Student'].map((type) => (
                    <Pressable
                      key={type}
                      style={[styles.chip, employmentType === type && styles.chipActive]}
                      onPress={() => setEmploymentType(type)}
                    >
                      <Text style={[styles.chipText, employmentType === type && styles.chipTextActive]}>
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isApply ? 'Submit Application' : 'Save Details'}
            </Text>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  header: { marginBottom: 28 },
  modeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modeBadgeText: { fontSize: 13, fontWeight: '700', color: INDUS_BLUE },
  title: { fontSize: 26, fontWeight: '800', color: INDUS_DARK, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B7280', lineHeight: 22 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: INDUS_BLUE,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: INDUS_DARK },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: INDUS_DARK,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipActive: { borderColor: INDUS_BLUE, backgroundColor: '#EFF6FF' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: INDUS_BLUE },
  footer: { padding: 24, paddingBottom: 40 },
  submitButton: {
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
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
