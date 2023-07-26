import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Trip from "../components/Trip";

const TripListView = ({ navigation, trip_push, title, company,date, image_url, place, content, historyList, tagList}) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Trip',{trip_push: trip_push,title: title,company:company,date:date,
      image_url:image_url, place:place, content:content, historyList:historyList, tagList:tagList})}>
        <Image source={{uri : image_url}} style={styles.photo} />
        <View style={styles.container_text}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.company}>
                {company}
            </Text>
            <Text style={styles.date}>
                {date}
            </Text>
        </View>
      </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:6,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 1,
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: 1,
    },
    container_text: {
      padding:8,
      flex: 1,
      flexDirection: 'column',
      marginLeft: 2,
      justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: '#000',
    },
    company: {
        fontSize: 14,
    },
    date: {
        fontSize: 11,
    },
    photo: {
      borderRadius: 5,
      aspectRatio: 1.777,
      resizeMode: "contain",
    },
});

export default TripListView;
