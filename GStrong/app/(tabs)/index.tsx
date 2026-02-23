import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExerciseEntry {
  id: string;
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  weight: string;
}

interface MuscleOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  exercises: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MUSCLE_GROUPS: MuscleOption[] = [
  {
    id: 'chest', name: 'Chest', emoji: '💪', color: '#1d4ed8',
    exercises: ['Bench Press', 'Push-Ups', 'Dumbbell Fly', 'Chest Dips', 'Incline Press', 'Cable Crossover'],
  },
  {
    id: 'back', name: 'Back', emoji: '🏋️', color: '#065f46',
    exercises: ['Pull-Ups', 'Barbell Rows', 'Deadlift', 'Face Pull', 'Romanian Deadlift', 'Lat Pulldown'],
  },
  {
    id: 'legs', name: 'Legs', emoji: '🦵', color: '#7c3aed',
    exercises: ['Squat', 'Lunges', 'Leg Press', 'Leg Curl', 'Calf Raise', 'Bulgarian Split Squat'],
  },
  {
    id: 'shoulders', name: 'Shoulders', emoji: '🤸', color: '#0f766e',
    exercises: ['Shoulder Press', 'Arnold Press', 'Lateral Raise', 'Front Raise', 'Reverse Fly', 'Upright Row'],
  },
  {
    id: 'arms', name: 'Arms', emoji: '💪', color: '#b45309',
    exercises: ['Bicep Curl', 'Hammer Curl', 'Concentration Curl', 'Close Grip Bench', 'Overhead Tricep Extension', 'Tricep Dips'],
  },
  {
    id: 'core', name: 'Core', emoji: '🔥', color: '#be123c',
    exercises: ['Plank', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers', 'Ab Rollout'],
  },
];

const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength', icon: 'barbell-outline' },
  { id: 'hypertrophy', label: 'Hypertrophy', icon: 'body-outline' },
  { id: 'cardio', label: 'Cardio', icon: 'heart-outline' },
  { id: 'circuit', label: 'Circuit', icon: 'refresh-outline' },
];

