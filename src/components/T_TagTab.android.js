import React, {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid ,
  addListener,
} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import { getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';
import { getDatabase, child, get, set, ref as database_ref,onValue } from "firebase/database";

import moment  from 'moment';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

import "../firebase";

import Feather from 'react-native-vector-icons/Feather';
import CustomSwitch from '../style/CustomSwitch';

import M_UploadTag from "./M_UploadTag";
import TagListView from '../style/TagListView';

async function reqPer() {

  try {

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
    ]).then((result) => {
      if (result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.BLUETOOTH_SCAN'] &&
        result['android.permission.BLUETOOTH_CONNECT'] &&
        result['android.permission.BLUETOOTH_ADVERTISE'] === 'granted') {
        console.log("모든 권한 획득")
      } else {
        console.log("거절된 권한있음")
      }
    })

    console.log("granted : ", granted)
    /*
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
          return true;

        } else {
          console.log("location permission denied");
          return false;
        } */

  } catch (err) {
    console.warn(err)
  }

}

const App = ({
  navigation,
  route,
  }) => {
  const trip_push = route.params.trip_push;

  const beaconsDidRangeEvent = null;

  const [tripnum, settripnum] = useState('0/0');
  const [load, setload] = useState(null);
  const [on_switch, seton_switch] = useState('2');
  const [itemList, setitemList] = useState('');

  const onSelectSwitch = index => {
    if (index===1) {
      if (on_switch==2) {
        componentWillMount();
        seton_switch('1');
      }

    }else if(index===2) {
      if (on_switch==1) {
        componentWillUnmount();
        seton_switch('2');
      }

    }

  };

  state = {
    uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
    identifier: '가이드',
  };

  useEffect(()=>{
    const dataRef = database_ref(getDatabase(), '여행/'+trip_push+"/인원/");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        push_snap = snapshot.val();
        const tmp = [];
        for (i in push_snap){
          tmp.unshift({
              key : i,
              trip_push : trip_push,
              num_push : i,
              uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
              name: snapshot.child(i).child('이름').val(),
              major: snapshot.child(i).child('major').val(),
              minor: snapshot.child(i).child('minor').val(),
              distance: "-",
              proximity: "-",
              check:"미확인",
          });
        }
        settripnum("0/"+tmp.length);
        tmp.reverse();
        setitemList(tmp);
      }else{
      }
    });

    return () => {
      // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.
      componentWillUnmount();
    };
  },[])

  function componentWillMount(){
    reqPer();

    const { identifier, uuid } = this.state;
    const region = { identifier, uuid };
    Beacons.detectIBeacons();

    // Monitor beacons inside the region
    Beacons
      .startMonitoringForRegion(region)
      .then(() => console.log('Beacons monitoring started succesfully'))
      .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));

    // Range beacons inside the region
    Beacons
      .startRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons ranging started succesfully'))
      .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

    componentDidMount();
  }
  function componentDidMount() {
    //
    // component state aware here - attach events
    //
    // Ranging:
    this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('beaconsDidRange data: ', data);
        setload("검색중...");
        if (data.beacons.length != 0) {
          const getitem = data.beacons;
          var num = 0;
          let copyArray = [...itemList];
          for (i in copyArray){

            let found = data.beacons.find(element => element.major == itemList[i].major&&element.minor == itemList[i].minor)
            if (found) {
              copyArray[i] = {...copyArray[i], check: "확인" ,distance: found.distance};
              num++;
            }else{
              copyArray[i] = {...copyArray[i], check: "미확인" ,distance: "-"};
            }

          }
          setitemList(copyArray);
          settripnum(num+"/"+itemList.length);
        }else{
          let copyArray = [...itemList];
          for (i in copyArray){

            copyArray[i] = {...copyArray[i], check: "미확인" ,distance: "-"};

          }
          setitemList(copyArray);
          settripnum("0/"+itemList.length);
        }

      }
    );
  }

  function componentWillUnmount() {
    const { uuid, identifier } = this.state;
    const region = { identifier, uuid };

    // stop ranging beacons:
    Beacons
    .stopRangingBeaconsInRegion(identifier, uuid)
    .then(() => console.log('Beacons ranging stopped succesfully'))
    .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

    // stop monitoring beacons:
    Beacons
    .stopMonitoringForRegion(region)
    .then(() => console.log('Beacons monitoring stopped succesfully'))
    .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`));

    // remove ranging event we registered at componentDidMount

    if (this.beaconsDidRangeEvent!=null) {
      this.beaconsDidRangeEvent.remove();
    }


    let copyArray = [...itemList];
    for (i in copyArray){

      copyArray[i] = {...copyArray[i], check: "미확인" ,distance: "-"};

    }
    setitemList(copyArray);
    settripnum("0/"+itemList.length);
    setload(null);
    // remove beacons events we registered at componentDidMount
    //this.regionDidEnterEvent.remove();
    //this.regionDidExitEvent.remove();

  }

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();

      if (JSON.stringify(profile.id)==="\"2873594727\"") {
        navigation.navigate('M_UploadTag',{trip_push: trip_push})
      }
    } catch (err) {
      console.log('signOut error', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => getProfile()}>
        <View style={styles.container_top}>
            <View style={styles.container_num}>
              <Feather name="user" size={25} color={'#5E5E5E'} />
              <Text style={styles.tx_num}>{tripnum}</Text>
            </View>
        </View>
      </TouchableOpacity>

      <View style={styles.container_search}>
        <Text style={styles.tx_load}>{load}</Text>
        <View style={styles.container_bt}>
          <CustomSwitch
            selectionMode={2}
            roundCorner={true}
            option1={'확인'}
            option2={'해제'}
            onSelectSwitch={onSelectSwitch}
            selectionColor={'#2179E3'}
          />
        </View>
      </View>
      <View style={styles.row}></View>

      <FlatList
        data={itemList}
        renderItem={({ item }) =>
        <TagListView
          name={item.name}
          distance={item.distance}
          proximity={item.proximity}
          check={item.check}
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
  row: {
    backgroundColor: '#ACACAC',
    height:1,
    marginBottom:5,
  },
  container_top: {
   flexDirection: 'row',
   backgroundColor: '#fff',
  },
  container_num: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    flex:1,
    alignItems: "center"
  },
  container_search: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: "center",
  },
  container_bt: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   flex:1,
   justifyContent: 'flex-end',
   alignItems: "center",
   marginRight:10,
   marginBottom:10,
  },
  bt_title: {
      fontSize: 16,
      color: '#000',
  },
  title: {
      fontSize: 18,
      color: '#000',
  },
  tx_num: {
      fontSize: 16,
      color: '#000',
      marginRight:10,
      padding:5,
  },
  tx_load: {
      fontSize: 16,
      color: '#000',
      marginLeft:20,
  },
});

export default App;
