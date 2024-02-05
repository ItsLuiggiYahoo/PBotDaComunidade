import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomPlace (interaction: CommandInteraction): Promise<any> {
  const randomId = randomUtils.randomInt(1, 7940)
  const apiUrl = `https://api.polytoria.com/v1/places/${randomId}`

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

  if (!randomData || !randomData.data) {
    return await randomPlace(interaction)
  }

  const data = randomData.data
  const rating = data.rating
  const creator = data.creator

  let externalDesc = ''

  if (data.isActive === false) {
    externalDesc += `${emojiUtils.private} **This place is currently private. Only the creator can join it.**\n`
  }

  externalDesc += '\n'

  if (data.description === '') {
    externalDesc += '*No description set.*'
  } else {
    externalDesc += data.description
  }

  let accessMessage = ''

  switch (data.accessType) {
    case 'everyone':
      accessMessage = `${emojiUtils.public} **Todos porem entrar!**`
      break
    case 'purchase': {
      const accessPrice = data.accessPrice || 0
      accessMessage = `${emojiUtils.brick} **Requer pagamento de ${accessPrice.toLocaleString()} bricks.**`
      break
    }
    case 'whitelist':
      accessMessage = `${emojiUtils.request} **É Whitelisted(apenas membros de uma lista)**`
      break
    default:
      break
  }

  const embed = new EmbedBuilder({
    title: data.name + (data.isFeatured === true ? emojiUtils.star : ''),
    description: `${accessMessage}\n${externalDesc}`,
    thumbnail: {
      url: `${data.thumbnail}`
    },
    url: `https://polytoria.com/places/${data.id}`,
    color: 0xFF5454,
    fields: [
      {
        name: 'Criador',
        value: `[${creator.name}](https://polytoria.com/users/${creator.id})`,
        inline: true
      },
      {
        name: 'Visitas',
        value: data.visits.toLocaleString(),
        inline: true
      },
      {
        name: 'Likes',
        value: rating.likes.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Dislikes',
        value: rating.dislikes.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Genêro',
        value: data.genre.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Maximo de jogadores',
        value: data.maxPlayers.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Jogando',
        value: data.playing.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Criado em',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      },
      {
        name: 'Atualizado em',
        value: dateUtils.atomTimeToDisplayTime(data.updatedAt),
        inline: true
      }
    ]
  })

  const redoButton = new ButtonBuilder()
    .setLabel('Re-do Randomize')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('redo_button')

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/places/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle(ButtonStyle.Link),
      redoButton
    )

  return {
    embeds: [embed],
    components: [actionRow]
  }
}
