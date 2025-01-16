import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [dados, setDados] = useState([]);

  useEffect(() =>{
    axios.get('http://192.168.0.103:3000/dados').then(
      resp => setDados(resp.data)
    )
  }, [])

  const formatarData = (dataPadrao) => {
    const dataObj = new Date(dataPadrao);
    const dia = dataObj.getDate().toString().padStart(2, '0'); // 
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); 
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const formatarValor = (valor) => {
    let valorFormatado = 'R$';
    valorFormatado += valor.replace('.', ',');

    return valorFormatado;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.cell}>Caixa</Text>
              <Text style={styles.cell}>{formatarValor(item.caixa)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.cell}>Despesas</Text>
              <Text style={styles.cell}>{formatarValor(item.despesas)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.cell}>Data</Text>
              <Text style={styles.cell}>{formatarData(item.datavendas)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.cell}>Lucro</Text>
              <Text style={styles.cell}>{formatarValor(String(item.caixa - item.despesas))}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  column: {
    width: '100',
    paddingVertical: 10,
    
  },
  cell: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  
  },
});
