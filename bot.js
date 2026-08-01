require('dotenv').config();
const { Bot } = require('grammy');

// Токен будет бережно храниться в настройках сервера
const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
  await ctx.reply('ПРИВЕТ! Я РАБОТАЮ С СЕРВЕРА 24/7! 🚀');
});

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Бот работает! Имя: @${botInfo.username}`);
  }
});