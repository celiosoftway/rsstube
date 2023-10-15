# RssTUBE - Bot para Telegram para receber os videos dos canais favoritos

## Como iniciar o projeto

Dentro do diretório principal, você pode executar:

### `npm install`

Instala todas as dependências do projeto dentro da pasta "node_modules"


### `Criar um aquivo .env para as variáveis`

```
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
  /start - inicia a conversa com o bot
  /addcanal - Cadastra um canal no banco de dados
  /lista - lista os canais cadastrados
  /find - Executa a busca por videos novos manualmente
```
## Como cadastrar canais
```
  1 - Acesse um video do canal desejado
  2 - Copie a URL do video
  3 - Cole a URL do video no resposta do BOT. 
```