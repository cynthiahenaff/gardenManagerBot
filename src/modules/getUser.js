import Airtable from 'airtable';

export default async username => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const users = await base('Users')
    .select({
      maxRecords: 12,
    })
    .firstPage();

  const user = users.find(({ fields }) => fields?.Username === username);
  return user;
};
