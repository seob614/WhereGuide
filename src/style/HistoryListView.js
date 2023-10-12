import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dialog from "react-native-dialog";
import NetInfo from "@react-native-community/netinfo";

import "../firebase";
import { getDatabase, child, get, set, push, update, ref as database_ref, onValue } from "firebase/database";
import { getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';

import HistoryInfo from "../components/HistoryInfo";

const HistoryListView = ({ navigation,trip_push,h_push, title, date,h_date,time, check, num }) => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [now_check, setNow_check] = useState(check);

  const getProfile = async () => {
    try {
      const profile = await getKakaoProfile();

      var id = '"'+email.slice(0, email.indexOf('@'))+'"';

      //var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';
      console.log(now_check);
      const dataRef = database_ref(getDatabase());
      get(child(dataRef, `유저/${id}/관리자`)).then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val()=="Y") {

            showDialog(now_check);
          }else{
            console.log('관리자가 아닙니다');
          }
        }else{
          console.log('관리자가 아닙니다2');
        }
      });


    } catch (err) {
      console.log('signOut error', err);
    }
  };

  const showDialog = (now_check) => {
    if (now_check=='진행중') {
      setVisible(true);
    }else{
      setVisible2(true);
    }
  };

  const handleCancel = (now_check) => {
    if (now_check=='진행중') {
      setVisible(false);
    }else{
      setVisible2(false);
    }
  };

  const handleCheck = (now_check) => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        if (now_check=='진행중') {
          const db = getDatabase();
          const key = push(child(database_ref(db), 'posts')).key;
          setNow_check("완료");
          update(database_ref(db, '여행/' +trip_push+"/일정/"+h_push), {
            출석: "완료"
          })
          .then(() => {
            // Data saved successfully!
            alert("일정 완료");
          })
          .catch((error) => {
            // The write failed...
            alert(error);
          });;
          setVisible(false);
        }else{
          const db = getDatabase();
          const key = push(child(database_ref(db), 'posts')).key;
          setNow_check("진행중");
          update(database_ref(db, '여행/' +trip_push+"/일정/"+h_push), {
            출석: "진행중"
          })
          .then(() => {
            // Data saved successfully!
            alert("일정 완료 해제");
          })
          .catch((error) => {
            // The write failed...
            alert(error);
          });;
          setVisible2(false);
        }

      }else{
        alert("네트워크 상태를 확인하세요.");
      }
    });


  };

  return(
    <View>
      <View style={styles.row}>
        <Image style={styles.row_Image} source={require('../assets/images/down_arrow.png')} />
      </View>
      <View style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>일정 완료</Dialog.Title>
          <Dialog.Description>
            일정을 완료하셨습니까?
          </Dialog.Description>
          <Dialog.Button label="확인" onPress={() => handleCheck(now_check)}/>
          <Dialog.Button label="취소" onPress={() => handleCancel(now_check)}/>
        </Dialog.Container>

        <Dialog.Container visible={visible2}>
          <Dialog.Title style={{color: '#d82d37',}}>일정 완료 해제</Dialog.Title>
          <Dialog.Description>
            일정 완료를 해제하시겠습니까?
          </Dialog.Description>
          <Dialog.Button label="확인" onPress={() => handleCheck(now_check)}/>
          <Dialog.Button label="취소" onPress={() => handleCancel(now_check)}/>
        </Dialog.Container>
        <TouchableOpacity onPress={() => getProfile() } >
          <View style={styles.container_top}>
          {now_check == '진행중' ?
          (
            <View style={styles.container_state}>
              <Text style={styles.tx_state}>{now_check}</Text>
            </View>
          ) :
          (
            <View style={styles.container_state2}>
              <Text style={styles.tx_state}>{now_check}</Text>
            </View>
          )}
          </View>
          <View style={styles.container_text}>
            <View style={styles.container_text2}>
              <Ionicons name="location-sharp" size={25} color={'#ACACAC'}/>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.container_text2}>
              <Ionicons style={styles.bt_date} name="time-sharp" size={25}  color={'#ACACAC'}/>
              <View style={styles.container_time}>
                <Text style={styles.time}>{time}</Text>
              </View>

              <Text style={styles.date}>{h_date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:6,
        marginTop:2,
        marginBottom:5,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 8,
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: 1,
    },
    row: {
      alignItems: "center"
    },
    row_Image: {
      height: 25,
      resizeMode: "contain",
    },
    container_state: {
        borderRadius: 3,
        backgroundColor: '#4DA9F5',
    },
    container_state2: {
        borderRadius: 3,
        backgroundColor: '#5E5E5E',
    },
    container_num: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      justifyContent: 'flex-end',
      flex:1,
      alignItems: "center"
    },
    tx_num: {
        fontSize: 16,
        color: '#000',
        marginRight:10,
        padding:5,
    },
    tx_state: {
        fontSize: 16,
        color: '#fff',
        padding:5,
        marginLeft:10,
        marginRight:10,
    },
    container_top: {
     flexDirection: 'row',
     backgroundColor: '#fff',
    },
    container_text: {
      padding:8,
      flex: 1,
      flexDirection: 'column',
      marginLeft: 2,
      justifyContent: 'center',
    },
    container_text2: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      flex:1,
      alignItems: "center",
      marginBottom:5,
    },
    title: {
        fontSize: 18,
        color: '#000',
        marginLeft:8,
    },
    container_time: {
        marginLeft:8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 3,
    },
    time: {
        fontSize: 16,
        color: '#000',
        padding:4,
        marginLeft:2,
        marginRight:2,
    },
    date: {
        fontSize: 14,
        color: '#000',
        marginLeft:8,
    },
});

export default HistoryListView;
