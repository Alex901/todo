import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import { useState } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'
import { useUserContext } from './contexts/UserContext'
import Select from 'react-select'
import CreateListModal from './components/Todo/TodoModal/CreateListModal/CreateListModal'
import DeleteListModal from './components/Todo/TodoModal/DeleteListModal/DeleteListModal'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { toast } from "react-toastify";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiMinus } from '@mdi/js';


import 'material-design-lite/dist/material.min.css';
import 'material-design-lite/dist/material.min.js';

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount, getDoingCount, getActiveListTodoCount, getActiveListDoingCount, getActiveListDoneCount,
    getListDoingCount, getListDoneCount, getListTodoCount } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setActiveList, deleteList } = useUserContext();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isdDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [deleteListError, setDeleteListError] = useState("");

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
      //TODO: this is a bad function name, change it
      setActiveList(selectedOption.value);
    } else {
      //0 can never be deleted, so we prevent the nullpointer here
      setLoggedInUser({ ...loggedInUser, activeList: loggedInUser.listNames[0] });
      setActiveList(loggedInUser.listNames[0]);
    }
  }

  const openCreateListModal = (event) => {
    event.preventDefault();
    setIsCreateListModalOpen(true);
  };

  const closeCreateListModal = () => {
    setIsCreateListModalOpen(false);
  };

  const openDeleteListModal = (event) => {
    event.preventDefault();
    setIsDeleteListModalOpen(true);
  };

  const handleDelete = () => {
    const lisToDelete = loggedInUser.activeList
    if (lisToDelete === 'all' || lisToDelete === 'shared' || lisToDelete === 'today') {
      toast.error(`You cannot delete the list "${lisToDelete}"!`);
      setIsDeleteListModalOpen(false);
      return;
    }

    deleteList(lisToDelete);
    toast.success(`List "${lisToDelete}" deleted!`);
    setDeleteListError("");
    setIsDeleteListModalOpen(false);
  }

  //TODO: This shouldbe moved to a separate component
  return (
    <div className='app'>
      <Header />
      <>
        <CookieConsent />
      </>
      <div className="content">
        <Card>
          <div className='nav' style={{ display: 'flex', flexDirection: 'column' }}>
            {/* First row */}
            {isLoggedIn && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1em 0 2em 0', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', margin: '10px' }}> Active list: </label>
                <Select
                  styles={{ control: (base) => ({ ...base, width: '22em', borderRadius: '10px' }) }}
                  className="select-list"
                  isSearchable={true}
                  isClearable={true}
                  options={loggedInUser.listNames.map(listName => {
                    const todoCount = getListTodoCount(listName.name);
                    const doingCount = getListDoingCount(listName.name);
                    const doneCount = getListDoneCount(listName.name);

                    return {
                      label: (
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{listName.name}</span>
                          <span>({todoCount},{doingCount},{doneCount})</span>
                        </div>
                      ),
                      value: listName.name
                    };
                  })}
                  value={typeof loggedInUser.activeList === 'string' ? { label: loggedInUser.activeList, value: loggedInUser.activeList } : null}
                  onChange={handleListChange}
                />

                <div style={{ margin: '0 1em 0 1em' }}></div> {/* Best solution ever :D */}

                <div className="icon-button" onClick={openCreateListModal}>
                  <Icon path={mdiPlus} size={1.6} />
                </div>

                <div className="icon-button" onClick={openDeleteListModal}>
                  <Icon path={mdiMinus} size={1.6} />
                </div>

                <CreateListModal
                  isOpen={isCreateListModalOpen}
                  onRequestClose={closeCreateListModal} />

                <DeleteListModal
                  isOpen={isdDeleteListModalOpen}
                  onRequestClose={() => { setIsDeleteListModalOpen(false); setDeleteListError("") }}
                  listName={loggedInUser.activeList}
                  onDelete={handleDelete}
                  onCancel={() => { setIsDeleteListModalOpen(false); setDeleteListError("") }}
                  errorMessage={deleteListError}
                />
              </div>
            )}

            {isLoggedIn && <hr style={{ width: '80%', margin: '1em auto' }}></hr>}

            {/* Second row */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="navButton" onClick={switchTodoView} style={{
                background: activeView === 'todo' ? '#eaeaef' : '#777474',
                color: activeView === 'todo' ? 'black' : 'white',
                flexGrow: '1'
              }}> Prepared ({isLoggedIn ? getActiveListTodoCount() : getTodoCount()}) </button>

              <button className="navButton" onClick={switchDoingView} style={{
                background: activeView === 'doing' ? '#eaeaef' : '#777474',
                color: activeView === 'doing' ? 'black' : 'white',
                flexGrow: '1'
              }}> Ongoing ({isLoggedIn ? getActiveListDoingCount() : getDoingCount()}) </button>

              <button className="navButton" onClick={switchDoneView} style={{
                background: activeView === 'done' ? '#eaeaef' : '#777474',
                color: activeView === 'done' ? 'black' : 'white',
                flexGrow: '1'
              }}> Review ({isLoggedIn ? getActiveListDoneCount() : getDoneCount()}) </button>
            </div>
          </div>

          <AnythingList type={activeView} />

        </Card>
      </div>
    </div>
  )
}

export default App
