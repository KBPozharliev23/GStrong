import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CHART_WIDTH = width - 28 - 32;

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ data: [2, 1, 3, 1, 4, 2, 2] }],
};

const monthlyData = {
  labels: ['W1', 'W2', 'W3', 'W4'],
  datasets: [{ data: [310, 450, 380, 500] }],
};

const chartConfig = {
  backgroundGradientFrom: '#0c1120',
  backgroundGradientTo: '#0c1120',
  color: (opacity = 1) => `rgba(99, 155, 255, ${opacity})`,
  strokeWidth: 2,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#3b82f6',
    fill: '#1e3a6e',
  },
  propsForBackgroundLines: {
    stroke: '#1a2540',
    strokeDasharray: '',
  },
  propsForLabels: {
    fontSize: 10,
    fill: '#6b7280',
  },
  decimalPlaces: 0,
};

const achievements = [
  {
    id: '7day',
    icon: '🏆',
    title: '7 Day Streak',
    desc: 'Workout 7 days in a row',
    time: '2d ago',
    color: '#b45309',
    bg: '#150f02',
    border: '#92400e',
  },
  {
    id: 'earlybird',
    icon: '🥇',
    title: 'Early Bird',
    desc: 'Complete 5 morning workouts',
    time: '2d ago',
    color: '#1e40af',
    bg: '#0a1628',
    border: '#1e3a6e',
  },
  {
    id: 'bingomaster',
    icon: '⭐',
    title: 'Bingo Master',
    desc: 'Complete a full bingo card',
    time: '2d ago',
    color: '#854d0e',
    bg: '#150f02',
    border: '#78350f',
  },
];

