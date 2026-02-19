import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type Category = 'All' | 'Cardio' | 'Strength' | 'Flexibility' | 'Endurance';

interface Task {
  label: string;
  category: Category | 'FREE';
  points: number;
}

const bingoGrid: Task[][] = [
  [
    { label: '10 Push-ups', category: 'Strength', points: 10 },
    { label: '20 Squats', category: 'Strength', points: 10 },
    { label: '30s Plank', category: 'Endurance', points: 10 },
    { label: '15 Lunges', category: 'Strength', points: 10 },
    { label: '10 Burpees', category: 'Cardio', points: 10 },
  ],
  [
    { label: '20 Crunches', category: 'Strength', points: 10 },
    { label: '15 Jump Jacks', category: 'Cardio', points: 10 },
    { label: 'Stretch 5min', category: 'Flexibility', points: 10 },
    { label: '10 Pull-ups', category: 'Strength', points: 10 },
    { label: '30s Wall Sit', category: 'Endurance', points: 10 },
  ],
  [
    { label: 'FREE', category: 'FREE', points: 0 },
    { label: '20 High Knees', category: 'Cardio', points: 10 },
    { label: '15 Dips', category: 'Strength', points: 10 },
    { label: '10 Leg Raises', category: 'Strength', points: 10 },
    { label: '25 Mt. Climbers', category: 'Cardio', points: 10 },
  ],
  [
    { label: '15 Bicep Curls', category: 'Strength', points: 10 },
    { label: '20 Shoulder Press', category: 'Strength', points: 10 },
    { label: '30s Side Plank', category: 'Endurance', points: 10 },
    { label: '10 Deadlifts', category: 'Strength', points: 10 },
    { label: '15 Rows', category: 'Strength', points: 10 },
  ],
  [
    { label: '20 Tricep Ext.', category: 'Strength', points: 10 },
    { label: '10 Box Jumps', category: 'Cardio', points: 10 },
    { label: '15 Russian Twists', category: 'Strength', points: 10 },
    { label: '20 Calf Raises', category: 'Strength', points: 10 },
    { label: '30s Hollow Hold', category: 'Endurance', points: 10 },
  ],
];

const LINES = [
  // Rows
  [0,1,2,3,4],
  [5,6,7,8,9],
  [10,11,12,13,14],
  [15,16,17,18,19],
  [20,21,22,23,24],
  // Cols
  [0,5,10,15,20],
  [1,6,11,16,21],
  [2,7,12,17,22],
  [3,8,13,18,23],
  [4,9,14,19,24],
  // Diagonals
  [0,6,12,18,24],
  [4,8,12,16,20],
];

const CATEGORIES: Category[] = ['All', 'Cardio', 'Strength', 'Flexibility', 'Endurance'];

const CATEGORY_COLORS: Record<string, string> = {
  Cardio: '#ef4444',
  Strength: '#3b82f6',
  Flexibility: '#a855f7',
  Endurance: '#f59e0b',
  FREE: '#22c55e',
};

