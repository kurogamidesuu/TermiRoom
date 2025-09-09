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
      execute: async ({content}, {setThemeByName}) => {
        if(!content) return `Enter a theme name`;

        const res = await setThemeByName(content);

        if(!res) return `No theme named '${content}' found`;

        return `Theme changed to '${content}' successfully.`;
      }
    },
    list: {
      description: {
        format: '',
        desc: 'List all the available themes',
      },
      execute: (_, {listThemes}) => listThemes().join('\n')
    },
    current: {
      description: {
        format: '',
        desc: 'Show the current Theme',
      },
      execute: (_, {theme}) => {
        return `Current theme name: ${theme.name}`;
      }
    }
  }
}