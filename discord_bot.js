require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

const ALLOWED_ROLE_IDS = ['1385641525341454337', '1385199472094740561'];

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN not set');
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

const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const command = new SlashCommandBuilder()
    .setName('send_input')
    .setDescription('Display modal to submit a code');
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: [command] });
    console.log('Slash command registered');
  } catch (err) {
    console.error('Failed to register slash command:', err);
  }
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
  if (message.content.trim() === '/send-input') {
    const { embed, row } = buildEmbedAndButton();
    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'send_input') {
    const { embed, row } = buildEmbedAndButton();
    await interaction.reply({ embeds: [embed], components: [row] });
  } else if (interaction.isButton() && interaction.customId === 'code_submit') {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This interaction is only available in a server.',
        ephemeral: true,
      });
      return;
    }
    const member = interaction.member;
    const allowed = member.roles.cache.some((role) => ALLOWED_ROLE_IDS.includes(role.id));
    if (!allowed) {
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
    const member = interaction.member;
    const hasSpecialRole = member.roles.cache.some((role) => role.id === '1385199472094740561');
    const codeValue = interaction.fields.getTextInputValue('code_input').trim();
    if (hasSpecialRole && codeValue === '377') {
      const removeRole = interaction.guild.roles.cache.get('1385199472094740561');
      const addRole = interaction.guild.roles.cache.get('1385658290490576988');
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
