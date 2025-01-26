# Cadastro de Fluxo de Caixa

## Descrição

Este projeto é uma aplicação de fluxo de caixa desenvolvida em **React Native** usando o **Expo**. O objetivo é permitir que os usuários registrem as transações financeiras de um pequeno negócio, como entradas e saídas de caixa, e gerenciem suas finanças de forma eficiente.

## Funcionalidades

- **Cadastro de Fluxo de Caixa**: Permite registrar entradas e saídas de caixa, com valores iniciais e finais de cada transação.
- **Exibição de Dados**: Exibe uma lista de transações registradas com informações detalhadas, como valores de caixa inicial e final, despesas e lucros.
- **Exclusão de Registros**: Possibilita a exclusão de transações financeiras do banco de dados, com confirmação por meio de um alerta.
- **Formatação de Dados**: Os valores são formatados como moeda, e as datas são convertidas para o formato `DD/MM/AAAA`.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis.
- **Expo**: Ferramenta que facilita o desenvolvimento de aplicativos com React Native.
- **SQLite**: Banco de dados local para armazenar os registros de fluxo de caixa.

## Instalação e Execução

Siga os passos abaixo para rodar o projeto em sua máquina:

### 1. Clone o Repositório

Abra o terminal e execute o comando:

```bash
    git clone https://github.com/leoreboucas/cadastro-de-fluxo-de-caixa.git
```

### 2. Instale as Dependências

Acesse a pasta do projeto e instale as dependências necessárias:

```bash
    cd cadastro-de-fluxo-de-caixa
    cd cadastro
    npm install
```
### 3. Execute a Aplicação
Após a instalação das dependências, inicie o projeto com o Expo:

```bash
    npx expo start
```

Isso abrirá uma página no terminal com um QR code. Escaneie o código com o aplicativo Expo Go no seu dispositivo móvel para visualizar a aplicação.

### Como Funciona
Estrutura do Banco de Dados
O banco de dados é um SQLite local que armazena as transações de caixa. Ele contém uma tabela chamada cadastro, onde são armazenados:

caixainicial: Valor do caixa inicial.
caixafinal: Valor do caixa final.
despesas: Valor das despesas durante o dia.
datavendas: Data da Movimentação do Caixa.

### Contribuições
Se desejar contribuir para o projeto, siga os passos abaixo:

- **Fork o repositório.
- **Crie uma nova branch (git checkout -b minha-nova-feature).
- **Faça suas modificações e commit (git commit -am 'Adicionando nova feature').
- **Push para a branch (git push origin minha-nova-feature).
- **Envie um Pull Request.
  
### Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais informações.
