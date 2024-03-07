import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import { useState } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'
import { useUserContext } from './contexts/UserContext'
import Select from 'react-select'

import 'material-design-lite/dist/material.min.css';
import 'material-design-lite/dist/material.min.js';

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount, getDoingCount } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser } = useUserContext();


  const switchTodoView = () => {
    setActiveView('todo');
  }

  const switchDoneView = () => {
    setActiveView('done');
  }

  const switchDoingView = () => {
    setActiveView('doing');
  }

  const handleListChange = (selectedOption) => {
    console.log("selectedOption: ", selectedOption);
    if (selectedOption) {
      setLoggedInUser({ ...loggedInUser, activeList: selectedOption.value });
    } else {
      setLoggedInUser({ ...loggedInUser, activeList: loggedInUser.listNames[2] });
    }




  }


  //TODO: Break out these buttons maybe ? 
  return (
    <div className='app'>
      <Header />
      <div className="content">
        <Card>
          <div className='nav' style={{ display: 'flex', flexDirection: 'column' }}>
            {/* First row */}
            {isLoggedIn && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1em 0 2em 0' }}>
                <Select
                  styles={{ control: (base) => ({ ...base, width: '22em', borderRadius: '10px' }) }}
                  className="select-list"
                  isSearchable={true}
                  isClearable={true}
                  options={loggedInUser.listNames.map(listName => ({ label: listName, value: listName }))}
                  value={typeof loggedInUser.activeList === 'string' ? { label: loggedInUser.activeList, value: loggedInUser.activeList } : null}
                  onChange={handleListChange}
                />

                <div style={{ margin: '0 1em 0 1em' }}></div>

                <button className="create-list-button"> Create new list

                </button>
                <button className="delete-list-button">Delete List</button>
              </div>
            )}

            {isLoggedIn && <hr style={{ width: '80%', margin: '1em auto' }}></hr>}

            {/* Second row */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="navButton" onClick={switchTodoView} style={{
                background: activeView === 'todo' ? '#eaeaef' : '#777474',
                color: activeView === 'todo' ? 'black' : 'white',
                flexGrow: '1'
              }}> todo ({getTodoCount()}) </button>

              <button className="navButton" onClick={switchDoingView} style={{
                background: activeView === 'doing' ? '#eaeaef' : '#777474',
                color: activeView === 'doing' ? 'black' : 'white',
                flexGrow: '1'
              }}> doing ({getDoingCount()}) </button>

              <button className="navButton" onClick={switchDoneView} style={{
                background: activeView === 'done' ? '#eaeaef' : '#777474',
                color: activeView === 'done' ? 'black' : 'white',
                flexGrow: '1'
              }}> done ({getDoneCount()}) </button>
            </div>
          </div>

          <AnythingList type={activeView} />

        </Card>
      </div>
    </div>
  )
}

export default App
