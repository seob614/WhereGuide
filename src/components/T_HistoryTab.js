import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import "../firebase";
import { getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';
import { getDatabase, child, get, set, ref as database_ref,onValue } from "firebase/database";

import HistoryListView from '../style/HistoryListView';
import M_UploadHistory from "./M_UploadHistory";

const App = ({
  navigation,
  route,
  }) => {
  const trip_push = route.params.trip_push;
  const title = route.params.title;
  const company = route.params.company;
  const date = route.params.date;
  const place = route.params.place;
  const content = route.params.content;

  const [itemList, setitemList] = useState('');

  useEffect(()=>{
    const dataRef = database_ref(getDatabase(), '여행/'+trip_push+"/일정/");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        push_snap = snapshot.val();
        const tmp = [];
        for (i in push_snap){
          tmp.unshift({
              key : i,
              trip_push : trip_push,
              h_push : i,
              title: snapshot.child(i).child('제목').val(),
              date: date,
              h_date: snapshot.child(i).child('날짜').val(),
              time: snapshot.child(i).child('시간').val(),
              check: snapshot.child(i).child('출석').val(),
              num: snapshot.child(i).child('인원').val(),
          });
        }
        tmp.reverse();
        setitemList(tmp);
      }else{
      }
    });


  },[])

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();

      if (JSON.stringify(profile.id)==="\"2873594727\"") {
        navigation.navigate('M_UploadHistory',{trip_push: trip_push,title: title,company:company,date:date,
        place:place, content:content});
      }
    } catch (err) {
      console.log('signOut error', err);
    }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={() => getProfile()}>
      <Text style={styles.title}>여행일정</Text>
    </TouchableOpacity>

      <FlatList
        data={itemList}
        renderItem={({ item }) =>
        <HistoryListView
          navigation={navigation}
          trip_push={item.trip_push}
          h_push={item.h_push}
          title={item.title}
          date={item.date}
          h_date={item.h_date}
          time={item.time}
          check={item.check}
          num={item.num}
        />}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
      fontSize: 18,
      color: '#000',
      padding:10,
      paddingBottom:5,
  },
  row_Image: {
    height: 25,
    resizeMode: "contain",
  },
});

export default App;
