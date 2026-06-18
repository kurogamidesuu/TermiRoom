import { memo } from "react";

const HighlightedCommand = ({ command, theme, validCommands = [] }) => {
  const match = command.match(/^(\s*)([^\s]+)(.*)$/);
  if (!match) return <span>{command}</span>;

  const [, spaces, cmd, rest] = match;

  const isValidCommand = validCommands.includes(cmd);
  const colorClass = isValidCommand
    ? theme?.command || theme?.username || "text-amber-300"
    : "";

  return (
    <span>
      {spaces}
      <span className={colorClass}>{cmd}</span>
      {rest}
    </span>
  );
};

const History = ({ history, theme, validCommands = [] }) => {
  return (
    <div className="flex flex-col">
      {history.map((item, index) => (
        <div key={index} className="mb-1 w-full">
          {item.type === "input" ? (
            <div className="flex items-start w-full">
              <span className={`mr-2 shrink-0 ${theme.username}`}>
                {`${item.user}@termiRoom:~${item.dirName}$`}
              </span>

              <HighlightedCommand
                command={item.command}
                theme={theme}
                validCommands={validCommands}
              />
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-all w-full mt-1">
              {item.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(History);
