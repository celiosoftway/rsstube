# RssTUBE - Bot para Telegram para receber os videos dos canais favoritos

## Como iniciar o projeto

Dentro do diretório principal, você pode executar:

### `npm install`

Instala todas as dependências do projeto dentro da pasta "node_modules"


### `Criar um aquivo .env para as variáveis de ambiente`

```
APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxx.xxxxxxxxxxxxxxxx
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxx
```
```
APIKEY é a sua chave de API do Google. 
Crie uma conta (gratuita) no Google Cloud 
Dentro do Cloud, crie um novo projeto
Em API e Serviços, crie uma nova API
Ative a API no botão API e serviços ( na pesquisa escolha Youtube Data API V3)
Ative o serviço, em seguida em credenciais gere um novo token.

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
  No momento essa é uma tarefa manual
  1 - Acesse um video do canaal desejado
  2 - Exiba o codigo fonte da página ( Ctrl + U no Mozila) ou adicione no inicio da url  EX view-source:https://www.youtube.com/watch?v=
  3 - Pesquise por channelId, e copie o condeudo. Exemplo
    "channelId":"UC06jukdbEi7_2h79Ohvs0Rw"
  o id do canal é : UC06jukdbEi7_2h79Ohvs0Rw
```