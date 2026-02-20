import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function EmailPreferences() {
  const router = useRouter();

  const [weeklyProgress, setWeeklyProgress] = useState(true);
  const [achievementUnlocked, setAchievementUnlocked] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [saving, setSaving] = useState(false);

  // Save popup
  const [showSavePopup, setShowSavePopup] = useState(false);
  const popupScale = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  const triggerSavePopup = () => {
    setShowSavePopup(true);
    popupScale.setValue(0);
    popupOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(popupScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(popupOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(popupScale, { toValue: 0.85, duration: 150, useNativeDriver: true }),
        Animated.timing(popupOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        setShowSavePopup(false);
        router.replace('/(tabs)/profile');
      });
    }, 1800);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerSavePopup();
    }, 800);
  };

  const handleUnsubscribeAll = () => {
    setWeeklyProgress(false);
    setAchievementUnlocked(false);
    setWorkoutReminders(false);
    setProductUpdates(false);
  };

  const renderToggle = (
    icon: string,
    iconBg: string,
    label: string,
    description: string,
    value: boolean,
    onValueChange: (v: boolean) => void
  ) => (
    <View style={styles.toggleCard}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2a3148', true: '#2563eb' }}
        thumbColor="#ffffff"
        ios_backgroundColor="#2a3148"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/settings')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Email Preferences</Text>
            <Text style={styles.subtitle}>Manage your notifications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrap}>
              <Text style={styles.infoIcon}>✉️</Text>
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Stay Connected</Text>
              <Text style={styles.infoDesc}>
                Choose which emails you'd like to receive at{' '}
                <Text style={styles.infoEmail}>george.strong@gmail.com</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {renderToggle(
            '⚡', '#2d2006',
            'Weekly Progress Report',
            'Get a summary of your workouts, streaks, and points every Monday.',
            weeklyProgress, setWeeklyProgress
          )}
        </View>

        <View style={styles.section}>
          {renderToggle(
            '☆', '#1e0d33',
            'Achievement Unlocked',
            'Instant notifications when you earn a new badge or hit a milestone.',
            achievementUnlocked, setAchievementUnlocked
          )}
        </View>

        <View style={styles.section}>
          {renderToggle(
            '🔔', '#0d1a33',
            'Workout Reminders',
            "Gentle nudges if you haven't worked out in a few days.",
            workoutReminders, setWorkoutReminders
          )}
        </View>

        <View style={styles.section}>
          {renderToggle(
            '📩', '#0d2218',
            'Product Updates & Tips',
            'News about new features, fitness tips, and community challenges.',
            productUpdates, setProductUpdates
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.saveBtnIcon}>✓</Text>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleUnsubscribeAll} activeOpacity={0.7}>
            <Text style={styles.dangerIcon}>🔕</Text>
            <Text style={styles.dangerText}>Unsubscribe from All Emails</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {showSavePopup && (
        <Modal transparent animationType="none">
          <View style={styles.popupOverlay}>
            <Animated.View style={[
              styles.popupCard,
              { transform: [{ scale: popupScale }], opacity: popupOpacity },
            ]}>
              <Text style={styles.popupIcon}>✅</Text>
              <Text style={styles.popupTitle}>Preferences Saved!</Text>
              <Text style={styles.popupSubtitle}>Your email settings have been updated</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0c1120',
    borderWidth: 1,
    borderColor: '#1a2540',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { color: '#3b82f6', fontSize: 26, lineHeight: 30, marginLeft: -2 },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },

  section: { paddingHorizontal: 14, marginBottom: 10 },

  infoCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#131d33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: { fontSize: 22 },
  infoText: { flex: 1 },
  infoTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  infoDesc: { color: '#6b7280', fontSize: 13, lineHeight: 18 },
  infoEmail: { color: 'white', fontWeight: '600' },

  toggleCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 20 },
  toggleInfo: { flex: 1 },
  toggleLabel: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  toggleDesc: { color: '#6b7280', fontSize: 12, lineHeight: 17 },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginTop: 6,
  },
  saveBtnIcon: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1120',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#450a0a',
    gap: 12,
  },
  dangerIcon: { fontSize: 18, color: '#ef4444' },
  dangerText: { color: '#ef4444', fontSize: 15, fontWeight: '600' },

  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupCard: {
    backgroundColor: '#020f1f',
    borderColor: '#2563eb',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  popupIcon: { fontSize: 48, marginBottom: 10 },
  popupTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  popupSubtitle: { color: '#60a5fa', fontSize: 15, marginTop: 5, fontWeight: '600' },
});