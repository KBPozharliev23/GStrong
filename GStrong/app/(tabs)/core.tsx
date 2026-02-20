import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
    id: 'plank',
    name: 'Plank',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '30-60 seconds',
    muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Glutes', 'Shoulders'],
    image: require('../../assets/images/core/plank.png'),
    instructions: [
      'Start in a forearm plank with elbows directly under your shoulders',
      'Keep your body in a straight line from head to heels',
      'Engage your core by pulling your belly button toward your spine',
      'Squeeze your glutes and keep your hips level — don\'t let them sag or rise',
      'Breathe steadily and hold for the full duration',
    ],
    proTip: 'Quality beats duration every time — a 20-second plank with perfect form does more than a 60-second plank with a sagging back',
  },
  {
    id: 'bicycle_crunch',
    name: 'Bicycle Crunch',
    difficulty: 'Beginner',
    sets: '3 sets',
    reps: '20 reps each side',
    muscles: ['Rectus Abdominis', 'Obliques', 'Hip Flexors'],
    image: require('../../assets/images/core/bicycle_crunch.png'),
    instructions: [
      'Lie on your back with hands lightly behind your head and knees bent',
      'Lift your shoulder blades off the ground and bring one knee toward your chest',
      'Rotate your torso to bring the opposite elbow toward the raised knee',
      'Simultaneously extend the other leg out straight',
      'Alternate sides in a smooth pedalling motion without rushing',
    ],
    proTip: 'Slow down — most people turn bicycle crunches into a neck-pulling race. Focus on rotating your torso, not just your elbows',
  },
  {
    id: 'russian_twists',
    name: 'Russian Twists',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '20 reps each side',
    muscles: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
    image: require('../../assets/images/core/russian_twists.png'),
    instructions: [
      'Sit on the floor with knees bent and feet slightly elevated',
      'Lean back slightly to create a V-shape with your torso and thighs',
      'Hold a weight or clasp your hands together in front of you',
      'Rotate your torso to one side, then twist to the other side',
      'Keep your core braced throughout and move with control',
    ],
    proTip: 'Add a dumbbell or weight plate to make this significantly harder — bodyweight alone becomes too easy quickly for most people',
  },
  {
    id: 'hanging_leg',
    name: 'Hanging Leg Raise',
    difficulty: 'Advanced',
    sets: '3-4 sets',
    reps: '10-15 reps',
    muscles: ['Lower Rectus Abdominis', 'Hip Flexors', 'Obliques'],
    image: require('../../assets/images/core/hanging_leg.png'),
    instructions: [
      'Hang from a pull-up bar with a shoulder-width overhand grip',
      'Brace your core and keep a slight posterior pelvic tilt',
      'Raise your legs up by flexing at the hips, keeping legs straight',
      'Lift until your legs are parallel to the floor or higher',
      'Lower slowly back to the dead hang — don\'t swing or use momentum',
    ],
    proTip: 'If straight-leg raises are too hard, start with knee raises and progressively work toward full straight-leg raises over several weeks',
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug',
    difficulty: 'Beginner',
    sets: '3 sets',
    reps: '10 reps each side',
    muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Spinal Erectors'],
    image: require('../../assets/images/core/dead_bug.png'),
    instructions: [
      'Lie on your back with arms straight up toward the ceiling',
      'Raise your knees to 90° so shins are parallel to the floor',
      'Press your lower back firmly into the floor — maintain this throughout',
      'Slowly lower one arm and the opposite leg toward the floor simultaneously',
      'Return to the start and repeat on the other side',
    ],
    proTip: 'The dead bug is arguably the best core stability exercise — it trains your abs to resist movement rather than create it, which is how they function in real life',
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '30-45 seconds',
    muscles: ['Rectus Abdominis', 'Obliques', 'Hip Flexors', 'Shoulders'],
    image: require('../../assets/images/core/mountain_climbers.png'),
    instructions: [
      'Start in a high plank position with wrists directly under your shoulders',
      'Keep your hips level and core tight throughout the entire movement',
      'Drive one knee toward your chest, then quickly switch legs',
      'Alternate legs at a controlled but continuous pace',
      'Keep your hips down — resist letting them bounce up as you fatigue',
    ],
    proTip: 'Mountain climbers double as both a core exercise and cardio — increase the speed for more metabolic conditioning, or slow them down for deeper core activation',
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
export default function CoreExercises() {
  const router = useRouter();
  const [filter, setFilter] = useState<Difficulty>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = filter === 'All'
    ? EXERCISES
    : EXERCISES.filter(e => e.difficulty === filter);

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
          <Text style={styles.title}>Core Exercises</Text>
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
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onPress={() => { setSelectedExercise(ex); setModalVisible(true); }}
            />
          ))}
        </View>
      </ScrollView>

      {modalVisible && (
        <ExerciseModal exercise={selectedExercise} onClose={() => setModalVisible(false)} />
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