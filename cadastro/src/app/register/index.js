import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper'
import axios from 'axios';


export default function Register() {

  const [caixa, setCaixa] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const salvarDados = () => {

    const formattedDate = formatDate(data);

    axios
      .post('http://192.168.0.103:3000/dados', { caixa, despesas, data: formattedDate })
      .then(() => {
        alert('Dados salvos com sucesso!');
        setCaixa(0);
        setDespesas(0);
        setData(new Date());
      })
      .catch((error) => {
        console.error('Erro no POST:', error);
        alert('Erro ao salvar os dados.');
      });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    
    setData(currentDate);
    setShowDatePicker(false); // Esconde o DateTimePicker após selecionar a data
  };
  const showPicker = () => {
    setShowDatePicker(true); // Mostra o DateTimePicker quando o campo for pressionado
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajuste para o mês
    const day = date.getDate().toString().padStart(2, '0'); // Ajuste para o dia
    return `${year}-${month}-${day}`;
  };
  return (
    <View style={styles.container}>
      <View>
        <View>
          <TextInput 
          label='Caixa:' 
          mode="outlined" 
          placeholder="Digite o valor em caixa" 
          value={caixa.toString()}
          onChangeText={(value) => setCaixa(Number(value))} 
          inputMode='decimal' 
          style={styles.input} />
        </View>
        <View>
          <TextInput 
          label='Despesas:' 
          mode="outlined" 
          placeholder="Digite as despesas" 
          inputMode='decimal' 
          style={styles.input}
          value={despesas.toString()}
          onChangeText={(value) => setDespesas(Number(value))}
          />
        </View>
        <View>
          <TouchableOpacity onPress={showPicker} style={styles.inputContainer}>
            <TextInput
              label="Data:"
              mode="outlined"
              placeholder="Escolha a data"
              value={data.toLocaleDateString()} 
              editable={false}
              style={styles.input}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <View style={styles.btnContainer}>
          <View style={styles.btn}>
            <Button title='Resetar' color={'#008000'} />
          </View>
          <View style={styles.btn}>
            <Button title='Salvar' color={'#008000'} onPress={salvarDados} />
          </View>
        </View>
      </View>
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
  input: {
    width: '90%',
    backgroundColor: '#fff', 
    margin: 10
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5, 
    fontSize: 16,
    color: '#333',
  },
  btnContainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    width: '100%'   
  },
  btn: {
    flex: 1,
    marginHorizontal: 20,
  }
});
