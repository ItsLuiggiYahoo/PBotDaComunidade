import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomStore (interaction: CommandInteraction): Promise<any> {
  const randomId = randomUtils.randomInt(7674, 30361)
  const apiUrl = `https://api.polytoria.com/v1/store/${randomId}`

  const randomData = await randomUtils.randomize(
    apiUrl,
    function (response: any) {
      return response.data
    },
    function () {
      return { id: randomId }
    },
    20
  )

  if (randomData == null) {
    return await randomStore(interaction)
  }

  const data = randomData.data
  const creator = data.creator

  let thumbnailURL = data.thumbnail

  // Check if the asset type is "audio" and set a specific link as the thumbnail
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
        name: 'Criador',
        value: `[${creator.name}](${creatorLink})`,
        inline: true
      },
      {
        name: 'Criado em',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      }
    ]
  })

  const assetType = data.type.toLowerCase()
  if (!['audio', 'decal', 'mesh'].includes(assetType)) {
    if (data.tags && data.tags.length > 0 && data.tags[0] !== '') {
      embed.setDescription(data.description === '' ? 'Sem descrição' : data.description + '\n\n**Tags:** ' + (data.tags as string[]).map(tag => `\`${tag}\``).join(', '))
    } else {
      embed.setDescription(data.description === '' ? 'Sem descrição' : data.description)
    }
    embed.addFields(
      {
        name: 'Preço',
        value: emojiUtils.brick + ' ' + data.price.toString(),
        inline: true
      },
      {
        name: 'Vendas',
        value: data.sales.toString(),
        inline: true
      }
    )
  }

  const redoButton = new ButtonBuilder()
    .setLabel('Re-randomizar')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('redo_button')

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/store/${data.id}`)
        .setLabel('Veja no Polytoria')
        .setStyle(ButtonStyle.Link),
      redoButton
    )

  return {
    embeds: [embed],
    components: [actionRow]
  }
}
