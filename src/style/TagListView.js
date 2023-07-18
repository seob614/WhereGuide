import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TagListView = ({ name,distance, proximity, check }) => (
  <View>
    <View style={styles.container}>
      <View style={styles.container_text}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.container_check}>
          <Text style={styles.tx_check}>{check}</Text>
        </View>
      </View>
      <View style={styles.container_text2}>
        <Text style={styles.tx_distance}>거리 : </Text>
        <Text style={styles.tx_distance}>{distance} m</Text>
      </View>
      <View style={styles.row}></View>
    </View>
  </View>

);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:6,
        marginTop:2,
        marginBottom:5,
        backgroundColor: '#FFF',
    },
    row: {
      backgroundColor: '#ACACAC',
      height:1,
      marginBottom:5,
    },
    container_text: {
      padding:8,
      flex: 1,
      flexDirection: 'row',
      marginLeft: 2,
      alignItems: "center"
    },
    container_text2: {
      padding:1,
      flex: 1,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: 'flex-end',
      marginBottom:5,
    },
    name: {
        fontSize: 18,
        color: '#000',
        marginLeft:8,
        flex: 1,
    },
    container_check: {
        borderRadius: 3,
        backgroundColor: '#4DA9F5',
        justifyContent: 'flex-end',
    },
    tx_check: {
        fontSize: 16,
        color: '#fff',
        padding:5,
        marginLeft:10,
        marginRight:10,
    },
    tx_distance: {
        fontSize: 12,
        color: '#000',
        marginRight:8,
    },
});

export default TagListView;
