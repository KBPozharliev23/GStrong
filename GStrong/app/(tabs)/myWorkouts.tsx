import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';

interface ExerciseEntry {
  id: string;
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  weight: string;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  exercises: ExerciseEntry[];
  created_at: string;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  strength:    { bg: 'rgba(29,78,216,0.15)',  text: '#60a5fa', border: 'rgba(29,78,216,0.3)' },
  hypertrophy: { bg: 'rgba(124,58,237,0.15)', text: '#c084fc', border: 'rgba(124,58,237,0.3)' },
  cardio:      { bg: 'rgba(220,38,38,0.15)',  text: '#f87171', border: 'rgba(220,38,38,0.3)' },
  circuit:     { bg: 'rgba(5,150,105,0.15)',  text: '#34d399', border: 'rgba(5,150,105,0.3)' },
};

const TYPE_ICONS: Record<string, string> = {
  strength: 'barbell-outline',
  hypertrophy: 'body-outline',
  cardio: 'heart-outline',
  circuit: 'refresh-outline',
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function WorkoutCard({ workout, onDelete }: { workout: Workout; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const typeStyle = TYPE_COLORS[workout.type] ?? TYPE_COLORS.strength;
  const totalSets = workout.exercises.reduce((acc, e) => acc + (parseInt(e.sets) || 0), 0);

  const confirmDelete = () => {
    Alert.alert('Delete Workout', `Remove "${workout.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(workout.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Card header */}
      <TouchableOpacity style={styles.cardHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.typeIcon, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
            <Ionicons name={TYPE_ICONS[workout.type] as any ?? 'barbell-outline'} size={18} color={typeStyle.text} />
          </View>
          <View>
            <Text style={styles.cardName}>{workout.name}</Text>
            <Text style={styles.cardDate}>{formatDate(workout.created_at)}</Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
      </TouchableOpacity>

      {/* Quick stats */}
      <View style={styles.cardStats}>
        <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
          <Text style={[styles.typeBadgeText, { color: typeStyle.text }]}>
            {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.cardStatText}>{workout.exercises.length} exercises</Text>
        <Text style={styles.cardStatDot}>·</Text>
        <Text style={styles.cardStatText}>{totalSets} sets</Text>
        <Text style={styles.cardStatDot}>·</Text>
        <Text style={styles.cardStatText}>~{Math.round(totalSets * 2.5)}m</Text>
      </View>

      {/* Expanded exercise list */}
      {expanded && (
        <View style={styles.exerciseList}>
          <View style={styles.divider} />
          {workout.exercises.map((ex, i) => (
            <View key={ex.id ?? i} style={styles.exerciseRow}>
              <View style={styles.exerciseNum}>
                <Text style={styles.exerciseNumText}>{i + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMuscle}>{ex.muscleGroup}</Text>
              </View>
              <View style={styles.exerciseChips}>
                <View style={styles.chip}><Text style={styles.chipText}>{ex.sets}×{ex.reps}</Text></View>
                {ex.weight ? <View style={styles.chip}><Text style={styles.chipText}>{ex.weight}kg</Text></View> : null}
              </View>
            </View>
          ))}

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.startBtn} activeOpacity={0.85}>
              <Ionicons name="play-circle-outline" size={18} color="white" />
              <Text style={styles.startBtnText}>Start Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function MyWorkouts() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setWorkouts(data as Workout[]);
    }
    setLoading(false);
  };

  // Refetch every time this screen comes into focus
  useFocusEffect(useCallback(() => { fetchWorkouts(); }, []));

  const deleteWorkout = async (id: string) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/profile')}>
            <Ionicons name="arrow-back" size={20} color="#3b82f6" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Workouts</Text>
          <Text style={styles.subtitle}>
            {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} saved
          </Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : workouts.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🏋️</Text>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySubtitle}>Create your first workout using the Create tab</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => router.replace('/(tabs)/create')}>
              <Ionicons name="add-circle-outline" size={18} color="white" />
              <Text style={styles.createBtnText}>Create Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {workouts.map(w => (
              <WorkoutCard key={w.id} workout={w} onDelete={deleteWorkout} />
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  backText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 28 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },

  list: { paddingHorizontal: 16, paddingTop: 4 },

  card: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cardDate: { color: '#6b7280', fontSize: 12 },

  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  typeBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  cardStatText: { color: '#6b7280', fontSize: 12 },
  cardStatDot: { color: '#374151', fontSize: 12 },

  divider: { height: 1, backgroundColor: '#1a2540', marginHorizontal: 16 },

  exerciseList: { paddingBottom: 4 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  exerciseNum: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#162035',
    borderWidth: 1,
    borderColor: '#1f3a6a',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exerciseNumText: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: 'white', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  exerciseMuscle: { color: '#6b7280', fontSize: 12 },
  exerciseChips: { flexDirection: 'row', gap: 6 },
  chip: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#1f2a3c',
  },
  chipText: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },

  cardActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingTop: 12,
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  startBtnText: { color: 'white', fontSize: 14, fontWeight: '700' },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});