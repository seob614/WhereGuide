import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import "../firebase";
import Login from "./Login";

const App = ({
  navigation,
  }) => {

  return (
    <View>
      <Button
        title="로그인"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};



const styles = StyleSheet.create({

});

export default App;
