import { Command } from '@knighthacks/scythe';
import { KnightHacksMajorsMenu } from '../../components/KnightHacksRolesMenu';

const MajorsCommand: Command = {
  name: 'majors',
  description: 'Manage the your majors for this server.',
  options: [
    {
      name: 'add',
      description: 'Add majors to your account',
      type: 'SUB_COMMAND',
    },
    {
      name: 'remove',
      description: 'Remove majors from your account',
      type: 'SUB_COMMAND',
    },
  ],
  async run({ interaction, registerUI }) {
    const action = interaction.options.getSubcommand() as 'add' | 'remove';
    const ui = KnightHacksMajorsMenu(action);
    await interaction.reply({
      content: `Pick Majors to ${action}`,
      components: registerUI(ui),
      ephemeral: true,
    });
  },
};

export default MajorsCommand;
