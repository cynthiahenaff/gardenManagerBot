require('dotenv').config();

import Telegraf from 'telegraf';
import { IncomingWebhook } from '@slack/webhook';
import sendMonthlyActuality from 'modules/sendMonthlyActuality';
import getAndUpdateUser from 'modules/getAndUpdateUser';
import catchImage from 'modules/catchImage';
import catchMessage from 'modules/catchMessage';
import { errorHandling, logHandling } from 'utils';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

//Catch uncaught exceptions
process.on('uncaughtException', function (err) {
  // handle the error safely
  (async () => errorHandling(err))();
});

(async () => {
  bot.start(ctx => {
    ctx.replyWithMarkdown(
      `Bienvenue sur GardenManager *${ctx.from.first_name}*`,
    );
    getAndUpdateUser(ctx.from.username, ctx.from.id);
  });

  await sendMonthlyActuality(bot);

  catchImage(bot);
  catchMessage(bot);

  bot.startPolling(30, 100, null, async () => {
    await errorHandling('Garden Manager : startPolling stopped');
    // if error with telegram, exit after 10 seconds
    setTimeout(() => {
      process.exit(1);
    }, 10 * 1000);
  });
  logHandling('Garden Manager is ready…');
})();

bot.launch();
