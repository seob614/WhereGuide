import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid ,
} from 'react-native';
import "../firebase";

import AppContext from './AppContext'

import BeaconBroadcast from '@jaidis/react-native-ibeacon-simulator';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible_btTag, setVisible_btTag] = useState(true);
  const [ontravel, setOntravel] = useState(false);

  const et_travel_num = useRef(null);
  const [travel_num, setTravel_num] = useState(null);
  const et_travel_num2 = useRef(null);
  const [travel_num2, setTravel_num2] = useState(null);

  const [str_tag, setStr_tag] = useState(null);
  const [major, setMajor] = useState(null);
  const [minor, setMinor] = useState(null);
  const [tag_trip_push, setTag_trip_push] = useState(null);

  const myContext = useContext(AppContext);


  useEffect(()=>{

    // AsyncStorage에 저장된 데이터가 있다면, 불러온다.
    getData();

  },[])
  const getData = () => {

    if (myContext.stringValue) {
      const getitem = myContext.stringValue[0];
      const data_major = getitem.major;
      if(data_major) {
        console.log("GET data from storage:major");
        setMajor(data_major);
      }
      const data_minor = getitem.minor;
      if(data_minor) {
        console.log("GET data from storage:minor");
        setMinor(data_minor);
      }
      const data_tag = getitem.tag_trip_push;
      if(data_tag) {
        console.log("GET data from storage:data_tag");
        setTag_trip_push(data_tag);
      }
      if (data_major!=null&&data_minor!=null&&data_tag==trip_push) {
        setOntravel(true);
        setTravel_num(null);
        setTravel_num2(null);
        setTag_trip_push(null);
        setVisible_btTag(false);
        setStr_tag('주 번호: '+data_major+"/보조 번호: "+data_minor);
      }else{
        setStr_tag('여행객 등록 필요');
      }
    }else{
      setStr_tag('여행객 등록 필요');
    }

  }

  const showDialog = () => {
    if (ontravel) {
      setVisible2(true);
    }else{
      setVisible(true);
    }
  };

  const handleCancel = () => {
    if (ontravel) {
      setVisible2(false);
    }else{
      setVisible(false);
    }
  };

  const handleCheck = async () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic

    if (ontravel) {
      BeaconBroadcast.stopAdvertisingBeacon()
      myContext.setValue(null)
      setMajor(null);
      setMinor(null);
      setTag_trip_push(null);
      setStr_tag('여행객 등록 필요');
      alert("등록 해제");

      setVisible2(false);
      setOntravel(false);
      setVisible_btTag(true);


    }else{
      if (travel_num==null||travel_num2==null||0>=travel_num||travel_num>=65535||0>=travel_num2||travel_num2>=65535) {
        alert("번호를 확인하세요.");
        return
      }

      const storageData = await AsyncStorage.getItem("email");

      if(storageData) {
        const tagList = route.params.tagList;
        var no_email = true;
        for (var i = 0; i < tagList.length; i++) {
          var email = tagList[i].email;

          if (storageData==email) {

            if (tagList[i].major===travel_num.trim().toString()&&tagList[i].minor===travel_num2.trim().toString()) {
              no_email = false;
            }

          }
        }
        if (no_email) {
          alert("여행객 번호 확인 및 여행객 등록여부를 여행사에서 확인하세요.");
          return
        }
      }else{
        alert("회원가입 혹은 로그인 상태를 확인하세요.");
        return
      }

      var num = Number(travel_num);
      var num2 = Number(travel_num2);
      BeaconBroadcast.startAdvertisingBeaconWithString("68243019-63e6-4fe8-9fa7-52a90b29a5d4", "wattagam", num, num2)

      const tmp = [];

      tmp.unshift({
          tag_trip_push : trip_push,
          major : num,
          minor : num2,
      });
      myContext.setValue(tmp)
      setMajor(num);
      setMinor(num2);
      setTag_trip_push(trip_push);
      setStr_tag('주 번호: '+num+"/보조 번호: "+num2);

      setOntravel(true);
      setTravel_num(null);
      setTravel_num2(null);
      setVisible(false);
      setVisible_btTag(false);
      alert("등록 성공");
    }

  };

  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>여행객 번호 입력</Dialog.Title>
        <Dialog.Description>
          여행사에서 받은 여행객 번호를 입력하세요.
        </Dialog.Description>
        <Dialog.Input style={{backgroundColor:'#eee', padding:5,}}
          textInputRef={et_travel_num}
          onChangeText={travel_num => setTravel_num(travel_num)}
          label="주 번호 : "
          placeholder="주 번호을 입력해주세요"
          keyboardType="number-pad"></Dialog.Input>
        <Dialog.Input style={{backgroundColor:'#eee', padding:5,}}
          textInputRef={et_travel_num2}
          onChangeText={travel_num2 => setTravel_num2(travel_num2)}
          label="보조 번호 :"
          placeholder="보조 번호을 입력해주세요"
          keyboardType="number-pad"></Dialog.Input>
        <Dialog.Button label="확인" onPress={() => handleCheck()}/>
        <Dialog.Button label="취소" onPress={() => handleCancel()}/>
      </Dialog.Container>

      <Dialog.Container visible={visible2}>
        <Dialog.Title style={{color: '#d82d37',}}>여행객 등록 해제</Dialog.Title>
        <Dialog.Description>
          여행객 등록을 해제하시겠습니까?
        </Dialog.Description>
        <Dialog.Button label="확인" onPress={() => handleCheck()}/>
        <Dialog.Button label="취소" onPress={() => handleCancel()}/>
      </Dialog.Container>

      <ScrollView style={styles.scrollView}>
        <Image source={{uri : image_url}} style={styles.photo} />
        <View style={styles.container_text}>
          <Text style={styles.title}>
            {title}
          </Text>
          <View style={styles.row}></View>
          <View style={styles.container_tag}>
            <Text style={styles.tx_tag}>* {str_tag}</Text>
            <View style={styles.container_tag_bt}>
            {visible_btTag ?
            (
              <TouchableOpacity onPress={() => showDialog()}>
                <View style={styles.container_top}>
                    <View style={styles.container_startbt}>
                      <AntDesign name="pluscircle" size={20} color={'#fff'} />
                      <Text style={styles.tx_bt}>여행객 등록</Text>
                    </View>
                </View>
              </TouchableOpacity>
            ) :
            (
            <TouchableOpacity onPress={() => showDialog()}>
              <View style={styles.container_top}>
                  <View style={styles.container_stopbt}>
                    <AntDesign name="minuscircle" size={20} color={'#fff'} />
                    <Text style={styles.tx_bt}>등록 해제</Text>
                  </View>
              </View>
            </TouchableOpacity>
            )}
            </View>
          </View>

          <View style={styles.container_text_row}>
            <Text style={styles.tx_title}>여행사 : </Text>
            <Text style={styles.tx_title}>{company}</Text>
          </View>
          <View style={styles.container_text_row}>
            <Text style={styles.tx_title}>여행지 : </Text>
            <Text style={styles.tx_title}>{place}</Text>
          </View>
          <View style={styles.container_text_row}>
            <Text style={styles.tx_title}>날짜 : </Text>
            <Text style={styles.tx_title}>{date}</Text>
          </View>
          <View style={styles.container_text_row}>
            <Text style={styles.tx_title}>내용</Text>
          </View>
          <View style={styles.container_info}>
            <Text style={styles.tx_title}>{content}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
  },
  row: {
    backgroundColor: '#ACACAC',
    height:1,
    marginBottom:5,
  },
  container_top: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   justifyContent: 'flex-end',
  },
  container_startbt: {
    flexDirection: 'row',
    backgroundColor: '#2179E3',
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 5,
    padding:5,
    paddingLeft:8,
    paddingRight:8,
  },
  container_stopbt: {
    flexDirection: 'row',
    backgroundColor: '#5E5E5E',
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 5,
    padding:5,
    paddingLeft:8,
    paddingRight:8,
  },
  tx_bt: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    marginLeft:5,
  },
  photo: {
    borderRadius: 5,
    aspectRatio: 1.777,
    resizeMode: "contain",
  },
  container_text: {
    padding:8,
    flexDirection: 'column',
    marginLeft: 2,
    marginRight: 2,
  },
  container_tag: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom:8,
  },
  container_tag_bt: {
   flexDirection: 'row',
   flex:1,
   justifyContent: 'flex-end',
  },
  tx_tag: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4DA9F5',
    marginLeft:8,
  },
  container_text_row: {
    padding:1,
    flexDirection: 'row',
  },
  container_info: {
    marginTop:5,
    borderRadius: 10,
    padding:6,
    elevation: 6,
    backgroundColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    marginTop:2,
    marginBottom:8,
  },
  tx_title: {
    flexShrink: 1,
    fontSize: 15,
    color: '#000',
  },
});

export default App;
