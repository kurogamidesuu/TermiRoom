import { getFileNodeById } from "./ls";

export default {
  description: {
    desc: '',
    format: ''
  },
  execute: async ({content}, {setDirectory}) => {
    if(!content) return 'Enter the name of directory.';

    const dirArray = resolvePath(content);
    if(!dirArray || dirArray.length === 0) return 'Invalid path.';

    try {
      const res = await fetch('/api/file/cd', {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({dirArray})
      });
      if(!res.ok) {
        const error = await res.json();
        return error.error;
      }
      const data = await res.json();
      const dirId = data.user.currDir;
      const dir = await getFileNodeById(dirId);
      setDirectory(dir.name);
      return 'moved';
    } catch {
      return 'Error occurred';
    }
  }
}

const resolvePath = (pathString) => {
  const pathArray = pathString.split('/').filter(elem => elem !== '');

  return pathArray;
}