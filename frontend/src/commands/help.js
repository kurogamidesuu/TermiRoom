const CMD_COL_WIDTH = 45;
const DESC_COL_WIDTH = 60;
const TABLE_LINE = '+' + '-'.repeat(CMD_COL_WIDTH) + '+' + '-'.repeat(DESC_COL_WIDTH+2) + '+\n';
const HEADER_TEXT = '|' + '  COMMAND'.padEnd(CMD_COL_WIDTH) + '|' + '  DESCRIPTION'.padEnd(DESC_COL_WIDTH+2) + '|\n';

export default {
  description: {
    format: '',
    desc: "Shows this help menu"
  },
  execute: ({commandTree}) => TABLE_LINE + HEADER_TEXT + TABLE_LINE + handleHelp('', commandTree) + TABLE_LINE ,
}

const keywords = [];

function handleHelp(line, commandTree, indent='  ') {
  for (const [cmd, value] of Object.entries(commandTree)) {
    keywords.push(cmd);

    const cmdString = indent + (cmd + (value.description?.format ? ' ' + value.description?.format : ''));
    const paddedCmd = cmdString.padEnd(CMD_COL_WIDTH, ' ');
    const desc = value.description?.desc ? value.description.desc : '';
    const paddedDesc = desc.padEnd(DESC_COL_WIDTH, ' ');

    line += `|${paddedCmd}|  ${paddedDesc}|\n`;

    if(value.args?.description) {
      for(const [arg, desc] of Object.entries(value.args.description)) {
        const argCmd = `${indent.repeat(2)}${cmd} ${value.description?.format} ${arg}`;
        const paddedArg = argCmd.padEnd(CMD_COL_WIDTH, ' ');
        const paddedArgDesc = desc.padEnd(DESC_COL_WIDTH, ' ');
        line += `|${paddedArg}|  ${paddedArgDesc}|\n`;
      }
    }
    if(value.subcommands) {
      line = handleHelp(line, value.subcommands, indent+'   ');
    }
  }
  return line;
}

export {keywords};
