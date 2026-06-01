import { useState, useEffect } from 'react';
	import Terminal from './components/Terminal';

function App() {
  const [booting, setBooting] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);
  
  useEffect(() => {
    const logs = [
      'Loading kubernetes context...',
      'Connecting to cluster [minikube]... OK',
      'Initializing mock virtualization environment... OK',
      'Setting up file system... OK',
      'Mounting volumes... OK',
      'HelloLaTeam Starting terminal services...'
    ];
    
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < logs.length) {
        setBootLog(prev => [...prev, logs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {booting && (
        <div className="boot-sequence" onClick={() => setBooting(false)}>
          {bootLog.map((log, i) => (
            <div key={i} className="output-line">{log}</div>
          ))}
          {bootLog.length === 6 && (
            <>
              <br/>
              <div className="output-line blink" style={{animation: 'blink 1s step-end infinite'}}>
                Click anywhere to skip or wait for boot...
              </div>
            </>
          )}
        </div>
      )}
      {!booting && <Terminal />}
    </>
  );
}

export default App;
