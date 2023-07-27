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
  const title = route.params.title;
  const company = route.params.company;
  const date = route.params.date;
  const place = route.params.place;

  const et_h_title = useRef(null);
  const [h_title, setH_title] = useState('');
  const et_h_date = useRef(null);
  const [h_date, setH_Date] = useState('');
  const et_hour = useRef(null);
  const [hour, setHour] = useState('');
  const et_min = useRef(null);
  const [min, setMin] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "히스토리 업로드",
    })
  })

  function saveData() {
    if (h_title==''||h_date==''||hour==''||min=='') {
      alert("정보를 모두 입력하세요");
      return;
    }
    const db = getDatabase();
    const key = push(child(ref(db), 'posts')).key;

    set(ref(db, '여행/' +trip_push+"/일정/"+key), {
      제목: h_title,날짜: h_date,시간:hour+":"+min,
      출석: "진행중",인원: "-",
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
        <Text style={styles.title}>제목: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_h_title}
         onChangeText={h_title => setH_title(h_title)}
         placeholder="제목을 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>날짜: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_h_date}
         onChangeText={h_date => setH_Date(h_date)}
         placeholder="날짜를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>시: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_hour}
         onChangeText={hour => setHour(hour)}
         multiline ={true}
         keyboardType="number-pad"
         placeholder="시 입력"  />
         <Text style={styles.title}>분: </Text>
         <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
          ref={et_min}
          onChangeText={min => setMin(min)}
          multiline ={true}
          keyboardType="number-pad"
          placeholder="분 입력"  />
      </View>
      <Button
        title="히스토리 등록"
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
