import { Text, View } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

const TabsLayout = () => {
    return (
      <Tabs screenOptions={{}}>

        <Tabs.Screen 
        name="index"
        options={{
            title:"Home",
            tabBarIcon: ({color,size}) => (
                <Ionicons name='home-outline'/>
            )
        }}
        />
        <Tabs.Screen 
        name="bingo"
        options={{
            title:"Bingo",
            tabBarIcon: ({color,size}) => (
                <Ionicons name='home-outline'/>
            )
        }}
        />

      </Tabs>
    )
}

export default TabsLayout
