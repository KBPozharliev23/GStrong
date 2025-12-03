import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import React from 'react'

export default function Signup() {
  return (
    <LinearGradient
          colors={["#16295eff", "#04091aff"]}
          style={styles.container}
        >
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
})