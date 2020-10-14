import Airtable from 'airtable';
import { get } from 'lodash';
import { getCurrentMonth } from 'utils';

const getUserPlantsData = async id => {
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

  const currentMonth = getCurrentMonth();

  const currentMonthRecord = monthRecords.find(
    ({ fields }) => fields?.Name === `${currentMonth}`,
  );

  const plantationIds = get(currentMonthRecord, 'fields.Plantation', []);

  const plantationRecords = await Promise.all(
    plantationIds.map(id => getPlant(id)),
  );

  const userPlantations = plantationRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  const pruningIds = get(currentMonthRecord, 'fields.Pruning', []);

  const pruningRecords = await Promise.all(pruningIds.map(id => getPlant(id)));

  const userPrunings = pruningRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  const harvestIds = get(currentMonthRecord, 'fields.Harvest', []);

  const harvestRecords = await Promise.all(harvestIds.map(id => getPlant(id)));

  const userHarvests = harvestRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  const winterIds = get(currentMonthRecord, 'fields.Winter', []);

  const winterRecords = await Promise.all(winterIds.map(id => getPlant(id)));

  const userWinters = winterRecords.filter(
    ({ Owner }) => Owner && Owner.indexOf(id) !== -1,
  );

  return {
    userPlantations,
    userPrunings,
    userHarvests,
    userWinters,
  };
};

export default getUserPlantsData;
