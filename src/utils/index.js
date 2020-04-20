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

export const currentDay = parseInt(
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(new Date()),
  10,
);

export const currentHour = parseInt(
  new Intl.DateTimeFormat('fr-FR', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Europe/Paris',
  }).format(new Date()),
  10,
);

export const currentMonth = parseInt(
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
  'aout',
  'septembre',
  'octobre',
  'novembre',
  'decembre',
];

export const getMonthKeyboard = query => [
  months
    .slice(0, 4)
    .map(month =>
      Markup.callbackButton(
        capitalize(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
  months
    .slice(4, 8)
    .map(month =>
      Markup.callbackButton(
        capitalize(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
  months
    .slice(8, 12)
    .map(month =>
      Markup.callbackButton(
        capitalize(month),
        `${query}-${months.indexOf(month) + 1}`,
      ),
    ),
];
