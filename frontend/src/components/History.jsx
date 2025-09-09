const History = ({history, theme}) => {
  return (
    <div className="pl-1" >
      {history.map((entry, index) => {
        if(entry.type === 'input') {
          return (
            <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
              <span className={theme.username}>{`${entry.user}@termiRoom:~$ `}</span>
              <span>{entry.command}</span>
            </pre>
          )
        } else if(entry.type === 'output') {
          return (
            <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
              <span>{entry.text}</span>
            </pre>
          )
        }
      })}
    </div>
  );
}

export default History;