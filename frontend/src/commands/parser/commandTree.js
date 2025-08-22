import ai from '../ai'
import termiGod from '../termiGod'
import define from '../define'
import help from '../help'
import time from '../time'
import todo from '../todo'
import weather from '../weather'
import whoami from '../whoami'
import theme from '../theme'

export default {
  help,
  clear: {
    description: {
      format: '',
      desc: 'Clear the console'
    },
    execute: () => '__CLEAR__',
  },
  time,
  todo,
  weather,
  define,
  ai,
  theme,
  whoami,
  termiGod,
}