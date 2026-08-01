require('dotenv').config();
const { Bot } = require('grammy');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Заглушка для работы сервера 24/7 (для Render и cron-job)
app.get('/', (req, res) => {
  res.send('CaseUp Server is running 24/7!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// 1. ОБРАБОТКА СТАРТА И РЕФЕРАЛОК
bot.command('start', async (ctx) => {
  const startPayload = ctx.match; // Параметр рефералки (например: ref_123456)
  
  if (startPayload && startPayload.startsWith('ref_')) {
    const referrerId = startPayload.replace('ref_', '');
    
    // Проверка, чтобы юзер не приглашал сам себя
    if (referrerId !== ctx.from.id.toString()) {
      console.log(`Пользователь ${ctx.from.id} пришел по рефералке от ${referrerId}`);
      await ctx.reply(`🎁 Вы зарегистрировались по приглашению! Вам начислен бонус.`);
    }
  }

  // Генерация личной реферальной ссылки
  const refLink = `https://t.me/${ctx.me.username}?start=ref_${ctx.from.id}`;

  await ctx.reply(
    `🔥 *Добро пожаловать в CaseUp!*\n\n` +
    `Открывай кейсы, выбивай крутые NFT и выводи их без комиссии!\n\n` +
    `👥 *Ваша реферальная ссылка:*\n\`${refLink}\`\n\n` +
    `Приглашайте друзей и получайте бонусные Stars ⭐ за каждого!`,
    { parse_mode: 'Markdown' }
  );
});

// 2. ОПЛАТА ТЕЛЕГРАМ СТАРС (XTR)
bot.command('buy', async (ctx) => {
  await ctx.api.sendInvoice(
    ctx.chat.id,
    'Пополнение баланса CaseUp',
    'Покупка 100 Stars ⭐ для открытия кейсов',
    'payload_stars_100',
    '',                  // Провайдер пустой для Stars
    'XTR',               // Валюта Telegram Stars
    [{ label: '100 Stars ⭐', amount: 100 }]
  );
});

// Подтверждение перед оплатой
bot.on('pre_checkout_query', async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

// 3. УСПЕШНАЯ ОПЛАТА
bot.on('message:successful_payment', async (ctx) => {
  const payment = ctx.message.successful_payment;
  console.log(`Пользователь ${ctx.from.id} оплатил ${payment.total_amount} Stars!`);
  await ctx.reply(`🎉 Оплата прошла успешно! Вам начислено ${payment.total_amount} Stars ⭐.`);
});

// Запуск бота
bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Бот ${botInfo.username} успешно запущен!`);
  }
});
