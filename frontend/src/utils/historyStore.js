let history = null;
let listeners = [];

const text = `
████████╗███████╗██████╗ ███╗   ███╗██╗██████╗  ██████╗  ██████╗ ███╗   ███╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██████╔╝██║   ██║██║   ██║██╔████╔██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
                                                                            
`
const initial_message = {
  type: 'output',
  text: `${text}\nWelcome to termiRoom!\nWrite 'help' to check the available commands\nVisit the Github repo for more information: https://github.com/kurogamidesuu/TermiRoom.git`
}

export const getServerHistory = async () => {
  if(!history) {
    try {
      const res = await fetch('/api/user/history', {
        credentials: 'include'
      });
      if(res.ok) {
        const data = await res.json();
        history = (data.history && data.history.length > 0) ? data.history : [initial_message];
      } else {
        history = [initial_message];
      }
    } catch {
      history = [initial_message];
    }
  }
  return history;
}

export const setServerHistory = async (newHistory) => {
  history = newHistory;
  listeners.forEach((cb) => cb(newHistory));
  await fetch('/api/user/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({history}),
  });
};