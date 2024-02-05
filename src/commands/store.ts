import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function store (interaction:CommandInteraction) {
  // @ts-expect-error
  const assetID = interaction.options.getInteger('id')

  if (assetID.length === 0) {
    return await interaction.reply('Por favor, preciso de um ID para pesquisar este item.')
  }

  await interaction.deferReply()

  const response = await axios.get(`https://api.polytoria.com/v1/store/${assetID}`, {
    validateStatus: () => true
  })
  const data = response.data
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    if (errResult.statusCode === 404) {
      return await interaction.editReply("Não achei esse item, tem certeza que este ID está certo?")
    } else {
      return await interaction.editReply(errResult.displayText)
    }
  }

  let thumbnailURL = data.thumbnail

  if (data.type.toLowerCase() === 'audio') {
    thumbnailURL = 'https://c0.ptacdn.com/static/images/placeholders/audio.88cff071.png'
  }

  const creatorLink = creator.type === 'user'
    ? `https://polytoria.com/users/${creator.id}`
    : `https://polytoria.com/guilds/${creator.id}`

  const embed = new EmbedBuilder({
    title: data.name + ' ' + (data.isLimited === true ? emojiUtils.star : ''),
    description: data.description === '' ? 'Sem descrição.' : data.description,
    url: `https://polytoria.com/store/${data.id}`,
    thumbnail: {
      url: thumbnailURL
    },
    color: 0xFF5454,
    fields: [
      {
        name: 'Creator',
        value: `[${creator.name}](${creatorLink})`,
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      }
    ]
  })

  const assetType = data.type.toLowerCase()
  if (!['audio', 'decal', 'mesh'].includes(assetType)) {
    if (data.tags && data.tags.length > 0 && data.tags[0] !== '') {
      embed.setDescription(data.description === '' ? 'Sem descrição.' : data.description + '\n\n**Tags:** ' + (data.tags as string[]).map(tag => `\`${tag}\``).join(', '))
    } else {
      embed.setDescription(data.description === '' ? 'Sem descrição.' : data.description)
    }

    embed.addFields(
      {
        name: 'Price',
        value: emojiUtils.brick + ' ' + data.price.toString(),
        inline: true
      },
      {
        name: 'Sales',
        value: data.sales.toString(),
        inline: true
      }
    )
  }

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/store/${data.id}`)
        .setLabel('Veja no Polytoria')
        .setStyle(ButtonStyle.Link)
    )

  await interaction.editReply({
    embeds: [embed],
    components: [actionRow]
  })
}
