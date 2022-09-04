import React, { Component, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from "react-native-gesture-handler";
import { openDatabase } from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';

import { setCancelledBookings } from '../app/cancelled';
import { Modal } from "../components/modal";
import Colors from '../const/color';

const db = openDatabase({
    name: "hotel_booking", 
    location: 'default'
});

const CancelBookingScreen = ({navigation, route}) =>{

    const { cancelled } = useSelector((state) => state.cancelled);
    const dispatch = useDispatch();

    useEffect(() => {
        getCancelledHotels();
    }, []);

    // Function to retrieve cancelled booking details
    const getCancelledHotels = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM cancelled",
                    [],
                    (sqlTxn, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            console.log("Got data");
                            let results = [];
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push({ id: item.id, userID: item.userID, hotelName: item.hotelName, hotelLocation: item.hotelLocation, hotelImage: item.hotelImage, startDate: item.startDate, duration: item.duration, adults: item.adults, child: item.child, price: item.price });
                            }
                            dispatch(setCancelledBookings(results));
                        }
                    },
                    error => {
                        console.log("Error reading from table: " + error.message);
                    },
                );
            });
        } catch (error) {
            console.log(error);
        }
    };

    console.log("Cancelled screen bookings: " + cancelled);

    // Function to render retrieved data
    const RenderBookings = ({ data }) => {
        return (
            <TouchableOpacity key={data.id} activeOpacity={1} > 
                <View style={styles.mainBox}>
                    <View style={{flexDirection:'column'}}>

                        {/* Hotel details */}
                        <View style={{flexDirection:'row', margin:15}}>
                            <Image 
                                style={styles.popularImage}
                                source={{uri: data.hotelImage}}
                            />
                            <View style={{flexDirection:'column', marginTop: 30, marginLeft: 20}}> 
                                <Text style={{
                                    fontSize: 20, 
                                    fontWeight: 'bold', 
                                    color:'black',
                                    }}> {data.hotelName} </Text> 

                                <Text style={{
                                    fontSize: 15,  
                                    color:'black',
                                    paddingLeft: 2,
                                    marginTop: 15,
                                    }}> {data.hotelLocation} </Text> 
                            </View>
                        </View>

                        <Text style={styles.line}> ────────────────────────────────────── </Text>

                        {/* Booking details */}
                        <View style={styles.verticalBox}>
                            <View style={{flexDirection:'column', marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                                <Text style={{fontSize:15, }}> Start Date </Text>
                                <Text style={{fontSize:20, fontWeight: 'bold', }}> {data.startDate} </Text>
                            </View>

                            <View style={styles.verticleLine}></View>

                            <View style={{flexDirection:'column', marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                                <Text style={{fontSize:15, }}> Stay Duration </Text>
                                <Text style={{fontSize:20, fontWeight: 'bold', }}> {data.duration} </Text>
                            </View>

                            <View style={styles.verticleLine}></View>

                            <View style={{flexDirection:'column', marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                                <Text style={{fontSize:15, }}> Adult </Text>
                                <Text style={{fontSize:20, fontWeight: 'bold', }}> {data.adults} </Text>
                            </View>

                            <View style={styles.verticleLine}></View>

                            <View style={{flexDirection:'column', marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                                <Text style={{fontSize:15, }}> Children </Text>
                                <Text style={{fontSize:20, fontWeight: 'bold', }}> {data.child} </Text>
                            </View>
                        </View>

                        {/* Additional info */}
                        <Text style={styles.line}> ────────────────────────────────────── </Text>
                        <View style={{flexDirection:'row', paddingLeft:20, paddingTop: 5,}} >
                            <Icon name="cancel" size={25} color="#bf2b0a" />
                            <Text style={{fontSize: 18, paddingLeft: 20, color: "#bf2b0a" , paddingBottom: 5,}}> Cancelled </Text>
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={{textAlign: 'center', color: "#e0e0e0", marginTop: 5}}> ────────────────────────────────────── </Text>
                </View>
            </TouchableOpacity>
        );
    };


    return(
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={{ 
                        fontSize:25,  
                        alignSelf: 'center',
                        marginTop:10, 
                        marginBottom:5, 
                        color: 'black', 
                        fontWeight: 'bold'}}>Cancelled Bookings
                    </Text>
                    <View>
                        <Text style={styles.line}> ───────────────────────────────────────── </Text>
                    </View>

                    {cancelled.map((item, index) => {
                        return <RenderBookings key={index} data={item} />
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.white, 
        flex: 1,
    },
    line:{
        textAlign: 'center'
    },
    popularImage:{
        height: 140,
        width: 140,
        borderRadius: 20,
        flexDirection:'row', 
    },
    mainBox:{
        backgroundColor: Colors.light,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        height:300,
        borderRadius: 15,
    },
    verticalBox: {
        flexDirection: 'row',
        width: '100%',
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
    },
})


export default CancelBookingScreen;