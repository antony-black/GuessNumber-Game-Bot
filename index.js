const TelegrafApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('/options');
const token = '6534447047:AAEUx7H46dO19PUSQHU5AhC-5peknBhAlqY';

const bot = new TelegrafApi(token, {polling: true});

const chats = {};

const start = () => {
  setCommands();
  sendMsg();
  playGame();
}
start();

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `I made up a number from 0 to 9. Try to guess it:)`);

  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Guess the number:)', gameOptions);
}

 const setCommands = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Greeting!'},
    {command: '/info', description: 'Get user data'},
    {command: '/game', description: 'Guess the number;)'}
  ]);
 }

  const sendMsg = () => {
    bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;
  
      if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/10.webp');
        return bot.sendMessage(chatId, 'Welcome to my chat-bot;)');
      }
      if (text === '/info') {
        return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
      }
      if (text === '/game') {
       return startGame(chatId);
      }
  
      return bot.sendMessage(chatId, 'Sorry, I couldn\'t understand you! Try again, please!');
      // console.log(msg);
    });
  }

  const  playGame = () => {
    bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      const rightAnswer = `You\'re win! It's ${chats[chatId]}. Congratulations!`;
      const wrongAnswer = `It\'s wrong answer! Bot guessed number ${chats[chatId]}. Try again:)`;

      if (data === '/again') {
        return startGame(chatId);
      }
      if (data === chats[chatId]) {
        return await bot.sendMessage(chatId, rightAnswer, againOptions)
      } else{
        return await bot.sendMessage(chatId, wrongAnswer, againOptions);
      }
    })
  }