import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
    id: 'chest',
    name: 'Chest',
    emoji: '💪',
    color: '#1d4ed8',
    exercises: ['Bench Press', 'Push-Ups', 'Dumbbell Fly', 'Chest Dips', 'Incline Press', 'Cable Crossover'],
  },
  {
    id: 'back',
    name: 'Back',
    emoji: '🏋️',
    color: '#065f46',
    exercises: ['Pull-Ups', 'Barbell Rows', 'Deadlift', 'Face Pull', 'Romanian Deadlift', 'Lat Pulldown'],
  },
  {
    id: 'legs',
    name: 'Legs',
    emoji: '🦵',
    color: '#7c3aed',
    exercises: ['Squat', 'Lunges', 'Leg Press', 'Leg Curl', 'Calf Raise', 'Bulgarian Split Squat'],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    emoji: '🤸',
    color: '#0f766e',
    exercises: ['Dumbbell Shoulder Press', 'Arnold Press', 'Lateral Raise', 'Front Raise', 'Reverse Fly', 'Upright Row'],
  },
  {
    id: 'arms',
    name: 'Arms',
    emoji: '💪',
    color: '#b45309',
    exercises: ['Bicep Curl', 'Hammer Curl', 'Concentration Curl', 'Close Grip Bench', 'Overhead Tricep Extension', 'Tricep Dips'],
  },
  {
    id: 'core',
    name: 'Core',
    emoji: '🔥',
    color: '#be123c',
    exercises: ['Plank', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers', 'Ab Rollout'],
  },
];

const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength', icon: 'barbell-outline' },
  { id: 'hypertrophy', label: 'Hypertrophy', icon: 'body-outline' },
  { id: 'cardio', label: 'Cardio', icon: 'heart-outline' },
  { id: 'circuit', label: 'Circuit', icon: 'refresh-outline' },
];

