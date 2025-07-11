import dotenv from 'dotenv';
import {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';

dotenv.config();

const BLACKLIST_ROLE_ID = '1385663190096154684';
const STAGE1_ROLE_ID = '1385199472094740561';
const STAGE2_ROLE_ID = '1385658290490576988';
const STAGE3_ROLE_ID = '1385658291018797156';

const token = process.env.BOT_TOKEN;
const ownerId = process.env.OWNER_ID;
if (!token) {
  throw new Error('BOT_TOKEN not set');
}
if (!ownerId) {
  throw new Error('OWNER_ID not set');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

function buildEmbedAndButton() {
  const embed = new EmbedBuilder()
    .setTitle('Enter Access Code')
    .setDescription('To continue, click **CODE SUBMIT** below and enter the code we provided.')
    .setColor('Blue')
    .setFooter({ text: "Let's keep moving!" });

  const button = new ButtonBuilder()
    .setCustomId('code_submit')
    .setLabel('CODE SUBMIT')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);
  return { embed, row };
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.trim();
  if (content === '/send-input') {
    const { embed, row } = buildEmbedAndButton();
    await message.channel.send({ embeds: [embed], components: [row] });
  } else if (
    content === '.send input 1' &&
    message.author.id === ownerId
  ) {
    const { embed, row } = buildEmbedAndButton();
    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'code_submit') {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This interaction is only available in a server.',
        ephemeral: true,
      });
      return;
    }
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const blacklisted = member.roles.cache.some((role) => role.id === BLACKLIST_ROLE_ID);
    if (blacklisted) {
      await interaction.reply({
        content: 'You do not have permission to use this button.',
        ephemeral: true,
      });
      return;
    }
    const modal = new ModalBuilder()
      .setCustomId('code_modal')
      .setTitle('Submit Code');

    const input = new TextInputBuilder()
      .setCustomId('code_input')
      .setLabel('Input Code')
      .setStyle(TextInputStyle.Short);

    const modalRow = new ActionRowBuilder().addComponents(input);
    modal.addComponents(modalRow);

    await interaction.showModal(modal);
  } else if (interaction.isModalSubmit() && interaction.customId === 'code_modal') {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const code = interaction.fields.getTextInputValue('code_input').trim().toUpperCase();

    const hasStage1 = member.roles.cache.some((role) => role.id === STAGE1_ROLE_ID);
    const hasStage2 = member.roles.cache.some((role) => role.id === STAGE2_ROLE_ID);

    if (hasStage2) {
      if (code === 'FOREST') {
        const removeRole = interaction.guild.roles.cache.get(STAGE2_ROLE_ID);
        const addRole = interaction.guild.roles.cache.get(STAGE3_ROLE_ID);
        if (removeRole && addRole) {
          await member.roles.remove(removeRole, 'Correct code submitted');
          await member.roles.add(addRole, 'Correct code submitted');
        }
        await interaction.reply({
          content: '✅ Code accepted! Your roles have been updated.',
          ephemeral: true,
        });
      } else if (code === 'FORES') {
        await interaction.reply({
          content: 'Almost! You\u2019re missing something\u2026',
          ephemeral: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await interaction.followUp({
          content: '\u2026and what completes every forest?',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: '❌ Wrong code. Please check and try again!',
          ephemeral: true,
        });
      }
    } else if (hasStage1 && code === '377') {
      const removeRole = interaction.guild.roles.cache.get(STAGE1_ROLE_ID);
      const addRole = interaction.guild.roles.cache.get(STAGE2_ROLE_ID);
      if (removeRole && addRole) {
        await member.roles.remove(removeRole, 'Correct code submitted');
        await member.roles.add(addRole, 'Correct code submitted');
      }
      await interaction.reply({
        content: '✅ Code accepted! Your roles have been updated.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '❌ Wrong code. Please check and try again!',
        ephemeral: true,
      });
    }
  }
});

client.login(token);
