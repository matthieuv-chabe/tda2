import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ActionRecorder } from './core/ActionRecorder/ActionRecorder.ts'

const ar = new ActionRecorder()

ar.startRecording()

setTimeout(() => {
  console.log("stop recording...")
  ar.stopRecording()
  console.log("actions:", ar.getHumanReadableActions())
}, 10000)

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
