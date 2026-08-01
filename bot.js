require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Отдаем статические файлы (HTML, CSS, картинки) из текущей папки
app.use(express.static(__dirname));

// При заходе на главную страницу открываем index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
  const startPayload = ctx.match;
  if (startPayload && startPayload.startsWith('ref_')) {
    const referrerId = startPayload.replace('ref_', '');
    if (referrerId !== ctx.from.id.toString()) {
      await ctx.reply(`🎁 Вы зарегистрировались по приглашению! Вам начислен бонус.`);
    }
  }

  const refLink = `https://t.me/${ctx.me.username}?start=ref_${ctx.from.id}`;

  const keyboard = new InlineKeyboard()
    .webApp('🚀 Открыть CaseUp', 'https://my-bot-r98j.onrender.com');

  await ctx.reply(
    `🔥 *Добро пожаловать в CaseUp!*\n\n` +
    `Открывай кейсы, выбивай крутые NFT и выводи их без комиссии!\n\n` +
    `👥 *Ваша реферальная ссылка:*\n\`${refLink}\`\n\n` +
    `Приглашайте друзей и получайте бонусные Stars ⭐ за каждого!`,
    { 
      parse_mode: 'Markdown',
      reply_markup: keyboard 
    }
  );
});

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Бот ${botInfo.username} успешно запущен!`);
  }
});
