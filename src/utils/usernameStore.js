let username = null;
let listeners = [];

export const getUsername = () => {
  if (!username) {
    const stored = localStorage.getItem('username');
    username = stored ? JSON.parse(stored) : `user${Math.floor(Math.random() * 10000 + 500)}`;
    localStorage.setItem('username', JSON.stringify(username));
  }
  return username;
};

export const setUsername = (newName) => {
  username = newName;
  localStorage.setItem('username', JSON.stringify(newName));
  listeners.forEach((cb) => cb(newName));
};

export const onUsernameChange = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
