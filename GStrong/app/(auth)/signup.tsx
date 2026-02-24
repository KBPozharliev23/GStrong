import { useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { supabase } from '../../lib/supabase';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    goal: '',
    experienceLevel: '',
    workoutFrequency: '',
    preferredTime: ''
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canContinue = () => {
    if (currentStep === 1) {
      return formData.fullName && formData.email && formData.password && formData.confirmPassword;
    }
    if (currentStep === 2) return formData.goal;
    if (currentStep === 3) return formData.experienceLevel;
    if (currentStep === 4) return formData.workoutFrequency && formData.preferredTime;
    return false;
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final step — create account in Supabase
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          goal: formData.goal,
          experience_level: formData.experienceLevel,
          workout_frequency: formData.workoutFrequency,
          preferred_time: formData.preferredTime,
        },
      },
    });

    if (error) {
      setLoading(false);
      Alert.alert('Signup Failed', error.message);
      return;
    }

    // Also insert into profiles table for reliable storage
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: formData.fullName,
        goal: formData.goal,
        experience_level: formData.experienceLevel,
        workout_frequency: formData.workoutFrequency,
        preferred_time: formData.preferredTime,
      });
    }

    setLoading(false);
    Alert.alert(
      'Account Created! 🎉',
      'Check your email to confirm your account, then sign in.',
      [{ text: 'Go to Login', onPress: () => router.replace('/(auth)') }]
    );
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <LinearGradient
      colors={["#16295eff", "#04091aff"]}
      style={styles.container}
    >
      
      <SafeAreaView style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Step {currentStep} of 4</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {currentStep === 1 && (
            <>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logoImage} 
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Let's get you started</Text>

              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={22} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#6B7280"
                  value={formData.fullName}
                  onChangeText={(text) => updateFormData('fullName', text)}
                />
              </View>

              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!passwordVisible}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!confirmPasswordVisible}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <Ionicons
                    name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.signinContainer}>
                <Text style={styles.signinText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)')}>
                  <Text style={styles.signinLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Text style={styles.title}>Your Goal</Text>
              <Text style={styles.subtitle}>What do you want to achieve?</Text>

              <View style={styles.goalsGrid}>
                <TouchableOpacity 
                  style={[styles.goalCard, formData.goal === 'lose' && styles.goalCardActive]}
                  onPress={() => updateFormData('goal', 'lose')}
                >
                  <Ionicons name="trending-down" size={40} color="#3B82F6" />
                  <Text style={styles.goalText}>Lose Weight</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.goalCard, formData.goal === 'build' && styles.goalCardActive]}
                  onPress={() => updateFormData('goal', 'build')}
                >
                  <Ionicons name="flame" size={40} color="#F59E0B" />
                  <Text style={styles.goalText}>Build Muscle</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.goalCard, formData.goal === 'stay' && styles.goalCardActive]}
                  onPress={() => updateFormData('goal', 'stay')}
                >
                  <Ionicons name="radio-button-on" size={40} color="#10B981" />
                  <Text style={styles.goalText}>Stay Fit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.goalCard, formData.goal === 'improve' && styles.goalCardActive]}
                  onPress={() => updateFormData('goal', 'improve')}
                >
                  <Ionicons name="flash" size={40} color="#FBBF24" />
                  <Text style={styles.goalText}>Improve Endurance</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Text style={styles.title}>Experience Level</Text>
              <Text style={styles.subtitle}>How would you describe yourself?</Text>

              <TouchableOpacity 
                style={[styles.levelCard, formData.experienceLevel === 'beginner' && styles.levelCardActive]}
                onPress={() => updateFormData('experienceLevel', 'beginner')}
              >
                <Text style={styles.levelIcon}>🌱</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>Beginner</Text>
                  <Text style={styles.levelDesc}>Just starting out</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.levelCard, formData.experienceLevel === 'intermediate' && styles.levelCardActive]}
                onPress={() => updateFormData('experienceLevel', 'intermediate')}
              >
                <Text style={styles.levelIcon}>💪</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>Intermediate</Text>
                  <Text style={styles.levelDesc}>Some experience</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.levelCard, formData.experienceLevel === 'advanced' && styles.levelCardActive]}
                onPress={() => updateFormData('experienceLevel', 'advanced')}
              >
                <Text style={styles.levelIcon}>🔥</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>Advanced</Text>
                  <Text style={styles.levelDesc}>Regular training</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.levelCard, formData.experienceLevel === 'expert' && styles.levelCardActive]}
                onPress={() => updateFormData('experienceLevel', 'expert')}
              >
                <Text style={styles.levelIcon}>⚡</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>Expert</Text>
                  <Text style={styles.levelDesc}>Years of experience</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {currentStep === 4 && (
            <>
              <Text style={styles.title}>Almost There!</Text>
              <Text style={styles.subtitle}>Tell us about your routine</Text>

              <Text style={styles.sectionTitle}>How often do you want to workout?</Text>

              <TouchableOpacity 
                style={[styles.optionCard, formData.workoutFrequency === '1-2' && styles.optionCardActive]}
                onPress={() => updateFormData('workoutFrequency', '1-2')}
              >
                <Text style={styles.optionTitle}>1-2 days/week</Text>
                <Text style={styles.optionDesc}>Light activity</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionCard, formData.workoutFrequency === '3-4' && styles.optionCardActive]}
                onPress={() => updateFormData('workoutFrequency', '3-4')}
              >
                <Text style={styles.optionTitle}>3-4 days/week</Text>
                <Text style={styles.optionDesc}>Moderate activity</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionCard, formData.workoutFrequency === '5-6' && styles.optionCardActive]}
                onPress={() => updateFormData('workoutFrequency', '5-6')}
              >
                <Text style={styles.optionTitle}>5-6 days/week</Text>
                <Text style={styles.optionDesc}>High activity</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionCard, formData.workoutFrequency === 'daily' && styles.optionCardActive]}
                onPress={() => updateFormData('workoutFrequency', 'daily')}
              >
                <Text style={styles.optionTitle}>Daily</Text>
                <Text style={styles.optionDesc}>Maximum commitment</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Preferred workout time?</Text>

              <View style={styles.timeGrid}>
                <TouchableOpacity 
                  style={[styles.timeCard, formData.preferredTime === 'morning' && styles.timeCardActive]}
                  onPress={() => updateFormData('preferredTime', 'morning')}
                >
                  <Text style={styles.timeIcon}>🌅</Text>
                  <Text style={styles.timeTitle}>Morning</Text>
                  <Text style={styles.timeDesc}>6AM - 10AM</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.timeCard, formData.preferredTime === 'afternoon' && styles.timeCardActive]}
                  onPress={() => updateFormData('preferredTime', 'afternoon')}
                >
                  <Text style={styles.timeIcon}>☀️</Text>
                  <Text style={styles.timeTitle}>Afternoon</Text>
                  <Text style={styles.timeDesc}>12PM - 4PM</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.timeCard, formData.preferredTime === 'evening' && styles.timeCardActive]}
                  onPress={() => updateFormData('preferredTime', 'evening')}
                >
                  <Text style={styles.timeIcon}>🌆</Text>
                  <Text style={styles.timeTitle}>Evening</Text>
                  <Text style={styles.timeDesc}>5PM - 9PM</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.timeCard, formData.preferredTime === 'night' && styles.timeCardActive]}
                  onPress={() => updateFormData('preferredTime', 'night')}
                >
                  <Text style={styles.timeIcon}>🌙</Text>
                  <Text style={styles.timeTitle}>Night</Text>
                  <Text style={styles.timeDesc}>9PM+</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

        </ScrollView>

        <TouchableOpacity 
          style={[styles.continueButton, (!canContinue() || loading) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.continueText}>
                {currentStep === 4 ? 'Complete Setup' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward-outline" size={22} color="white" />
            </>
          )}
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { 
    flex: 1, 
    paddingHorizontal: 24,
    paddingTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  backBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  stepText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500"
  },
  progressBar: {
    height: 6,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 32
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10
  },
  scrollContent: {
    paddingBottom: 20
  },
  logoContainer: { 
    alignItems: "center", 
    marginBottom: 24 
  },
  logoWrapper: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10
  },
  logoImage: { 
    width: 100,
    height: 100,
    borderRadius: 20 
  },
  title: { 
    color: "white", 
    fontSize: 32, 
    fontWeight: "800", 
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: { 
    color: "#9CA3AF", 
    textAlign: "center", 
    marginBottom: 32,
    fontSize: 15
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 4
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E293B"
  },
  input: { 
    flex: 1, 
    color: "white", 
    marginLeft: 12,
    fontSize: 15
  },
  inputIcon: { marginRight: 4 },
  signinContainer: { 
    flexDirection: "row", 
    justifyContent: "center",
    marginTop: 8
  },
  signinText: { 
    color: "#9CA3AF", 
    fontSize: 15 
  },
  signinLink: { 
    color: "#3B82F6", 
    fontSize: 15,
    fontWeight: "600"
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  goalCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
    padding: 20
  },
  goalCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E293B'
  },
  goalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center'
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1E293B'
  },
  levelCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E293B'
  },
  levelIcon: {
    fontSize: 36,
    marginRight: 16
  },
  levelInfo: {
    flex: 1
  },
  levelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  levelDesc: {
    color: '#9CA3AF',
    fontSize: 14
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8
  },
  optionCard: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1E293B'
  },
  optionCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E293B'
  },
  optionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  optionDesc: {
    color: '#9CA3AF',
    fontSize: 14
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 20
  },
  timeCard: {
    width: '47%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B'
  },
  timeCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E293B'
  },
  timeIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  timeTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4
  },
  timeDesc: {
    color: '#9CA3AF',
    fontSize: 12
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 20
  },
  continueButtonDisabled: {
    backgroundColor: "#1E3A5F",
    opacity: 0.6
  },
  continueText: { 
    color: "white", 
    fontSize: 17, 
    fontWeight: "600"
  }
});