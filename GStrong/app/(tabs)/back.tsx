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
  image: any;
  instructions: string[];
  proTip: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'barbell_rows',
    name: 'Barbell Rows',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '8-12 reps',
    muscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps'],
    image: require('../../assets/images/back/barbell_rows.png'),
    instructions: [
      'Stand with feet shoulder-width apart and hinge at the hips',
      'Grip the barbell just outside your legs with an overhand grip',
      'Keep your back flat and core tight throughout',
      'Pull the bar toward your lower chest, leading with your elbows',
      'Lower the bar slowly back to the starting position',
    ],
    proTip: 'Keep your torso as close to parallel to the floor as possible — the more upright you are, the less lat engagement you get',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    difficulty: 'Advanced',
    sets: '3-5 sets',
    reps: '3-6 reps',
    muscles: ['Erector Spinae', 'Latissimus Dorsi', 'Glutes', 'Hamstrings'],
    image: require('../../assets/images/back/deadlift.png'),
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at the hips and grip the bar just outside your legs',
      'Brace your core, take a deep breath, and create full-body tension',
      'Drive through the floor, keeping the bar close to your body',
      'Lock out the hips at the top, then lower under control',
    ],
    proTip: 'Think "push the floor away" rather than "pull the bar up" — it cues better leg drive and keeps your back safer',
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '15-20 reps',
    muscles: ['Rear Deltoids', 'Rhomboids', 'Rotator Cuff'],
    image: require('../../assets/images/back/face_pull.png'),
    instructions: [
      'Set a cable machine to upper-chest height with a rope attachment',
      'Grab the rope with both hands, palms facing inward',
      'Step back to create tension and keep elbows at shoulder height',
      'Pull the rope toward your face, flaring elbows out to the sides',
      'Squeeze the rear delts and rhomboids at full contraction',
    ],
    proTip: 'Do these every single session — face pulls are the single best exercise for shoulder health and posture correction',
  },
  {
    id: 'pull_ups',
    name: 'Pull-Ups',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '6-12 reps',
    muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Deltoids'],
    image: require('../../assets/images/back/pull_ups.png'),
    instructions: [
      'Hang from a pull-up bar with hands slightly wider than shoulder-width',
      'Engage your lats by depressing your shoulder blades downward',
      'Pull your chest toward the bar, driving elbows down and back',
      'Pause briefly at the top, chin over the bar',
      'Lower yourself slowly to a full dead hang between reps',
    ],
    proTip: 'Focus on driving your elbows to your hips rather than pulling with your hands — this shifts the work from biceps to lats',
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '10-12 reps',
    muscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    image: require('../../assets/images/back/romanian_deadlift.png'),
    instructions: [
      'Stand holding the bar at hip height with an overhand grip',
      'Push your hips back and lower the bar along your legs',
      'Keep a slight bend in the knees and back completely flat',
      'Lower until you feel a deep hamstring stretch',
      'Drive hips forward to return to the starting position',
    ],
    proTip: 'The bar should stay in contact with your legs the entire way down — if it drifts forward, you\'re loading your lower back instead of your hamstrings',
  },
  {
    id: 'lat_pulldown',
    name: 'Lateral Pulldown',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '10-15 reps',
    muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Deltoids'],
    image: require('../../assets/images/exercises/back.jpg'), // placeholder — swap for lat_pulldown image
    instructions: [
      'Sit at a lat pulldown machine and secure your thighs under the pads',
      'Grip the bar slightly wider than shoulder-width, palms facing away',
      'Lean back slightly and pull the bar down toward your upper chest',
      'Squeeze your lats hard at the bottom of the movement',
      'Return the bar slowly to full arm extension',
    ],
    proTip: 'Pull to your upper chest, not behind your neck — behind-the-neck pulldowns put serious stress on your cervical spine',
  },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  Intermediate: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Advanced: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
};

const FILTERS: Difficulty[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// ── Detail Modal ──────────────────────────────────────────────────────────────
function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise | null;
  onClose: () => void;
}) {
  const slideY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const imgFade = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (exercise) {
      imgFade.setValue(0);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 100, friction: 14 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      Animated.timing(imgFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [exercise]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: height, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(onClose);
  };

  if (!exercise) return null;

  const diff = DIFFICULTY_COLORS[exercise.difficulty];

  return (
    <Modal transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.modalHero}>
          <View style={[styles.modalHeroPlaceholder, { backgroundColor: '#0c1120' }]} />
          <Animated.Image
            source={exercise.image}
            style={[styles.modalHeroImage, { opacity: imgFade }]}
            resizeMode="cover"
          />
          <View style={styles.modalHeroGradient} />
        </View>

        <View style={styles.pullIndicator} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={styles.modalTitleRow}>
            <Text style={styles.modalTitle}>{exercise.name}</Text>
            <View style={[styles.diffBadge, { backgroundColor: diff.bg, borderColor: diff.border }]}>
              <Text style={[styles.diffBadgeText, { color: diff.text }]}>{exercise.difficulty}</Text>
            </View>
          </View>

          <View style={styles.modalMeta}>
            <Text style={styles.modalMetaIcon}>⊙</Text>
            <Text style={styles.modalMetaText}>{exercise.sets} × {exercise.reps}</Text>
          </View>

          <Text style={styles.modalSectionLabel}>Target Muscles</Text>
          <View style={styles.modalTagRow}>
            {exercise.muscles.map(m => (
              <View key={m} style={styles.modalTag}>
                <Text style={styles.modalTagText}>{m}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.modalSectionLabel}>Instructions</Text>
          {exercise.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

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

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
      <View style={styles.cardImageWrapper}>
        <View style={styles.cardImagePlaceholder} />
        <Animated.Image
          source={exercise.image}
          style={[styles.cardImage, { opacity: imgFade }]}
          resizeMode="cover"
          onLoad={() =>
            Animated.timing(imgFade, { toValue: 1, duration: 300, useNativeDriver: true }).start()
          }
        />
        <View style={[styles.diffBadge, styles.cardBadge, { backgroundColor: diff.bg, borderColor: diff.border }]}>
          <Text style={[styles.diffBadgeText, { color: diff.text }]}>{exercise.difficulty}</Text>
        </View>
      </View>

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
export default function BackExercises() {
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back to Exercises</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Back Exercises</Text>
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
                  active && {
                    backgroundColor: f === 'All' ? '#1d4ed8' : DIFFICULTY_COLORS[f]?.bg,
                    borderColor: f === 'All' ? '#3b82f6' : DIFFICULTY_COLORS[f]?.border,
                  },
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

      {modalVisible && (
        <ExerciseModal exercise={selectedExercise} onClose={closeModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backArrow: { color: '#3b82f6', fontSize: 18, marginRight: 6 },
  backText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13 },

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

  cardList: { paddingHorizontal: 14, gap: 16 },
  card: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardImageWrapper: { width: '100%', height: 200, position: 'relative' },
  cardImagePlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0c1120' },
  cardImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 12, right: 12 },
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

  diffBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  diffBadgeText: { fontSize: 12, fontWeight: '700' },

  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
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
  modalHeroPlaceholder: { ...StyleSheet.absoluteFillObject },
  modalHeroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  modalHeroGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,23,41,0.7)' },
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
  modalSectionLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
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