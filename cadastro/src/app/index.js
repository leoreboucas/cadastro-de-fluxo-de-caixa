import { View, Button, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';


export default function Home() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Produtos Registrados" onPress={() => router.push('/products')} />
            </View>
            <View style={styles.buttonContainer}>
                <Button color={"#008000"} title="Registrar Movimentação de Caixa" onPress={() => router.push('/register')} />
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