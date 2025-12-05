import { Text, View, Animated, StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import React, { useEffect, useRef } from 'react'

const AnimatedTabIcon = ({ name, color, focused }: { name: any, color: string, focused: boolean }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current
    const glowAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (focused) {
            // Breathing animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.15,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start()

            // Glow animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        } else {
            scaleAnim.setValue(1)
            glowAnim.setValue(0)
        }
    }, [focused])

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                opacity: focused ? 1 : 1,
            }}
        >
            <Animated.View
                style={{
                    shadowColor: '#60A5FA',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: focused ? glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8]
                    }) : 0,
                    shadowRadius: 8,
                }}
            >
                <Ionicons name={name} size={24} color={color} />
            </Animated.View>
        </Animated.View>
    )
}

const TabsLayout = () => {
    return (
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
            backgroundColor: "#0A0E1A",
            borderTopWidth: 0,
            height: 110,
            paddingBottom: 25,
            paddingTop: 8,
            elevation: 0,
            shadowColor: '#60A5FA',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            borderTopColor: 'rgba(96, 165, 250, 0.2)',
        },
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginTop: 4,
        },
        tabBarItemStyle: {
            paddingVertical: 5,
        },
        headerShown: false,
      }}>

        <Tabs.Screen 
        name="index"
        options={{
            title:"Home",
            tabBarIcon: ({color, focused}) => (
                <AnimatedTabIcon 
                    name='home' 
                    color={color}
                    focused={focused}
                />
            )
        }}
        />

        <Tabs.Screen 
        name="bingo"
        options={{
            title:"Bingo",
            tabBarIcon: ({color, focused}) => (
                <AnimatedTabIcon 
                    name='grid' 
                    color={color}
                    focused={focused}
                />
            )
        }}
        />

        <Tabs.Screen 
        name="exercises"
        options={{
            title:"Exercises",
            tabBarIcon: ({color, focused}) => (
                <AnimatedTabIcon 
                    name='barbell' 
                    color={color}
                    focused={focused}
                />
            )
        }}
        />

        <Tabs.Screen 
        name="progress"
        options={{
            title:"Progress",
            tabBarIcon: ({color, focused}) => (
                <AnimatedTabIcon 
                    name='trending-up' 
                    color={color}
                    focused={focused}
                />
            )
        }}
        />

        <Tabs.Screen 
        name="profile"
        options={{
            title:"Profile",
            tabBarIcon: ({color, focused}) => (
                <AnimatedTabIcon 
                    name='person' 
                    color={color}
                    focused={focused}
                />
            )
        }}
        />

      </Tabs>
    )
}

export default TabsLayout