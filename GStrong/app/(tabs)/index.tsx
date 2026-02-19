import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function FitnessDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}> 
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Let's crush your goals today</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.emoji}>🔥</Text>
            <Text style={styles.cardValue}>12</Text>
            <Text style={styles.cardLabel}>Day Streak</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.emoji}>🏆</Text>
            <Text style={styles.cardValue}>8</Text>
            <Text style={styles.cardLabel}>Completed</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.emoji}>⚡</Text>
            <Text style={styles.cardValue}>450</Text>
            <Text style={styles.cardLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.quickStartBtn}>
            <View>
              <Text style={styles.quickTitle}>Quick Start Workout</Text>
              <Text style={styles.quickSubtitle}>15 min • Full Body</Text>
            </View>
            <View style={styles.quickIconWrapper}>
              <Text style={styles.quickIcon}>⚡</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Challenge</Text>

          <TouchableOpacity style={styles.challengeCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.challengeTitle}>Complete 5 Bingo Tasks</Text>
              <Text style={styles.challengeSub}>3 of 5 completed</Text>

              <View style={styles.progressBarBg}>
                <View style={styles.progressFill} />
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {[{ name: 'Push-ups', detail: '3 sets', time: '2h ago' },
            { name: 'Squats', detail: '4 sets', time: '5h ago' },
            { name: 'Plank', detail: '2 min', time: 'Yesterday' }].map((item, i) => (
            <View key={i} style={styles.activityCard}>
              <View>
                <Text style={styles.activityTitle}>{item.name}</Text>
                <Text style={styles.activitySub}>{item.detail}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20,   marginTop:10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  subtitle: { color: '#9ca3af' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#0a0f1f', borderColor: '#1a2338', borderWidth: 1, marginHorizontal: 4, borderRadius: 16, padding: 16 },
  emoji: { fontSize: 24, marginBottom: 10 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  cardLabel: { fontSize: 10, color: '#9ca3af' },

  section: { paddingHorizontal: 20, marginBottom: 30 },

  quickStartBtn: { backgroundColor: '#2563eb', borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quickTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  quickSubtitle: { color: '#bfdbfe', marginTop: 4 },
  quickIconWrapper: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, justifyContent: 'center', alignItems: 'center' },
  quickIcon: { fontSize: 24, color: 'white' },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },

  challengeCard: { backgroundColor: '#0a0f1f', borderColor: '#1a2338', borderWidth: 1, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' },
  challengeTitle: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 6 },
  challengeSub: { fontSize: 13, color: '#9ca3af', marginBottom: 12 },

  progressBarBg: { height: 6, backgroundColor: '#1a2338', borderRadius: 999, overflow: 'hidden' },
  progressFill: { width: '60%', height: '100%', backgroundColor: '#2563eb' },
  arrow: { fontSize: 28, color: '#6b7280', marginLeft: 12 },

  activityCard: { backgroundColor: '#0a0f1f', borderColor: '#1a2338', borderWidth: 1, borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  activityTitle: { fontWeight: '600', color: 'white', marginBottom: 4 },
  activitySub: { color: '#9ca3af', fontSize: 13 },
  activityTime: { color: '#6b7280', fontSize: 13 },
});
