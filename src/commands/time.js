export default {
  description: {
    format: '',
    desc: 'Shows the current time.',
  },
  execute: () => new Date().toTimeString(),
  subcommands: {
    utc: {
      description: {
        format: '',
        desc: 'Show current UTC time'
      },
      execute: () => new Date().toUTCString().slice(17),
    },
    hours: {
      args: {
        min: 0,
        max: 1,
        description:{
          '-standard': 'Show the current hour in the standard 12-hour format.',
        }
      },
      description: {
        format: '',
        desc: 'Show the current hour'
      },
      execute: ({args}) => {
        if(args.standard) {
          return Math.abs(new Date().getHours() - 12);
        }
        return new Date().getHours();
      },
      subcommands: {
        utc: {
          description: {
            format: '',
            desc: 'Show current UTC hour'
          },
          execute: () => new Date().getUTCHours(),
        }
      }
    },
    minutes: {
      description: {
        format: '',
        desc: 'Show the current minutes'
      },
      execute: () => new Date().getMinutes(),
      subcommands: {
        utc: {
          description: {
            format: '',
            desc: 'Show current UTC minutes'
          },
          execute: () => new Date().getUTCMinutes(),
        }
      }
    },
    seconds: {
      description: {
        format: '',
        desc: 'Show the current seconds'
      },
      execute: () => new Date().getSeconds(),
      subcommands: {
        utc: {
          description: {
            format: '',
            desc: 'Show current UTC seconds'
          },
          execute: () => new Date().getUTCSeconds(),
        }
      }
    }
  }
}