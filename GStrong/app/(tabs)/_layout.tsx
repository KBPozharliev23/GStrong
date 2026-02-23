import { Text, View, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import React, { useEffect, useRef } from 'react'

const AnimatedTabIcon = ({ name, color, focused }: { name: any, color: string, focused: boolean }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current
    const glowAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (focused) {
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
                <Ionicons name={name} size={26} color={color} />
            </Animated.View>
        </Animated.View>
    )
}

const CenterCreateButton = () => {
    const router = useRouter()
    
    return (
        <View style={styles.centerButtonContainer}>
            <TouchableOpacity 
                style={styles.createButton}
                onPress={() => {
                    console.log('Create button pressed')
                }}
            >
                <Ionicons name="add" size={28} color="white" />
                <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
        </View>
    )
}

const TabsLayout = () => {
    return (
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
            backgroundColor: "#0F172A",
            borderTopWidth: 1,
            height: 90,
            paddingBottom: 25,
            paddingTop: 5,
            elevation: 0,
            shadowColor: '#60A5FA',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            borderTopColor: 'rgba(96, 165, 250, 0.2)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            position: 'relative',
            paddingHorizontal: 10,
            justifyContent: 'center',
        },
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 3,
        },
        tabBarItemStyle: {
            paddingVertical: 5,
            marginTop: -10,
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
        name="create"
        options={{
            title:"",
            tabBarIcon: () => <CenterCreateButton />,
            tabBarLabel: () => null,
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

        {/* Hidden screen - not shown in tab bar */}
        <Tabs.Screen
        name="settings"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="chest"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="back"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="legs"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="shoulders"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="arms"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="core"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="achievements"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="editProfile"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="emailPreferences"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="changePassword"
        options={{
            href: null,
            headerShown: false,
        }}
        />
        <Tabs.Screen
        name="notifications"
        options={{
            href: null,
            headerShown: false,
        }}
        />

      </Tabs>
      
    )
}

const styles = StyleSheet.create({
    centerButtonContainer: {
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButton: {
        width: 90,
        height: 90,
        borderRadius: 35,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 4,
        borderColor: '#0F172A',
    },
    createText: {
        color: 'white',
        fontSize: 9,
        fontWeight: '700',
        marginTop: 1,
    }
})

export default TabsLayout