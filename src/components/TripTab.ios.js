import React, { useState, useRef, useEffect, useContext } from 'react';
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
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";

import { getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';

import TripListView from '../style/TripListView';
import M_UploadTrip from "./M_UploadTrip";

import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = ({
  navigation,
  }) => {

  const [itemList, setitemList] = useState('');
  const [item_visible, setItem_visible] = useState(true);
  const [visible, setVisible] = useState(false);

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();

      if (JSON.stringify(profile.id)==="\"2873594727\"") {
        navigation.navigate('M_UploadTrip')
      }else{
        showDialog();
      }
    } catch (err) {
      console.log('signOut error', err);
      showDialog();
    }
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getStartProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      var id = email.slice(0, email.indexOf('@'))+email.slice(email.indexOf('@')).replace('.', '?');
      //var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';

      if (JSON.stringify(profile.id)==="\"2873594727\"") {
        const dataRef = database_ref(getDatabase(), '/');
        onValue(dataRef, (snapshot) => {
          if (snapshot.child('여행').exists()) {
            push_snap = snapshot.child('여행').val();
            const tmp = [];
            for (i in push_snap){
              const h_tmp = [];
              if (snapshot.child('여행').child(i).child('일정').exists()) {
                h_push_snap = snapshot.child('여행').child(i).child('일정').val();

                for (j in h_push_snap){
                  h_tmp.unshift({
                      key : j,
                      trip_push : i,
                      h_push : j,
                      title: snapshot.child('여행').child(i).child('일정').child(j).child('제목').val(),
                      date: snapshot.child('여행').child(i).child('날짜').val(),
                      h_date: snapshot.child('여행').child(i).child('일정').child(j).child('날짜').val(),
                      time: snapshot.child('여행').child(i).child('일정').child(j).child('시간').val(),
                      check: snapshot.child('여행').child(i).child('일정').child(j).child('출석').val(),
                      num: snapshot.child('여행').child(i).child('일정').child(j).child('인원').val(),
                  });
                }
                h_tmp.reverse();
              }

              const t_tmp = [];
              if (snapshot.child('여행').child(i).child('인원').exists()) {
                t_push_snap = snapshot.child('여행').child(i).child('인원').val();

                for (k in t_push_snap){
                  t_tmp.unshift({
                      key : k,
                      trip_push : i,
                      num_push : k,
                      uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
                      email: snapshot.child('여행').child(i).child('인원').child(k).child('아이디').val(),
                      name: snapshot.child('여행').child(i).child('인원').child(k).child('이름').val(),
                      major: snapshot.child('여행').child(i).child('인원').child(k).child('major').val(),
                      minor: snapshot.child('여행').child(i).child('인원').child(k).child('minor').val(),
                      distance: "-",
                      proximity: "-",
                      check:"미확인",
                  });
                }
                t_tmp.reverse();
              }

              tmp.unshift({
                  key : i,
                  trip_push : i,
                  title: snapshot.child('여행').child(i).child('제목').val(),
                  company: snapshot.child('여행').child(i).child('여행사').val(),
                  date: snapshot.child('여행').child(i).child('날짜').val(),
                  place: snapshot.child('여행').child(i).child('여행지').val(),
                  content: snapshot.child('여행').child(i).child('내용').val(),
                  image_url: snapshot.child('여행').child(i).child('이미지').val(),
                  historyList: h_tmp,
                  tagList: t_tmp,
              });

            }
            tmp.reverse();
            setitemList(tmp);
            const setData = async () => {
              await AsyncStorage.setItem("trip", JSON.stringify(tmp));
            }
            setData();

          }else{
            console.log('여행을 등록하세요');
            setItem_visible(false);
          }
        });
      }else{
        const dataRef = database_ref(getDatabase(), '/');
        onValue(dataRef, (snapshot) => {
          if (snapshot.child('유저').child(id).child('여행').exists()) {
            push_snap = snapshot.child('유저').child(id).child('여행').val();
            const tmp = [];
            for (i in push_snap){
              const h_tmp = [];
              if (snapshot.child('여행').child(i).child('일정').exists()) {
                h_push_snap = snapshot.child('여행').child(i).child('일정').val();

                for (j in h_push_snap){
                  h_tmp.unshift({
                      key : j,
                      trip_push : i,
                      h_push : j,
                      title: snapshot.child('여행').child(i).child('일정').child(j).child('제목').val(),
                      date: snapshot.child('여행').child(i).child('날짜').val(),
                      h_date: snapshot.child('여행').child(i).child('일정').child(j).child('날짜').val(),
                      time: snapshot.child('여행').child(i).child('일정').child(j).child('시간').val(),
                      check: snapshot.child('여행').child(i).child('일정').child(j).child('출석').val(),
                      num: snapshot.child('여행').child(i).child('일정').child(j).child('인원').val(),
                  });
                }
                h_tmp.reverse();
              }

              const t_tmp = [];
              if (snapshot.child('여행').child(i).child('인원').exists()) {
                t_push_snap = snapshot.child('여행').child(i).child('인원').val();

                for (k in t_push_snap){
                  t_tmp.unshift({
                      key : k,
                      trip_push : i,
                      num_push : k,
                      uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
                      email: snapshot.child('여행').child(i).child('인원').child(k).child('아이디').val(),
                      name: snapshot.child('여행').child(i).child('인원').child(k).child('이름').val(),
                      major: snapshot.child('여행').child(i).child('인원').child(k).child('major').val(),
                      minor: snapshot.child('여행').child(i).child('인원').child(k).child('minor').val(),
                      distance: "-",
                      proximity: "-",
                      check:"미확인",
                  });
                }
                t_tmp.reverse();
              }

              tmp.unshift({
                  key : i,
                  trip_push : i,
                  title: snapshot.child('여행').child(i).child('제목').val(),
                  company: snapshot.child('여행').child(i).child('여행사').val(),
                  date: snapshot.child('여행').child(i).child('날짜').val(),
                  place: snapshot.child('여행').child(i).child('여행지').val(),
                  content: snapshot.child('여행').child(i).child('내용').val(),
                  image_url: snapshot.child('여행').child(i).child('이미지').val(),
                  historyList: h_tmp,
                  tagList: t_tmp,
              });

            }
            tmp.reverse();
            setitemList(tmp);
            const setData = async () => {
              await AsyncStorage.setItem("trip", JSON.stringify(tmp));
            }

            setData();
          }else{
            console.log('여행을 등록하세요');
            setItem_visible(false);
          }
        });
      }


    } catch (err) {
      console.log('signOut error', err);
      setItem_visible(false);
    }
  };

  const getTripData = async () => {
    const storageData = await AsyncStorage.getItem("appleID");
    if(storageData) {
      var id = storageData
      const dataRef = database_ref(getDatabase(), '/');
      onValue(dataRef, (snapshot) => {
        if (snapshot.child('유저').child(id).child('여행').exists()) {
          push_snap = snapshot.child('유저').child(id).child('여행').val();
          const tmp = [];
          for (i in push_snap){
            const h_tmp = [];
            if (snapshot.child('여행').child(i).child('일정').exists()) {
              h_push_snap = snapshot.child('여행').child(i).child('일정').val();

              for (j in h_push_snap){
                h_tmp.unshift({
                    key : j,
                    trip_push : i,
                    h_push : j,
                    title: snapshot.child('여행').child(i).child('일정').child(j).child('제목').val(),
                    date: snapshot.child('여행').child(i).child('날짜').val(),
                    h_date: snapshot.child('여행').child(i).child('일정').child(j).child('날짜').val(),
                    time: snapshot.child('여행').child(i).child('일정').child(j).child('시간').val(),
                    check: snapshot.child('여행').child(i).child('일정').child(j).child('출석').val(),
                    num: snapshot.child('여행').child(i).child('일정').child(j).child('인원').val(),
                });
              }
              h_tmp.reverse();
            }

            const t_tmp = [];
            if (snapshot.child('여행').child(i).child('인원').exists()) {
              t_push_snap = snapshot.child('여행').child(i).child('인원').val();

              for (k in t_push_snap){
                t_tmp.unshift({
                    key : k,
                    trip_push : i,
                    num_push : k,
                    uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
                    email: snapshot.child('여행').child(i).child('인원').child(k).child('아이디').val(),
                    name: snapshot.child('여행').child(i).child('인원').child(k).child('이름').val(),
                    major: snapshot.child('여행').child(i).child('인원').child(k).child('major').val(),
                    minor: snapshot.child('여행').child(i).child('인원').child(k).child('minor').val(),
                    distance: "-",
                    proximity: "-",
                    check:"미확인",
                });
              }
              t_tmp.reverse();
            }

            tmp.unshift({
                key : i,
                trip_push : i,
                title: snapshot.child('여행').child(i).child('제목').val(),
                company: snapshot.child('여행').child(i).child('여행사').val(),
                date: snapshot.child('여행').child(i).child('날짜').val(),
                place: snapshot.child('여행').child(i).child('여행지').val(),
                content: snapshot.child('여행').child(i).child('내용').val(),
                image_url: snapshot.child('여행').child(i).child('이미지').val(),
                historyList: h_tmp,
                tagList: t_tmp,
            });

          }
          tmp.reverse();
          setitemList(tmp);
          const setData = async () => {
            await AsyncStorage.setItem("trip", JSON.stringify(tmp));
          }

          setData();
        }else{
          console.log('여행을 등록하세요');
          setItem_visible(false);
        }
      });
    }else{
      getStartProfile();
    }
  }

  const startPage = () => {
    setItem_visible(true);
    NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        getTripData();
      }else{
        const getData = async () => {
            const storageData = JSON.parse(await AsyncStorage.getItem("trip"));
            if(storageData) {
              setitemList(storageData);
            }else{
              setItem_visible(false);
            }
        }
        getData();
      }
    });
  };

  useEffect(()=>{
    startPage();

  },[])


  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title >여행 등록</Dialog.Title>
        <Dialog.Description>
          - 회원가입 후, 여행사에 아이디를 알려주면 자동 등록됩니다.
        </Dialog.Description>
        <Dialog.Description>
          (회원가입: 어플 하단; 나의정보→카카오 로그인)
        </Dialog.Description>
        <Dialog.Button label="취소" onPress={() => handleCancel()}/>
      </Dialog.Container>
      <View style={styles.TopBar}>
        <Image
          style={styles.TopLogo}

          source={require('../assets/images/logo.png')}
        />
        <View style={styles.Topbt_view}>
          <TouchableOpacity onPress={() => startPage()}>
            <Entypo style={styles.Topbt} name="cycle" size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getProfile()}>
            <AntDesign style={styles.Topbt} name="pluscircle" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      {item_visible ?
      (
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
                historyList={item.historyList}
                tagList={item.tagList}
              />}
            />
        </View>
      ) :
      (
        <View style={styles.container}>
          <View style={styles.container_info}>
            <Entypo name="aircraft" color={'#5E5E5E'} size={60} />
            <Text style={styles.tx_title}>여행일정이 없습니다</Text>
            <View style={styles.container_image}>
              <Text style={styles.tx_title}>우측 상단의 </Text>
              <AntDesign name="pluscircle" size={25} color={'#5E5E5E'} />
              <Text style={styles.tx_title}> 으로 추가</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container_info: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container_image: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop:10,
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
