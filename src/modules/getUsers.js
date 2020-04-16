require('dotenv').config();

import Airtable from 'airtable';

const getUsers = async () => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const users = await base('Users')
    .select({
      maxRecords: 12,
      fields: ['Name', 'Username', 'TelegramID', 'Shrub'],
    })
    .firstPage();

  return {
    users: users.map(({ id, fields }) => ({ ...fields, id })),
  };
};

export default getUsers;
