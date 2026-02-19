import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';


export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const router = useRouter();

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderNavItem = (icon: string, label: string, rightText?: string) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
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

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/profile')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../assets/images/profilePicture.png')}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex.johnson@example.com</Text>
              <TouchableOpacity>
                <Text style={styles.manageText}>Manage Subscription</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Section */}
        {renderSectionHeader('ACCOUNT')}
        <View style={styles.section}>
          <View style={styles.groupCard}>
            {renderNavItem('👤', 'Edit Profile')}
            <View style={styles.separator} />
            {renderNavItem('✉️', 'Email Preferences')}
            <View style={styles.separator} />
            {renderNavItem('🔒', 'Change Password')}
            <View style={styles.separator} />
            {renderNavItem('🌐', 'Language', 'English')}
          </View>
        </View>

        {/* Preferences Section */}
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

        {/* Support Section */}
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

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7}>
            <Text style={styles.dangerIcon}>↪</Text>
            <Text style={styles.dangerText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.7}>
            <Text style={styles.dangerIcon}>🗑</Text>
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>GStrong Fitness v1.0 • Build 245</Text>

      </ScrollView>
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
  manageText: { color: '#3b82f6', fontSize: 12, marginTop: 4, fontWeight: '600' },

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
});