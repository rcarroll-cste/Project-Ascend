import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'
import { DndContext } from '@dnd-kit/core'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <DndContext>
        <App />
      </DndContext>
    </Provider>
  </React.StrictMode>,
)