import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins, sans-serif',
          fontSize: 16,
          colorText: '#565656',
          colorPrimary: '#22bb93'
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
