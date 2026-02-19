import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

type Difficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

interface Exercise {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sets: string;
  reps: string;
  muscles: string[];
  image: { uri: string };
  instructions: string[];
  proTip: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '8-12 reps',
    muscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoids'],
    image: { uri: '' },
    instructions: [
      'Lie flat on the bench with feet firmly on the ground',
      'Grip the barbell slightly wider than shoulder-width',
      'Lower the bar to your mid-chest with control',
      'Press the bar back up explosively until arms are extended',
    ],
    proTip: 'Keep your shoulder blades retracted and maintain a slight arch in your lower back',
  },
  {
    id: 'pushups',
    name: 'Push-Ups',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '15-20 reps',
    muscles: ['Pectoralis Major', 'Triceps', 'Core'],
    image: { uri: '' },
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulders',
      'Keep your body in a straight line from head to heels',
      'Lower your chest to just above the floor',
      'Push back up to the starting position explosively',
    ],
    proTip: 'Squeeze your glutes and core throughout the entire movement to protect your lower back',
  },
  {
    id: 'dumbbell_fly',
    name: 'Dumbbell Fly',
    difficulty: 'Intermediate',
    sets: '3 sets',
    reps: '10-15 reps',
    muscles: ['Pectoralis Major', 'Anterior Deltoids'],
    image: { uri: '' },
    instructions: [
      'Lie on a flat bench holding dumbbells above your chest',
      'Keep a slight bend in the elbows throughout',
      'Lower the dumbbells in a wide arc until you feel a stretch',
      'Bring them back together squeezing your chest at the top',
    ],
    proTip: 'Think of hugging a giant tree — the arc motion is key, not a press',
  },
  {
    id: 'chest_dips',
    name: 'Chest Dips',
    difficulty: 'Intermediate',
    sets: '3 sets',
    reps: '8-12 reps',
    muscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoids'],
    image: { uri: '' },
    instructions: [
      'Grip parallel bars and lift yourself up to the starting position',
      'Lean your torso slightly forward to target the chest',
      'Lower yourself until your upper arms are parallel to the ground',
      'Push back up to the top without fully locking the elbows',
    ],
    proTip: 'The more you lean forward, the more you shift the work onto your chest vs triceps',
  },
  {
    id: 'incline_press',
    name: 'Incline Press',
    difficulty: 'Advanced',
    sets: '4 sets',
    reps: '6-10 reps',
    muscles: ['Upper Pectoralis', 'Anterior Deltoids', 'Triceps'],
    image: { uri: '' },
    instructions: [
      'Set the bench to a 30-45 degree incline',
      'Unrack the bar and hold it above your upper chest',
      'Lower the bar slowly to the top of your chest',
      'Drive the bar up in a slight arc back to the starting position',
    ],
    proTip: 'Keep the incline under 45° — steeper angles shift the work to your shoulders',
  },
  {
    id: 'cable_crossover',
    name: 'Cable Crossover',
    difficulty: 'Advanced',
    sets: '3 sets',
    reps: '12-15 reps',
    muscles: ['Pectoralis Major', 'Anterior Deltoids'],
    image: { uri: '' },
    instructions: [
      'Stand in the center of a cable machine with handles at the highest setting',
      'Step forward and lean slightly from the waist',
      'Bring both handles down and across in a wide arc',
      'Squeeze the chest at the bottom, then return slowly',
    ],
    proTip: 'Slow down the eccentric (return) phase — that\'s where most chest growth happens',
  },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  Intermediate: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Advanced: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
};

