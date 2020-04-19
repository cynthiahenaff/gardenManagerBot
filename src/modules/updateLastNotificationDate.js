import Airtable from 'airtable';

const updateLastNotificationDate = async id => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const users = await base('Users')
    .select({
      maxRecords: 12,
    })
    .firstPage();

  const user = users.find(user => user.id === id);

  try {
    await base('Users').update(user.id, {
      ...user.fields,
      LastNotification: new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export default updateLastNotificationDate;
