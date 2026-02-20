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
    id: 'bicep_curl',
    name: 'Bicep Curl',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '10-15 reps',
    muscles: ['Biceps Brachii', 'Brachialis'],
    image: require('../../assets/images/arms/bicep_curl.png'),
    instructions: [
      'Stand holding dumbbells at your sides with palms facing forward',
      'Keep your elbows pinned tight to your torso throughout',
      'Curl the weights up toward your shoulders in a controlled arc',
      'Squeeze the bicep hard at the top of the movement',
      'Lower slowly back to full extension — don\'t let the weight drop',
    ],
    proTip: 'Supinate your wrists (rotate pinky outward) at the top of each rep to fully contract the bicep peak',
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '10-12 reps',
    muscles: ['Brachialis', 'Brachioradialis', 'Biceps Brachii'],
    image: require('../../assets/images/arms/hammer_curl.png'),
    instructions: [
      'Stand holding dumbbells with a neutral grip — palms facing each other',
      'Keep your upper arms completely still at your sides',
      'Curl both dumbbells upward without rotating your wrists',
      'Pause at the top, then lower slowly back to the start',
    ],
    proTip: 'Hammer curls hit the brachialis harder than regular curls — that muscle pushes your bicep up and makes your arms look thicker from the front',
  },
  {
    id: 'concentration_curl',
    name: 'Concentration Curl',
    difficulty: 'Intermediate',
    sets: '3 sets',
    reps: '10-12 reps each arm',
    muscles: ['Biceps Brachii', 'Brachialis'],
    image: require('../../assets/images/arms/concentration_curl.png'),
    instructions: [
      'Sit on a bench with legs wide apart, holding a dumbbell in one hand',
      'Rest the back of your upper arm against your inner thigh',
      'Curl the weight up toward your shoulder, keeping the arm braced',
      'Squeeze the bicep at the top, then lower with full control',
      'Complete all reps on one side before switching',
    ],
    proTip: 'Studies consistently show concentration curls produce the highest bicep activation of any curl variation — go slow and feel every rep',
  },
  {
    id: 'close_grip',
    name: 'Close Grip Bench Press',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '8-12 reps',
    muscles: ['Triceps Brachii', 'Anterior Deltoids', 'Pectoralis Major'],
    image: require('../../assets/images/arms/close_grip.png'),
    instructions: [
      'Lie on a flat bench and grip the bar with hands shoulder-width apart',
      'Unrack the bar and hold it directly over your chest',
      'Lower the bar to your lower chest, keeping elbows tucked close to your sides',
      'Press the bar back up powerfully until arms are fully extended',
    ],
    proTip: 'Don\'t go too narrow — hands inside shoulder width puts excessive stress on your wrists. Shoulder-width is the sweet spot for tricep emphasis',
  },
  {
    id: 'overhead_tricep',
    name: 'Overhead Tricep Extension',
    difficulty: 'Beginner',
    sets: '3-4 sets',
    reps: '12-15 reps',
    muscles: ['Triceps Brachii (Long Head)', 'Triceps Brachii (Lateral Head)'],
    image: require('../../assets/images/arms/overhead_tricep.png'),
    instructions: [
      'Stand or sit holding a dumbbell with both hands above your head',
      'Keep your upper arms close to your ears throughout the movement',
      'Lower the dumbbell behind your head by bending the elbows',
      'Extend your arms back to the starting position, squeezing the triceps',
    ],
    proTip: 'The overhead position is the only way to fully stretch the long head of the tricep — it\'s the biggest portion of the muscle, so don\'t skip this angle',
  },
  {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    difficulty: 'Intermediate',
    sets: '3-4 sets',
    reps: '10-15 reps',
    muscles: ['Triceps Brachii', 'Anterior Deltoids', 'Pectoralis Minor'],
    image: require('../../assets/images/arms/tricep_dips.png'),
    instructions: [
      'Grip parallel bars or a bench edge with arms fully extended',
      'Keep your torso upright and legs slightly in front of you',
      'Lower your body by bending the elbows until upper arms are parallel to the floor',
      'Press back up explosively to the starting position',
      'Avoid flaring your elbows outward — keep them tracking back',
    ],
    proTip: 'Stay as upright as possible to keep the focus on your triceps — leaning forward shifts the load onto your chest',
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
export default function ArmsExercises() {
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
          <Text style={styles.title}>Arm Exercises</Text>
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
            <ExerciseCard key={ex.id} exercise={ex} onPress={() => { setSelectedExercise(ex); setModalVisible(true); }} />
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