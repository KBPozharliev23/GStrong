import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

const LANGUAGES = ['English', 'Bulgarian'];

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [displayName, setDisplayName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

useFocusEffect(
  useCallback(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user.email) {
        setUserEmail(user.email);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setDisplayName(profile.full_name);
      } else if (user.user_metadata?.full_name) {
        setDisplayName(user.user_metadata.full_name);
      } else if (user.email) {
        setDisplayName(user.email.split('@')[0]);
      }
    };

    loadUser();
  }, [])
);

  const handleNavPress = (label: string) => {
    if (label === 'Edit Profile') router.replace('/(tabs)/editProfile');
    if (label === 'Email Preferences') router.replace('/(tabs)/emailPreferences');
    if (label === 'Change Password') router.replace('/(tabs)/changePassword');
    if (label === 'Language') setShowLanguagePicker(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    router.replace('/(auth)');
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderNavItem = (icon: string, label: string, rightText?: string) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => handleNavPress(label)}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.menuRight}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderToggleItem = (
    icon: string,
    label: string,
    value: boolean,
    onValueChange: (v: boolean) => void
  ) => (
    <View style={styles.menuItem}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2a3148', true: '#2563eb' }}
        thumbColor={'#ffffff'}
        ios_backgroundColor="#2a3148"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../assets/images/profilePicture.png')}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {renderSectionHeader('ACCOUNT')}
        <View style={styles.section}>
          <View style={styles.groupCard}>
            {renderNavItem('👤', 'Edit Profile')}
            <View style={styles.separator} />
            {renderNavItem('✉️', 'Email Preferences')}
            <View style={styles.separator} />
            {renderNavItem('🔒', 'Change Password')}
            <View style={styles.separator} />
            {renderNavItem('🌐', 'Language', selectedLanguage)}
          </View>
        </View>

        {renderSectionHeader('PREFERENCES')}
        <View style={styles.section}>
          <View style={styles.groupCard}>
            {renderToggleItem('🔔', 'Push Notifications', pushNotifications, setPushNotifications)}
            <View style={styles.separator} />
            {renderToggleItem('✉️', 'Email Updates', emailUpdates, setEmailUpdates)}
            <View style={styles.separator} />
            {renderToggleItem('🔊', 'Sound Effects', soundEffects, setSoundEffects)}
            <View style={styles.separator} />
            {renderToggleItem('📳', 'Haptic Feedback', hapticFeedback, setHapticFeedback)}
          </View>
        </View>

        {renderSectionHeader('SUPPORT')}
        <View style={styles.section}>
          <View style={styles.groupCard}>
            {renderNavItem('❓', 'Help Center')}
            <View style={styles.separator} />
            {renderNavItem('🛡️', 'Privacy Policy')}
            <View style={styles.separator} />
            {renderNavItem('📄', 'Terms of Service')}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7} onPress={() => setShowLogoutModal(true)}>
            <Text style={styles.dangerIcon}>↪</Text>
            <Text style={styles.dangerText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7} onPress={() => setShowDeleteModal(true)}>
            <Text style={styles.dangerIcon}>🗑</Text>
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal transparent visible={showLanguagePicker} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguagePicker(false)}
        >
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Language</Text>
            <View style={styles.pickerDivider} />
            {LANGUAGES.map((lang, i) => (
              <React.Fragment key={lang}>
                <TouchableOpacity
                  style={styles.pickerOption}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{lang}</Text>
                  {selectedLanguage === lang && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                {i < LANGUAGES.length - 1 && <View style={styles.pickerSeparator} />}
              </React.Fragment>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={showLogoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmIcon}>↪</Text>
            <Text style={styles.confirmTitle}>Log Out?</Text>
            <Text style={styles.confirmSubtitle}>Are you sure you want to log out of your account?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDangerBtn}
                activeOpacity={0.7}
                onPress={handleLogout}
              >
                <Text style={styles.confirmDangerBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmIcon}>🗑</Text>
            <Text style={styles.confirmTitle}>Delete Account?</Text>
            <Text style={styles.confirmSubtitle}>This will permanently delete your account and all your data. This cannot be undone.</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDangerBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setShowDeleteModal(false);
                  router.replace('/(auth)');
                }}
              >
                <Text style={styles.confirmDangerBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a14' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },

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

  profileCard: {
    backgroundColor: '#0c1120',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#1a2540',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  avatarImage: {
    width: 122,
    height: 122,
    top: -8,
    left: -31,
  },
  profileInfo: { flex: 1 },
  profileName: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  profileEmail: { color: '#6b7280', fontSize: 12, marginTop: 2 },

  groupCard: {
    backgroundColor: '#0c1120',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2540',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#131d33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 16 },
  menuLabel: { flex: 1, color: 'white', fontSize: 15, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rightText: { color: '#6b7280', fontSize: 14 },
  chevron: { color: '#4b5563', fontSize: 22, lineHeight: 22 },

  separator: { height: 1, backgroundColor: '#1a2540', marginLeft: 66 },

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

  versionText: { color: '#374151', fontSize: 12, textAlign: 'center', marginTop: 16, marginBottom: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pickerCard: {
    backgroundColor: '#0c1120',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2540',
    width: 280,
    overflow: 'hidden',
  },
  pickerTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  pickerDivider: { height: 1, backgroundColor: '#1a2540' },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  pickerOptionText: { color: 'white', fontSize: 16, fontWeight: '500' },
  checkmark: { color: '#2563eb', fontSize: 18, fontWeight: 'bold' },
  pickerSeparator: { height: 1, backgroundColor: '#1a2540', marginHorizontal: 16 },

  confirmCard: {
    backgroundColor: '#0c1120',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1a2540',
    width: 300,
    padding: 28,
    alignItems: 'center',
  },
  confirmIcon: { fontSize: 36, marginBottom: 12 },
  confirmTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  confirmSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#131d33',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  cancelBtnText: { color: '#9ca3af', fontSize: 15, fontWeight: '600' },
  confirmDangerBtn: {
    flex: 1,
    backgroundColor: '#450a0a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  confirmDangerBtnText: { color: '#ef4444', fontSize: 15, fontWeight: '700' },
});