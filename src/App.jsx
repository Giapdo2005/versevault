// src/App.jsx
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddVerse from './pages/AddVerse'
import VerseList from './pages/VerseList'
import Practice from './pages/Practice'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddVerse />} />
          <Route path="/verses" element={<VerseList />} />

          {/*
            :id is a dynamic segment — it matches any value in that position.
            /practice/123, /practice/456 all match this one route.
            Inside Practice.jsx, useParams() lets us read what :id actually is.
          */}
          <Route path="/practice/:id" element={<Practice />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
