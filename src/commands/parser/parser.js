import commandTree from "./commandTree";

function parseArgsAndFlags(tokens) {
  const args = {};
  const flags = {};
  const cleanTokens = [];

  for(const token of tokens) {
    if(token.startsWith('--')) {
      const [key, value] = token.slice(2).split('=');
      flags[key] = value ?? true;
    } else if(token.startsWith('-')) {
      args[token.slice(1)] = true;
    } else {
      cleanTokens.push(token);
    }
  }

  return {args, flags, cleanTokens};
}

export async function executeCommand(input) {
  const rawTokens = input.split(/'([^']*)'|\s+/).filter(Boolean);
  const {args, flags, cleanTokens} = parseArgsAndFlags(rawTokens);

  let node =  null;
  let currentTree = commandTree;
  let index = 0;
  
  while(index < cleanTokens.length && currentTree[cleanTokens[index]]) {
    const token = cleanTokens[index];
    node = currentTree[token];
    currentTree = node.subcommands || {};
    index++;
  }

  const temp = cleanTokens.slice(index);
  const content = temp.join(' ');

  if(node?.args) {
    const optionsLength = Number(Object.keys(args).length) + Number(Object.keys(flags).length);
    if(optionsLength < node.args.min) {
      return `Provide atleast ${node.args.min} argument(s).`;
    }
    if(optionsLength > node.args.max) {
      return `Too many arguments! Provide at most ${node.args.max} argument(s).`
    }
  }
  
  if(node?.execute) {
    try {
      const result = await node.execute({args, flags, content, commandTree});
      return result;
    } catch(e) {
      return `Error executing command: ${e.message}`;
    }
  } else {
    return `Command found, but no execute() defined.`;
  }
}