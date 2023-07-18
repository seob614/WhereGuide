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
import { getStorage, getDownloadURL, ref as storage_ref } from "firebase/storage";

const App = ({
  navigation,
  }) => {
  const et_title = useRef(null);
  const [title, setTitle] = useState('');
  const et_company = useRef(null);
  const [company, setCompany] = useState('');
  const et_date = useRef(null);
  const [date, setDate] = useState('');
  const et_place = useRef(null);
  const [place, setPlace] = useState('');
  const et_image = useRef(null);
  const [image, setImage] = useState('');
  const et_content = useRef(null);
  const [content, setContent] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "여행 업로드",
    })
  })

  function saveData() {
    const storage = getStorage();

    const storageRef = storage_ref(storage, image);

    // Get the download URL
    getDownloadURL(storageRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        const db = getDatabase();
        const key = push(child(ref(db), 'posts')).key;


        set(ref(db, '여행/' + key), {
          제목: title,여행사: company,날짜: date,
          여행지: place,내용: content,이미지:url,
        })
        .then(() => {
          // Data saved successfully!
          alert("업로드 성공");
        })
        .catch((error) => {
          // The write failed...
          alert(error);
        });;

      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            alert(error);
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            alert(error);
            break;
          case 'storage/canceled':
            // User canceled the upload
            alert(error);
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            alert(error);
            break;
        }
      });

  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>제목: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_title}
         onChangeText={title => setTitle(title)}
         placeholder="제목을 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>여행사: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_company}
         onChangeText={company => setCompany(company)}
         placeholder="여행사를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>날짜: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_date}
         onChangeText={date => setDate(date)}
         placeholder="날짜를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>여행지: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_place}
         onChangeText={place => setPlace(place)}
         placeholder="여행지를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>이미지: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_image}
         onChangeText={image => setImage(image)}
         multiline ={true}
         placeholder="이미지번호를 입력해주세요"  />
      </View>
      <View style={{flexDirection:'row', padding:10, alignItems: 'center', }}>
        <Text style={styles.title}>내용: </Text>
        <TextInput style={{backgroundColor:'#eee', padding:5, flex:1,   }}
         ref={et_content}
         onChangeText={content => setContent(content)}
         multiline ={true}
         placeholder="내용을 입력해주세요"  />
      </View>
      <Button
        title="여행 등록"
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
