import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Category = 'All' | 'Weekly' | 'Lifetime' | 'Special';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  category: Category;
  points: number;
  unlocked: boolean;
  unlockedTime?: string;
  progress?: number;
  total?: number;
  detail: string;
}

const achievements: Achievement[] = [
  {
    id: 'early_bird',
    icon: '📅',
    title: 'Early Bird',
    desc: 'Complete a workout before 8 AM',
    category: 'Special',
    points: 50,
    unlocked: true,
    unlockedTime: '2 days ago',
    detail: 'You woke up early and crushed a workout before 8 AM. Keep up the early morning grind!',
  },
  {
    id: 'streak_master',
    icon: '🔥',
    title: 'Streak Master',
    desc: 'Maintain a 7-day workout streak',
    category: 'Weekly',
    points: 100,
    unlocked: false,
    progress: 5,
    total: 7,
    detail: 'Work out every day for 7 days in a row to unlock this achievement.',
  },
  {
    id: 'bingo_champion',
    icon: '🎯',
    title: 'Bingo Champion',
    desc: 'Complete a full Bingo card',
    category: 'Weekly',
    points: 150,
    unlocked: false,
    progress: 18,
    total: 25,
    detail: 'Complete all 25 tasks on a weekly bingo card to earn this badge.',
  },
  {
    id: 'muscle_machine',
    icon: '💪',
    title: 'Muscle Machine',
    desc: 'Complete 50 strength workouts',
    category: 'Lifetime',
    points: 200,
    unlocked: false,
    progress: 32,
    total: 50,
    detail: 'Log 50 strength-based workouts to prove you are a Muscle Machine.',
  },
  {
    id: 'first_step',
    icon: '⭐',
    title: 'First Step',
    desc: 'Complete your first workout',
    category: 'Special',
    points: 20,
    unlocked: true,
    unlockedTime: '1 month ago',
    detail: 'Every journey begins with a single step. You completed your very first workout!',
  },
  {
    id: 'social_butterfly',
    icon: '🦋',
    title: 'Social Butterfly',
    desc: 'Share your progress 10 times',
    category: 'Special',
    points: 75,
    unlocked: false,
    progress: 3,
    total: 10,
    detail: 'Share your fitness progress with friends and the community 10 times.',
  },
  {
    id: 'high_voltage',
    icon: '⚡',
    title: 'High Voltage',
    desc: 'Earn 1000 total points',
    category: 'Lifetime',
    points: 250,
    unlocked: false,
    progress: 850,
    total: 1000,
    detail: 'Accumulate 1000 total points across all your workouts and achievements.',
  },
  {
    id: 'perfect_week',
    icon: '🏆',
    title: 'Perfect Week',
    desc: 'Reach your weekly goal 4 weeks in a row',
    category: 'Weekly',
    points: 300,
    unlocked: false,
    progress: 2,
    total: 4,
    detail: 'Hit your weekly workout goal four consecutive weeks in a row.',
  },
  {
    id: 'night_owl',
    icon: '🦉',
    title: 'Night Owl',
    desc: 'Complete a workout after 9 PM',
    category: 'Special',
    points: 50,
    unlocked: false,
    progress: 0,
    total: 1,
    detail: 'Burn the midnight oil and complete a workout after 9 PM.',
  },
  {
    id: 'fitness_legend',
    icon: '👑',
    title: 'Fitness Legend',
    desc: 'Unlock 50 achievements',
    category: 'Lifetime',
    points: 500,
    unlocked: false,
    progress: 12,
    total: 50,
    detail: 'Become a true legend by unlocking 50 achievements across the app.',
  },
];

const CATEGORIES: Category[] = ['All', 'Weekly', 'Lifetime', 'Special'];

