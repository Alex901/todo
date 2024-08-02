import './App.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'
import { useUserContext } from './contexts/UserContext'
//import Select from 'react-select'
import CreateListModal from './components/Todo/TodoModal/CreateListModal/CreateListModal'
import DeleteListModal from './components/Todo/TodoModal/DeleteListModal/DeleteListModal'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { toast } from "react-toastify";
import Icon from '@mdi/react';
import {
  mdiDelete, mdiPlus, mdiMinus, mdiFileExport, mdiGroup, mdiTextBoxEditOutline,
  mdiPlaylistEdit, mdiDeleteEmpty, mdiPencil, mdiArchiveArrowDownOutline, mdiArchiveArrowUpOutline, mdiCloseCircle
} from '@mdi/js';
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
    getListDoingCount, getListDoneCount, getListTodoCount, todoList } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setActiveList, deleteList, addTag, deleteTag, checkLogin, toggleShowDetails } = useUserContext();
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
  const [isEditHovered, setIsEditHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isShowDetailsSelected, setIsShowDetailsSelected] = useState(false);
  const [totalTimeToComplete, setTotalTimeToComplete] = useState("");


  const activeList = loggedInUser?.myLists.find(list => list.listName === loggedInUser.activeList);

  const formatDuration = (minutes) => {
    const months = Math.floor(minutes / (60 * 24 * 30));
    const days = Math.floor((minutes % (60 * 24 * 30)) / (60 * 24));
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;
  
    let formatted = '';
    if (months > 0) formatted += `${months} month${months > 1 ? 's' : ''} `;
    if (weeks > 0) formatted += `${weeks} week${weeks > 1 ? 's' : ''} `;
    if (remainingDays > 0) formatted += `${remainingDays} day${remainingDays > 1 ? 's' : ''} `;
    if (hours > 0) formatted += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (mins > 0 || formatted === '') formatted += `${mins} minute${mins > 1 ? 's' : ''}`;
  
    return formatted.trim();
  };

  //Is this clever or na ? 
  useEffect(() => {
    const fetchLoginStatus = async () => {
      setIsLoading(true);
      await checkLogin();
      setIsLoading(false);
    };

    fetchLoginStatus();
  }, []);



  useEffect(() => {
    if (loggedInUser?.settings?.todoList?.showListDetails !== undefined) {
      setIsShowDetailsSelected(loggedInUser.settings.todoList.showListDetails);
    }
  }, [loggedInUser]);

  useMemo(() => {
    if (todoList && activeList) {
      console.log("DEBUG -- activeList", activeList.listName);
      console.log("DEBUG -- todoList", todoList);

      const totalTime = todoList
        .filter(todo => {
          const isMatch = todo.inListNew.some(list => list.listName.toLowerCase() === activeList.listName.toLowerCase());
          console.log(`Filtering todo: ${todo.task}, isMatch: ${isMatch}`);
          return isMatch;
        })
        .reduce((acc, todo) => acc + todo.estimatedTime, 0);

      const formattedTime = formatDuration(totalTime);
      setTotalTimeToComplete(formattedTime);
    }
  }, [todoList, activeList]);

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
    //console.log("selectedOption: ", event.target.value);
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

  const openEditListModal = () => {
    console.log("Edit list modal opened");
  }

  const toggleDetails = () => {
    setIsShowDetailsSelected(prevState => {
      const newState = !prevState;
      toggleShowDetails(newState);
      return newState;
    });
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
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
        <div className="content" style={{ display: 'flex', flexDirection: 'column' }}>
          <Card>
            <div className='nav' style={{ display: 'flex', flexDirection: 'column' }}>
              {/* First row */}
              {isLoggedIn && (
                <div className="listSelection">
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

                      {loggedInUser.myLists && loggedInUser.myLists.map(list => {
                        const todoCount = getListTodoCount(list.listName);
                        const doingCount = getListDoingCount(list.listName);
                        const doneCount = getListDoneCount(list.listName);
                        return (
                          <MenuItem key={list.listName} value={list.listName}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div>{list.listName.charAt(0).toUpperCase() + list.listName.slice(1)}</div>
                              <div>{`(${todoCount},${doingCount},${doneCount})`}</div>
                            </div>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <div className="icon-buttons">
                    <div className="icon-button add" onClick={openCreateListModal} style={{ marginLeft: 10 }}>
                      <Icon path={mdiPlus} size={1.6} />
                    </div>

                    <div
                      className="icon-button edit"
                      onClick={openEditListModal}
                      onMouseEnter={() => setIsEditHovered(true)}
                      onMouseLeave={() => setIsEditHovered(false)}
                    >
                      <Icon path={isEditHovered ? mdiPencil : mdiTextBoxEditOutline} size={1.4} />
                    </div>

                    <div className="icon-button description" onClick={toggleDetails}>
                      <Icon path={isShowDetailsSelected ? mdiArchiveArrowUpOutline : mdiArchiveArrowDownOutline} size={1.4} />
                    </div>

                    <div
                      className="icon-button delete"
                      onClick={openDeleteListModal}
                      onMouseEnter={() => setIsDeleteHovered(true)}
                      onMouseLeave={() => setIsDeleteHovered(false)}
                    >
                      <Icon path={isDeleteHovered ? mdiDeleteEmpty : mdiDelete} size={1.4} />
                    </div>

                    <div className="list-details-section">
                    </div>
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

              {isShowDetailsSelected && (
                <div className="details-container">
                  <div style={{ flex: 1 }}>
                    <strong>Description</strong>
                    <br />
                    {activeList?.description || 'No description'}
                  </div>
                  <div className="details-grid" style={{ flex: 2 }}>
                    <div><strong>Owner:</strong> {activeList?.type === 'userList' ? activeList?.owner.username : activeList?.owner.name}</div>
                    <div><strong>List Type:</strong> {activeList?.type}</div>
                    <div><strong>Created:</strong> {activeList?.createdAt ? formatDate(activeList.createdAt) : 'N/A'}</div>
                    <div><strong>Visibility:</strong> {activeList?.visibility}</div>
                    <div><strong>Time to complete: </strong> {totalTimeToComplete || 'N/A'}</div>
                    <div><strong>Last Modified:</strong> {activeList?.updatedAt ? formatDate(activeList.updatedAt) : 'N/A'}</div>
                  </div>
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

                    {loggedInUser.myLists
                      .find(list => list.listName === loggedInUser.activeList)
                      .tags.slice(0, showAll ? undefined : 3)
                      .map((tag, index) => {
                        return (
                          <Chip
                            key={index}
                            label={tag.label}
                            className="chip"
                            style={{
                              background: `linear-gradient(135deg, ${tag.color} 25%, ${tag.color} 75%)`,
                              boxShadow: `0 3px 5px 2px rgba(255, 105, 135, .3), inset 0 1px 2px rgba(255, 255, 255, 0.3)`,
                              color: tag.textColor,
                            }}
                            onDelete={() => deleteTag(tag._id, tag)}
                            deleteIcon={
                              <Icon
                                path={mdiCloseCircle}
                                size={1}
                                color={tag.textColor}
                                className="delete-icon" // Apply CSS class
                              />
                            }
                            sx={{
                              margin: '0.5em',
                              height: '2em',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: `0 3px 5px 2px rgba(255, 105, 135, .6), inset 0 1px 2px rgba(255, 255, 255, 0.5)`,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
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

                    {loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList).tags.length > 3 && (
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
