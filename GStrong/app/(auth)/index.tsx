import { useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import React from 'react'

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#16295eff", "#04091aff"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.inner}>

        <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain"/>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#9CA3AF" style={styles.inputIcon} />
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
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
          <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="white" />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={24} color="white" />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { 
    flex: 1, 
    paddingHorizontal: 36, 
    justifyContent: "center"
  },
  logoContainer: { 
    alignItems: "center", 
    marginBottom: 24 
  },
  logoImage: { 
    width: 100,
    height: 100,
    borderRadius: 20 
  },
  title: { 
    color: "white", 
    fontSize: 36, 
    fontWeight: "800", 
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: { 
    color: "#9CA3AF", 
    textAlign: "center", 
    marginBottom: 48 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
  },
  input: { 
    flex: 1, 
    color: "white", 
    marginLeft: 12 
  },
  inputIcon: { marginRight: 10 },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { color: "#3B82F6", fontSize: 15 },
  signInButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 20,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  signInText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "600"
  },
  orContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 30 
  },
  orLine: { 
    flex: 1, 
    height: 1.5, 
    backgroundColor: "#1F2937" 
  },
  orText: { 
    color: "#6B7280", 
    marginHorizontal: 12,
    fontSize: 16
  },
  socialButton: {
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 18,
  },
  socialText: { 
    color: "white", 
    fontSize: 16 
  },
  signupContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: 18
  },
  signupText: { color: "#9CA3AF", fontSize: 15 },
  signupLink: { color: "#3B82F6", fontSize: 15 },
});
