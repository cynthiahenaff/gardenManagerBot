import Airtable from 'airtable';
import getUser from './getUser';

export default async (username, telegramId) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const user = await getUser(username);

  try {
    await base('Users').update(user.id, {
      ...user.fields,
      TelegramID: telegramId,
    });
  } catch (err) {
    console.log(err);
  }
};
