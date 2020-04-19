import { webhook } from 'server';
import { get } from 'lodash';

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