const FILTERS: Difficulty[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// ── Detail Modal ─────────────────────────────────────────────────────────────
function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise | null;
  onClose: () => void;
}) {
  const slideY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgFade = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (exercise) {
      setImgLoaded(false);
      imgFade.setValue(0);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 14 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [exercise]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: height, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(onClose);
  };

  const onImgLoad = () => {
    setImgLoaded(true);
    Animated.timing(imgFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  if (!exercise) return null;

  const diff = DIFFICULTY_COLORS[exercise.difficulty];

  return (
    <Modal transparent animationType="none" onRequestClose={handleClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideY }] }]}>
        {/* Hero image behind the sheet */}
        <View style={styles.modalHero}>
          <View style={[styles.modalHeroPlaceholder, { backgroundColor: '#0c1120' }]} />
          <Animated.Image
            source={exercise.image}
            style={[styles.modalHeroImage, { opacity: imgFade }]}
            resizeMode="cover"
            onLoad={onImgLoad}
          />
          <View style={styles.modalHeroGradient} />
        </View>

        {/* Pull indicator */}
        <View style={styles.pullIndicator} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          {/* Title row */}
          <View style={styles.modalTitleRow}>
            <Text style={styles.modalTitle}>{exercise.name}</Text>
            <View style={[styles.diffBadge, { backgroundColor: diff.bg, borderColor: diff.border }]}>
              <Text style={[styles.diffBadgeText, { color: diff.text }]}>{exercise.difficulty}</Text>
            </View>
          </View>

          {/* Sets × Reps */}
          <View style={styles.modalMeta}>
            <Text style={styles.modalMetaIcon}>⊙</Text>
            <Text style={styles.modalMetaText}>{exercise.sets} × {exercise.reps}</Text>
          </View>

          {/* Target Muscles */}
          <Text style={styles.modalSectionLabel}>Target Muscles</Text>
          <View style={styles.modalTagRow}>
            {exercise.muscles.map(m => (
              <View key={m} style={styles.modalTag}>
                <Text style={styles.modalTagText}>{m}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <Text style={styles.modalSectionLabel}>Instructions</Text>
          {exercise.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {/* Pro Tip */}
          <View style={styles.proTipCard}>
            <View style={styles.proTipHeader}>
              <Text style={styles.proTipIcon}>⚡</Text>
              <Text style={styles.proTipTitle}>Pro Tip</Text>
            </View>
            <Text style={styles.proTipText}>{exercise.proTip}</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({
  exercise,
  onPress,
}: {
  exercise: Exercise;
  onPress: () => void;
}) {
  const imgFade = useRef(new Animated.Value(0)).current;
  const diff = DIFFICULTY_COLORS[exercise.difficulty];

  const onLoad = () => {
    Animated.timing(imgFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
      {/* Image */}
      <View style={styles.cardImageWrapper}>
        <View style={[styles.cardImagePlaceholder, { backgroundColor: '#0c1120' }]} />
        <Animated.Image
          source={exercise.image}
          style={[styles.cardImage, { opacity: imgFade }]}
          resizeMode="cover"
          onLoad={onLoad}
        />
        {/* Gradient overlay at bottom */}
        <View style={styles.cardImageGradient} />
        {/* Difficulty badge */}
        <View style={[styles.diffBadge, styles.cardBadge, { backgroundColor: diff.bg, borderColor: diff.border }]}>
          <Text style={[styles.diffBadgeText, { color: diff.text }]}>{exercise.difficulty}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{exercise.name}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaIcon}>⊙</Text>
          <Text style={styles.cardMetaText}>{exercise.sets}</Text>
          <Text style={styles.cardMetaSep}>  ⚡</Text>
          <Text style={styles.cardMetaText}>{exercise.reps}</Text>
        </View>
        <View style={styles.cardTagRow}>
          {exercise.muscles.slice(0, 3).map(m => (
            <View key={m} style={styles.cardTag}>
              <Text style={styles.cardTagText}>{m}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.detailsBtn} onPress={onPress}>
          <Text style={styles.detailsBtnIcon}>ⓘ</Text>
          <Text style={styles.detailsBtnText}>Tap to view details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ChestExercises() {
  const router = useRouter();
  const [filter, setFilter] = useState<Difficulty>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = filter === 'All'
    ? EXERCISES
    : EXERCISES.filter(e => e.difficulty === filter);

  const openExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/exercises')}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back to Exercises</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chest Exercises</Text>
          <Text style={styles.subtitle}>{filtered.length} exercises available</Text>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={{ marginBottom: 20 }}
        >
          {FILTERS.map(f => {
            const active = filter === f;
            const color = f === 'All' ? '#2563eb' : DIFFICULTY_COLORS[f]?.text ?? '#2563eb';
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterBtn,
                  active && { backgroundColor: f === 'All' ? '#1d4ed8' : DIFFICULTY_COLORS[f]?.bg, borderColor: f === 'All' ? '#3b82f6' : DIFFICULTY_COLORS[f]?.border },
                ]}
              >
                <Text style={[styles.filterText, active && { color: f === 'All' ? 'white' : color }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Exercise Cards */}
        <View style={styles.cardList}>
          {filtered.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} onPress={() => openExercise(ex)} />
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      {modalVisible && (
        <ExerciseModal exercise={selectedExercise} onClose={closeModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: 10 },
  backArrow: { color: '#3b82f6', fontSize: 18, marginRight: 6 },
  backText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13 },

  // Filters
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  filterText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },

  // Cards
  cardList: { paddingHorizontal: 14, gap: 16 },
  card: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardImageWrapper: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  cardImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardImageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulated gradient with a dark bottom
    backgroundImage: undefined,
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardContent: { padding: 16 },
  cardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardMetaIcon: { color: '#6b7280', fontSize: 14, marginRight: 4 },
  cardMetaText: { color: '#94a3b8', fontSize: 13 },
  cardMetaSep: { color: '#fbbf24', fontSize: 13 },
  cardTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  cardTag: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1f2a3c',
  },
  cardTagText: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailsBtnIcon: { color: '#3b82f6', fontSize: 15 },
  detailsBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: '600' },

  // Difficulty badge
  diffBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  diffBadgeText: { fontSize: 12, fontWeight: '700' },

  // Modal
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0e1729',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.88,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#1a2540',
    overflow: 'hidden',
  },
  modalHero: {
    position: 'absolute',
    top: -160,
    left: 0,
    right: 0,
    height: 200,
    zIndex: -1,
  },
  modalHeroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  modalHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  modalHeroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,23,41,0.7)',
  },
  pullIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#2d3f5c',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
  modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  modalMetaIcon: { color: '#6b7280', fontSize: 16 },
  modalMetaText: { color: '#94a3b8', fontSize: 15 },
  modalSectionLabel: { color: '#6b7280', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  modalTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  modalTag: {
    backgroundColor: '#162035',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1f3a6a',
  },
  modalTagText: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#162035',
    borderWidth: 1,
    borderColor: '#1f3a6a',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: '#60a5fa', fontSize: 12, fontWeight: 'bold' },
  stepText: { color: '#cbd5e1', fontSize: 14, flex: 1, lineHeight: 22 },
  proTipCard: {
    backgroundColor: 'rgba(251,191,36,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
    padding: 16,
    marginTop: 8,
  },
  proTipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  proTipIcon: { fontSize: 18, color: '#fbbf24' },
  proTipTitle: { color: '#fbbf24', fontWeight: 'bold', fontSize: 15 },
  proTipText: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
});