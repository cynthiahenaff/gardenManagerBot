import Telegram from 'telegraf/telegram';
import { logHandling } from 'utils';

export default async ({ TelegramID, title, data, type }) => {
  const momId = parseInt(process.env.MOM_ID, 10);
  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

  const message = data
    .map(
      plant =>
        `*${plant.Name}*${
          Boolean(plant[`${type}Advice`]) ? `\n${plant[`${type}Advice`]}` : ''
        }`,
    )
    .join(`\n\n`);

  try {
    if (TelegramID === momId) {
      await logHandling(title, message);
    }
    const finalmessage = `*${title}*\n\n ${message}`;
    telegram.sendMessage(TelegramID, finalmessage, { parse_mode: 'Markdown' });
  } catch (err) {
    console.log('ERROR', err);
  }
};
