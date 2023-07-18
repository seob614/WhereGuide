import React, {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {
  Button,
  Text,
  View,
  FlatList,
  PermissionsAndroid ,
  addListener,
} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import Beacons from 'react-native-beacons-manager';

import {styles} from '../style/beacon';

import moment  from 'moment';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

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
  }) => {
  // will be set as a reference to "beaconsDidRange" event:
  const beaconsDidRangeEvent = null;
  // will be set as a reference to "regionDidEnter" event:
  //const regionDidEnterEvent = null;
  // will be set as a reference to "beaconsDidRange" event:
  //const regionDidExitEvent  = null;

  const [rangingDataSource, setrangingDataSource] = useState([]);
  const [regionEnterDatasource, setregionEnterDatasource] = useState([]);
  const [regionExitDatasource, setregionExitDatasource] = useState([]);
  state = {
    uuid: '68243019-63e6-4fe8-9fa7-52a90b29a5d4',
    identifier: 'www',
  };

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

        if (data.beacons.length != 0) {
          setrangingDataSource(data.beacons);
          //componentWillUnmount();
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
    this.beaconsDidRangeEvent.remove();
    // remove beacons events we registered at componentDidMount
    //this.regionDidEnterEvent.remove();
    //this.regionDidExitEvent.remove();


  }
  const renderRangingRow = (rowData) => {
    const json = JSON.stringify(rowData);
    const getitem = rowData.item;
    console.log(getitem);
    if (rowData.length != 0) {
      return (
        <View style={styles.row}>
          <Text style={styles.smallText}>
            UUID: {getitem.uuid ? getitem.uuid  : 'NA'}
          </Text>
          <Text style={styles.smallText}>
            Major: {getitem.major ? getitem.major : 'NA'}
          </Text>
          <Text style={styles.smallText}>
            Minor: {getitem.minor ? getitem.minor : 'NA'}
          </Text>
          <Text>
            RSSI: {getitem.rssi ? getitem.rssi : 'NA'}
          </Text>
          <Text>
            Proximity: {getitem.proximity ? getitem.proximity : 'NA'}
          </Text>
          <Text>
            Distance: {getitem.distance ? getitem.distance : 'NA'}m
          </Text>
        </View>
      );
    }

  }

  const renderMonitoringEnterRow = ({ identifier, uuid, minor, major, time }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          Identifier: {identifier ? identifier : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          UUID: {uuid ? uuid  : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {major ? major : ''}
        </Text>
        <Text style={styles.smallText}>
          Minor: { minor ? minor : ''}
        </Text>
        <Text style={styles.smallText}>
          time: { time ? time : 'NA'}
        </Text>
      </View>
    );
  }

  const renderMonitoringLeaveRow = ({ identifier, uuid, minor, major, time }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          Identifier: {identifier ? identifier : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          UUID: {uuid ? uuid  : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {major ? major : ''}
        </Text>
        <Text style={styles.smallText}>
          Minor: { minor ? minor : ''}
        </Text>
        <Text style={styles.smallText}>
          time: { time ? time : 'NA'}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Button
        title="비콘탐색"
        onPress={componentWillMount}
      />
      <Button
        title="비콘해제"
        onPress={componentWillUnmount}
      />
      <Text style={styles.headline}>
        ranging beacons in the area:
      </Text>
      <FlatList
        data={rangingDataSource}
        renderItem={renderRangingRow}
        keyExtractor={(item) => String(item.uuid+item.major+item.minor)}
      />
    </View>
  );


}
export default App;
