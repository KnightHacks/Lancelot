import { Command } from '@knighthacks/scythe';
import { ApplicationCommandOptionData } from 'discord.js';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'question',
    type: 'STRING',
    description: 'Generates a random response to a question',
    required: true,
  },
];

const responses = [
  'The stars will most definitely grant your wish!',
  'The stars in the milky way are blinking in a decidedly good fashion!',
  '01111001 01100101 01110011',
  'You may rely on it.',
  'Concentrate and ask again!',
  'Beep boop, cannot predict now.',
  'My hacking sources say not likely!',
  '01101110 01101111',
  'Outlook not so good!',
  "Don't count on it.",
];

const eightball: Command = {
  name: 'eightball',
  description: 'Ask a question, and you shall recieve an answer',
  options,
  async run({ interaction }) {
    const randIndex = Math.floor(Math.random() * responses.length);
    await interaction.reply(responses[randIndex] ?? '');
  },
};

export default eightball;
