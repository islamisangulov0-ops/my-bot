require('dotenv').config();
const { Bot } = require('grammy');
const express = require('express');

// Express-сервер для Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('CaseUp Bot is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Telegram-бот
const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
  await ctx.reply('ПРИВЕТ! Я РАБОТАЮ С СЕРВЕРА 24/7! 🚀');
});

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Бот работает! Имя: @${botInfo.username}`);
  }
});
