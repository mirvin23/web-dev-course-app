import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Simulator.css';

export default function Simulator({ initialCode, onValidate, onCodeChange }) {
  const [code, setCode] = useState(initialCode);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setSuccess(false);
  }, [initialCode]);

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
    
    if (onValidate) {
      const isValid = onValidate(newCode);
      if (isValid && !success) {
        setSuccess(true);
      }
    }
  };

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: sans-serif; 
            margin: 10px; 
            color: #333; 
            background: #fff;
          }
        </style>
      </head>
      <body>${code}</body>
    </html>
  `;

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div className="window-controls">
          <span className="control close"></span>
          <span className="control minimize"></span>
          <span className="control maximize"></span>
        </div>
        <div className="tabs">
          <div className="tab active">index.html</div>
          <div className="tab">Resultado en Vivo</div>
        </div>
      </div>
      <div className="simulator-panels">
        <div className="editor-panel">
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              wordWrap: 'on',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true
            }}
          />
        </div>
        <div className="preview-panel">
          <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts"
            className="preview-iframe"
          />
        </div>
      </div>
      {success && (
        <div className="success-banner">
          ¡Reto Superado! 🎉
        </div>
      )}
    </div>
  );
}
