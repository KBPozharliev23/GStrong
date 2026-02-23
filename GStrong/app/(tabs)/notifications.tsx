import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Notification = {
  id: string;
  type: 'achievement' | 'bingo' | 'streak' | 'reminder' | 'level';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
  iconBg: string;
  iconBorder: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'achievement',
    title: 'New Achievement Unlocked!',
    desc: 'You earned the "Week Warrior" badge for completing 7 workouts in a row!',
    time: '5 min ago', read: false,
    icon: '🏆', iconBg: '#1a0f00', iconBorder: '#92400e',
  },
  {
    id: '2', type: 'bingo',
    title: 'Bingo Line Complete!',
    desc: 'You completed a horizontal line! Keep going for a full house.',
    time: '1 hour ago', read: false,
    icon: '🎯', iconBg: '#0d1a33', iconBorder: '#1e3a6e',
  },
  {
    id: '3', type: 'streak',
    title: 'Streak Milestone!',
    desc: 'Amazing! You have maintained a 15-day workout streak.',
    time: '3 hours ago', read: false,
    icon: '🔥', iconBg: '#2d0f00', iconBorder: '#7c2d12',
  },
  {
    id: '4', type: 'reminder',
    title: 'Workout Reminder',
    desc: "Don't forget your leg day workout scheduled for today at 6 PM.",
    time: '6 hours ago', read: true,
    icon: '📅', iconBg: '#0d1a33', iconBorder: '#1e3a6e',
  },
  {
    id: '5', type: 'level',
    title: 'Level Up!',
    desc: "Congratulations! You've reached Level 8 and unlocked new exercises.",
    time: '1 day ago', read: true,
    icon: '👑', iconBg: '#1a1200', iconBorder: '#78350f',
  },
  {
    id: '6', type: 'achievement',
    title: 'Early Bird Badge!',
    desc: 'You completed 5 morning workouts before 8 AM. Keep it up!',
    time: '2 days ago', read: true,
    icon: '🥇', iconBg: '#0a1628', iconBorder: '#1e3a6e',
  },
  {
    id: '7', type: 'bingo',
    title: 'Bingo Card Complete!',
    desc: 'Full house! You completed every exercise on your bingo card this week.',
    time: '3 days ago', read: true,
    icon: '⭐', iconBg: '#1a1200', iconBorder: '#78350f',
  },
  {
    id: '8', type: 'reminder',
    title: 'Weekly Goal Check',
    desc: "You're 3 workouts away from your weekly goal. Push through!",
    time: '4 days ago', read: true,
    icon: '📊', iconBg: '#0d2218', iconBorder: '#14532d',
  },
  {
    id: '9', type: 'streak',
    title: 'Streak Saved!',
    desc: 'You logged a workout just in time to keep your 10-day streak alive.',
    time: '5 days ago', read: true,
    icon: '🔥', iconBg: '#2d0f00', iconBorder: '#7c2d12',
  },
  {
    id: '10', type: 'achievement',
    title: 'Iron Arms Unlocked!',
    desc: 'You completed 20 arm workouts. Your dedication is showing!',
    time: '6 days ago', read: true,
    icon: '💪', iconBg: '#1a0f00', iconBorder: '#92400e',
  },
];

const TABS = ['All', 'Achievements', 'Workouts', 'Bingo'] as const;
type Tab = typeof TABS[number];

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const achievementCount = notifications.filter(
    (n) => n.type === 'achievement' || n.type === 'level'
  ).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Achievements') return n.type === 'achievement' || n.type === 'level';
    if (activeTab === 'Workouts') return n.type === 'reminder' || n.type === 'streak';
    if (activeTab === 'Bingo') return n.type === 'bingo';
    return true;
  });

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteAll = () => setNotifications([]);

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteOne = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(tabs)/profile')}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={markAllRead}>
              <Text style={styles.actionBtnText}>✓✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnRed]}
              onPress={deleteAll}
            >
              <Text style={styles.actionBtnText}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#60a5fa' }]}>
              {notifications.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {achievementCount}
            </Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Filter Tabs - rendered as a plain row, no nested ScrollView */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification Cards */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyDesc}>You're all caught up!</Text>
          </View>
        ) : (
          filtered.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notifCard,
                notif.read ? styles.notifCardRead : styles.notifCardUnread,
              ]}
              activeOpacity={0.75}
              onPress={() => !notif.read && markRead(notif.id)}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: notif.iconBg, borderColor: notif.iconBorder },
                ]}
              >
                <Text style={styles.iconText}>{notif.icon}</Text>
              </View>

              <View style={styles.notifBody}>
                <View style={styles.notifTopRow}>
                  <Text
                    style={[styles.notifTitle, notif.read && styles.notifTitleRead]}
                    numberOfLines={1}
                  >
                    {notif.title}
                  </Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.notifDesc} numberOfLines={2}>
                  {notif.desc}
                </Text>

                <View style={styles.notifFooter}>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                  <View style={styles.notifActions}>
                    {!notif.read && (
                      <TouchableOpacity
                        style={styles.miniBtn}
                        onPress={() => markRead(notif.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.miniBtnText}>✓</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.miniBtn, styles.miniBtnRed]}
                      onPress={() => deleteOne(notif.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.miniBtnText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 28; // 14px padding each side

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  scrollContent: {
    paddingBottom: 80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 54,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backIcon: { color: '#3b82f6', fontSize: 26, lineHeight: 30, marginLeft: -2 },
  headerCenter: { flex: 1 },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  headerActions: { flexDirection: 'row', marginLeft: 10 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtnRed: { borderColor: '#450a0a' },
  actionBtnText: { fontSize: 13, color: '#9ca3af' },

  // Stats
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    paddingVertical: 14,
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#1a2540' },

  // Tabs - plain row, no nested ScrollView
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
    alignItems: 'center',
    marginRight: 6,
  },
  tabActive: { backgroundColor: '#172554', borderColor: '#2563eb' },
  tabText: { color: '#6b7280', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: 'white' },

  // Cards
  notifCard: {
    width: CARD_WIDTH,
    marginHorizontal: 14,
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notifCardUnread: {
    backgroundColor: '#0c1120',
    borderColor: '#1e3a6e',
  },
  notifCardRead: {
    backgroundColor: '#080d18',
    borderColor: '#111827',
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconText: { fontSize: 22 },

  notifBody: { flex: 1, marginLeft: 12 },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  notifTitleRead: { color: '#9ca3af', fontWeight: '500' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  notifDesc: { color: '#6b7280', fontSize: 12, lineHeight: 17, marginBottom: 8 },
  notifFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTime: { color: '#4b5563', fontSize: 11 },
  notifActions: { flexDirection: 'row' },
  miniBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#131d33',
    borderWidth: 1,
    borderColor: '#1a2540',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  miniBtnRed: { backgroundColor: '#1a0505', borderColor: '#450a0a' },
  miniBtnText: { fontSize: 12, color: '#9ca3af' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  emptyDesc: { color: '#6b7280', fontSize: 14 },
});