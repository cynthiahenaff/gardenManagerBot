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
