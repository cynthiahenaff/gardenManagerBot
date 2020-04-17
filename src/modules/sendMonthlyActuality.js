import { format, getHours } from 'date-fns';
import getAirtableData from './getAirtableData';
import getUsers from './getUsers';
import Telegram from 'telegraf/telegram';
import { logHandling } from 'utils';

export default () => {
  const momId = parseInt(process.env.MOM_ID);
  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

  const sendMonthlyActuality = async () => {
    const day = format(new Date(), 'd');
    const hour = getHours(new Date());

    if (day !== 17 && hour !== 14) {
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
              'Voici les plantes qui ont besoin d‘être taillée pour ce mois ci',
              message,
            );
          }

          telegram.sendMessage(
            TelegramID,
            'Voici les plantes qui ont besoin d‘être taillée pour ce mois ci',
          );
          telegram.sendMessage(TelegramID, message, { parse_mode: 'Markdown' });
        }

        if (userHarvests.length > 0) {
          const message = userHarvests
            .map(({ Name, HarvestAdvice }) => `*${Name}* \n${HarvestAdvice}`)
            .join(`\n\n`);

          if (TelegramID === momId) {
            await logHandling('Voici les recoltes du mois', message);
          }

          telegram.sendMessage(TelegramID, 'Voici les recoltes du mois');
          telegram.sendMessage(TelegramID, message, { parse_mode: 'Markdown' });
        }
      });
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  setInterval(sendMonthlyActuality, 3600 * 1000);
};
