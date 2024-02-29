import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import { useState } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount } = useTodoContext();

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
      <Card>
        <div className='nav'>
          <button className="navButton" onClick={switchTodoView} style={{
            background: activeView === 'todo' ? '#eaeaef' : '#777474',
            color: activeView === 'todo' ? 'black' : 'white'
          }}> todo ({getTodoCount()}) </button>
          <button className="navButton" onClick={switchDoneView} style={{
            background: activeView === 'done' ? '#eaeaef' : '#777474',
            color: activeView === 'done' ? 'black' : 'white'
          }}> done ({getDoneCount()}) </button>
        </div>
          

            <AnythingList type={activeView} />

          </Card>
      </div>
    </>
  )
}

export default App
