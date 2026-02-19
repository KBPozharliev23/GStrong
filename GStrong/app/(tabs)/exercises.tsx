import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface MuscleGroup {
  id: string;
  name: string;
  count: number;
  tags: string[];
  image: ImageSourcePropType | null;
  fallbackColor: string;
  fallbackEmoji: string;
}

interface PopularExercise {
  name: string;
  group: string;
  sets: string;
  tagColor: string;
  lightColor: string;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Chest',
    count: 12,
    tags: ['Push-ups', 'Bench Press', 'Chest Fly'],
    image: require('../../assets/images/chest.png'),
    fallbackColor: '#1e3a5f',
    fallbackEmoji: '💪',
  },
  {
    id: 'back',
    name: 'Back',
    count: 8,
    tags: ['Pull-ups', 'Rows', 'Deadlifts'],
    image: require('../../assets/images/back.jpg'),
    fallbackColor: '#1a3a2a',
    fallbackEmoji: '🏋️',
  },
  {
    id: 'legs',
    name: 'Legs',
    count: 8,
    tags: ['Squats', 'Lunges', 'Leg Press'],
    image: require('../../assets/images/legs.png'),
    fallbackColor: '#2d1f3d',
    fallbackEmoji: '🦵',
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    count: 5,
    tags: ['Shoulder Press', 'Lateral Raises', 'Front Raises'],
    image: require('../../assets/images/shoulders.png'),
    fallbackColor: '#1e3a5f',
    fallbackEmoji: '🤸',
  },
  {
    id: 'arms',
    name: 'Arms',
    count: 10,
    tags: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls'],
    image: require('../../assets/images/arms.png'),
    fallbackColor: '#3a1a1a',
    fallbackEmoji: '💪',
  },
  {
    id: 'core',
    name: 'Core',
    count: 10,
    tags: ['Plank', 'Crunches', 'Russian Twists'],
    image: require('../../assets/images/core.png'),
    fallbackColor: '#1a2a3a',
    fallbackEmoji: '🔥',
  },
];

const POPULAR: PopularExercise[] = [
  { name: 'Push-ups', group: 'Chest', sets: '3x15', tagColor: '#1d4ed8', lightColor: '#60a5fa' },
  { name: 'Squats', group: 'Legs', sets: '4x12', tagColor: '#7c3aed', lightColor: '#c084fc' },
  { name: 'Plank', group: 'Core', sets: '3x60s', tagColor: '#0f766e', lightColor: '#2dd4bf' },
  { name: 'Pull-ups', group: 'Back', sets: '3x8', tagColor: '#065f46', lightColor: '#4ade80' },
];

// Map of group id -> route path
const GROUP_ROUTES: Record<string, string> = {
  chest: '/chest',
  back: '/back',
  legs: '/legs',
  shoulders: '/shoulders',
  arms: '/arms',
  core: '/core',
};

export default function ExercisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MUSCLE_GROUPS.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleGroupPress = (group: MuscleGroup) => {
    const route = GROUP_ROUTES[group.id];
    if (route) {
      router.replace(route as any);
    } else {
      setSelected(selected === group.id ? null : group.id);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Exercises</Text>
          <Text style={styles.subtitle}>Browse exercises by muscle group</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#4b5563"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <View style={styles.section}>
          {filtered.map(group => (
            <TouchableOpacity
              key={group.id}
              activeOpacity={0.75}
              onPress={() => handleGroupPress(group)}
              style={[
                styles.groupCard,
                selected === group.id && styles.groupCardSelected,
              ]}
            >
              <View style={styles.thumbnailWrapper}>
                {group.image ? (
                  <Image
                    source={group.image}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.thumbnailFallback, { backgroundColor: group.fallbackColor }]}>
                    <Text style={styles.thumbnailEmoji}>{group.fallbackEmoji}</Text>
                  </View>
                )}
              </View>

              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupCount}>{group.count} exercises</Text>
                <View style={styles.tagRow}>
                  {group.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>
          <View style={styles.popularGrid}>
            {POPULAR.map(ex => (
              <TouchableOpacity key={ex.name} style={styles.popularCard} activeOpacity={0.75}>
                <Text style={styles.popularName}>{ex.name}</Text>
                <Text style={styles.popularGroup}>{ex.group}</Text>
                <View style={[styles.popularTag, { backgroundColor: ex.tagColor + '33', borderColor: ex.tagColor + '66' }]}>
                  <Text style={[styles.popularTagText, { color: ex.lightColor }]}>
                    {ex.sets}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const CARD_W = (width - 28 - 10) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, marginTop:10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#6b7280', fontSize: 13, marginTop: 4 },

  section: { paddingHorizontal: 14, marginBottom: 16 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  searchBox: {
    backgroundColor: '#0c1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2540',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: 'white', fontSize: 14 },

  groupCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
  },
  groupCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#0d1a35',
  },

  thumbnailWrapper: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
    flexShrink: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: { fontSize: 28 },

  groupInfo: { flex: 1 },
  groupName: { color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 2 },
  groupCount: { color: '#6b7280', fontSize: 12, marginBottom: 8 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1f2a3c',
  },
  tagText: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },

  chevron: { color: '#4b5563', fontSize: 22, marginLeft: 8 },

  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  popularCard: {
    width: CARD_W,
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    padding: 16,
  },
  popularName: { color: 'white', fontWeight: '700', fontSize: 15, marginBottom: 3 },
  popularGroup: { color: '#6b7280', fontSize: 12, marginBottom: 10 },
  popularTag: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularTagText: { fontSize: 12, fontWeight: '700' },
});