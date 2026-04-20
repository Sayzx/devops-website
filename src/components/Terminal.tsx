import React, { useState, useEffect, useRef } from 'react';
import { parseCommand } from '../utils/commandParser';

interface HistoryItem {
  id: number;
  type: 'input' | 'output';
  content: string | React.ReactNode;
  command?: string;
  isError?: boolean;
}

const Terminal: React.FC = () => {
  const [currentNamespace /*, setCurrentNamespace*/] = useState('default');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 0, type: 'output', content: 'Welcome to KubeCTL Web Simulator v1.0' },
    { id: 1, type: 'output', content: 'Type "help" to see available commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (typeof endOfTerminalRef.current?.scrollIntoView === 'function') {
      endOfTerminalRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, inputVal]);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    document.addEventListener('click', focusInput);
    focusInput();
    return () => document.removeEventListener('click', focusInput);
  }, []);

  const playKeyPressSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      }
    } catch(e) { /* ignore */ }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeyPressSound();
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);

    if (e.key === 'Enter') {
      const cmd = inputVal.trim();
      
      const newHistory: HistoryItem[] = [...history, {
        id: Date.now(),
        type: 'input',
        content: inputVal,
        command: cmd
      }];

      if (cmd) {
        setCommandHistory(prev => [...prev, cmd]);
        setHistoryIndex(-1);

        const result = parseCommand(cmd, currentNamespace);
        
        if (result.output === 'CLEAR') {
          setHistory([]);
          setInputVal('');
          return;
        }

        newHistory.push({
          id: Date.now() + 1,
          type: 'output',
          content: result.output,
          isError: result.error
        });
      }

      setHistory(newHistory);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (inputVal === 'k') setInputVal('kubectl ');
      if (inputVal === 'kubectl g') setInputVal('kubectl get ');
    }
  };

  const Prompt = () => (
    <span className="prompt">
      <span className="user">admin</span>
      <span className="at">@</span>
      <span className="cluster">minikube</span>
      <span className="colon">:</span>
      <span className="path">~</span>
      <span className="dollar">$</span>
    </span>
  );

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">admin@minikube:~</div>
      </div>
      <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
        {history.map((item) => (
          <div key={item.id} className={`output-line ${item.isError ? 'output-error' : ''}`}>
            {item.type === 'input' && <Prompt />}
            {item.content}
          </div>
        ))}
        
        <div className="input-line">
          <Prompt />
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="command-input"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            <div className="fake-input">
              <span>{inputVal}</span>
              <span className={`cursor-block ${isTyping ? 'typing' : ''}`}></span>
            </div>
          </div>
        </div>
        <div ref={endOfTerminalRef} />
      </div>
    </div>
  );
};

export default Terminal;
