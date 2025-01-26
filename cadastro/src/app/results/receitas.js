import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Receitas({ dados }) {
    // Estado para armazenar as receitas mensais e as receitas gerais
    const [receitaMensal, setReceitaMensal] = useState([]);
    const [receitaGeral, setReceitaGeral] = useState({});
    const [mesSelecionado, setMesSelecionado] = useState(null);

    // Hook de efeito que executa o cálculo das receitas sempre que os dados mudam
    useEffect(() => {
        calcularReceitasMensais(); // Atualiza a receita mensal
        calcularReceitaGeral(); // Atualiza a receita geral
    }, [dados]);

    // Função para calcular as receitas gerais (bruta, líquida e despesas totais)
    const calcularReceitaGeral = () => {
        let somaReceitaBruta = 0;
        let somaReceitaLiquida = 0;
        let somaDespesasTotais = 0;

        // Itera sobre os dados para somar as receitas e despesas
        dados.forEach((value) => {
            somaReceitaBruta += value.caixafinal - value.caixainicial;
            somaReceitaLiquida += value.caixafinal - value.caixainicial - value.despesas;
            somaDespesasTotais += value.despesas;
        });

        // Atualiza o estado com os valores calculados
        setReceitaGeral({
            bruto: somaReceitaBruta,
            liquido: somaReceitaLiquida,
            despesas: somaDespesasTotais,
        });
    };

    // Função para calcular as receitas mensais (bruta, líquida e despesas)
    const calcularReceitasMensais = () => {
        const periodoEscolhido = {}; // Objeto que irá armazenar as receitas por mês

        dados.forEach((value) => {
            const dataReceita = new Date(value.datavendas);
            const chave = `${dataReceita.getFullYear()}-${String(dataReceita.getMonth() + 1).padStart(2, "0")}`;

            // Inicializa o objeto para o mês se não existir
            if (!periodoEscolhido[chave]) {
                periodoEscolhido[chave] = { bruto: 0, liquido: 0, despesas: 0 };
            }

            let somaReceitaBruta = value.caixafinal - value.caixainicial;
            let somaReceitaLiquida = somaReceitaBruta - value.despesas;
            let somaDespesasTotais = value.despesas;

            // Acumula os valores de receita e despesas para o mês correspondente
            periodoEscolhido[chave].bruto += somaReceitaBruta;
            periodoEscolhido[chave].liquido += somaReceitaLiquida;
            periodoEscolhido[chave].despesas += somaDespesasTotais;
        });

        // Atualiza o estado com as receitas mensais calculadas
        setReceitaMensal(
            Object.entries(periodoEscolhido).map(([key, value]) => ({
                key,
                ...value,
            }))
        );
    };

    // Gera a lista de meses disponíveis com base nos dados fornecidos
    const mesesDisponiveis = [...new Set(dados.map((value) => {
        const data = new Date(value.datavendas);
        return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    }))];

    // Função para formatar o mês e ano no formato "Mês/Ano"
    const formatarMesAno = (mesAno) => {
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
        ];

        const [ano, mes] = mesAno.split("-");
        return `${meses[parseInt(mes, 10) - 1]}/${ano}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Receitas</Text>

            <View style={styles.card}>
                {/* Picker para selecionar o período (mês ou geral) */}
                <Picker
                    selectedValue={mesSelecionado}
                    onValueChange={(itemValue) => setMesSelecionado(itemValue)}
                >
                    <Picker.Item label="Selecione o período" value={null} />
                    <Picker.Item label="Todo o Período" value="geral" />
                    {mesesDisponiveis.map((mes) => (
                        <Picker.Item
                            key={mes}
                            label={formatarMesAno(mes)}
                            value={mes}
                        />
                    ))}
                </Picker>
            </View>

            {/* Exibe as receitas gerais ou mensais dependendo da seleção */}
            {mesSelecionado === "geral" ? (
                <View style={styles.card}>
                    <Text style={styles.label}>Resumo de Todo o Período:</Text>
                    <View style={styles.item}>
                        <Text style={styles.label}>Receita Bruta:</Text>
                        <Text style={styles.value}>R$ {receitaGeral.bruto?.toFixed(2).replace(".", ",")}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>Receita Líquida:</Text>
                        <Text style={styles.value}>R$ {receitaGeral.liquido?.toFixed(2).replace(".", ",")}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>Despesas:</Text>
                        <Text style={styles.value}>R$ {receitaGeral.despesas?.toFixed(2).replace(".", ",")}</Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={mesSelecionado ? receitaMensal.filter((item) => item.key === mesSelecionado) : []}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.label}>Resumo do Mês: {formatarMesAno(item.key)}</Text>
                            <View style={styles.item}>
                                <Text style={styles.label}>Receita Bruta:</Text>
                                <Text style={styles.value}>R$ {item.bruto.toFixed(2).replace(".", ",")}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.label}>Receita Líquida:</Text>
                                <Text style={styles.value}>R$ {item.liquido.toFixed(2).replace(".", ",")}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.label}>Despesas:</Text>
                                <Text style={styles.value}>R$ {item.despesas.toFixed(2).replace(".", ",")}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#343a40",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 10,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 40,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#dee2e6",
        padding: 15,
        width: '100%'
    },
    label: {
        fontSize: 16,
        color: "#495057",
        padding: 15,
        textAlign: 'center'
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#28a745",
    },
});
