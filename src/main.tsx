import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { WithJazz } from 'jazz-react'
import { LocalAuth } from 'jazz-react-auth-local'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WithJazz auth={LocalAuth({ appName: 'iits-a-chat' })}>
      <App />
    </WithJazz>
  </React.StrictMode>,
)
