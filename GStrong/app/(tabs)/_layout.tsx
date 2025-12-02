import { Text, View } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

const TabsLayout = () => {
    return (
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#5caed3',
        tabBarStyle:{
            backgroundColor: "#252525",
            borderTopWidth: 2,
            borderTopColor: "#5caed3",
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
        },
        headerShown: false,
      }}>

        <Tabs.Screen 
        name="index"
        options={{
            title:"Home",
            tabBarIcon: ({color,size}) => (
                <Ionicons name='home-outline' size={size} color={color}/>
            )
        }}
        />
        <Tabs.Screen 
        name="bingo"
        options={{
            title:"Bingo",
            tabBarIcon: ({color,size}) => (
                <Ionicons name='grid-outline' size={size} color={color}/>
            )
        }}
        />

      </Tabs>
    )
}

export default TabsLayout
