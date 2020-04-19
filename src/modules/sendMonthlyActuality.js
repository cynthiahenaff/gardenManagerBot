import getAirtableData from './getAirtableData';
import getUsers from './getUsers';
import Telegram from 'telegraf/telegram';
import { logHandling, currentDay, currentHour } from 'utils';

export default () => {
  const momId = parseInt(process.env.MOM_ID, 10);
  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

  const sendMonthlyActuality = async () => {
    if (currentDay !== 20 || currentHour !== 17) {
      return;
    }

    try {
      const { users } = await getUsers();
      users.map(async ({ TelegramID, id }) => {
        const { userPrunings, userHarvests } = await getAirtableData(id);

        if (userPrunings.length > 0) {
          const message = userPrunings
            .map(({ Name, PruningAdvice }) => `*${Name}* \n${PruningAdvice}`)
            .join(`\n\n`);

          if (TelegramID === momId) {
            await logHandling(
              'Voici les plantes qui ont besoin d‘être taillées pour ce mois ci',
              message,
            );
          }

          telegram.sendMessage(
            TelegramID,
            'Voici les plantes qui ont besoin d‘être taillées pour ce mois ci',
          );
          telegram.sendMessage(TelegramID, message, { parse_mode: 'Markdown' });
        }

        if (userHarvests.length > 0) {
          const message = userHarvests
            .map(({ Name, HarvestAdvice }) => `*${Name}* \n${HarvestAdvice}`)
            .join(`\n\n`);

          if (TelegramID === momId) {
            await logHandling('Voici les récoltes du mois', message);
          }

          telegram.sendMessage(TelegramID, 'Voici les récoltes du mois');
          telegram.sendMessage(TelegramID, message, { parse_mode: 'Markdown' });
        }
      });
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  setInterval(sendMonthlyActuality, 3600 * 1000);
};
