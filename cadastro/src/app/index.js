import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Registrar vendas" onPress={() => router.push('/register')} />
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.btn} color={"#008000"} title="Histórico de vendas" onPress={() => router.push('/history')} />
            </View>

            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Resultados" onPress={() => router.push('/results')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        
    },
    buttonContainer: {
        marginVertical: 10,
        padding: 0,       
        width: '60%',      
    },
});