// ── Exercise Picker Modal ─────────────────────────────────────────────────────
function ExercisePickerModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: Omit<ExerciseEntry, 'id'>) => void;
}) {
  const [selectedGroup, setSelectedGroup] = useState<MuscleOption | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');

  const reset = () => {
    setSelectedGroup(null);
    setSelectedExercise('');
    setSets('3');
    setReps('10');
    setWeight('');
  };

  const handleAdd = () => {
    if (!selectedExercise) return;
    onAdd({
      name: selectedExercise,
      muscleGroup: selectedGroup?.name ?? '',
      sets,
      reps,
      weight,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <View style={modal.sheet}>
          <View style={modal.handle} />

          <View style={modal.sheetHeader}>
            <Text style={modal.sheetTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Step 1 — Pick muscle group */}
            <Text style={modal.stepLabel}>Muscle Group</Text>
            <View style={modal.groupGrid}>
              {MUSCLE_GROUPS.map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[modal.groupChip, selectedGroup?.id === g.id && { backgroundColor: g.color + '33', borderColor: g.color }]}
                  onPress={() => { setSelectedGroup(g); setSelectedExercise(''); }}
                >
                  <Text style={modal.groupChipEmoji}>{g.emoji}</Text>
                  <Text style={[modal.groupChipText, selectedGroup?.id === g.id && { color: 'white' }]}>{g.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Step 2 — Pick exercise */}
            {selectedGroup && (
              <>
                <Text style={modal.stepLabel}>Exercise</Text>
                {selectedGroup.exercises.map(ex => (
                  <TouchableOpacity
                    key={ex}
                    style={[modal.exerciseRow, selectedExercise === ex && modal.exerciseRowActive]}
                    onPress={() => setSelectedExercise(ex)}
                  >
                    <Text style={[modal.exerciseRowText, selectedExercise === ex && { color: 'white' }]}>{ex}</Text>
                    {selectedExercise === ex && (
                      <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Step 3 — Sets / Reps / Weight */}
            {selectedExercise !== '' && (
              <>
                <Text style={modal.stepLabel}>Details</Text>
                <View style={modal.detailsRow}>
                  <View style={modal.detailBox}>
                    <Text style={modal.detailLabel}>Sets</Text>
                    <TextInput
                      style={modal.detailInput}
                      value={sets}
                      onChangeText={setSets}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                  </View>
                  <View style={modal.detailBox}>
                    <Text style={modal.detailLabel}>Reps</Text>
                    <TextInput
                      style={modal.detailInput}
                      value={reps}
                      onChangeText={setReps}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                  </View>
                  <View style={modal.detailBox}>
                    <Text style={modal.detailLabel}>kg</Text>
                    <TextInput
                      style={modal.detailInput}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="—"
                      placeholderTextColor="#4b5563"
                      selectTextOnFocus
                    />
                  </View>
                </View>

                <TouchableOpacity style={modal.addBtn} onPress={handleAdd}>
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text style={modal.addBtnText}>Add to Workout</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CreateWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  const addExercise = (ex: Omit<ExerciseEntry, 'id'>) => {
    setExercises(prev => [...prev, { ...ex, id: Date.now().toString() }]);
  };

  const removeExercise = (id: string) => {
    Alert.alert('Remove Exercise', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setExercises(prev => prev.filter(e => e.id !== id)) },
    ]);
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Name required', 'Please give your workout a name');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('No exercises', 'Add at least one exercise');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save workouts');
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('workouts').insert({
      user_id: user.id,
      name: workoutName.trim(),
      type: workoutType,
      exercises: exercises,
    });
    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Workout Saved! 💪', `"${workoutName}" has been saved.`, [
        { text: 'Great!', onPress: () => { setWorkoutName(''); setExercises([]); setWorkoutType('strength'); } },
      ]);
    }
  };

  const totalSets = exercises.reduce((acc, e) => acc + (parseInt(e.sets) || 0), 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <LinearGradient
            colors={['#0d1a35', '#060a14']}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Create Workout</Text>
            <Text style={styles.headerSubtitle}>Build your perfect session</Text>
          </LinearGradient>

          {/* Workout name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Workout Name</Text>
            <View style={styles.nameInput}>
              <Ionicons name="pencil-outline" size={18} color="#4b5563" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.nameInputText}
                placeholder="e.g. Push Day, Leg Day..."
                placeholderTextColor="#4b5563"
                value={workoutName}
                onChangeText={setWorkoutName}
              />
            </View>
          </View>

          {/* Workout type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Workout Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {WORKOUT_TYPES.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeChip, workoutType === t.id && styles.typeChipActive]}
                  onPress={() => setWorkoutType(t.id)}
                >
                  <Ionicons
                    name={t.icon as any}
                    size={16}
                    color={workoutType === t.id ? 'white' : '#6b7280'}
                  />
                  <Text style={[styles.typeChipText, workoutType === t.id && { color: 'white' }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Stats bar */}
          {exercises.length > 0 && (
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{exercises.length}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalSets}</Text>
                <Text style={styles.statLabel}>Total Sets</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>~{Math.round(totalSets * 2.5)}m</Text>
                <Text style={styles.statLabel}>Est. Time</Text>
              </View>
            </View>
          )}

          {/* Exercise list */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Exercises</Text>

            {exercises.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🏋️</Text>
                <Text style={styles.emptyTitle}>No exercises yet</Text>
                <Text style={styles.emptySubtitle}>Tap the button below to add your first exercise</Text>
              </View>
            ) : (
              exercises.map((ex, index) => {
                const group = MUSCLE_GROUPS.find(g => g.name === ex.muscleGroup);
                return (
                  <View key={ex.id} style={styles.exerciseCard}>
                    <View style={[styles.exerciseIndex, { backgroundColor: (group?.color ?? '#1d4ed8') + '33' }]}>
                      <Text style={[styles.exerciseIndexText, { color: group?.color ?? '#60a5fa' }]}>{index + 1}</Text>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <View style={styles.exerciseMeta}>
                        <View style={styles.exerciseMetaChip}>
                          <Text style={styles.exerciseMetaText}>{ex.sets} sets</Text>
                        </View>
                        <View style={styles.exerciseMetaChip}>
                          <Text style={styles.exerciseMetaText}>{ex.reps} reps</Text>
                        </View>
                        {ex.weight ? (
                          <View style={styles.exerciseMetaChip}>
                            <Text style={styles.exerciseMetaText}>{ex.weight} kg</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeExercise(ex.id)} style={styles.removeBtn}>
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                );
              })
            )}

            {/* Add exercise button */}
            <TouchableOpacity style={styles.addExerciseBtn} onPress={() => setPickerVisible(true)}>
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text style={styles.addExerciseBtnText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Save button — fixed at bottom */}
        {exercises.length > 0 && (
          <View style={styles.saveContainer}>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                  <Text style={styles.saveBtnText}>Save Workout</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onAdd={addExercise}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2540',
  },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: '#6b7280', fontSize: 13, marginTop: 4 },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  nameInput: {
    backgroundColor: '#0c1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2540',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  nameInputText: { flex: 1, color: 'white', fontSize: 15 },

  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  typeChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#3b82f6',
  },
  typeChipText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: '#1a2540' },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#0c1120',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { color: '#6b7280', fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },

  exerciseCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  exerciseIndex: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  exerciseIndexText: { fontSize: 15, fontWeight: 'bold' },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: 'white', fontSize: 15, fontWeight: '600', marginBottom: 6 },
  exerciseMeta: { flexDirection: 'row', gap: 6 },
  exerciseMetaChip: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#1f2a3c',
  },
  exerciseMetaText: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  removeBtn: { padding: 6 },

  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1d4ed8',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(37,99,235,0.06)',
  },
  addExerciseBtnText: { color: '#3b82f6', fontSize: 15, fontWeight: '600' },

  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#060a14',
    borderTopWidth: 1,
    borderTopColor: '#1a2540',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

const modal = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0e1729',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#1a2540',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#2d3f5c',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },

  stepLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },

  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2a3c',
  },
  groupChipEmoji: { fontSize: 16 },
  groupChipText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },

  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a3c',
    marginBottom: 8,
  },
  exerciseRowActive: {
    borderColor: '#2563eb',
    backgroundColor: '#0d1a35',
  },
  exerciseRowText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },

  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailBox: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a3c',
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: { color: '#6b7280', fontSize: 11, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  detailInput: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },

  addBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  addBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
});