export default function WeeklyBingo() {
  const flatTasks = bingoGrid.flat();

  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set([12])); // FREE center
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [completedLines, setCompletedLines] = useState<Set<number>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupLine, setPopupLine] = useState<number[]>([]);
  const popupScale = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  const checkLines = (completed: Set<number>) => {
    let newLineFound = false;
    let newLineIndices: number[] = [];
    const newCompletedLines = new Set(completedLines);

    LINES.forEach((line, lineIdx) => {
      if (!completedLines.has(lineIdx) && line.every(i => completed.has(i))) {
        newCompletedLines.add(lineIdx);
        newLineFound = true;
        newLineIndices = line;
      }
    });

    if (newLineFound) {
      setCompletedLines(newCompletedLines);
      setPopupLine(newLineIndices);
      setShowPopup(true);
      popupScale.setValue(0);
      popupOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(popupScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
        Animated.timing(popupOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(popupScale, { toValue: 0.85, duration: 120, useNativeDriver: true }),
          Animated.timing(popupOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
        ]).start(() => setShowPopup(false));
      }, 1500);
    }

    return newCompletedLines;
  };

  const toggleTask = (index: number) => {
    const task = flatTasks[index];
    if (task.label === 'FREE') return;

    const newCompleted = new Set(completedTasks);
    let pointsDelta = 0;

    if (newCompleted.has(index)) {
      newCompleted.delete(index);
      pointsDelta = -task.points;
    } else {
      newCompleted.add(index);
      pointsDelta = task.points;
    }

    setCompletedTasks(newCompleted);
    setTotalPoints(p => p + pointsDelta);
    checkLines(newCompleted);
  };

  const completedCount = completedTasks.size;
  const progressPercentage = Math.round((completedCount / 25) * 100);

  const isTaskVisible = (task: Task) => {
    if (selectedCategory === 'All') return true;
    return task.category === selectedCategory;
  };

  const achievements = [
    { id: 'first_line', icon: '🥇', title: 'First Line', desc: 'Complete 1 line', unlocked: completedLines.size >= 1 },
    { id: 'triple', icon: '🏆', title: 'Triple Threat', desc: 'Complete 3 lines', unlocked: completedLines.size >= 3 },
    { id: 'full_card', icon: '⭐', title: 'Full Card', desc: 'Complete all 25', unlocked: completedCount >= 25 },
    { id: 'point_master', icon: '⚡', title: 'Point Master', desc: 'Earn 300+ points', unlocked: totalPoints >= 300 },
  ];

  const getCategoryDot = (task: Task) => {
    if (task.category === 'FREE') return '#22c55e';
    return CATEGORY_COLORS[task.category] || '#9ca3af';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Weekly Bingo</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>⬆</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>↺</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitle}>Complete 5 in a row to win!</Text>
        </View>

        {/* Timer + Points Row */}
        <View style={styles.section}>
          <View style={styles.timerCard}>
            <View style={styles.timerLeft}>
              <Text style={styles.timerIcon}>⏱</Text>
              <View>
                <Text style={styles.timerLabel}>Week Resets In</Text>
                <Text style={styles.timerValue}>5d · 14h · 27m</Text>
              </View>
            </View>
            <View style={styles.timerRight}>
              <Text style={styles.timerLabel}>Total Points</Text>
              <Text style={[styles.timerValue, totalPoints > 0 && { color: '#facc15' }]}>{totalPoints}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}/25</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, completedLines.size > 0 && { color: '#facc15' }]}>{completedLines.size}</Text>
              <Text style={styles.statLabel}>Lines</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxGreen]}>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>{progressPercentage}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.section}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bingo Grid */}
        <View style={styles.section}>
          <View style={styles.grid}>
            {flatTasks.map((task, index) => {
              const isCompleted = completedTasks.has(index);
              const isFree = task.label === 'FREE';
              const visible = isTaskVisible(task) || isFree;
              const dimmed = !visible;
              const isLineCell = Array.from(completedLines).some(li => LINES[li]?.includes(index));

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleTask(index)}
                  disabled={isFree}
                  activeOpacity={0.7}
                  style={[
                    styles.gridItem,
                    isCompleted ? styles.gridItemCompleted : styles.gridItemDefault,
                    isFree && styles.gridItemFree,
                    dimmed && styles.gridItemDimmed,
                    isLineCell && styles.gridItemLine,
                  ]}
                >
                  {/* Category dot */}
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryDot(task) }]} />

                  {isCompleted && !isFree && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  <Text style={[styles.gridText, dimmed && styles.gridTextDimmed]}>{task.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map(ach => (
              <View key={ach.id} style={[styles.achievementCard, ach.unlocked && styles.achievementUnlocked]}>
                <Text style={[styles.achievementIcon, !ach.unlocked && { opacity: 0.3 }]}>{ach.icon}</Text>
                <Text style={[styles.achievementTitle, ach.unlocked && { color: '#facc15' }]}>{ach.title}</Text>
                <Text style={styles.achievementDesc}>{ach.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Line Complete Popup */}
      {showPopup && (
        <Modal transparent animationType="none">
          <View style={styles.popupOverlay}>
            <Animated.View style={[styles.popupCard, { transform: [{ scale: popupScale }], opacity: popupOpacity }]}>
              <Text style={styles.popupIcon}>🏆</Text>
              <Text style={styles.popupTitle}>Line Complete!</Text>
              <Text style={styles.popupSubtitle}>+100 Bonus Points</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const CELL_SIZE = (width - 28 - 16) / 5; // slightly larger cells

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14'},

  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10,  marginTop:10},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#6b7280', marginTop: 4, fontSize: 13 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { backgroundColor: '#111827', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1f2a3c' },
  iconBtnText: { color: '#9ca3af', fontSize: 16 },

  section: { paddingHorizontal: 14, marginBottom: 14 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  timerCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  timerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timerIcon: { fontSize: 18 },
  timerLabel: { color: '#6b7280', fontSize: 10, letterSpacing: 0.3 },
  timerValue: { color: 'white', fontWeight: '700', fontSize: 15, marginTop: 2 },
  timerRight: { alignItems: 'flex-end' },

  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1,
    backgroundColor: '#0c1120',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  statBoxGreen: { borderColor: '#14532d' },
  statValue: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  statLabel: { color: '#6b7280', fontSize: 10, marginTop: 2, letterSpacing: 0.2 },

  progressBarBg: { height: 5, backgroundColor: '#1a2540', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 999 },

  categoryRow: { flexDirection: 'row', gap: 7, paddingVertical: 4 },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  categoryBtnActive: { backgroundColor: '#172554', borderColor: '#2563eb' },
  categoryText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: 'white' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' },
  gridItem: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 14,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  gridItemDefault: { backgroundColor: '#0c1120', borderColor: '#1a2540' },
  gridItemCompleted: { backgroundColor: '#1d3a8a', borderColor: '#2563eb' },
  gridItemFree: { backgroundColor: '#0d2218', borderColor: '#166534' },
  gridItemDimmed: { opacity: 0.15 },
  gridItemLine: { borderColor: '#eab308', borderWidth: 1.5 },
  categoryDot: { width: 5, height: 5, borderRadius: 3, position: 'absolute', top: 7, left: 7 },
  gridText: { color: '#e2e8f0', fontSize: 9.5, fontWeight: '600', textAlign: 'center', lineHeight: 13 },
  gridTextDimmed: { color: '#374151' },
  checkmark: { position: 'absolute', top: 5, right: 6, color: '#60a5fa', fontSize: 10, fontWeight: 'bold' },

  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: {
    width: '47%',
    backgroundColor: '#0c1120',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    alignItems: 'flex-start',
  },
  achievementUnlocked: { borderColor: '#92400e', backgroundColor: '#150f02' },
  achievementIcon: { fontSize: 26, marginBottom: 8 },
  achievementTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  achievementDesc: { color: '#6b7280', fontSize: 11, marginTop: 2 },

  popupOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  popupCard: {
    backgroundColor: '#130e02',
    borderColor: '#d97706',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  popupIcon: { fontSize: 48, marginBottom: 10 },
  popupTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  popupSubtitle: { color: '#fbbf24', fontSize: 15, marginTop: 5, fontWeight: '600' },
});