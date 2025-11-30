import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

const AppWithDnd = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext sensors={sensors}>
      <App />
    </DndContext>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithDnd />
    </Provider>
  </React.StrictMode>,
)