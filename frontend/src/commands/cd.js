
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
      const newRes = await fetch('/api/file/path', {
        credentials: 'include'
      });
      if(newRes.ok) {
        const data = await newRes.json();
        const pathArr = data.pathArr;
        setDirectory(pathArr);
        return 'moved';
      } else {
        return `An error occurred.`;
      }

    } catch {
      return 'Error occurred';
    }
  }
}

const resolvePath = (pathString) => {
  const pathArray = pathString.split('/').filter(elem => elem !== '');

  return pathArray;
}