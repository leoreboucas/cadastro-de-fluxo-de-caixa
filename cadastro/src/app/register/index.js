import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import { addCadastro, checkProduct, checkTables } from '../../database/initializeDatabase';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

// Função para formatar a data no formato "YYYY-MM-DD"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Função para validar e processar valores inseridos nos campos de "Caixa Inicial", "Caixa Final" e "Despesas"
const handleSubmit = (valor) => {
  const caixaFloat = parseFloat(valor); // Converte para float ao enviar
  if (!isNaN(caixaFloat)) {
    return caixaFloat;
  } else {
    console.error('Valor inválido');
  }
};

// Componente principal do registro
export default function Register() {
  const router = useRouter();

  // Estados do componente para controlar os valores dos campos
  const [caixaInicial, setCaixaInicial] = useState(0.00);
  const [caixaFinal, setCaixaFinal] = useState(0.00);
  const [despesas, setDespesas] = useState(0.00);
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [productList, setProductList] = useState([]); // Lista de produtos disponíveis
  const [produtoSelecionado, setProdutoSelecionado] = useState(''); // Produto selecionado
  const [units, setUnits] = useState(''); // Quantidade do produto
  const [productSelectedList, setProductSelectedList] = useState([]); // Produtos selecionados para adicionar

  // Função para buscar os produtos do banco de dados
  const fetchData = async () => {
    try {
      const result = await checkTables('produto');
      if (Array.isArray(result)) {
        setProductList(result); // Atualiza a lista de produtos
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Carregar a lista de produtos quando o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

  // Função para salvar os dados no banco
  const salvarDados = () => {
    const validador = caixaInicial && caixaFinal && data; // Valida se todos os campos foram preenchidos
    if (validador) {
      const formattedDate = formatDate(data); // Formata a data
      const formattedValueCaixaInicial = handleSubmit(caixaInicial);
      const formattedValueCaixaFinal = handleSubmit(caixaFinal);
      const formattedValueDespesas = handleSubmit(despesas);
      addCadastro(formattedValueCaixaInicial, formattedValueCaixaFinal, formattedValueDespesas, formattedDate); // Adiciona no banco
      // Reseta os campos após salvar
      setCaixaInicial(0.00);
      setCaixaFinal(0.00);
      setDespesas(0.00);
      setData(new Date());
      setProductSelectedList([]);
      setUnits('');
      setProdutoSelecionado('');
      Alert.alert('Sucesso', 'Valor adicionado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/history'), // Redireciona para o histórico após sucesso
        },
      ]);
    } else {
      Alert.alert('Preencha todos os campos');
    }
  };

  // Função para resetar todos os campos
  const resetarDados = () => {
    setCaixaInicial(0.00);
    setCaixaFinal(0.00);
    setDespesas(0.00);
    setData(new Date());
    setProductSelectedList([]);
    setUnits('');
    setProdutoSelecionado('');
  };

  // Função para lidar com a seleção da data
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setData(currentDate);
    setShowDatePicker(false); // Fecha o seletor de data
  };

  // Função para mostrar o seletor de data
  const showPicker = () => {
    setShowDatePicker(true);
  };

  // Função para adicionar um produto selecionado à lista de produtos
  const addProductSelected = () => {
    const fetchDataProduct = async () => {
      try {
        if (produtoSelecionado) {
          const result = await checkProduct(produtoSelecionado); // Busca informações do produto selecionado
          if (Array.isArray(result)) {
            if (units && produtoSelecionado) {
              const updatedResult = result.map((item) => ({
                ...item,
                precoTotal: item.precounitario * Number(units), // Calcula o preço total com base na quantidade
                quantidade: units, // Atribui a quantidade
              }));
              setProductSelectedList([...productSelectedList, ...updatedResult]); // Atualiza a lista de produtos selecionados
              setUnits('');
              setProdutoSelecionado('');
            }
          }
        } else {
          Alert.alert('Selecione algum produto');
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchDataProduct();
  };

  // Função para calcular o gasto total de um produto, formatando o valor
  const calcularGasto = (valor) => {
    if (typeof valor !== 'string') {
      valor = valor?.toString() || '0.00';
    }

    let valorFormatado = 'R$';
    valorFormatado += valor.replace('.', ','); // Substitui ponto por vírgula para exibição no formato brasileiro

    return valorFormatado;
  };

  // Atualiza o valor das despesas sempre que a lista de produtos selecionados mudar
  useEffect(() => {
    const gastoTotal = productSelectedList.reduce((total, item) => total + item.precoTotal, 0).toFixed(2);
    setDespesas(gastoTotal);
  }, [productSelectedList]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Caixa Inicial */}
        <View style={styles.inputWrapper}>
          <TextInput
            label="Caixa Inicial"
            mode="outlined"
            value={caixaInicial}
            onChangeText={(value) => setCaixaInicial(value)}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        {/* Caixa Final */}
        <View style={styles.inputWrapper}>
          <TextInput
            label="Caixa Final"
            mode="outlined"
            value={caixaFinal}
            onChangeText={(value) => setCaixaFinal(value)}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        {/* Seção de Despesas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Despesas</Text>

          <Picker
            selectedValue={produtoSelecionado}
            style={styles.picker}
            onValueChange={(itemValue) => setProdutoSelecionado(itemValue)}
          >
            <Picker.Item label="Selecione um produto" value="" />
            {productList.map((produto) => (
              <Picker.Item key={produto.id} label={produto.produto} value={produto.id} />
            ))}
          </Picker>

          {/* Quantidade do Produto */}
          <View style={styles.inputRow}>
            <TextInput
              label="Quantidade"
              mode="outlined"
              value={units.toString()}
              onChangeText={(text) => setUnits(Number(text))}
              keyboardType="numeric"
              style={styles.inputSmall}
            />
            <Button title="Adicionar Produto" color="#008000" onPress={addProductSelected} style={styles.button} />
          </View>

          {/* Lista de Produtos Selecionados */}
          <FlatList
            data={productSelectedList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productRow} key={item.id}>
                <Text style={styles.productText}>{item.produto}</Text>
                <Text style={styles.productText}>{calcularGasto(item.precoTotal)}</Text>
              </View>
            )}
          />
        </View>

        {/* Gasto Total */}
        <Text style={styles.totalText}>Gasto Total: {calcularGasto(despesas)}</Text>

        {/* Data */}
        <TouchableOpacity onPress={showPicker} style={styles.inputWrapper}>
          <TextInput
            label="Data"
            mode="outlined"
            value={data.toLocaleDateString()}
            editable={false}
            style={styles.input}
          />
        </TouchableOpacity>

        {/* Seletor de Data */}
        {showDatePicker && (
          <DateTimePicker value={data} mode="date" display="default" onChange={onChange} />
        )}

        {/* Botões de Salvar e Resetar */}
        <View style={styles.buttonsContainer}>
          <Button title="Resetar" color="#FF6347" onPress={resetarDados} style={styles.button} />
          <Button title="Salvar" color="#008000" onPress={salvarDados} style={styles.button} />
        </View>
      </View>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  inputContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
  },
  inputSmall: {
    width: '40%',
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    marginVertical: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  productText: {
    fontSize: 14,
    color: '#333',
  },
});
