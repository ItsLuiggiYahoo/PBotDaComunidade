import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, BaseInteraction, StringSelectMenuOptionBuilder, CommandInteraction } from 'discord.js'

// Import Random Files
import { randomPlace } from './random/randomPlace.js'
import { randomUser } from './random/randomUser.js'
import { randomGuild } from './random/randomGuild.js'
import { randomStore } from './random/randomStore.js'

export async function random (interaction:CommandInteraction) {
  let InitialType: any = null

  const embed = new EmbedBuilder()
    .setTitle('Randomizer!')
    .setColor(0xFF5454)
    .setDescription('Bem vindo ao randomizer! Selecione uma das funcionalidades abaixo e te daremos uma coisa aleatória daquele assunto em especifico.')

  const placeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🎮 Places')
    .setDescription('Place aleatória no Polytoria')
    .setValue('place')

  const userOption = new StringSelectMenuOptionBuilder()
    .setLabel('🗣️ Usuário')
    .setDescription('Usuário aleatório no Polytoria')
    .setValue('user')

  const guildOption = new StringSelectMenuOptionBuilder()
    .setLabel('🫂 Guilds')
    .setDescription('Guild aleatório no Polytoria')
    .setValue('guild')

  const storeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🏪 Loja')
    .setDescription('Item aleatório na loja')
    .setValue('store')

  const selectMenu = new StringSelectMenuBuilder()
    .setPlaceholder('Qual coisa?')
    .setCustomId('select')
    .addOptions(
      placeOption,
      userOption,
      guildOption,
      storeOption
    )

  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      selectMenu
    )

  const reply = await interaction.reply({
    embeds: [embed],
    components: [actionRow]
  })

  const selectCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (selectInteraction: BaseInteraction) => (
      selectInteraction.isStringSelectMenu() && selectInteraction.user.id === interaction.user.id
    ),
    time: 60000
  })

  selectCollector.on('collect', async (selectInteraction) => {
    if (selectInteraction.customId === 'select') {
      InitialType = selectInteraction.values[0] // Update InitialType here
      await selectInteraction.deferUpdate()
      update(InitialType, reply)
    }
  })

  const buttonCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (buttonInteraction: BaseInteraction) => (
      buttonInteraction.isButton() && buttonInteraction.user.id === interaction.user.id && buttonInteraction.customId === 'redo_button'
    ),
    time: 60000
  })

  buttonCollector.on('collect', async (buttonInteraction) => {
    if (InitialType !== null) {
      update(InitialType, reply)
      await buttonInteraction.deferUpdate()
    }
  })

  async function update (id: string, reply: any) {
    let Response: any = null
    switch (id) {
      case 'place':
        Response = await randomPlace(interaction)
        break
      case 'user':
        Response = await randomUser(interaction)
        break
      case 'guild':
        Response = await randomGuild(interaction)
        break
      case 'store':
        Response = await randomStore(interaction)
        break
    }

    if (Response !== null) {
      await reply.edit(Response)
    }
  }
}
