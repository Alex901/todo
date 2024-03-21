import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import React, { useState, useRef } from 'react'
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
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import { SketchPicker } from 'react-color';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import 'material-design-lite/dist/material.min.css';
import 'material-design-lite/dist/material.min.js';

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount, getDoingCount, getActiveListTodoCount, getActiveListDoingCount, getActiveListDoneCount,
    getListDoingCount, getListDoneCount, getListTodoCount } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setActiveList, deleteList, addTag, deleteTag } = useUserContext();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isdDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [deleteListError, setDeleteListError] = useState("");
  const [isNewTagPopperOpen, setIsNewTagPopperOpen] = useState(false);
  const newTagAnchorRef = React.useRef(null);

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

  console.debug("DEBUG: loggedInUser: ", loggedInUser);

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

  const getBrightness = (color) => {
    const rgb = parseInt(color.slice(1), 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = (rgb >> 0) & 0xff;  // extract blue

    // calculate brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  const getHexColor = (colorName) => {
    switch (colorName) {
      case 'black':
        return '#000000';
      case 'white':
        return '#FFFFFF';
      default:
        return colorName;
    }
  }

  const handleNewTagSubmit = (event) => {
    event.preventDefault();
    let tagName = event.target[0].value;

    if (!tagName) {
      toast.error('Please enter a name for the tag!');
      return;
    }

    if (tagName.charAt(0) !== '#') {
      tagName = '#' + tagName;
    }

    const tagColor = document.querySelector('input[type="color"]').value;
    const brightness = getBrightness(tagColor);
    const textColor = brightness > 128 ? 'black' : 'white';
    const textColorHex = getHexColor(textColor);

    addTag(tagName, tagColor, textColorHex);
    setIsNewTagPopperOpen(false);
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
                  options={loggedInUser.listNames.map(listName => {
                    const todoCount = getListTodoCount(listName.name);
                    const doingCount = getListDoingCount(listName.name);
                    const doneCount = getListDoneCount(listName.name);

                    return {
                      label: (
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{listName.name.charAt(0).toUpperCase() + listName.name.slice(1)}</span>
                          <span>({todoCount},{doingCount},{doneCount})</span>
                        </div>
                      ),
                      value: listName.name
                    };
                  })}
                  value={typeof loggedInUser.activeList === 'string' ? { label: loggedInUser.activeList.charAt(0).toUpperCase() + loggedInUser.activeList.slice(1), value: loggedInUser.activeList } : null}
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
            {isLoggedIn && (
              <div className="tags-container">
                <div className='tags'>
                  {loggedInUser.listNames.find(list => list.name === loggedInUser.activeList).tags.map((tag, index) => {
                    return (
                      <Chip
                        key={index}
                        label={tag.label}
                        style={{
                          background: `linear-gradient(45deg, ${tag.color} 30%, ${tag.color} 90%)`,
                          boxShadow: `0 3px 5px 2px rgba(255, 105, 135, .3)`,
                          color: tag.textColor,
                        }}
                        onDelete={() => deleteTag(tag.label)}
                        sx={{
                          margin: '0.5em',
                          height: '2em',
                          '&:hover': {
                            backgroundColor: tag.color,
                            color: tag.textColor,
                          },
                        }}
                      />
                    );
                  })}

                  <Chip
                    ref={newTagAnchorRef}
                    label="Add tag"
                    variant="outlined"
                    onClick={setIsNewTagPopperOpen.bind(this, !isNewTagPopperOpen)}
                    className='add-tag'
                    sx={{
                      border: '2px dotted',
                      borderColor: 'action.active',
                      width: 'auto',
                      height: '2em',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundImage: 'none',
                        border: '1px solid',
                      },
                    }}
                  />

                </div>
              </div>
            )}
            <Popper open={isNewTagPopperOpen} anchorEl={newTagAnchorRef.current} placement='bottom'>
              <div className='new-tag-popper-container'>
                <h5 style={{ margin: '8px', marginBottom: '8px' }}>Create new tag</h5>
                <form className='new-tag-popper-form' onSubmit={handleNewTagSubmit}>
                  <div className="new-tag-inputs">
                    <TextField label="Tag name" variant="outlined" size="small" />
                    <input type="color" defaultValue="#1e34a4" />
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
              </div>
            </Popper>

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
