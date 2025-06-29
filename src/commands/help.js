
export default {
  description: "Shows this help menu",
  execute: ({commandTree}) => handleHelp('The available commands are:\n\n', commandTree),
}

const keywords = [];

function handleHelp(line, commandTree, indent='  ') {
  for (const [cmd, value] of Object.entries(commandTree)) {
    keywords.push(cmd);
    line += `${indent}${cmd}:\t\t${value.description || ''}\n`;
    if(value.subcommands) {
      line = handleHelp(line, value.subcommands, indent+'\t');
    }
  }
  return line;
}
export {keywords};
