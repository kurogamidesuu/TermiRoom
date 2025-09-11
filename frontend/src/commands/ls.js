export default {
  description: {
    desc: '',
    format: ''
  },
  execute: async ({content, args}) => {
    const targetPath = content.trim() || '.';
    
    try {
      const result = await listDirectory(targetPath, args);
      return result;
    } catch(error) {
      return `ls: ${error.message}`;
    }
  }
};

const listDirectory = async (path, args={}) => {
  let targetDirectoryId;

  if(path === '.' || path === '') {
    targetDirectoryId = await getCurrentDirectoryId();
  } else if(path === '..') {
    const currDirectoryId = await getCurrentDirectoryId();
    const currDirectory = await getFileNodeById(currDirectoryId);

    targetDirectoryId = currDirectory.parent;
    if(!targetDirectoryId) {
      return `ls: Cannot access parent of root directory.`;
    }
  } else {
    targetDirectoryId = await resolvePath(path);
  }

  if(!targetDirectoryId) {
    return `ls: cannot access '${path}': No such file or directory.`;
  }

  const targetDirectory = await getFileNodeById(targetDirectoryId);
  if(!targetDirectory) {
    return `ls: cannot access '${path}': No such file or directory.`;
  }

  if(targetDirectory.type === 'file') {
    return showFileContent(targetDirectory, args);
  }

  const children = await getDirectoryContent(targetDirectoryId);

  return await showFolderContents(children);
}

export const getCurrentDirectoryId = async () => {
  try {
    const res = await fetch('/api/file/curr', {
      credentials: 'include'
    });

    if(res.ok) {
      const data = await res.json();
      return data.id;
    }
  } catch {
    return null;
  }
}

export const getFileNodeById = async (id) => {
  try {
    const res = await fetch(`/api/file/node/${id}`, {
      credentials: 'include'
    });

    if(res.ok) {
      const data = await res.json();
      return data.node;
    }
  } catch {
    return null;
  }
}

const resolvePath = (path) => {
  return path;
}

const showFileContent = (fileNode, args) => {
  if(!args) args = {bruh: 'bruh'};
  
  return fileNode.content;
}

const getDirectoryContent = async (fileNode) => {
  try {
    const res = await fetch(`/api/file/node/${fileNode}/children`);

    if(res.ok) {
      const data = await res.json();
      const children = data.children;

      return children;
    }
    return [];
  } catch {
    return [];
  }
}

const showFolderContents = async (children) => {
  if(!children || children.length === 0) {
    return 'empty directory!';
  }

  let output = '';
  
  for(const child of children) {
    const node = await getFileNodeById(child);
    if(node) {
      output += node.name + '\n';
    }
  }

  return output.trim();
}