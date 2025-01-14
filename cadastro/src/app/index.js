import React from 'react';
import { View, Text, Button, StyleSheet, Touchable, TouchableHighlight } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Ir para Registros" onPress={() => router.push('/register')} />
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.btn} color={"#008000"} title="Ir para Historico" onPress={() => router.push('/history')} />
            </View>

            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Ir para Resultados" onPress={() => router.push('/results')} />
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
        marginVertical: 10, // Espaço entre os botões
        padding: 0,        // Padding interno do botão (indireto)
        width: '60%',       // Largura do botão
    },
});