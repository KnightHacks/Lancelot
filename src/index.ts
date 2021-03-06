import path from 'path';
import dotenv from 'dotenv';
import { Client } from '@knighthacks/scythe';
import { countingFilter } from './countingFilter';
import { onWelcome } from './welcomer';
import * as Sentry from '@sentry/node';
import { setupSentry } from './sentry';
import { Message, PresenceData } from 'discord.js';
import * as random from './util/random';
import replies from './replies.json';
import setupProcess from './problemSchedule';
import { checkForLicense } from './licenseChecker';

// Load env vars.
dotenv.config();

// Setup Sentry
setupSentry();

(async function main() {
  const presence: PresenceData = {
    activities: [
      {
        name: 'Slash Commands',
        type: 'WATCHING',
      },
    ],
  };

  // Create client.
  const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'],
    partials: ['MESSAGE'],
    presence,
  });

  if (!process.env.GUILD_ID) {
    throw new Error('GUILD_ID is not set in your env file!');
  }

  // Start up client.
  await client.login(process.env.DISCORD_TOKEN);

  // Load commands in.
  client.setGuildID(process.env.GUILD_ID);
  await client.registerCommands(path.join(__dirname, 'commands'));
  client.registerAutocompleteHandlers(path.join(__dirname, 'autocomplete'));

  client.registerMessageFilters([countingFilter]);

  client.on('messageCreate', async (message) => {
    if (client.isReady()) {
      const everyone = message.guild?.roles.everyone.id;
      if (!everyone) {
        return;
      }

      if (message.mentions.has(everyone)) {
        return;
      }

      if (message.mentions.has(client.user)) {
        await message.reply(random.choice(replies) ?? 'Something went wrong!');
      }
    }
  });

  const isThisBotAuthor = (message: Message): boolean => {
    return message.author.id === client.user?.id;
  };

  // license checker
  client.on('messageCreate', (message) => {
    if (!isThisBotAuthor(message)) {
      checkForLicense(message);
    }
  });

  // New user handler
  client.on('guildMemberAdd', async (member) =>
    onWelcome(client.eventHandler.registerUI, member)
  );

  // Handle command errors.
  client.onError = (_, error) => {
    console.error(error);
    const transaction = Sentry.startTransaction({
      op: 'Command Running',
      name: 'Command Execution',
    });

    Sentry.captureException(error);
    transaction.finish();
  };

  await setupProcess(client);
  console.log('Lancelot is now running.');
})();
