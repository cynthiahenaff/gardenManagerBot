import getUserPlantsData from './getUserPlantsData';
import getUsers from './getUsers';
import updateLastNotificationDate from './updateLastNotificationDate';
import sendUserNotification from './sendUserNotification';
import { currentDay, currentHour } from 'utils';

export default () => {
  const sendMonthlyActuality = async () => {
    if (currentDay !== 20 || currentHour !== 9) {
      return;
    }

    try {
      const { users } = await getUsers();
      users.map(async ({ TelegramID, id, Notifications }) => {
        const {
          userPrunings,
          userHarvests,
          userPlantations,
        } = await getUserPlantsData(id);

        if (
          Notifications.indexOf('Pruning') !== -1 &&
          userPrunings.length > 0
        ) {
          const message = userPrunings
            .map(({ Name, PruningAdvice }) => `*${Name}* \n${PruningAdvice}`)
            .join(`\n\n`);

          sendUserNotification({
            TelegramID,
            title: `${userPrunings.length} plante${
              userPrunings.length > 1 ? 's' : ''
            } à tailler ce mois ci:`,
            message,
          });
        }

        if (
          Notifications.indexOf('Harvest') !== -1 &&
          userHarvests.length > 0
        ) {
          const message = userHarvests
            .map(({ Name, HarvestAdvice }) => `*${Name}* \n${HarvestAdvice}`)
            .join(`\n\n`);

          sendUserNotification({
            TelegramID,
            title: `${userHarvests.length} plante${
              userHarvests.length > 1 ? 's' : ''
            } à récolter ce mois ci:`,
            message,
          });
        }

        if (
          Notifications.indexOf('Plantation') !== -1 &&
          userPlantations.length > 0
        ) {
          const message = userPlantations
            .map(
              ({ Name, PlantationAdvice }) => `*${Name}* \n${PlantationAdvice}`,
            )
            .join(`\n\n`);

          sendUserNotification({
            TelegramID,
            title: `${userPlantations.length} plante${
              userPlantations.length > 1 ? 's' : ''
            } à planter ce mois ci:`,
            message,
          });
        }
        updateLastNotificationDate(id);
      });
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  setInterval(sendMonthlyActuality, 3600 * 1000);
};
