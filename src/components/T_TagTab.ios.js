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
  NativeEventEmitter,
  NativeModules
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


const App = ({
  navigation,
  route,
  }) => {
  const trip_push = route.params.trip_push;
  const tagList = route.params.tagList;

  const beaconsDidRangeEvent = null;
  // will be set as a reference to "authorizationStatusDidChange" event:
  const authStateDidRangeEvent = null;

  const RNBeaconsModule = NativeModules.RNiBeacon;
  const BeaconsEventEmitter = new NativeEventEmitter(RNBeaconsModule)

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
    setitemList(tagList);
    settripnum("0/"+tagList.length);

    return () => {
      // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.
      componentWillUnmount();
    };
  },[])

  function componentWillMount(){

    const { identifier, uuid } = this.state;
    const region = { identifier, uuid };

    // MANDATORY: you have to request ALWAYS Authorization (not only when in use) when monitoring
    // you also have to add "Privacy - Location Always Usage Description" in your "Info.plist" file
    // otherwise monitoring won't work
    Beacons.requestAlwaysAuthorization();
    Beacons.shouldDropEmptyRanges(true);

    // Define a region which can be identifier + uuid,
    // identifier + uuid + major or identifier + uuid + major + minor
    // (minor and major properties are numbers)
    // Monitor for beacons inside the region
    Beacons
    .startMonitoringForRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
    .then(() => console.log('Beacons monitoring started succesfully'))
    .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));
    // Range for beacons inside the region
    Beacons
    .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
    .then(() => console.log('Beacons ranging started succesfully'))
    .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
    // update location to ba able to monitor:
    Beacons.startUpdatingLocation();



    componentDidMount();
  }
  function componentDidMount() {
    //
    // component state aware here - attach events
    //
    // OPTIONAL: listen to authorization change
    setload("검색중...");
    this.authStateDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
      'authorizationStatusDidChange',
      info => console.log('authorizationStatusDidChange: ', info),
    );
    // Ranging:
    this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      data => {
        console.log('beaconsDidRange data: ', data);

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
      },
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

    Beacons.stopUpdatingLocation();

    // remove ranging event we registered at componentDidMount

    if (this.beaconsDidRangeEvent!=null) {
      this.beaconsDidRangeEvent.remove();
    }

    if (this.authStateDidRangeEvent!=null) {
      this.authStateDidRangeEvent.remove();
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
