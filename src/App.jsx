import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import { useState } from 'react'

function App() {
const [activeView, setActiveView] = useState('todo');

const switchTodoView = () => {
  setActiveView('todo');
}

const switchDoneView = () => {
  setActiveView('done');
}


  return (
    <>
      <Header />
      <div className='app'> 
        <div className='nav'>
        <button onClick={switchTodoView}> todo </button>
        <button onClick={switchDoneView}> done </button>
        </div>
      <Card>
        <h1> Hello world </h1>
      </Card>
      </div>
    </>
  )
}

export default App
