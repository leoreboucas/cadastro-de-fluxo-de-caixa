import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { checkTables, deleteData } from '../../database/initializeDatabase';

/**
 * Função que formata a data no formato `dd/mm/aaaa`.
 * @param {string|Date} dataPadrao - Data a ser formatada.
 * @returns {string} - Data formatada no formato `dd/mm/aaaa`.
 */
const formatarData = (dataPadrao) => {
  const dataObj = new Date(dataPadrao);
  const dia = dataObj.getDate().toString().padStart(2, '0');
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

/**
 * Função que formata um valor numérico para o formato de moeda brasileira (R$).
 * @param {number|string} valor - Valor a ser formatado.
 * @returns {string} - Valor formatado como `R$ xx,xx`.
 */
const formatarValor = (valor) => {
  if (typeof valor !== 'string') {
    valor = valor?.toString() || '0.00';
  }
  return 'R$' + valor.replace('.', ',');
};

export default function History() {
  const [dados, setDados] = useState([]);

  /**
   * Função para buscar os dados de vendas (caixas) no banco de dados.
   * Utiliza a função `checkTables` para verificar a tabela 'cadastro' e atualizar o estado `dados`.
   */
  const fetchData = useCallback(async () => {
    try {
      const result = await checkTables('cadastro');
      if (Array.isArray(result)) {
        setDados(result);
        console.log(dados)
      }
    } catch (err) {
      console.log(err);
    }
  }, []); // A função `fetchData` depende de nenhum valor específico, então o array de dependências está vazio.

  useEffect(() => {
    fetchData(); // Chama a função `fetchData` quando o componente for montado.
  }, []); // O efeito só é executado uma vez quando o componente é montado.

  /**
   * Função para deletar um registro de caixa do banco de dados.
   * Exibe um alerta de confirmação antes de proceder com a exclusão.
   * @param {number} id - ID do registro a ser deletado.
   */
  const deletarCaixa = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza que deseja excluir o caixa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar', onPress: () => {
            deleteData(id, 'cadastro') // Chama a função `deleteData` para excluir o registro.
              .then(() => fetchData()); // Após excluir, chama `fetchData` novamente para atualizar os dados.
          }
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {dados.length > 0 ? (
        // Exibe a lista de dados se existirem registros.
        <FlatList
          data={dados} // Passa os dados para o FlatList.
          keyExtractor={(item) => item.id} // Utiliza o ID como chave para cada item.
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          renderItem={({ item }) => (
            // Para cada item, exibe um conjunto de dados formatados.
            <View style={styles.row} key={item.id}>
              <View style={styles.column}>
                <Text style={styles.cell}>Caixa Inicial</Text>
                <Text style={styles.cell}>{formatarValor(item.caixainicial.toFixed(2))}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.cell}>Caixa Final</Text>
                <Text style={styles.cell}>{formatarValor(item.caixafinal.toFixed(2))}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.cell}>Despesas</Text>
                <Text style={styles.cell}>{formatarValor(item.despesas.toFixed(2))}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.cell}>Data</Text>
                <Text style={styles.cell}>{formatarData(item.datavendas)}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.cell}>Lucro</Text>
                <Text style={styles.cell}>{formatarValor((item.caixafinal - item.caixainicial - item.despesas).toFixed(2))}</Text>
              </View>
              <View style={styles.column}>
                <Button title='Deletar' color={'#dc3545'} onPress={() => deletarCaixa(item.id)} />
              </View>
            </View>
          )}
        />
      ) : (
        // Exibe uma mensagem caso não existam registros.
        <View>
          <Text style={styles.noData}>Nenhum registro de vendas.</Text>
        </View>
      )}
    </View>
  );
}

// Estilos do componente, definidos usando `StyleSheet`.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  row: {
    flexDirection: 'row', // Exibe os itens da linha em uma direção horizontal.
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#ccc',
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  column: {
    width: '45%', // Cada coluna ocupa 45% da largura disponível.
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  cell: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6c757d',
    paddingHorizontal: 10,
  },
  noData: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 20,
  },
});
