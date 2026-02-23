import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

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
        router.replace('/(tabs)/settings');
      });
    }, 1800);
  };

  const validate = () => {
    const newErrors: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) newErrors.current = 'Current password is required.';
    if (!newPassword) newErrors.new = 'New password is required.';
    else if (newPassword.length < 8) newErrors.new = 'Password must be at least 8 characters.';
    if (!confirmPassword) newErrors.confirm = 'Please confirm your new password.';
    else if (newPassword !== confirmPassword) newErrors.confirm = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerSavePopup();
    }, 800);
  };

  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (v: string) => void,
    showText: boolean,
    onToggleShow: () => void,
    errorKey: 'current' | 'new' | 'confirm'
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputCard, errors[errorKey] ? styles.inputCardError : null]}>
        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={(v) => {
            onChangeText(v);
            if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
          }}
          secureTextEntry={!showText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={onToggleShow} activeOpacity={0.7}>
          <Ionicons
            name={showText ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      {errors[errorKey] ? <Text style={styles.errorText}>{errors[errorKey]}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/settings')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>Update your account password</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          {renderInput(
            'Current Password',
            'Enter current password',
            currentPassword,
            setCurrentPassword,
            showCurrent,
            () => setShowCurrent((v) => !v),
            'current'
          )}
        </View>

        <View style={styles.section}>
          {renderInput(
            'New Password',
            'Enter new password',
            newPassword,
            setNewPassword,
            showNew,
            () => setShowNew((v) => !v),
            'new'
          )}
        </View>

        <View style={styles.section}>
          {renderInput(
            'Confirm New Password',
            'Confirm new password',
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            () => setShowConfirm((v) => !v),
            'confirm'
          )}
        </View>

        {/* Save Button */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            {[
              "Use a unique password you don't use anywhere else",
              'Avoid common words, names, or personal information',
              'Consider using a password manager for strong passwords',
              'Change your password regularly for better security',
            ].map((tip, i) => (
              <Text key={i} style={styles.tipItem}>• {tip}</Text>
            ))}
          </View>
        </View>

      </ScrollView>

      {showSavePopup && (
        <Modal transparent animationType="none">
          <View style={styles.popupOverlay}>
            <Animated.View style={[
              styles.popupCard,
              { transform: [{ scale: popupScale }], opacity: popupOpacity },
            ]}>
              <Text style={styles.popupIcon}>🔐</Text>
              <Text style={styles.popupTitle}>Password Updated!</Text>
              <Text style={styles.popupSubtitle}>Your password has been changed</Text>
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

  fieldGroup: { gap: 6 },
  fieldLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '600', marginBottom: 2, marginLeft: 2 },

  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  inputCardError: {
    borderColor: '#ef4444',
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    paddingVertical: 0,
  },
  errorText: { color: '#ef4444', fontSize: 12, marginLeft: 4, marginTop: 2 },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginTop: 6,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  tipsCard: {
    backgroundColor: '#1a1200',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3d2e00',
    padding: 16,
    marginTop: 4,
  },
  tipsTitle: { color: '#f59e0b', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  tipItem: { color: '#d1b97a', fontSize: 13, lineHeight: 22 },

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