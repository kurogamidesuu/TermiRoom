
export default {
  description: {
    format: '',
    desc: "Shows this help menu"
  },
  execute: ({commandTree}) => handleHelp('The available commands are:\n\n', commandTree),
}

const keywords = [];

function handleHelp(line, commandTree, indent='  ') {
  for (const [cmd, value] of Object.entries(commandTree)) {
    keywords.push(cmd);
    line += `${indent}${(cmd+' '+value.description?.format).padEnd(40)}${value.description?.desc || ''}\n`;
    if(value.args?.description) {
      for(const [arg, desc] of Object.entries(value.args.description)) {
        line += `${indent}${cmd} ${value.description?.format} ${arg.padEnd(40)}${desc}\n`
      }
    }
    if(value.subcommands) {
      line = handleHelp(line, value.subcommands, indent+'\t');
    }
  }
  return line;
}

export {keywords};
