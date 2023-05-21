import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from './routes/routes'
import { Provider } from 'react-redux'
import { store } from '../src/app/store'

export default function App() {
  return <Routes />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
