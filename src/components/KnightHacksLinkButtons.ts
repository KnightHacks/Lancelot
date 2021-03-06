import { MessageButton, MessageActionRow } from 'discord.js';

type LinkButtonData = { link: string; label: string };
const links: LinkButtonData[] = [
  { link: 'https://www.knighthacks.org/', label: 'Website' },
  { link: 'https://www.knighthacks.org/membership', label: 'Membership Form' },
  { link: 'https://www.knighthacks.org/linktree', label: 'Link Tree' },
  { link: 'https://www.knighthacks.org/dues', label: 'Pay Dues' },
  { link: 'https://www.knighthacks.org/ops', label: 'Operations Meetings' },
];

const buttons: MessageButton[] = links.map((data) => {
  return new MessageButton()
    .setLabel(data.label)
    .setStyle('LINK')
    .setURL(data.link);
});

const row = new MessageActionRow().addComponents(buttons);

export { row as KnightHacksLinkButtons };
