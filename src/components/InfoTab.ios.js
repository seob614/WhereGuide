import React, { useState, useEffect } from 'react';
import {
  Image,
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import "../firebase";
import Login from "./Login";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, child, get, set, remove, ref as database_ref, onValue } from "firebase/database";
import { login, logout, getProfile as getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Dialog from "react-native-dialog";

const App = ({
  navigation,
  }) => {

  const [result, setResult] = useState('');
  const [on_login, setOn_login] = useState(false);
  const [on_applelogin, setOn_applelogin] = useState(false);
  const [bt_text, setBt_text] = useState('');
  const [info_text, setInfo_text] = useState('');

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  let user = null;
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

  async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
      updateCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED');
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  }

  /**
   * Starts the Sign In flow.
   */
  async function onAppleButtonPress(updateCredentialStateForUser) {
    console.log('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      //console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;

      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        //console.log(nonce, identityToken);
        var decoded = jwt_decode(identityToken);
        var get_email = decoded.email;
        var id = get_email.slice(0, get_email.indexOf('@'))+'(apple)';

        const dataRef = database_ref(getDatabase());
        get(child(dataRef, `유저/${id}`)).then((snapshot) => {
          if (!snapshot.exists()) {
            const db = getDatabase();
            set(database_ref(db, '유저/' +id), {
              아이디:id,이메일: get_email,
            })
            .then(() => {
              // Data saved successfully!
              setInfo_text("이메일:"+id);
              setOn_applelogin(true);
              setOn_login(true);
              alert("회원가입 성공");
            })
            .catch((error) => {
              // The write failed...
              alert("회원가입에 실패하였습니다. 재로그인 혹은 문의바랍니다.");
            });;
          }
        });
        const setData = async () => {
          await AsyncStorage.setItem("appleID", id);
          await AsyncStorage.setItem("email", id);
        }
        setData();
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      //console.log(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User canceled Apple Sign in.');
      } else {
        console.log(error);
      }
    }
  }

  useEffect(()=>{

    const getData = async () => {
        const storageData = await AsyncStorage.getItem("appleID");
        if(storageData) {
          console.log(storageData);
          setInfo_text("이메일:"+storageData);
          setOn_applelogin(true);
          setOn_login(true);
        }else{
          getStartProfile();
        }
    }
    getData();
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
      try {
        await AsyncStorage.removeItem("email");
      } catch (e) {
        alert("로그아웃 오류; 어플을 재설치 하세요.")
      }
      setOn_login(false);
    } catch (err) {
      console.log('signOut error', err);
      alert(err);
    }
  };

  const getStartProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      setResult(profile);
      setBt_text('로그아웃')
      var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';
      var c_email = email.replace('.', '?');
      setInfo_text("이메일:"+c_email);
      await AsyncStorage.setItem("email", email);
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
      setResult(profile);
      signOutWithKakao();
    } catch (err) {
      console.log('signOut error', err);

      signInWithKakao();
    }
  };

  const bt_delID = async () => {
      const storageData = await AsyncStorage.getItem("appleID");
      if(storageData) {
        setVisible2(true);
      }else{
        del_kakaoID();
      }
  }

  const del_kakaoID = async (): Promise<void> => {
    try {

      const profile = await getKakaoProfile();
      setResult(profile);
      setVisible(true);
    } catch (err) {
      console.log('signOut error', err);

      alert("비로그인 상태입니다. 오류시 재접속 바랍니다.");
    }
  };

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile();
      setResult(profile);
      //var id = JSON.stringify(profile.email).slice(0, JSON.stringify(profile.email).indexOf('@'))+'"';
      var c_email = email.replace('.', '?');
      setInfo_text("이메일:"+c_email);
      await AsyncStorage.setItem("email", email);

      const dataRef = database_ref(getDatabase());
      get(child(dataRef, `유저/${c_email}`)).then((snapshot) => {
        if (!snapshot.exists()) {
          const db = getDatabase();
          set(database_ref(db, '유저/' +c_email), {
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



  const handleCheck = async () => {
    //var id = JSON.stringify(result.email).slice(0, JSON.stringify(result.email).indexOf('@'))+'"';
    var c_email = email.replace('.', '?');

    const dataRef = database_ref(getDatabase(), '유저/'+c_email);

    try {
      await AsyncStorage.removeItem("email");
    } catch (e) {
      alert("계정삭제 오류; 어플을 재설치 하세요.")
    }

    remove(dataRef);
    setVisible(false);
    signOutWithKakao();
    alert("계정 삭제 완료");
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCheck2 = async () => {
    const storageData = await AsyncStorage.getItem("appleID");
    if(storageData) {
      var id = storageData

      const dataRef = database_ref(getDatabase(), '유저/'+id);

      remove(dataRef);
      try {
        await AsyncStorage.removeItem("appleID");
        await AsyncStorage.removeItem("email");
      } catch (e) {
        alert("계정 삭제 오류; 어플을 재설치 하세요.")
      }
      try {
        await AsyncStorage.removeItem("trip");
      } catch (e) {
        alert("계정 삭제 오류; 어플을 재설치 하세요.")
      }
      setBt_text('카카오 로그인')
      setInfo_text('로그인으로 간편 사용하세요.');
      setOn_applelogin(false);
      setOn_login(false);
      setVisible2(false);
      alert("계정 삭제 완료");
    }else{
      setVisible2(false);
      alert("계정 삭제 오류; 업체에 문의하세요.")
    }
  };

  const showDialog2 = () => {
    setVisible2(true);
  };

  const handleCancel2 = () => {
    setVisible2(false);
  };

  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title style={{color: '#d82d37',}}>계정 삭제</Dialog.Title>
        <Dialog.Description>
          계정 삭제시 모든 데이터가 사라집니다. 정말 삭제 하시겠습니까?
        </Dialog.Description>
        <Dialog.Button label="확인" onPress={() => handleCheck()}/>
        <Dialog.Button label="취소" onPress={() => handleCancel()}/>
      </Dialog.Container>

      <Dialog.Container visible={visible2}>
        <Dialog.Title style={{color: '#d82d37',}}>계정 삭제</Dialog.Title>
        <Dialog.Description>
          계정 삭제시 모든 데이터가 사라집니다. 정말 삭제 하시겠습니까?
        </Dialog.Description>
        <Dialog.Button label="확인" onPress={() => handleCheck2()}/>
        <Dialog.Button label="취소" onPress={() => handleCancel2()}/>
      </Dialog.Container>
      <View style={styles.TopBar}>
        <Image
          style={styles.TopLogo}

          source={require('../assets/images/logo.png')}
        />
        {on_login ?
        (
          <TouchableOpacity style={styles.Topbt_view} onPress={() => bt_delID()}>
            <View style={styles.Topbt}>
              <Text style={styles.tx_bt}>계정 삭제</Text>
            </View>
          </TouchableOpacity>
        ) :
        (
          <View >
          </View>
        )}

      </View>
      <View style={styles.container_info}>
        <FontAwesome5 name="power-off" color={on_login?'#2179E3':'#5E5E5E'} size={60} />
        {on_applelogin ?
        (
          <View>
          </View>
        ) :
        (
          <View>
            <TouchableOpacity onPress={() => bt_getProfile()}>
              <View style={styles.container_bt} backgroundColor={on_login?'#5E5E5E':'#2179E3'}>
                <Text style={styles.tx_bt}>{bt_text}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAppleButtonPress(updateCredentialStateForUser)}>
              <View style={styles.container_bt} backgroundColor={'#2179E3'}>
                <Text style={styles.tx_bt}>Apple 로그인</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

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
    padding:10,
    paddingLeft:20,
    paddingRight:20,
    marginTop:20,
  },
  Topbt:{
    backgroundColor: '#5E5E5E',
    alignItems: "center",
    borderRadius: 5,
    padding:5,
    paddingLeft:10,
    paddingRight:10,
    margin:10,
  },
  tx_bt: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
  },
});

export default App;
