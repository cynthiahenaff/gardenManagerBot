require('dotenv').config();

import Airtable from 'airtable';
import { format } from 'date-fns';
import { get } from 'lodash';

const getAirtableData = async id => {
  const actualMonth = format(new Date(), 'M');

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID);

  const getPlant = async id => {
    const response = await base('Shrub').find(id);
    return response?.fields;
  };

  const monthRecords = await base('Planning')
    .select({
      maxRecords: 12,
      fields: ['Name', 'Pruning', 'Harvest'],
    })
    .firstPage();

  const actualMonthRecord = monthRecords.find(
    ({ fields }) => fields?.Name === actualMonth,
  );

  const pruningIds = get(actualMonthRecord, 'fields.Pruning', []);

  const pruningRecords = await Promise.all(pruningIds.map(id => getPlant(id)));

  const userPrunings = pruningRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  const harvestIds = get(actualMonthRecord, 'fields.Harvest', []);

  const harvestRecords = await Promise.all(harvestIds.map(id => getPlant(id)));

  const userHarvests = harvestRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  return {
    userPrunings,
    userHarvests,
  };
};

export default getAirtableData;
