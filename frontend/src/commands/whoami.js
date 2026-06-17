import { updateUsername } from "../api/user";

export default {
  description: {
    format: "",
    desc: "As it says: Who am I?",
  },
  execute: async (_, { username }) => {
    return `  Username: ${username || "Unknown"}
  ${checkOSVer()}`;
  },
  subcommands: {
    set: {
      description: {
        format: "[name]",
        desc: "Update your username",
      },
      execute: async ({ content }, { setUsername }) => {
        if (!content) return `Error: Please enter a name`;
        try {
          const newName = await updateUsername(content);
          setUsername(newName);
          return `Username updated to "${newName}"`;
        } catch (error) {
          return error.message;
        }
      },
    },
  },
};

function checkOSVer() {
  const nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = "" + parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let verOffset;

  if ((verOffset = nAgt.indexOf("OPR")) !== -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 4);
  } else if ((verOffset = nAgt.indexOf("Edg")) !== -1) {
    browserName = "Microsoft Edge";
    fullVersion = nAgt.substring(verOffset + 4);
  } else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  } else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  } else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) !== -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
  } else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }

  return `Browser: ${browserName} ${majorVersion} (${fullVersion})`;
}
