import help from '../help'
import time from '../time'
import todo from '../todo'

export default {
  help,
  clear: {
    description: 'Clear the console',
    execute: () => '__CLEAR__',
  },
  time,
  todo,
}