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

export const getLocalHistory = () => {
  if(!history) {
    const stored = localStorage.getItem('cmdHistory');
    history = stored ? JSON.parse(stored) : [initial_message];
    localStorage.setItem('cmdHistory', JSON.stringify(history));
  }
  return history;
}

export const setLocalHistory = (newHistory) => {
  history = newHistory;
  localStorage.setItem('cmdHistory', JSON.stringify(history));
  listeners.forEach((cb) => cb(newHistory));
}