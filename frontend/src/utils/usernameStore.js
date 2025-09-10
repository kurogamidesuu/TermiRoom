let username = null;
let listeners = [];

export const getUsername = async () => {
  if (!username) {
    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include'
      });

      if(res.ok) {
        const data = await res.json();
        username = data.username;
      }
    } catch(error) {
      console.error('Error fetching username: ', error);
    }
  }
  return username;
};

export const setUsername = async (newName) => {
  try {
    const res = await fetch('/api/user/profile/username', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({newUsername: newName})
    });

    if(res.ok) {
      const data = await res.json();
      if(username !== data.user.username) {
        username = data.user.username;
        listeners.forEach((cb) => {
          console.log('Calling listener with: ', username);
          cb(username);
        });
      }
    }
  } catch(error) {
    console.error('Error setting username: ', error);
  }
};

export const clearUsername = () => {
  username = null;
  listeners.forEach((cb) => cb(null));
};

export const onUsernameChange = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
