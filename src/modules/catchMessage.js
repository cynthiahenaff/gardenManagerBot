import { Markup } from 'telegraf';
import { getMonthKeyboard } from 'utils';
import getQueryData from './getQueryData';
import getUser from './getUser';

export default bot => {
  try {
    bot.on('message', ctx => {
      ctx.replyWithMarkdown(
        'Salut, quel sujet t’intéresse ? ',
        Markup.inlineKeyboard([
          [
            Markup.callbackButton('Plantation', 'Plantation'),
            Markup.callbackButton('Taille', 'Pruning'),
            Markup.callbackButton('Récolte', 'Harvest'),
          ],
          [Markup.callbackButton('Se préparer pour l’hiver', 'Winter')],
        ]).extra(),
      );
    });

    bot.action(['Plantation', 'Pruning', 'Harvest', 'Winter'], ctx => {
      const query = ctx?.update?.callback_query?.data;
      ctx.replyWithMarkdown(
        'Pour quel mois de l’année ?',
        Markup.inlineKeyboard(getMonthKeyboard(query)).extra(),
      );
    });

    bot.action(/.*-.*/, async ctx => {
      const user = await getUser(ctx.from.username);
      const query = ctx?.update?.callback_query?.data;
      const [type, month] = query.split('-');
      const plants = await getQueryData(user.id, type, month);
      const message =
        plants.length > 1
          ? plants
              .map(plant => `*${plant.Name}* \n${plant[`${type}Advice`]}`)
              .join(`\n\n`)
          : 'Rien à faire pour ce mois ci :)';

      ctx.replyWithMarkdown(message);
    });
  } catch (err) {
    console.dir(err);
  }
};
