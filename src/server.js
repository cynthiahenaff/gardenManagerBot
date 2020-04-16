require('dotenv').config();

import Telegraf from 'telegraf';
import sendMonthlyActuality from 'modules/sendMonthlyActuality';
import getAndUpdateUser from 'modules/getAndUpdateUser';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(ctx => {
  ctx.replyWithMarkdown(
    `Bienvenue sur GardenManager *${ctx.from.first_name}*, \nvous recevrez un message chaque début de mois avec la liste des plantes qui ont besoins de vos soins.`,
  );
  getAndUpdateUser(ctx.from.username, ctx.from.id);
});

(async () => {
  await sendMonthlyActuality(bot);
})();

bot.launch();
