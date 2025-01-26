import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput } from 'react-native-paper'
import { addProduct, checkTables, deleteData, editProduct } from '../../database/initializeDatabase';

export default function Products() {
    // Estado para armazenar o nome do produto, preço unitário, ID do produto e dados dos produtos
    const [product, setProduct] = useState('');
    const [unitPrice, setUnitPrice] = useState(0.00);
    const [id, setId] = useState('');
    const [dados, setDados] = useState([]);
    const [editableOn, setEditableOn] = useState(false); // Controle de modo edição

    // Função para buscar os dados dos produtos registrados no banco
    const fetchData = async () => {
        try {
            const result = await checkTables('produto'); // Verifica a tabela 'produto' no banco de dados
            if (Array.isArray(result)) {
                setDados(result); // Atualiza o estado 'dados' com os produtos encontrados
                if (id) setId(''); // Reseta o id se houver algum valor
            }
        } catch (err) {
            console.log(err); // Log de erro caso a consulta falhe
        }
    }

    // Carrega os dados assim que o componente for montado
    useEffect(() => {
        fetchData();
    }, [])

    // Função de envio do produto, seja para adicionar ou editar
    const submitProduct = useCallback(() => {
        if (product && unitPrice) { // Verifica se os campos não estão vazios
            if (!editableOn) { // Se não está em modo edição, adiciona um novo produto
                addProduct(product, unitPrice);
                setProduct(''); // Reseta o campo 'produto' após salvar
                setUnitPrice(0.00); // Reseta o campo 'preço unitário'
                fetchData(); // Atualiza a lista de produtos
            } else { // Se está em modo edição, edita o produto existente
                editProduct(id, product, unitPrice);
                setProduct(''); // Reseta o campo 'produto' após editar
                setUnitPrice(0.00); // Reseta o campo 'preço unitário'
                setEditableOn(false); // Desativa o modo edição
                fetchData(); // Atualiza a lista de produtos
            }
        } else {
            Alert.alert('Campo vazio, tente novamente.'); // Exibe um alerta se algum campo estiver vazio
        }
    }, [product, unitPrice, editableOn, id]);

    // Função para formatar o valor do produto para o formato "R$"
    const formatarValor = (valor) => {
        if (typeof valor !== 'string') {
            valor = valor?.toString() || '0.00'; // Converte o valor para string, caso necessário
        }

        let valorFormatado = 'R$';
        valorFormatado += valor.replace('.', ','); // Substitui o ponto por vírgula para o formato brasileiro
        return valorFormatado;
    };

    // Função para resetar os campos de entrada do produto
    const resetProductInput = () => {
        setProduct('');
        setUnitPrice(0.00);
        if (editableOn) setEditableOn(false); // Desativa o modo edição ao resetar
    }

    // Função para ativar o modo de edição de um produto
    const editarProduto = (id, product, unitPrice) => {
        setEditableOn(true); // Ativa o modo edição
        setProduct(product); // Define o nome do produto para edição
        setUnitPrice(unitPrice.toFixed(2)); // Define o preço unitário para edição
        setId(id); // Define o id do produto a ser editado
    }

    // Função para deletar um produto, com confirmação via alerta
    const deletarProduto = (id) => {
        Alert.alert(
            'Confirmar exclusão',
            'Você tem certeza que deseja excluir este produto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar', onPress: () => {
                        deleteData(id, 'produto'); // Deleta o produto da tabela 'produto'
                        fetchData(); // Atualiza a lista de produtos após a exclusão
                    }
                },
            ],
            { cancelable: false } // Desativa a possibilidade de fechar o alerta clicando fora
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerenciamento de Produtos</Text>
            <View style={styles.card}>
                {/* Campo para inserir o nome do produto */}
                <TextInput
                    label='Produto'
                    mode='outlined'
                    placeholder='Digite o produto que deseja adicionar'
                    value={product}
                    onChangeText={(productInput) => setProduct(productInput)} // Atualiza o estado 'product'
                    style={styles.input}
                />
                {/* Campo para inserir o valor unitário do produto */}
                <TextInput
                    label='Valor Unitário'
                    mode='outlined'
                    placeholder='Digite o valor unitário do produto'
                    value={unitPrice}
                    onChangeText={(unitPriceInput) => {
                        if (/^\d*\.?\d*$/.test(unitPriceInput)) { // Verifica se o valor inserido é numérico
                            setUnitPrice(unitPriceInput); // Atualiza o estado 'unitPrice'
                        }
                    }}
                    keyboardType='decimal-pad' // Define o tipo de teclado para entrada de números decimais
                    style={styles.input}
                />
                {/* Botões de redefinir e salvar */}
                <View style={styles.buttonRow}>
                    <Button color={'#28a745'} title="Redefinir" onPress={resetProductInput} />
                    <Button color={'#28a745'} title="Salvar Produto" onPress={submitProduct} />
                </View>
            </View>
            <View style={styles.products} >
                <Text style={styles.sectionTitle}>Produtos Registrados</Text>
                {/* Se houver produtos registrados, exibe a lista */}
                {dados.length > 0 ? (
                    <FlatList
                        style={styles.list}
                        data={dados} // Dados a serem exibidos
                        keyExtractor={(item) => item.id} // Identificador único de cada produto
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 20,
                                    width: '90%',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Exibe o nome do produto e o preço */}
                                    <View>
                                        <Text style={styles.label}>Produto</Text>
                                        <Text>{item.produto}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Preço Unitário</Text>
                                        <Text style={styles.value}>{formatarValor((item.precounitario).toFixed(2))}</Text>
                                    </View>
                                </View>
                                <View style={styles.actions}>
                                    {/* Botões de editar e deletar */}
                                    <Button title="Editar" color={'#28a745'} onPress={() => editarProduto(item.id, item.produto, item.precounitario)} />
                                    <Button title="Deletar" color={'#dc3545'} onPress={() => deletarProduto(item.id)} />
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>Nenhum produto registrado.</Text> // Exibe mensagem caso não haja produtos
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
    },
    products: {
        flex: 1
    },
    input: {
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        width: '100%',
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    label: {
        fontSize: 14,
        color: '#6c757d',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    noData: {
        textAlign: 'center',
        color: '#6c757d',
        marginTop: 20,
    },
});
