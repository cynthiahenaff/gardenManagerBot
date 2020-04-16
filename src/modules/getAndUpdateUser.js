require('dotenv').config();

import Airtable from 'airtable';

const getAndUpdateUser = async (username, telegramId) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const users = await base('Users')
    .select({
      maxRecords: 12,
    })
    .firstPage();

  const user = users.find(({ fields }) => fields?.Username === username);

  try {
    await base('Users').update(user.id, {
      ...user.fields,
      TelegramID: telegramId,
    });
  } catch (err) {
    console.log(err);
  }
};

export default getAndUpdateUser;