const menuItems = [
  { icon: '⚙️', label: 'Settings', color: '#3b82f6', bg: '#172554' },
  { icon: '🏅', label: 'Achievements', color: '#d97706', bg: '#422006', badge: 2 },
  { icon: '🔔', label: 'Notifications', color: '#3b82f6', bg: '#172554', badge: 3 },
  { icon: '❓', label: 'Help & Support', color: '#6366f1', bg: '#1e1b4b' },
  { icon: '↪', label: 'Log Out', color: '#ef4444', bg: '#450a0a' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'progress'>('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const streakDays = 12;
  const totalDays = 7;

  const handleMenuPress = (label: string) => {
    if (label === 'Settings') router.replace('/settings');
    if (label === 'Achievements') router.replace('/achievements');
    if (label === 'Notifications') router.replace('/(tabs)/notifications');
    if (label === 'Log Out') setShowLogoutModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{activeTab === 'profile' ? 'Profile' : 'Your Progress'}</Text>
            <Text style={styles.subtitle}>
              {activeTab === 'profile' ? 'Manage your account' : 'Track your fitness journey'}
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>Progress</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'profile' ? (
          <>
            <View style={styles.section}>
              <View style={styles.profileCard}>
                <View style={styles.profileTop}>
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={require('../../assets/images/profilePicture.png')}
                      style={styles.avatarImage}
                    />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>George Strong</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>450</Text>
                    <Text style={styles.statLabel}>Points</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Achievements</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>45</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.levelCard}>
                <View style={styles.levelRow}>
                  <View style={styles.levelLeft}>
                    <Text style={styles.levelCrown}>👑</Text>
                    <Text style={styles.levelText}>Level 8</Text>
                  </View>
                  <Text style={styles.xpText}>450/600 XP</Text>
                </View>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${(450 / 600) * 100}%` }]} />
                </View>
                <Text style={styles.xpSubtext}>150 XP to Level 9</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.menuList}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7} onPress={() => handleMenuPress(item.label)}>
                    <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                      <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <View style={styles.menuRight}>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <Text style={styles.chevron}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.versionText}>GStrong Fitness v1.0</Text>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.streakCard}>
                <View style={styles.streakTop}>
                  <View style={styles.streakLeft}>
                    <View style={styles.fireIcon}>
                      <Text style={{ fontSize: 18 }}>🔥</Text>
                    </View>
                    <View>
                      <Text style={styles.streakLabel}>Current Streak</Text>
                      <Text style={styles.streakValue}>12 Days</Text>
                    </View>
                  </View>
                  <View style={styles.streakRight}>
                    <Text style={styles.bestLabel}>Best Streak</Text>
                    <Text style={styles.bestValue}>18 Days</Text>
                  </View>
                </View>
                <View style={styles.streakDots}>
                  {Array.from({ length: totalDays }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.streakDot,
                        i < 5 ? styles.streakDotActive : styles.streakDotInactive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.twoColRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>🏆</Text>
                  <Text style={styles.metricValue}>450</Text>
                  <Text style={styles.metricLabel}>Total Points</Text>
                </View>
                <View style={[styles.metricCard, { borderColor: '#1e3a6e' }]}>
                  <Text style={styles.metricIcon}>🎯</Text>
                  <Text style={styles.metricValue}>15/20</Text>
                  <Text style={styles.metricLabel}>Weekly Goal</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Weekly Activity</Text>
                  <Text style={styles.trendIcon}>↗</Text>
                </View>
                <LineChart
                  data={weeklyData}
                  width={CHART_WIDTH}
                  height={160}
                  chartConfig={chartConfig}
                  bezier
                  withDots={false}
                  withInnerLines={true}
                  withOuterLines={false}
                  style={{ marginLeft: -16 }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Monthly Points</Text>
                <LineChart
                  data={monthlyData}
                  width={CHART_WIDTH}
                  height={160}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(99, 155, 255, ${opacity})`,
                    propsForDots: {
                      r: '5',
                      strokeWidth: '2',
                      stroke: '#3b82f6',
                      fill: '#3b82f6',
                    },
                  }}
                  withDots={true}
                  withInnerLines={true}
                  withOuterLines={false}
                  style={{ marginLeft: -16 }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <View style={styles.achievementsList}>
                {achievements.map(ach => (
                  <View key={ach.id} style={[styles.achievementRow, { backgroundColor: ach.bg, borderColor: ach.border }]}>
                    <View style={[styles.achIconWrap, { backgroundColor: ach.color + '33' }]}>
                      <Text style={{ fontSize: 22 }}>{ach.icon}</Text>
                    </View>
                    <View style={styles.achInfo}>
                      <Text style={styles.achTitle}>{ach.title}</Text>
                      <Text style={styles.achDesc}>{ach.desc}</Text>
                    </View>
                    <Text style={styles.achTime}>{ach.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Log Out Confirmation Modal */}
      <Modal transparent visible={showLogoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmIcon}>↪</Text>
            <Text style={styles.confirmTitle}>Log Out?</Text>
            <Text style={styles.confirmSubtitle}>Are you sure you want to log out of your account?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDangerBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setShowLogoutModal(false);
                  router.replace('/(auth)');
                }}
              >
                <Text style={styles.confirmDangerBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#6b7280', marginTop: 4, fontSize: 13 },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#0c1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2540',
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#172554' },
  tabText: { color: '#6b7280', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: 'white' },

  section: { paddingHorizontal: 14, marginBottom: 14 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  profileCard: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#2563eb',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 130,
    height: 130,
    top: -8,
    left: -33,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a2540',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  avatarEmoji: { fontSize: 30 },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#d97706',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  profileMember: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  editText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#1a2540', marginVertical: 16 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#1a2540' },

  levelCard: {
    backgroundColor: '#100a00',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#78350f',
  },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelCrown: { fontSize: 18 },
  levelText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  xpText: { color: '#6b7280', fontSize: 13 },
  xpBarBg: { height: 8, backgroundColor: '#1a1a0a', borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  xpBarFill: { height: '100%', backgroundColor: '#eab308', borderRadius: 999 },
  xpSubtext: { color: '#6b7280', fontSize: 12 },

  menuList: { gap: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1120',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a2540',
    gap: 14,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, color: 'white', fontSize: 15, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: '#d97706',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  chevron: { color: '#6b7280', fontSize: 22, lineHeight: 22 },

  versionText: { color: '#374151', fontSize: 12, textAlign: 'center', marginTop: 8 },

  streakCard: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#7c2d12',
  },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fireIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#431407',
    justifyContent: 'center', alignItems: 'center',
  },
  streakLabel: { color: '#9ca3af', fontSize: 11 },
  streakValue: { color: 'white', fontWeight: 'bold', fontSize: 22, marginTop: 2 },
  streakRight: { alignItems: 'flex-end' },
  bestLabel: { color: '#9ca3af', fontSize: 11 },
  bestValue: { color: '#f97316', fontWeight: 'bold', fontSize: 18, marginTop: 2 },
  streakDots: { flexDirection: 'row', gap: 8 },
  streakDot: { flex: 1, height: 36, borderRadius: 10 },
  streakDotActive: { backgroundColor: '#ea580c' },
  streakDotInactive: { backgroundColor: '#1a2540' },

  twoColRow: { flexDirection: 'row', gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: '#0c1120',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#78350f',
    alignItems: 'flex-start',
  },
  metricIcon: { fontSize: 22, marginBottom: 6 },
  metricValue: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  metricLabel: { color: '#6b7280', fontSize: 11, marginTop: 3 },

  chartCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  chartTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  trendIcon: { color: '#22c55e', fontSize: 18, fontWeight: 'bold' },

  achievementsList: { gap: 8 },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  achIconWrap: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  achInfo: { flex: 1 },
  achTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  achDesc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  achTime: { color: '#4b5563', fontSize: 12 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCard: {
    backgroundColor: '#0c1120',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1a2540',
    width: 300,
    padding: 28,
    alignItems: 'center',
  },
  confirmIcon: { fontSize: 36, marginBottom: 12 },
  confirmTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  confirmSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#131d33',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  cancelBtnText: { color: '#9ca3af', fontSize: 15, fontWeight: '600' },
  confirmDangerBtn: {
    flex: 1,
    backgroundColor: '#450a0a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  confirmDangerBtnText: { color: '#ef4444', fontSize: 15, fontWeight: '700' },
});