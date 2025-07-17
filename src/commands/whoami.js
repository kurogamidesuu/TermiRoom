import { getUsername, setUsername } from "../utils/usernameStore";

export default {
  description: {
    format: '',
    desc: 'As it says: Who am I?',
  },
  execute: () => {
    return `  ${getUsername()}
  ${checkOSVer()}`
  },
  subcommands: {
    set: {
      description: {
        format: '',
        desc: 'Set your name on console',
      },
      execute: ({content}) => {
        if(!content) return `Error: Please enter a name`;

        setUsername(content)
        return `Your name has been set "${content}"`
      }
    }
  }
}

function checkOSVer() {
  let nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = ''+parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let verOffset;

  // Opera
  if((verOffset = nAgt.indexOf("OPR")) != -1) {
    browserName = 'Opera';
    fullVersion = nAgt.substring(verOffset+4);
    if((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset+8);
    }
  }
  // MS Edge
  else if((verOffset = nAgt.indexOf("Edg")) != -1) {
    browserName = 'Microsoft Edge';
    fullVersion = nAgt.substring(verOffset+4);
  }
  // MSIE
  else if((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset+5);
  }
  // Chrome
  else if((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = 'Chrome';
    fullVersion = nAgt.substring(verOffset+7);
  }
  // Safari
  else if((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset+7);
    if((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset+8);
    }
  }
  // Firefox
  else if((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
  }

  return `Browser Name: ${browserName}
  Full Version: ${fullVersion}
  Major Version: ${majorVersion}`
}