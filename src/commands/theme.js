import { themes } from "../utils/themeStore";

let currentCycleTheme = null;

export const setThemeHandler = (func) => {
  currentCycleTheme = func;
}

const applyTheme = (name = null) => {
  if(currentCycleTheme) {
    return currentCycleTheme(name);
  }
}

export default {
  description: {
    format: '',
    desc: ''
  },
  args: {
    min: 0,
    max: 0,
  },
  subcommands: {
    set: {
      description: {
        format: '[theme name]',
        desc: 'Change theme to [theme name]'
      },
      execute: ({content}) => {
        if(!content) return `Enter a theme name`;

        const res = applyTheme(content);

        if(!res) return `No theme named '${content}' found`;

        return `Theme changed to '${content}' successfully.`;
      }
    },
    list: {
      description: {
        format: '',
        desc: 'List all the available themes',
      },
      execute: () => themes.map(elem => '\t' + elem.name + '\n')
    },
    current: {
      description: {
        format: '',
        desc: 'Show the current Theme',
      },
      execute: () => {
        let currentThemeIndex = localStorage.getItem('themeIndex');

        const index = currentThemeIndex ? JSON.parse(currentThemeIndex) : 0;

        return `Current theme name: ${themes[index].name}`;
      }
    }
  }
}