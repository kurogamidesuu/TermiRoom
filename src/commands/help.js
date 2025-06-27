
export default {
  description: "Shows this help menu",
  execute: ({commandTree}) => handleHelp('The available commands are:\n\n', commandTree),
}

function handleHelp(line, commandTree, indent='  ') {
  for (const [cmd, value] of Object.entries(commandTree)) {
    line += `${indent}${cmd}:\t\t${value.description || ''}\n`;
    if(value.subcommands) {
      line = handleHelp(line, value.subcommands, indent+'  ');
    }
  }
  return line;
}