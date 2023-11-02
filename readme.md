# RssTUBE - Bot para Telegram para receber os videos dos canais favoritos

O Rsstube é um bot para Telegran para cadastrar um feed de canais do Youtube.
Implementado para ser usado em chat privato e tambem em grupos, oque permite criar grupos de feed separados por tema.

<img src="/assets/img/rsstube.png">

Atualmente o bot utiliza a API do Youtube que tem uma utilização diaria limitada,  mas já estamos trabalhando em api propria que atualiza os dados utilizando web scraping.

## Como iniciar o projeto

Dentro do diretório principal, você pode executar:

### `npm install`

Instala todas as dependências do projeto dentro da pasta "node_modules"


### `Criar um aquivo .env para as variáveis`

```
Veja o arquivo .env_exemplo

APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxx.xxxxxxxxxxxxxxxx
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxx

Para o BD esta sendo utilizado Sequelize, neste bot estou usando MYSQL e deixei exemplos com SQLite
HOST = host do banco de dados, no caso de usar banco MYSQL
BDSENHA = senha do banco de dados
```
```
APIKEY é a sua chave de API do Google. 
Crie uma conta (gratuita) no Google Cloud 
Dentro do Cloud, crie um novo projeto
Em API e Serviços, crie uma nova API
Ative a API no botão API e serviços ( na pesquisa escolha Youtube Data API V3)
Ative o serviço, em seguida em credenciais gere um novo token.

OBS: Pensando em um versão distribuida, sera implementado o cadastro da API e cada usuario usara sua propria chave

BOT_TOKEN é o token do bot no Telegram.
Dentro do app do Telegram inicie uma conversa com o bot BotFather
use o comando /newbot 
Insira os dados pedidos, sera gerado o Token para o seu bot.
```
**Atenção: Cuidado para não expor o TOKEN, sempre utilizar em um arquivo privado **

Esse projeto é uma aplicação para criar um Bot para Telegram
## Funções do Bot implementadas
```
  Comandos do bot:
  /start - inicia o bot
  /add - Cadastra um canal do banco de dados
  /del - Deleta um canal do banco de dados
  /list - lista os canais cadastrados
  /find - Executa a busca por videos novos manualmente
```
## Como cadastrar canais
```
  1 - Acesse um video do canal desejado
  2 - Copie a URL do video
       EX: https://www.youtube.com/watch?v=N3q2VfFiU_8
        A URL deve ter este formato com o final "?v=N3q2VfFiU_8"
  3 - Use o comando /add e cole a URL do video no resposta do BOT. 
```