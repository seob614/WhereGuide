import React, { useState, useRef } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import "../firebase";
import { getDatabase, ref, child, get, set, push } from "firebase/database";

const App = ({
  navigation,
  route
  }) => {
  const trip_push = route.params.trip_push;

  const et_tagname = useRef(null);
  const [tagname, setTagname] = useState('');
  const et_major = useRef(null);
  const [major, setMajor] = useState('');
  const et_minor = useRef(null);
  const [minor, setMinor] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "태그 업로드",
    })
  })

  function saveData() {
    const db = getDatabase();
    const key = push(child(ref(db), 'posts')).key;

    set(ref(db, '여행/' +trip_push+"/인원/"+key), {
      이름:tagname,major: major,minor: minor,
    })
    .then(() => {
      // Data saved successfully!
      alert("업로드 성공");
    })
    .catch((error) => {
      // The write failed...
      alert(error);
    });;

  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>태그이름: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_tagname}
         onChangeText={tagname => setTagname(tagname)}
         placeholder="태그이름을 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>주 major: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_major}
         onChangeText={major => setMajor(major)}
         placeholder="주 major를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>보조 minor: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_minor}
         onChangeText={minor => setMinor(minor)}
         placeholder="보조 minor를 입력해주세요"  />
      </View>
      <Button
        title="태그 등록"
        onPress={() => saveData()}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFF',
  },
  title: {
      fontSize: 16,
      color: '#000',
  },
});

export default App;
