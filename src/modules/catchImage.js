const gifs = [
  'https://media.giphy.com/media/5gXYzsVBmjIsw/giphy.gif',
  'https://media.giphy.com/media/2SYc7mttUnWWaqvWz8/giphy.gif',
  'https://media.giphy.com/media/1WbNfh5a4mN7mLm0cP/giphy.gif',
  'https://media.giphy.com/media/ey7aT0Fm64ecw/giphy.gif',
  'https://media.giphy.com/media/yOmNQsQQcRJfi/giphy.gif',
  'https://media.giphy.com/media/4qw6Eeo8JIq8U/giphy.gif',
];

const messages = [
  'Cool! 👍',
  'J‘adore ❤️',
  'Génial',
  'Bravo',
  'Tu es un génie',
  '❤️',
  '👍',
  '🤔',
  '🤷‍♀️',
];

const getRandomResponse = () => {
  const randomGifIndex = Math.floor(Math.random() * Math.floor(gifs.length));
  const randomMessageIndex = Math.floor(
    Math.random() * Math.floor(messages.length),
  );
  return { message: messages[randomMessageIndex], gif: gifs[randomGifIndex] };
};

export default bot => {
  const { message, gif } = getRandomResponse();
  bot.on(['sticker', 'photo'], ctx => {
    ctx.reply(message);
    ctx.replyWithDocument({
      url: gif,
      filename: 'gif.gif',
    });
  });
};
