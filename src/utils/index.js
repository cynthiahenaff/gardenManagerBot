import { webhook } from 'server';
import { get, capitalize } from 'lodash';
import { Markup } from 'telegraf';

export const errorHandling = error => {
  console.error(error);
  webhook.send({
    attachments: [
      {
        color: '#CC0000',
        title: get(error, 'status.error_message')
          ? `⚠️ ERROR - ${get(error, 'status.error_message')}`
          : '⚠️ UNKNOWN ERROR',
        text: JSON.stringify(error, null, 2),
      },
    ],
  });
};

export const logHandling = (title, message) => {
  webhook.send({
    attachments: [
      {
        color: '#008D00',
        title: title,
        text: message && `\`\`\`\n${message}\n\`\`\``,
        mrkdwn_in: ['text'],
      },
    ],
  });
};

export const getCurrentDay = () =>
  parseInt(
    new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      timeZone: 'Europe/Paris',
    }).format(new Date()),
    10,
  );

export const getCurrentHour = () =>
  parseInt(
    new Intl.DateTimeFormat('fr-FR', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/Paris',
    }).format(new Date()),
    10,
  );

export const getCurrentMonth = () =>
  parseInt(
    new Intl.DateTimeFormat('fr-FR', {
      month: 'numeric',
      timeZone: 'Europe/Paris',
    }).format(new Date()),
    10,
  );

const months = [
  'janvier',
  'fevrier',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export const getLabelByTypeAndMonth = (type, month) => {
  switch (type) {
    case 'Pruning':
      return `👩‍🌾 Tailles pour le mois de ${months[Number(month) + 1]}`;
    case 'Harvest':
      return `🌻 Récolte pour le mois de ${months[Number(month) + 1]}`;
    case '❄️ Winter':
      return `Préparation pour l'hiver pour le mois de ${
        months[Number(month) + 1]
      }`;
    case 'Plantation':
      return `🌱 Plantation pour le mois de ${months[Number(month) + 1]}`;
    default:
      return '';
  }
};

const getMonthName = month =>
  `${currentMonth === months.indexOf(month) + 1 ? '🗓 ' : ''}${capitalize(
    month,
  )}`;

export const getMonthKeyboard = query => [
  months
    .slice(0, 4)
    .map(month =>
      Markup.callbackButton(
        getMonthName(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
  months
    .slice(4, 8)
    .map(month =>
      Markup.callbackButton(
        getMonthName(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
  months
    .slice(8, 12)
    .map(month =>
      Markup.callbackButton(
        getMonthName(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
];
