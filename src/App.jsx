import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import { useState } from 'react'
import AnythingList from './components/Todo/List/AnythingList'

function App() {
const [activeView, setActiveView] = useState('todo');
const [todoList, setTodoList] = useState([]);
const [doneList, setDoneList] = useState([]);

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

          <AnythingList type={activeView} contentList={activeView === 'todo' ? 'todoList' : 'doneList'} />
       
      </Card>
      </div>
    </>
  )
}

export default App
