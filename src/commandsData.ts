import { lookUp, card, level, inventory } from './commands/user.js'
import { cookie } from './commands/cookie.js'
import { guild } from './commands/guild/guilds.js'
import { info } from './commands/info.js'
import { status } from './commands/status.js'
import { store } from './commands/store.js'
import { random } from './commands/random.js'
import { place } from './commands/place.js'
import { SlashCommandBuilder } from 'discord.js'
import { search } from './commands/search/search.js'

export default [
  {
    data: new SlashCommandBuilder()
      .setName('cookie')
      .setDescription('🍪'),
    execute: cookie
  },
  {
    data: new SlashCommandBuilder()
      .setName('status')
      .setDescription('Checa se Polytoria está online ou offline'),
    execute: status
  },
  {
    data: new SlashCommandBuilder()
      .setName('loja')
      .setDescription('Dados sobre itens na loja do Polytoria.')
      .addIntegerOption(option =>
        option.setName('id')
          .setDescription('ID do item da loja.')
          .setMinValue(1)
          .setRequired(true)
      ),
    execute: store
  },
  {
    data: new SlashCommandBuilder()
      .setName('lugar')
      .setDescription('Veja informações sobre places no Polytoria.')
      .addIntegerOption(option =>
        option.setName('id')
          .setDescription('ID da place.')
          .setMinValue(1)
          .setRequired(true)
      ),
    execute: place
  },
  {
    data: new SlashCommandBuilder()
      .setName('guild')
      .setDescription('Veja informações sobre guilds no Polytoria')
      .addIntegerOption(option =>
        option.setName('id')
          .setDescription('ID do guild')
          .setMinValue(1)
          .setRequired(true)
      ),
    execute: guild
  },
  {
    data: new SlashCommandBuilder()
      .setName('cartao')
      .setDescription('Veja informações sobre um usuário')
      .addStringOption(option =>
        option.setName('username')
          .setDescription("Nome do usuário para consultar informações")
          .setRequired(true)
      ),
    execute: card
  },
  {
    data: new SlashCommandBuilder()
      .setName('pesquisar')
      .setDescription('Pesquisar informações sobre um usuário')
      .addStringOption(option =>
        option.setName('username')
          .setDescription("Nome do usuário que você quer pesquisar")
          .setRequired(true)
      ),
    execute: lookUp
  },
  {
    data: new SlashCommandBuilder()
      .setName('inventário')
      .setDescription('Veja o inventário de algum usuário')
      .addStringOption(option =>
        option.setName('username')
          .setDescription("Nome do usuário que você quer pesquisar")
          .setRequired(true)
      ),
    execute: inventory
  },
  {
    data: new SlashCommandBuilder()
      .setName('nivel')
      .setDescription('Veja o nivel de algum usuário')
      .addStringOption(option =>
        option.setName('username')
          .setDescription("Nome do usuário que você quer pesquisar")
          .setRequired(true)
      ),
    execute: level
  },
  {
    data: new SlashCommandBuilder()
      .setName('pesquisar')
      .setDescription('Pesquisar no Polytoria')
      .addSubcommand(subCommand =>
        subCommand.setName('places')
          .setDescription('Pesquisar por places')
          .addStringOption(option => option.setName('query').setDescription('The search query'))
      )
      .addSubcommand(subCommand =>
        subCommand.setName('loja')
          .setDescription('Pesquisar na loja do Polytoria')
          .addStringOption(option => option.setName('query').setDescription('The search query'))
      )
      .addSubcommand(subCommand =>
        subCommand.setName('toolbox')
          .setDescription('Pesquisar no toolbox')
          .addStringOption(option => option.setName('query').setDescription('The search query'))
      )
      .addSubcommand(subCommand =>
        subCommand.setName('usuario')
          .setDescription('pesquisar por usuários')
          .addStringOption(option => option.setName('query').setDescription('The search query'))
      ),
    execute: search
  },
  {
    data: new SlashCommandBuilder()
      .setName('aleatorio')
      .setDescription('Algo aleatório do Polytoria'),
    execute: random
  },
  {
    data: new SlashCommandBuilder()
      .setName('informacoes')
      .setDescription('Informações sobre o Bot'),
    execute: info
  }

]
