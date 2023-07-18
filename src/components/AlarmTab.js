import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import "../firebase";
import Octicons from 'react-native-vector-icons/Octicons';
const App = ({
  navigation,
  }) => {

  return (
    <View style={styles.container}>
      <View style={styles.container_info}>
        <Octicons name="bell-fill" color={'#5E5E5E'} size={60} />
        <Text style={styles.tx_title}>알림이 없습니다</Text>
      </View>
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
  tx_title: {
    flexShrink: 1,
    fontSize: 15,
    color: '#5E5E5E',
    marginTop:15,
  },
});

export default App;
