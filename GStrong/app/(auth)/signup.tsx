import { useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';

export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#16295eff", "#04091aff"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.inner}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.progressContainer}>
            <Text style={styles.stepText}>Step 1 of 4</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

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
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
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
            />
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Ionicons
                name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward-outline" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)')}>
              <Text style={styles.signinLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { 
    flex: 1, 
    paddingHorizontal: 24
  },
  scrollContent: {
    paddingBottom: 40
  },
  progressContainer: {
    marginBottom: 32
  },
  stepText: {
    color: "white",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 12,
    fontWeight: "500"
  },
  progressBar: {
    height: 6,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    width: "25%",
    backgroundColor: "#3B82F6",
    borderRadius: 10
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
  continueButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 24
  },
  continueText: { 
    color: "white", 
    fontSize: 17, 
    fontWeight: "600"
  },
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
  }
});