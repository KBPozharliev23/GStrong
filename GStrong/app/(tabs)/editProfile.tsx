import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
const PRIMARY_GOALS = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'];

export default function EditProfile() {
  const router = useRouter();

  const [fullName, setFullName] = useState('George Strong');
  const [email, setEmail] = useState('george.strong@gmail.com');
  const [bio, setBio] = useState('Fitness enthusiast improving every day 🚀');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('75');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState('Muscle Gain');
  const [saving, setSaving] = useState(false);

  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const popupScale = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  const triggerSavePopup = () => {
    setShowSavePopup(true);
    popupScale.setValue(0);
    popupOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(popupScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(popupScale, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(popupOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSavePopup(false);
        router.back();
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

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>Update your personal details</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/profilePicture.png')}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        {renderSectionHeader('PERSONAL INFO')}
        <View style={styles.section}>
          <View style={styles.groupCard} collapsable={false}>

            {/* Full Name */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={inputStyle('name')} collapsable={false}>
                <Text style={styles.fieldIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#4b5563"
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.separator} />

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={inputStyle('email')} collapsable={false}>
                <Text style={styles.fieldIcon}>✉️</Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#4b5563"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.separator} />

            {/* Bio */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <View style={[inputStyle('bio'), styles.bioInput]} collapsable={false}>
                <TextInput
                  style={[styles.textInput, styles.bioTextInput]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#4b5563"
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

          </View>
        </View>

        {/* Physical Stats */}
        {renderSectionHeader('PHYSICAL STATS')}
        <View style={styles.section}>
          <View style={styles.statsRow}>

            <View style={[styles.groupCard, styles.statCard]} collapsable={false}>
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Height (cm)</Text>
                <View style={inputStyle('height')} collapsable={false}>
                  <Text style={styles.fieldIcon}>📏</Text>
                  <TextInput
                    style={styles.textInput}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    placeholderTextColor="#4b5563"
                    onFocus={() => setFocusedField('height')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.groupCard, styles.statCard]} collapsable={false}>
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Weight (kg)</Text>
                <View style={inputStyle('weight')} collapsable={false}>
                  <Text style={styles.fieldIcon}>⚖️</Text>
                  <TextInput
                    style={styles.textInput}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholderTextColor="#4b5563"
                    onFocus={() => setFocusedField('weight')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Fitness Preferences */}
        {renderSectionHeader('FITNESS PREFERENCES')}
        <View style={styles.section}>
          <View style={styles.groupCard}>

            {/* Experience Level */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Experience Level</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowExpDropdown(!showExpDropdown);
                  setShowGoalDropdown(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.fieldIcon}>〰️</Text>
                <Text style={styles.dropdownText}>{experienceLevel}</Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {showExpDropdown && (
                <View style={styles.dropdownMenu}>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.dropdownOption,
                        experienceLevel === level && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setExperienceLevel(level);
                        setShowExpDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        experienceLevel === level && styles.dropdownOptionTextActive,
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.separator} />

            {/* Primary Goal */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Primary Goal</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowGoalDropdown(!showGoalDropdown);
                  setShowExpDropdown(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.fieldIcon}>🎯</Text>
                <Text style={styles.dropdownText}>{primaryGoal}</Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {showGoalDropdown && (
                <View style={styles.dropdownMenu}>
                  {PRIMARY_GOALS.map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.dropdownOption,
                        primaryGoal === goal && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setPrimaryGoal(goal);
                        setShowGoalDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        primaryGoal === goal && styles.dropdownOptionTextActive,
                      ]}>
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

          </View>
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
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
              <Text style={styles.saveBtnIcon}>💾</Text>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Save Confirmation Popup */}
      {showSavePopup && (
        <Modal transparent animationType="none">
          <View style={styles.popupOverlay}>
            <Animated.View style={[
              styles.popupCard,
              {
                transform: [{ scale: popupScale }],
                opacity: popupOpacity,
              },
            ]}>
              <Text style={styles.popupIcon}>✅</Text>
              <Text style={styles.popupTitle}>Profile Saved!</Text>
              <Text style={styles.popupSubtitle}>Your changes have been updated</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
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
  backIcon: { color: '#3b82f6', fontSize: 26, lineHeight: 27, marginLeft: -2 },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#060a14',
  },
  cameraIcon: { fontSize: 14 },
  changePhotoText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },

  section: { paddingHorizontal: 14, marginBottom: 6 },
  sectionHeader: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 14,
    paddingBottom: 8,
    paddingTop: 10,
  },

  groupCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    paddingHorizontal: 16,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: { flex: 1 },

  fieldWrap: { paddingVertical: 12 },
  fieldLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131d33',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1a2540',
    gap: 10,
  },
  inputFocused: {
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bioInput: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  fieldIcon: { fontSize: 16 },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  bioTextInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131d33',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1a2540',
    gap: 10,
  },
  dropdownText: { flex: 1, color: 'white', fontSize: 15, fontWeight: '500' },
  dropdownChevron: { color: '#6b7280', fontSize: 14 },
  dropdownMenu: {
    backgroundColor: '#131d33',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2540',
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2540',
  },
  dropdownOptionActive: { backgroundColor: '#1e3a6e' },
  dropdownOptionText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  dropdownOptionTextActive: { color: '#3b82f6', fontWeight: '700' },

  separator: { height: 1, backgroundColor: '#1a2540' },

  saveContainer: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: '#060a14',
    borderTopWidth: 1,
    borderTopColor: '#1a2540',
  },
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
  },
  saveBtnIcon: { fontSize: 18 },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

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