const CATEGORY_COLORS: Record<string, string> = {
  Weekly: '#3b82f6',
  Lifetime: '#a855f7',
  Special: '#f59e0b',
};

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const router = useRouter();

  const totalPoints = achievements.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const overallProgress = Math.round((unlockedCount / totalCount) * 100);

  const filtered = achievements.filter(a =>
    selectedCategory === 'All' ? true : a.category === selectedCategory
  );

  const getUnlockedBg = (category: Category) => {
    if (category === 'Special') return { bg: '#1a1200', border: '#92400e' };
    if (category === 'Weekly') return { bg: '#0a1628', border: '#1e3a6e' };
    if (category === 'Lifetime') return { bg: '#150d20', border: '#6b21a8' };
    return { bg: '#0a1628', border: '#1e3a6e' };
  };

  const getIconColor = (category: Category) => CATEGORY_COLORS[category] || '#6b7280';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/profile')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Achievements</Text>
        </View>
        <Text style={styles.subtitle}>Unlock badges and earn points</Text>

        <View style={styles.section}>
          <View style={styles.dashCard}>
            <View style={styles.dashRow}>
              <View>
                <Text style={styles.dashPoints}>{totalPoints}</Text>
                <Text style={styles.dashLabel}>Total Points Earned</Text>
              </View>
              <View style={styles.dashRight}>
                <Text style={styles.dashBadgeCount}>
                  <Text style={styles.dashBadgeNum}>{unlockedCount}</Text>
                  <Text style={styles.dashBadgeTotal}>/{totalCount}</Text>
                </Text>
                <Text style={styles.dashLabel}>Badges Unlocked</Text>
              </View>
            </View>
            <View style={styles.dashBarBg}>
              <View style={[styles.dashBarFill, { width: `${overallProgress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.filterBtn,
                selectedCategory === cat && styles.filterBtnActive,
                selectedCategory === cat && cat !== 'All' && { backgroundColor: CATEGORY_COLORS[cat] + '33', borderColor: CATEGORY_COLORS[cat] },
              ]}
            >
              <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          {filtered.map(ach => {
            const colors = ach.unlocked ? getUnlockedBg(ach.category) : { bg: '#0c1120', border: '#1a2540' };
            const iconColor = ach.unlocked ? getIconColor(ach.category) : '#374151';
            const progressPct = ach.progress !== undefined && ach.total
              ? (ach.progress / ach.total) * 100
              : 0;

            return (
              <TouchableOpacity
                key={ach.id}
                style={[styles.achCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
                activeOpacity={0.75}
                onPress={() => setSelectedAchievement(ach)}
              >
                <View style={[styles.achIconWrap, { borderColor: iconColor + '55', backgroundColor: iconColor + '22' }]}>
                  {ach.unlocked
                    ? <Text style={styles.achIconText}>{ach.icon}</Text>
                    : <Text style={styles.lockIcon}>🔒</Text>
                  }
                </View>

                <View style={styles.achBody}>
                  <View style={styles.achTitleRow}>
                    <Text style={[styles.achTitle, !ach.unlocked && styles.achTitleLocked]}>{ach.title}</Text>
                    {ach.unlocked && (
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>+{ach.points}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.achDesc, !ach.unlocked && styles.achDescLocked]}>{ach.desc}</Text>

                  {ach.unlocked && ach.unlockedTime && (
                    <Text style={[styles.achTime, { color: iconColor }]}>Unlocked {ach.unlockedTime}</Text>
                  )}

                  {!ach.unlocked && ach.progress !== undefined && ach.total && (
                    <View style={styles.progressSection}>
                      <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressValue}>{ach.progress} / {ach.total}</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progressPct}%`, backgroundColor: '#3b82f6' }]} />
                      </View>
                    </View>
                  )}
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedAchievement && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {(() => {
                const ach = selectedAchievement;
                const iconColor = ach.unlocked ? getIconColor(ach.category) : '#374151';
                return (
                  <>
                    <View style={[styles.modalIconWrap, { backgroundColor: iconColor + '22', borderColor: iconColor + '55' }]}>
                      <Text style={styles.modalIcon}>{ach.unlocked ? ach.icon : '🔒'}</Text>
                    </View>
                    <Text style={styles.modalTitle}>{ach.title}</Text>
                    <View style={[styles.modalCategoryBadge, { backgroundColor: (CATEGORY_COLORS[ach.category] || '#6b7280') + '33' }]}>
                      <Text style={[styles.modalCategoryText, { color: CATEGORY_COLORS[ach.category] || '#9ca3af' }]}>{ach.category}</Text>
                    </View>
                    <Text style={styles.modalDetail}>{ach.detail}</Text>

                    {ach.unlocked ? (
                      <View style={styles.modalPointsRow}>
                        <Text style={styles.modalPointsLabel}>Points Earned</Text>
                        <Text style={styles.modalPointsValue}>+{ach.points}</Text>
                      </View>
                    ) : ach.progress !== undefined && ach.total ? (
                      <View style={styles.modalProgressSection}>
                        <View style={styles.progressLabelRow}>
                          <Text style={styles.progressLabel}>Progress</Text>
                          <Text style={styles.progressValue}>{ach.progress} / {ach.total}</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${(ach.progress / ach.total) * 100}%`, backgroundColor: '#3b82f6' }]} />
                        </View>
                        <Text style={styles.modalPointsLabel}>Reward: <Text style={{ color: '#facc15', fontWeight: 'bold' }}>+{ach.points} pts</Text></Text>
                      </View>
                    ) : null}

                    <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedAchievement(null)}>
                      <Text style={styles.modalCloseTxt}>Close</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 10,
    marginTop: 10,
    gap: 12,
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
  },
  backIcon: { color: '#3b82f6', fontSize: 26, lineHeight: 30, marginLeft: -2 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#6b7280', marginTop: 2, fontSize: 13, paddingHorizontal: 16, paddingBottom: 10 },

  section: { paddingHorizontal: 14, marginBottom: 8 },

  dashCard: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    marginBottom: 16,
  },
  dashRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  dashPoints: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  dashLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  dashRight: { alignItems: 'flex-end' },
  dashBadgeCount: { fontSize: 22, fontWeight: 'bold' },
  dashBadgeNum: { color: '#3b82f6' },
  dashBadgeTotal: { color: '#6b7280' },
  dashBarBg: { height: 6, backgroundColor: '#1a2540', borderRadius: 999, overflow: 'hidden' },
  dashBarFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: 999 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  filterBtnActive: { backgroundColor: '#172554', borderColor: '#3b82f6' },
  filterText: { color: '#6b7280', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: 'white' },

  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  achIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achIconText: { fontSize: 24 },
  lockIcon: { fontSize: 20 },
  achBody: { flex: 1 },
  achTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  achTitle: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  achTitleLocked: { color: '#6b7280' },
  achDesc: { color: '#9ca3af', fontSize: 12 },
  achDescLocked: { color: '#4b5563' },
  achTime: { fontSize: 11, marginTop: 4, fontWeight: '500' },

  pointsBadge: {
    backgroundColor: '#1a3a1a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#166534',
  },
  pointsBadgeText: { color: '#22c55e', fontSize: 11, fontWeight: 'bold' },

  progressSection: { marginTop: 8 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { color: '#6b7280', fontSize: 11 },
  progressValue: { color: '#6b7280', fontSize: 11 },
  progressBarBg: { height: 4, backgroundColor: '#1a2540', borderRadius: 999, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 999 },

  chevron: { color: '#4b5563', fontSize: 22, lineHeight: 22 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#0c1120',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1a2540',
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: { fontSize: 34 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  modalCategoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  modalCategoryText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  modalDetail: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  modalPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#0a1a0a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#166534',
  },
  modalPointsLabel: { color: '#6b7280', fontSize: 13, marginTop: 8 },
  modalPointsValue: { color: '#22c55e', fontSize: 18, fontWeight: 'bold' },
  modalProgressSection: { width: '100%', marginBottom: 20 },
  modalCloseBtn: {
    backgroundColor: '#172554',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  modalCloseTxt: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});