// ── Quick Start Modal (single modal, picker inlined) ──────────────────────────
function QuickStartModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);

  // Picker state — inlined, no second Modal
  const [showPicker, setShowPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<MuscleOption | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');

  const resetPicker = () => {
    setSelectedGroup(null);
    setSelectedExercise('');
    setSets('3');
    setReps('10');
    setWeight('');
  };

  const handleAddExercise = () => {
    if (!selectedExercise) return;
    setExercises(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: selectedExercise,
        muscleGroup: selectedGroup?.name ?? '',
        sets,
        reps,
        weight,
      },
    ]);
    resetPicker();
    setShowPicker(false);
  };

  const removeExercise = (id: string) => {
    Alert.alert('Remove Exercise', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setExercises(prev => prev.filter(e => e.id !== id)) },
    ]);
  };

  const handleStart = () => {
    if (!workoutName.trim()) { Alert.alert('Name required', 'Please give your workout a name'); return; }
    if (exercises.length === 0) { Alert.alert('No exercises', 'Add at least one exercise'); return; }
    Alert.alert('Workout Started! 💪', `"${workoutName}" is ready to go!`, [
      { text: "Let's Go!", onPress: () => { setWorkoutName(''); setExercises([]); setWorkoutType('strength'); onClose(); } },
    ]);
  };

  const totalSets = exercises.reduce((acc, e) => acc + (parseInt(e.sets) || 0), 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={qs.backdrop}>
        <View style={qs.sheet}>
          <View style={qs.handle} />

          {/* ── PICKER VIEW ── */}
          {showPicker ? (
            <>
              <View style={qs.sheetHeader}>
                <TouchableOpacity style={qs.backBtn} onPress={() => { resetPicker(); setShowPicker(false); }}>
                  <Ionicons name="arrow-back" size={20} color="#6b7280" />
                </TouchableOpacity>
                <Text style={qs.sheetTitle}>Add Exercise</Text>
                <View style={{ width: 34 }} />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={qs.stepLabel}>Muscle Group</Text>
                <View style={qs.groupGrid}>
                  {MUSCLE_GROUPS.map(g => (
                    <TouchableOpacity
                      key={g.id}
                      style={[
                        qs.groupChip,
                        selectedGroup?.id === g.id && { backgroundColor: g.color + '33', borderColor: g.color },
                      ]}
                      onPress={() => { setSelectedGroup(g); setSelectedExercise(''); }}
                    >
                      <Text style={qs.groupChipEmoji}>{g.emoji}</Text>
                      <Text style={[qs.groupChipText, selectedGroup?.id === g.id && { color: 'white' }]}>{g.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedGroup && (
                  <>
                    <Text style={qs.stepLabel}>Exercise</Text>
                    {selectedGroup.exercises.map(ex => (
                      <TouchableOpacity
                        key={ex}
                        style={[qs.exerciseRow, selectedExercise === ex && qs.exerciseRowActive]}
                        onPress={() => setSelectedExercise(ex)}
                      >
                        <Text style={[qs.exerciseRowText, selectedExercise === ex && { color: 'white' }]}>{ex}</Text>
                        {selectedExercise === ex && <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />}
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {selectedExercise !== '' && (
                  <>
                    <Text style={qs.stepLabel}>Details</Text>
                    <View style={qs.detailsRow}>
                      {[
                        { label: 'Sets', value: sets, onChange: setSets },
                        { label: 'Reps', value: reps, onChange: setReps },
                        { label: 'kg', value: weight, onChange: setWeight, placeholder: '—' },
                      ].map(({ label, value, onChange, placeholder }) => (
                        <View key={label} style={qs.detailBox}>
                          <Text style={qs.detailLabel}>{label}</Text>
                          <TextInput
                            style={qs.detailInput}
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            selectTextOnFocus
                            placeholder={placeholder}
                            placeholderTextColor="#4b5563"
                          />
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity style={qs.addBtn} onPress={handleAddExercise}>
                      <Ionicons name="add-circle-outline" size={20} color="white" />
                      <Text style={qs.addBtnText}>Add to Workout</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </>
          ) : (
            /* ── MAIN WORKOUT VIEW ── */
            <>
              <View style={qs.sheetHeader}>
                <View>
                  <Text style={qs.sheetTitle}>Quick Start</Text>
                  <Text style={qs.sheetSubtitle}>Build your session</Text>
                </View>
                <TouchableOpacity style={qs.closeBtn} onPress={onClose}>
                  <Ionicons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Name */}
                <Text style={qs.sectionLabel}>Workout Name</Text>
                <View style={qs.nameInput}>
                  <Ionicons name="pencil-outline" size={18} color="#4b5563" style={{ marginRight: 10 }} />
                  <TextInput
                    style={qs.nameInputText}
                    placeholder="e.g. Push Day, Leg Day..."
                    placeholderTextColor="#4b5563"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                  />
                </View>

                {/* Type */}
                <Text style={qs.sectionLabel}>Workout Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
                  {WORKOUT_TYPES.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={[qs.typeChip, workoutType === t.id && qs.typeChipActive]}
                      onPress={() => setWorkoutType(t.id)}
                    >
                      <Ionicons name={t.icon as any} size={15} color={workoutType === t.id ? 'white' : '#6b7280'} />
                      <Text style={[qs.typeChipText, workoutType === t.id && { color: 'white' }]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Stats */}
                {exercises.length > 0 && (
                  <View style={qs.statsBar}>
                    <View style={qs.statItem}>
                      <Text style={qs.statValue}>{exercises.length}</Text>
                      <Text style={qs.statLabel}>Exercises</Text>
                    </View>
                    <View style={qs.statDivider} />
                    <View style={qs.statItem}>
                      <Text style={qs.statValue}>{totalSets}</Text>
                      <Text style={qs.statLabel}>Total Sets</Text>
                    </View>
                    <View style={qs.statDivider} />
                    <View style={qs.statItem}>
                      <Text style={qs.statValue}>~{Math.round(totalSets * 2.5)}m</Text>
                      <Text style={qs.statLabel}>Est. Time</Text>
                    </View>
                  </View>
                )}

                {/* Exercises */}
                <Text style={qs.sectionLabel}>Exercises</Text>

                {exercises.length === 0 ? (
                  <View style={qs.emptyState}>
                    <Text style={qs.emptyEmoji}>🏋️</Text>
                    <Text style={qs.emptyTitle}>No exercises yet</Text>
                    <Text style={qs.emptySubtitle}>Tap below to add your first exercise</Text>
                  </View>
                ) : (
                  exercises.map((ex, index) => {
                    const group = MUSCLE_GROUPS.find(g => g.name === ex.muscleGroup);
                    return (
                      <View key={ex.id} style={qs.exerciseCard}>
                        <View style={[qs.exerciseIndex, { backgroundColor: (group?.color ?? '#1d4ed8') + '33' }]}>
                          <Text style={[qs.exerciseIndexText, { color: group?.color ?? '#60a5fa' }]}>{index + 1}</Text>
                        </View>
                        <View style={qs.exerciseInfo}>
                          <Text style={qs.exerciseName}>{ex.name}</Text>
                          <View style={qs.exerciseMeta}>
                            <View style={qs.metaChip}><Text style={qs.metaChipText}>{ex.sets} sets</Text></View>
                            <View style={qs.metaChip}><Text style={qs.metaChipText}>{ex.reps} reps</Text></View>
                            {ex.weight ? <View style={qs.metaChip}><Text style={qs.metaChipText}>{ex.weight} kg</Text></View> : null}
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => removeExercise(ex.id)} style={{ padding: 6 }}>
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}

                <TouchableOpacity style={qs.addExerciseBtn} onPress={() => setShowPicker(true)}>
                  <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
                  <Text style={qs.addExerciseBtnText}>Add Exercise</Text>
                </TouchableOpacity>
              </ScrollView>

              {exercises.length > 0 && (
                <View style={qs.startContainer}>
                  <TouchableOpacity style={qs.startBtn} onPress={handleStart} activeOpacity={0.85}>
                    <Ionicons name="flash-outline" size={22} color="white" />
                    <Text style={qs.startBtnText}>Start Workout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
export default function FitnessDashboard() {
  const [quickStartVisible, setQuickStartVisible] = useState(false);

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
          <TouchableOpacity style={styles.quickStartBtn} onPress={() => setQuickStartVisible(true)} activeOpacity={0.85}>
            <View style={styles.quickStartLeft}>
              <View style={styles.quickStartIconWrap}>
                <Ionicons name="flash-outline" size={22} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.quickTitle}>Quick Start Workout</Text>
                <Text style={styles.quickSubtitle}>Build and start your session now</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
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
          {[
            { name: 'Push-ups', detail: '3 sets', time: '2h ago' },
            { name: 'Squats', detail: '4 sets', time: '5h ago' },
            { name: 'Plank', detail: '2 min', time: 'Yesterday' },
          ].map((item, i) => (
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

      <QuickStartModal visible={quickStartVisible} onClose={() => setQuickStartVisible(false)} />
    </View>
  );
}

// ── Home Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  subtitle: { color: '#9ca3af' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#0a0f1f', borderColor: '#1a2338', borderWidth: 1, marginHorizontal: 4, borderRadius: 16, padding: 16 },
  emoji: { fontSize: 24, marginBottom: 10 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  cardLabel: { fontSize: 10, color: '#9ca3af' },

  section: { paddingHorizontal: 20, marginBottom: 30 },

  quickStartBtn: {
    backgroundColor: '#0c1120',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e3a6e',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickStartLeft: { flexDirection: 'row', alignItems: 'center' },
  quickStartIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#0d1a35', borderWidth: 1, borderColor: '#1e3a6e',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  quickTitle: { fontSize: 16, fontWeight: '700', color: 'white' },
  quickSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 3 },

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

// ── Quick Start Sheet Styles ──────────────────────────────────────────────────
const qs = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0e1729',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12,
    maxHeight: '92%',
    borderTopWidth: 1, borderColor: '#1a2540',
  },
  handle: { width: 40, height: 4, backgroundColor: '#2d3f5c', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },

  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  sheetSubtitle: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#131d33', borderWidth: 1, borderColor: '#1a2540', justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#131d33', borderWidth: 1, borderColor: '#1a2540', justifyContent: 'center', alignItems: 'center' },

  sectionLabel: { color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10, marginTop: 16 },

  nameInput: { backgroundColor: '#111827', borderRadius: 14, borderWidth: 1, borderColor: '#1f2a3c', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  nameInputText: { flex: 1, color: 'white', fontSize: 15 },

  typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2a3c', marginRight: 8 },
  typeChipActive: { backgroundColor: '#1d4ed8', borderColor: '#3b82f6' },
  typeChipText: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginLeft: 6 },

  statsBar: { flexDirection: 'row', backgroundColor: '#111827', borderRadius: 14, borderWidth: 1, borderColor: '#1f2a3c', marginTop: 16, padding: 14, alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#1f2a3c' },

  emptyState: { alignItems: 'center', paddingVertical: 36, backgroundColor: '#111827', borderRadius: 18, borderWidth: 1, borderColor: '#1f2a3c', borderStyle: 'dashed', marginBottom: 12 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  emptySubtitle: { color: '#6b7280', fontSize: 12, textAlign: 'center', paddingHorizontal: 24 },

  exerciseCard: { backgroundColor: '#111827', borderRadius: 14, borderWidth: 1, borderColor: '#1f2a3c', flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
  exerciseIndex: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  exerciseIndexText: { fontSize: 14, fontWeight: 'bold' },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: 'white', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  exerciseMeta: { flexDirection: 'row' },
  metaChip: { backgroundColor: '#0e1729', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, borderColor: '#1a2540', marginRight: 5 },
  metaChipText: { color: '#94a3b8', fontSize: 11 },

  addExerciseBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingVertical: 15, borderRadius: 14, borderWidth: 1.5, borderColor: '#1d4ed8', borderStyle: 'dashed', backgroundColor: 'rgba(37,99,235,0.06)' },
  addExerciseBtnText: { color: '#3b82f6', fontSize: 14, fontWeight: '600', marginLeft: 8 },

  startContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, backgroundColor: '#0e1729', borderTopWidth: 1, borderTopColor: '#1a2540' },
  startBtn: { backgroundColor: '#2563eb', borderRadius: 14, paddingVertical: 17, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#3b82f6', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  startBtnText: { color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 8 },

  // Picker styles
  stepLabel: { color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  groupChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2a3c', marginRight: 8, marginBottom: 8 },
  groupChipEmoji: { fontSize: 15 },
  groupChipText: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  exerciseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#111827', borderRadius: 12, borderWidth: 1, borderColor: '#1f2a3c', marginBottom: 8 },
  exerciseRowActive: { borderColor: '#2563eb', backgroundColor: '#0d1a35' },
  exerciseRowText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  detailsRow: { flexDirection: 'row', marginBottom: 20 },
  detailBox: { flex: 1, backgroundColor: '#111827', borderRadius: 12, borderWidth: 1, borderColor: '#1f2a3c', padding: 12, alignItems: 'center', marginRight: 10 },
  detailLabel: { color: '#6b7280', fontSize: 11, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  detailInput: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', width: '100%' },
  addBtn: { backgroundColor: '#2563eb', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#3b82f6', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  addBtnText: { color: 'white', fontSize: 15, fontWeight: '700', marginLeft: 8 },
});