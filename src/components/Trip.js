import React, { useState, useRef } from 'react';
import {
  Text,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import T_HistoryTab from "./T_HistoryTab";
import T_InfoTab from "./T_InfoTab";
import T_TagTab from "./T_TagTab";

const BottomTab = createBottomTabNavigator();

const App = ({
  navigation,
  route,
  }) => {
  const trip_push = route.params.trip_push;
  const title = route.params.title;
  const company = route.params.company;
  const date = route.params.date;
  const image_url = route.params.image_url;
  const place = route.params.place;
  const content = route.params.content;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.place,
    })
  })

  return (
    <BottomTab.Navigator initialRouteName="T_InfoTab">
      <BottomTab.Screen
      name="여행정보"
      component={T_InfoTab}
      initialParams={{trip_push: trip_push, title: title,company:company,date:date,
      image_url:image_url, place:place, content:content}}
      options={{
        headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Entypo name="info-with-circle" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
      name="일정"
      component={T_HistoryTab}
      initialParams={{trip_push: trip_push, title: title,company:company,date:date,
      image_url:image_url, place:place, content:content}}
      options={{
        headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="calendar-check" color={color} size={size} />
          ),
        }}
       />
       <BottomTab.Screen
       name="여행객"
       component={T_TagTab}
       initialParams={{trip_push: trip_push, title: title,company:company,date:date,
       image_url:image_url, place:place, content:content}}
       options={{
         headerShown: false,
           tabBarIcon: ({color, size}) => (
             <FontAwesome name="users" color={color} size={size} />
           ),
         }}
        />

    </BottomTab.Navigator>

  );
};

export default App;
