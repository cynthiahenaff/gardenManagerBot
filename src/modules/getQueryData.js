import Airtable from 'airtable';
import { get } from 'lodash';

const getQueryData = async (userId, type, month) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const getPlant = async id => {
    const response = await base('Plant').find(id);
    return response?.fields;
  };

  const monthRecords = await base('Planning')
    .select({
      maxRecords: 12,
      fields: ['Name', 'Plantation', 'Pruning', 'Harvest', 'Winter'],
    })
    .firstPage();

  const currentMonthRecord = monthRecords.find(
    ({ fields }) => fields?.Name === month,
  );

  const plantIds = get(currentMonthRecord, `fields[${type}]`, []);

  const plantsRecords = await Promise.all(plantIds.map(id => getPlant(id)));

  const plants = plantsRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(userId) !== -1,
  );

  return plants;
};

export default getQueryData;
