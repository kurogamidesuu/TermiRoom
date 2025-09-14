export default {
  description: {
    dsec: '',
    format: ''
  },
  execute: async ({content}) => {
    const dirName = content.trim();

    if(!dirName) return 'Enter the name of directory.';

    try {
      const res = await fetch('/api/file/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({name: dirName, type: 'folder'})
      });

      if(res.ok) {
        const data = await res.json();

        const {newFile, currDir} = data;
        return `created ${newFile.name} in ${currDir.name}`;
      }
    } catch(error) {
      return `Error creating a directory: ${error}`;
    }

  }
}