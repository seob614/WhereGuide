import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import "../firebase";
import Login from "./Login";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, child, get, set, ref as database_ref, onValue } from "firebase/database";
import { login, logout, getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';
const App = ({
  navigation,
  }) => {

  const [result, setResult] = useState('');
  const [on_login, setOn_login] = useState(false);
  const [bt_text, setBt_text] = useState('');
  const [info_text, setInfo_text] = useState('');

  useEffect(()=>{
    getStartProfile();

  },[])

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      setResult(JSON.stringify(token));
      setBt_text('로그아웃');
      setOn_login(true);
      getProfile();
    } catch (err) {
      console.log('login err', err);
      alert(err);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    try {
      const message = await logout();
      setResult(message);
      setBt_text('카카오 로그인')
      setInfo_text('로그인으로 간편 사용하세요.');
      setOn_login(false);
    } catch (err) {
      console.log('signOut error', err);
      alert(err);
    }
  };

  const getStartProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      setResult(JSON.stringify(profile));
      setBt_text('로그아웃')
      var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';
      setInfo_text("아이디:"+id);
      setOn_login(true);
    } catch (err) {
      console.log('signOut error', err);
      setBt_text('카카오 로그인')
      setInfo_text('로그인으로 간편 사용하세요.');
      setOn_login(false);
    }
  };

  const bt_getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      setResult(JSON.stringify(profile));
      signOutWithKakao();
    } catch (err) {
      console.log('signOut error', err);

      signInWithKakao();
    }
  };

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      setResult(JSON.stringify(profile));
      var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';
      setInfo_text("아이디:"+id);

      const dataRef = database_ref(getDatabase(), '유저/'+id);
      onValue(dataRef, (snapshot) => {
        if (!snapshot.exists()) {
          const db = getDatabase();
          set(database_ref(db, '유저/' +id), {
            아이디:id,이메일: JSON.stringify(profile.email),
          })
          .then(() => {
            // Data saved successfully!
            alert("회원가입 성공");
          })
          .catch((error) => {
            // The write failed...
            alert("회원가입에 실패하였습니다. 재로그인 혹은 문의바랍니다.");
          });;
        }
      });
    } catch (err) {
      console.log('signOut error', err);
    }
  };

  const unlinkKakao = async (): Promise<void> => {
    try {
      const message = await unlink();

      setResult(message);
    } catch (err) {
      console.log('signOut error', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_info}>
        <FontAwesome5 name="power-off" color={on_login?'#2179E3':'#5E5E5E'} size={60} />

        <TouchableOpacity onPress={() => bt_getProfile()}>
          <View style={styles.container_bt} backgroundColor={on_login?'#5E5E5E':'#2179E3'}>
            <Text style={styles.tx_bt}>{bt_text}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.tx_title}>{info_text}</Text>
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
    marginTop:10,
  },
  container_bt: {
    flexDirection: 'row',
    backgroundColor: '#2179E3',
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 5,
    padding:5,
    paddingLeft:20,
    paddingRight:20,
    marginTop:20,
  },
  tx_bt: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
  },
});

export default App;
