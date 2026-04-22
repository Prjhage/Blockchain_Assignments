import React from 'react'
import FileUpload from './components/FileUpload'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Assignment 4</h1>
        <p>Decentralized File Storage with IPFS & Pinata</p>
      </header>
      
      <main>
        <FileUpload />
      </main>

      <footer className="footer">
        Built with React + Vite + Pinata
      </footer>
    </div>
  )
}

export default App
