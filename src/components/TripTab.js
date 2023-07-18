import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import "../firebase";
import { getDatabase, child, get, set, ref as database_ref, onValue } from "firebase/database";
import { getStorage, getDownloadURL, ref as storage_ref } from "firebase/storage";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';

import TripListView from '../style/TripListView';
import M_UploadTrip from "./M_UploadTrip";

const App = ({
  navigation,
  }) => {

  const [itemList, setitemList] = useState('');

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();

      if (JSON.stringify(profile.id)==="\"2873594727\"") {
        navigation.navigate('M_UploadTrip')
      }
    } catch (err) {
      console.log('signOut error', err);
    }
  };

  useEffect(()=>{
    

    const dataRef = database_ref(getDatabase(), '여행/');
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("12");
        push_snap = snapshot.val();
        const tmp = [];
        for (i in push_snap){

          tmp.unshift({
              key : i,
              trip_push : i,
              title: snapshot.child(i).child('제목').val(),
              company: snapshot.child(i).child('여행사').val(),
              date: snapshot.child(i).child('날짜').val(),
              place: snapshot.child(i).child('여행지').val(),
              content: snapshot.child(i).child('내용').val(),
              image_url: snapshot.child(i).child('이미지').val(),
          });

        }
        tmp.reverse();
        setitemList(tmp);
      }else{

      }
    });

  },[])

  return (
    <View style={styles.container}>
      <View style={styles.TopBar}>
        <Image
          style={styles.TopLogo}

          source={require('../assets/images/logo.png')}
        />
        <View style={styles.Topbt_view}>
          <TouchableOpacity onPress={() => getProfile()}>
            <FontAwesome style={styles.Topbt} name="search" size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getProfile()}>
            <AntDesign style={styles.Topbt} name="pluscircle" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
          <FlatList
            data={itemList}
            renderItem={({ item }) =>
            <TripListView
              navigation={navigation}
              trip_push={item.trip_push}
              title={item.title}
              company={item.company}
              date={item.date}
              image_url={item.image_url}
              place={item.place}
              content={item.content}
            />}
          />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TopBar: {
   flexDirection: 'row',
   backgroundColor: '#fff',
  },
  TopLogo:{
    height: 25,
    margin:10,
    resizeMode: "contain",
    left:-26,
  },
  Topbt_view: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   justifyContent: 'flex-end',
   flex:1,
  },
  Topbt:{
    margin:10,
    marginRight:18,
  },
});

export default App;
