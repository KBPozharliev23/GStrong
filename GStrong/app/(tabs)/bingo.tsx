import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function WeeklyBingo() {
  const [completedTasks, setCompletedTasks] = useState(new Set([
    'FREE', '15 Dips', '25 Mountain Climbers'
  ]));

  const bingoTasks = [
    ['10 Push-ups', '20 Squats', '30s Plank', '15 Lunges', '10 Burpees'],
    ['20 Crunches', '15 Jump Jacks', 'Stretch 5min', '10 Pull-ups', '30s Wall Sit'],
    ['FREE', '20 High Knees', '15 Dips', '10 Leg Raises', '25 Mountain Climbers'],
    ['15 Bicep Curls', '20 Shoulder Press', '30s Side Plank', '10 Deadlifts', '15 Rows'],
    ['20 Tricep Extensions', '10 Box Jumps', '15 Russian Twists', '20 Calf Raises', '30s Hollow Hold']
  ];

  const toggleTask = (task: string) => {
    if (task === 'FREE') return;

    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(task)) {
      newCompleted.delete(task);
    } else {
      newCompleted.add(task);
    }
    setCompletedTasks(newCompleted);
  };

  const completedCount = completedTasks.size;
  const totalTasks = 25;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Weekly Bingo</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🏆</Text>
              <Text style={styles.badgeText}>{completedCount}/25</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Complete 5 in a row to win!</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Weekly Progress</Text>
              <Text style={styles.progressValue}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.grid}>
            {bingoTasks.flat().map((task, index) => {
              const isCompleted = completedTasks.has(task);
              const isFree = task === 'FREE';

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleTask(task)}
                  disabled={isFree}
                  style={[
                    styles.gridItem,
                    isCompleted ? styles.gridItemCompleted : styles.gridItemDefault,
                    isFree && styles.gridItemFree
                  ]}
                >
                  {isCompleted && !isFree && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  <Text style={styles.gridText}>{task}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rewardsCard}>
            <View style={styles.rewardsHeader}>
              <Text style={styles.rewardsIcon}>🏆</Text>
              <Text style={styles.rewardsTitle}>Rewards</Text>
            </View>
            <Text style={styles.rewardsSubtitle}>Complete a line to unlock bonus points!</Text>

            <View style={styles.rewardsGrid}>
              <View style={styles.rewardBox}>
                <Text style={styles.rewardLabel}>1 Line</Text>
                <Text style={styles.rewardValue}>+100 Points</Text>
              </View>

              <View style={styles.rewardBox}>
                <Text style={styles.rewardLabel}>Full Card</Text>
                <Text style={[styles.rewardValue, styles.rewardHighlight]}>+500 Points</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },

  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#9ca3af', marginTop: 4 },
  badge: { backgroundColor: '#ca8a04', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  badgeIcon: { fontSize: 20 },
  badgeText: { fontWeight: 'bold', marginLeft: 6, color: 'white' },

  section: { paddingHorizontal: 20, marginBottom: 30 },

  progressCard: { backgroundColor: '#0a0f1f', borderColor: '#1a2338', borderWidth: 1, borderRadius: 20, padding: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel: { color: '#9ca3af' },
  progressValue: { fontWeight: 'bold', color: '#3b82f6' },
  progressBarBg: { height: 8, backgroundColor: '#1a2338', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2563eb' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '18%', aspectRatio: 1, borderRadius: 16, padding: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, position: 'relative', margin: 3},
  gridItemDefault: { backgroundColor: '#0a0f1f', borderColor: '#1a2338' },
  gridItemCompleted: { backgroundColor: '#2563eb', borderColor: '#3b82f6', shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 6 },
  gridItemFree: { opacity: 0.7 },
  gridText: { color: 'white', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  checkmark: { position: 'absolute', top: 4, right: 4, color: 'white', fontSize: 12 },

  rewardsCard: { backgroundColor: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.3)', borderWidth: 1, borderRadius: 20, padding: 20 },
  rewardsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rewardsIcon: { fontSize: 24 },
  rewardsTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 6 },
  rewardsSubtitle: { color: '#9ca3af', fontSize: 13, marginBottom: 16 },
  rewardsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  rewardBox: { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(234,179,8,0.3)', borderWidth: 1, borderRadius: 14, padding: 16, width: '48%' },
  rewardLabel: { color: '#9ca3af', fontSize: 12, marginBottom: 4 },
  rewardValue: { color: '#60a5fa', fontWeight: 'bold' },
  rewardHighlight: { color: '#facc15' }
});