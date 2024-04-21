import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import React, { useState, useRef, useEffect } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'
import { useUserContext } from './contexts/UserContext'
//import Select from 'react-select'
import CreateListModal from './components/Todo/TodoModal/CreateListModal/CreateListModal'
import DeleteListModal from './components/Todo/TodoModal/DeleteListModal/DeleteListModal'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { toast } from "react-toastify";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiMinus } from '@mdi/js';
import { mdiFileExport } from '@mdi/js';
import { mdiGroup } from '@mdi/js';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import { SketchPicker } from 'react-color';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Select, MenuItem, ListItemText, FormControl, InputLabel, Typography, IconButton } from '@mui/material';
import GroupModal from './components/Todo/TodoModal/GroupModal/GroupModal'
import LandingPage from './pages/LandingPage/LandingPage'
import { MagnifyingGlass } from "react-loader-spinner";


import 'material-design-lite/dist/material.min.css';
import 'material-design-lite/dist/material.min.js';
import ExportListModal from './components/Todo/TodoModal/ExportListModal/ExportListModal'

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount, getDoingCount, getActiveListTodoCount, getActiveListDoingCount, getActiveListDoneCount,
    getListDoingCount, getListDoneCount, getListTodoCount } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setActiveList, deleteList, addTag, deleteTag, checkLogin } = useUserContext();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isdDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [deleteListError, setDeleteListError] = useState("");
  const [isNewTagPopperOpen, setIsNewTagPopperOpen] = useState(false);
  const newTagAnchorRef = React.useRef(null);
  const [showAll, setShowAll] = useState(false);
  const [isOpenListModalOpen, setIsOpenListModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      setIsLoading(true);
      await checkLogin();
      setIsLoading(false);
    };

    fetchLoginStatus();
  }, []);

  if (isLoading) {
    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <MagnifyingGlass />
    </div>
    );
  }


  const switchTodoView = () => {
    setActiveView('todo');
  }

  const switchDoneView = () => {
    setActiveView('done');
  }

  const switchDoingView = () => {
    setActiveView('doing');
  }

  const handleListChange = (event) => {
    console.log("selectedOption: ", event.target.value);
    if (event.target.value) {
      setLoggedInUser({ ...loggedInUser, activeList: event.target.value });
      setActiveList(event.target.value);
    } else {
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

  const openExportModal = () => {
    if (!isOpenListModalOpen) {
      setIsOpenListModalOpen(true);
    }
  };

  const closeExportListModal = () => {
    setIsOpenListModalOpen(false);
  };

  const openGroupModal = () => {
    if (!isGroupModalOpen) {
      setIsGroupModalOpen(true);
    }
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  //TODO: This shouldbe moved to a separate component
  return (

    <div className='app'>
      <div>
        {isLoggedIn && <Header />}
      </div>
      <>
        <CookieConsent />
      </>

      {isLoggedIn && (
        <div className="content">
          <Card>
            <div className='nav' style={{ display: 'flex', flexDirection: 'column' }}>
              {/* First row */}
              {isLoggedIn && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                  <FormControl variant='standard' style={{ width: '22em', margin: '10px' }}>
                    <InputLabel id="active-list-label" style={{ fontWeight: 'bold' }}>Active list </InputLabel>
                    <Select
                      labelId="active-list-label"
                      label="Active listt"
                      className="select-list"
                      size='small'
                      value={loggedInUser.activeList || ""}
                      onChange={handleListChange}
                    >
                      {loggedInUser.listNames.map(listName => {
                        const todoCount = getListTodoCount(listName.name);
                        const doingCount = getListDoingCount(listName.name);
                        const doneCount = getListDoneCount(listName.name);

                        return (
                          <MenuItem key={listName.name} value={listName.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div>{listName.name.charAt(0).toUpperCase() + listName.name.slice(1)}</div>
                              <div>{`(${todoCount},${doingCount},${doneCount})`}</div>
                            </div>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <div className="icon-button" onClick={openCreateListModal} style={{ marginLeft: 10 }}>
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
                <div className="functions-container" style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                  margin: '.5em 0 .5em 0', gap: '5px',
                  height: '42px'
                }}>

                  <IconButton className="icon-button" onClick={openGroupModal}>
                    <Icon path={mdiGroup} size={1.2} />
                  </IconButton>


                  <IconButton className="icon-button" onClick={openExportModal}>
                    <Icon path={mdiFileExport} size={1.2} />
                  </IconButton>

                </div>


              )}

              <ExportListModal isOpen={isOpenListModalOpen} onClose={closeExportListModal} />
              <GroupModal isOpen={isGroupModalOpen} onClose={closeGroupModal} />

              {isLoggedIn && (
                <div className="tags-container">
                  <div className='tags' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

                    {loggedInUser.listNames.find(list => list.name === loggedInUser.activeList).tags.slice(0, showAll ? undefined : 3).map((tag, index) => {
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

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip
                        ref={newTagAnchorRef}
                        label="Add tag"
                        variant="outlined"
                        onClick={setIsNewTagPopperOpen.bind(this, !isNewTagPopperOpen)}
                        className='add-tag'
                        sx={{
                          border: '2px dotted',
                          borderColor: 'action.active',
                          width: '8em',
                          height: '2em',
                          cursor: 'pointer',
                          margin: 'auto',
                          '&:hover': {
                            backgroundImage: 'none',
                            border: '1px solid',
                          },
                        }}
                      />
                    </div>

                    {loggedInUser.listNames.find(list => list.name === loggedInUser.activeList).tags.length > 3 && (
                      <Chip
                        label={showAll ? 'Show fewer' : 'Show all'}
                        onClick={() => setShowAll(!showAll)}
                        variant="outlined"
                        sx={{
                          border: 'none',
                          margin: '0.5em',
                          height: '2em',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    )}




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
                  background: activeView === 'todo' ? '#eaeaef' : '#E65151',
                  color: activeView === 'todo' ? 'black' : 'white',
                  flexGrow: '1'
                }}> Prepared ({isLoggedIn ? getActiveListTodoCount() : getTodoCount()}) </button>

                <button className="navButton" onClick={switchDoingView} style={{
                  background: activeView === 'doing' ? '#eaeaef' : '#EBCC67',
                  color: 'black',
                  flexGrow: '1'
                }}> Ongoing ({isLoggedIn ? getActiveListDoingCount() : getDoingCount()}) </button>

                <button className="navButton" onClick={switchDoneView} style={{
                  background: activeView === 'done' ? '#eaeaef' : '#649E31',
                  color: activeView === 'done' ? 'black' : 'white',
                  flexGrow: '1'
                }}> Review ({isLoggedIn ? getActiveListDoneCount() : getDoneCount()}) </button>
              </div>
            </div>

            <AnythingList type={activeView} />

          </Card>
        </div>
      )}
      {!isLoggedIn && !loggedInUser && <LandingPage />}
    </div>
  )
}

export default App
