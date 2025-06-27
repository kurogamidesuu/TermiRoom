export default {
  description: 'Shows the current time.',
  execute: () => new Date().toTimeString(),
  subcommands: {
    utc: {
      description: 'Show current UTC time',
      execute: () => new Date().toUTCString(),
    },
    hours: {
      description: 'Show the current hour',
      execute: ({args}) => {
        if(args.standard) {
          return Math.abs(new Date().getHours() - 12);
        }
        return new Date().getHours();
      },
      subcommands: {
        utc: {
          description: 'Show current UTC hour',
          execute: () => new Date().getUTCHours(),
        }
      }
    },
    minutes: {
      description: 'Show the current minutes',
      execute: () => new Date().getMinutes(),
      subcommands: {
        utc: {
          description: 'Show current UTC minutes',
          execute: () => new Date().getUTCMinutes(),
        }
      }
    },
    seconds: {
      description: 'Show the current seconds',
      execute: () => new Date().getSeconds(),
      subcommands: {
        utc: {
          description: 'Show current UTC seconds',
          execute: () => new Date().getUTCSeconds(),
        }
      }
    }
  }
}