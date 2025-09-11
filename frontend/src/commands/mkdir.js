export default {
  description: {
    dsec: '',
    format: ''
  },
  execute: async ({content}) => {
    const dirName = content.trim();

    if(!dirName) return 'Enter the name of directory.';

    try {
      const res = await fetch('/api/file/create/dir', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({dirName})
      });

      if(res.ok) {
        const data = await res.json();

        const {newDir, currDir} = data;
        return `created ${newDir.name} in ${currDir.name}`;
      }
    } catch(error) {
      return `Error creating a directory: ${error}`;
    }

  }
}