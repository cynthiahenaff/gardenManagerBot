import getUserPlantsData from './getUserPlantsData';
import getUsers from './getUsers';
import updateLastNotificationDate from './updateLastNotificationDate';
import sendUserNotification from './sendUserNotification';
import { getCurrentDay, getCurrentHour } from 'utils';

export default () => {
  const sendMonthlyActuality = async () => {
    const currentHour = getCurrentHour();
    const currentDay = getCurrentDay();
    console.log({ currentDay, currentHour });
    if (currentDay !== 21 || currentHour !== 10) {
      console.log('return');
      return;
    }

    try {
      const { users } = await getUsers();
      users.map(async ({ TelegramID, id, Notifications }) => {
        const {
          userPrunings,
          userHarvests,
          userPlantations,
          userWinters,
        } = await getUserPlantsData(id);

        if (
          Notifications.indexOf('Pruning') !== -1 &&
          userPrunings.length > 0
        ) {
          sendUserNotification({
            TelegramID,
            title: `👩‍🌾 ${userPrunings.length} plante${
              userPrunings.length > 1 ? 's' : ''
            } à tailler ce mois ci:`,
            data: userPrunings,
            type: 'Pruning',
          });
        }

        if (
          Notifications.indexOf('Harvest') !== -1 &&
          userHarvests.length > 0
        ) {
          sendUserNotification({
            TelegramID,
            title: `🌻 ${userHarvests.length} plante${
              userHarvests.length > 1 ? 's' : ''
            } à récolter ce mois ci:`,
            data: userHarvests,
            type: 'Harvest',
          });
        }

        if (
          Notifications.indexOf('Plantation') !== -1 &&
          userPlantations.length > 0
        ) {
          sendUserNotification({
            TelegramID,
            title: `🌱 ${userPlantations.length} plante${
              userPlantations.length > 1 ? 's' : ''
            } à planter ce mois ci:`,
            data: userPlantations,
            type: 'Plantation',
          });
        }

        if (Notifications.indexOf('Winter') !== -1 && userWinters.length > 0) {
          sendUserNotification({
            TelegramID,
            title: `❄️ ${userWinters.length} plante${
              userWinters.length > 1 ? 's' : ''
            } ont besoin de soin pour affronter l'hiver:`,
            data: userWinters,
            type: 'Winter',
          });
        }
        updateLastNotificationDate(id);
      });
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  setInterval(sendMonthlyActuality, 1800 * 1000);
};
