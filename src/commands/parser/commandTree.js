import define from '../define'
import help from '../help'
import time from '../time'
import todo from '../todo'
import weather from '../weather'

export default {
  help,
  clear: {
    description: 'Clear the console',
    execute: () => '__CLEAR__',
  },
  time,
  todo,
  weather,
  define,
}