import React, {useState} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, Button, SafeAreaView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import AppContext from './components/AppContext';

import TripTab from "./components/TripTab";
import AlarmTab from "./components/AlarmTab.js";
import InfoTab from "./components/InfoTab";

import Login from "./components/Login";
import M_UploadTrip from "./components/M_UploadTrip";
import Trip from "./components/Trip";
import HistoryInfo from "./components/HistoryInfo";
import M_UploadHistory from "./components/M_UploadHistory";
import M_UploadTag from "./components/M_UploadTag";

export default function Navigation() {
  const [stringValue, setStringValue] = useState('');

  const setValue = (string) => {
    setStringValue(string)
  }


  const values = {
    stringValue: stringValue,
    setValue
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppContext.Provider value={values}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppContext.Provider>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();
function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="M_UploadTrip" component={M_UploadTrip} />
      <Stack.Screen name="Trip" component={Trip} />
      <Stack.Screen name="HistoryInfo" component={HistoryInfo} />
      <Stack.Screen name="M_UploadHistory" component={M_UploadHistory} />
      <Stack.Screen name="M_UploadTag" component={M_UploadTag} />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator();
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="TripTab">
      <BottomTab.Screen
      name="여행"
      component={TripTab}
      options={{
        headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Entypo name="aircraft" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
      name="알림"
      component={AlarmTab}
      options={{
        headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="bell" color={color} size={size} />
          ),
        }}
       />
       <BottomTab.Screen
       name="나의 정보"
       component={InfoTab}
       options={{
         headerShown: false,
           tabBarIcon: ({color, size}) => (
             <FontAwesome name="user" color={color} size={size} />
           ),
         }}
        />

    </BottomTab.Navigator>

  );
}
