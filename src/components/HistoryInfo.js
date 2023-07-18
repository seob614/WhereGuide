import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import "../firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
import * as T_TagTab from "./T_TagTab";

const App = ({
  navigation,
  }) => {

  useEffect(()=>{
    //T_TagTab.www();
    return () => {
      // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.

    };
  },[])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    })
  })

  return (
    <View style={styles.container}>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFF',
  },
  title: {
      fontSize: 16,
      color: '#000',
  },
});

export default App;
