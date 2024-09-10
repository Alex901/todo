import './App.css'
import './App.mobile.css'
import Header from './components/Layout/header/Header'
import Card from './components/Layout/card/Card'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import AnythingList from './components/Todo/List/AnythingList'
import { useTodoContext } from './contexts/todoContexts'
import { useUserContext } from './contexts/UserContext'
import { useGroupContext } from './contexts/GroupContexts'
import { useMediaQuery } from '@mui/material';
import CreateListModal from './components/Todo/TodoModal/CreateListModal/CreateListModal'
import DeleteListModal from './components/Todo/TodoModal/DeleteListModal/DeleteListModal'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { toast } from "react-toastify";
import Icon from '@mdi/react';
import {
  mdiDelete, mdiPlus, mdiMinus, mdiFileExport, mdiAccountGroup, mdiTextBoxEditOutline,
  mdiPlaylistEdit, mdiDeleteEmpty, mdiPencil, mdiArchiveArrowDownOutline, mdiArchiveArrowUpOutline, mdiCloseCircle,
  mdiTimerCheckOutline, mdiTimelineClockOutline, mdiEyeOutline, mdiWrenchClock, mdiFolderPlusOutline, mdiFormatListBulletedType, mdiBadgeAccountOutline,
  mdiSelectGroup, mdiVoteOutline
} from '@mdi/js';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import { SketchPicker } from 'react-color';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Select, MenuItem, ListItemText, FormControl, InputLabel, Typography, IconButton, Tooltip, Checkbox, FormControlLabel } from '@mui/material';
import GroupModal from './components/Todo/TodoModal/GroupModal/GroupModal'
import LandingPage from './pages/LandingPage/LandingPage'
import { MagnifyingGlass } from "react-loader-spinner";
import ColorPickerButton from './components/UtilityComponents/ColorPickerButton/ColorPickerButton'
import 'material-design-lite/dist/material.min.css';
import 'material-design-lite/dist/material.min.js';
import ExportListModal from './components/Todo/TodoModal/ExportListModal/ExportListModal'
import EditListModal from './components/Todo/TodoModal/EditListModal/EditListModal'
import Draggable from 'react-draggable';
import ProgressArea from './components/UtilityComponents/ProgressArea/ProgressArea'
import VoteModal from './components/Todo/TodoModal/VoteModal/VoteModal'
import FirstTimeLoginModal from './components/Todo/TodoModal/FirstTimeLoginModal/FirstTimeLoginModal'
import BottomDrawer from './components/Mobile/BottomDrawer/BottomDrawer'
import BottomDrawerButton from './components/Mobile/BottomDrawerButton/BottomDrawerButton'

function App() {
  const [activeView, setActiveView] = useState('todo');
  const { getTodoCount, getDoneCount, getDoingCount, getActiveListTodoCount, getActiveListDoingCount, getActiveListDoneCount,
    getListDoingCount, getListDoneCount, getListTodoCount, todoList } = useTodoContext();
  const { loggedInUser, isLoggedIn, setLoggedInUser, setActiveList, deleteList, addTag, deleteTag, checkLogin, toggleShowDetails, updateSettings } = useUserContext();
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
  const [totalTimeSpent, setTotalTimeSpent] = useState("");
  const [selectedColor, setSelectedColor] = useState('#1e34a4');
  const popperRef = useRef(null);
  const [isGroupOnlySelected, setIsGroupOnlySelected] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const { isModerator, deleteGroupList, isGroupList } = useGroupContext();
  const [progressBarWidth, setProgressBarWidth] = useState(50);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const containerRef = useRef(null);
  const [entriesInActiveList, setEntriesInActiveList] = useState([]);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isFirstTimeLoginModalOpen, setIsFirstTimeLoginModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:800px)');

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const openNewLoginModal = () => {
    setIsFirstTimeLoginModalOpen(true);
  }

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.__v === 0) {
        openNewLoginModal();
      }
    }
  }, [loggedInUser]);

  // useEffect(() => {
  //   console.log("DEBUG -- App.js -- loggedInUser: ", loggedInUser)
  // }, [loggedInUser]);

  const activeList = loggedInUser?.myLists.find(list => list.listName === loggedInUser.activeList);

  useMemo(() => {
    setEntriesInActiveList([]);
    if (todoList && loggedInUser) {
      todoList.forEach(todo => {
        if (todo.inListNew.some(list => list?.listName?.toLowerCase() === loggedInUser.activeList.toLowerCase())) {
          setEntriesInActiveList(entriesInActiveList => [...entriesInActiveList, todo]);
        }
      });
    }
  }, [todoList, loggedInUser]);


  //WTF is this ? 
  const handleDrag = (e, data) => {
    const containerWidth = containerRef.current.offsetWidth;
    const deltaWidth = (data.deltaX / containerWidth) * 100;
    let newWidth = progressBarWidth + deltaWidth;

    // Clamp the new width between 25% and 75%
    newWidth = Math.max(25, Math.min(newWidth, 75));

    setProgressBarWidth(newWidth);
  };

  const calculateBounds = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const boundOffset = containerWidth * 0.25;
      return { left: -boundOffset, right: boundOffset };
    }
    return { left: 0, right: 0 };
  };

  const memoizedBounds = useMemo(calculateBounds, [containerRef.current?.offsetWidth]);

  useEffect(() => {
    const handleResize = () => {
      setBounds(calculateBounds());
    };

    window.addEventListener('resize', handleResize);
    setBounds(memoizedBounds);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [memoizedBounds]);

  //Load settings
  useEffect(() => {
    if (loggedInUser?.settings?.todoList?.groupOnly !== undefined) {
      setIsGroupOnlySelected(loggedInUser.settings.todoList.groupOnly);
    }
  }, [loggedInUser]);

  const webSafeColors = [
    '#000000', '#0000FF', '#00FF00', '#FF0000',
    '#00FFFF', '#FF00FF', '#FFFF00', '#C0C0C0',
    '#808080', '#800000', '#808000', '#800080',
    '#008080', '#FFA500', '#A52A2A', '#8A2BE2'
  ];




  const handleClickOutside = (event) => {
    if (event.target.classList.contains('color-swatch') || event.target.classList.contains('color-picker')) {
      return; // Do nothing if the click is on a color picker element
    }
    if (popperRef.current && !popperRef.current.contains(event.target) && !newTagAnchorRef.current.contains(event.target)) {
      setIsNewTagPopperOpen(false);
    }
  };

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
    if (mins > 0 || formatted === '') formatted += `${Math.round(mins)} minute${Math.round(mins) > 1 ? 's' : ''}`;

    return formatted.trim();
  };

  useEffect(() => {
    if (isNewTagPopperOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNewTagPopperOpen]);

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
      const totalTimeToComplete = todoList
        .filter(todo => {
          const isMatch = todo.inListNew.some(list => list.listName.toLowerCase() === activeList.listName.toLowerCase());
          const isNotCompleted = todo.completed === null;
          return isMatch && isNotCompleted;
        })
        .reduce((acc, todo) => acc + todo.estimatedTime, 0);

      const totalTimeSpent = todoList
        .filter(todo => {
          const isMatch = todo.inListNew.some(list => list.listName.toLowerCase() === activeList.listName.toLowerCase());
          const isCompleted = todo.completed !== null;
          return isMatch && isCompleted;
        })
        .reduce((acc, todo) => {
          const timeSpent = todo.totalTimeSpent / 60000; // Convert milliseconds to minutes
          const newAcc = acc + timeSpent;
          return newAcc;
        }, 0);


      const formattedTimeToComplete = formatDuration(totalTimeToComplete);
      const formattedTimeSpent = formatDuration(totalTimeSpent); // Convert milliseconds to minutes

      setTotalTimeToComplete(formattedTimeToComplete);
      setTotalTimeSpent(formattedTimeSpent);
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
    if (event.target.value) {
      setLoggedInUser({ ...loggedInUser, activeList: event.target.value });
      setActiveList(event.target.value);
    } else {
      setLoggedInUser({ ...loggedInUser, activeList: loggedInUser.listNames[0] });
      setActiveList(loggedInUser.listNames[0]);
    }
  }

  const openCreateListModal = (event) => {
    if (isDrawerOpen) {
      setDrawerOpen(false);
      setTimeout(() => {
        setIsCreateListModalOpen(true);
      }, 300);
    } else {
      event.preventDefault();
      setIsCreateListModalOpen(true);
    }
  };

  const closeCreateListModal = () => {
    setIsCreateListModalOpen(false);
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const openDeleteListModal = (event) => {
    if (isDrawerOpen) {
      setDrawerOpen(false);
      setTimeout(() => {
        setIsDeleteListModalOpen(true);
      }, 300);
    } else {
      event.preventDefault();
      setIsDeleteListModalOpen(true);
    }
  };

  const handleCloseDeleteListModal = () => {
    setIsDeleteListModalOpen(false);
    if (isMobile) {
      setDrawerOpen(true);
    }
  }




  const closeNewLoginModal = () => {
    setIsFirstTimeLoginModalOpen(false);
  }

  const handleDelete = (list, event) => {
    //console.log("DEBUG -- is list to delete a group list? ", isGroupList(list))
    event.preventDefault();
    const lisToDelete = loggedInUser.activeList
    if (lisToDelete === 'all' || lisToDelete === 'today') {
      toast.error("You cannot delete this list!");
      setIsDeleteListModalOpen(false);
      return;
    }
    if (isGroupList(list)) {
      console.log("List is a group list, delete group list now!")
      if (isModerator(loggedInUser, lisToDelete, list.owner._id)) {
        console.log("You are a moderator of this group, delete group list now!")
        deleteGroupList(list);
      } else {
        console.log("You are not a moderator of this group, you cannot delete this group list!")
        toast.error("You don't have permission to delete this project");
      }
      //deleteGroupList
    } else {
      console.log("Delete user list now")
      deleteList(lisToDelete);
    }

    //toast.success(`List "${lisToDelete}" deleted!`);
    setDeleteListError("");
    handleCloseDeleteListModal();
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
    const tagColor = selectedColor;
    //const tagColor = document.querySelector('input[type="color"]').value;
    const brightness = getBrightness(tagColor);
    const textColor = brightness > 128 ? 'black' : 'white';
    const textColorHex = getHexColor(textColor);

    addTag(tagName, tagColor, textColorHex);
    setIsNewTagPopperOpen(false);
  }

  const openExportModal = () => {
    if (isDrawerOpen) {
      setDrawerOpen(false);
      setTimeout(() => {
        setIsOpenListModalOpen(true);
      }, 300); // Adjust the delay as needed
    } else {
      setIsOpenListModalOpen(true);
    }
  };

  const closeExportListModal = () => {
    if (isMobile) {
      setDrawerOpen(true);
    }
    setIsOpenListModalOpen(false);
  };

  const openGroupModal = () => {
    if (!isGroupModalOpen) {
      setIsGroupModalOpen(true);
    }
  };

  const openVoteModal = () => {
    if (!isVoteModalOpen) {
      setIsVoteModalOpen(true);
    }
  };

  const closeVoteModal = () => {
    setIsVoteModalOpen(false);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const openEditListModal = (list) => {
    if (loggedInUser.activeList === 'all' || loggedInUser.activeList === 'today') {
      toast.error(`You cannot edit this project!`);
      return;
    } else if (list.ownerModel === "Group" && !isModerator(loggedInUser, loggedInUser.activeList, list.owner._id)) {
      toast.error("You don't have permission to edit this project!");
      return;
    } else {

      if (isDrawerOpen) {
        setDrawerOpen(false);
        setTimeout(() => {
          setIsEditListModalOpen(true);
        }, 300);
      } else {
        setIsEditListModalOpen(true);
      }
    }
  }

  const CloseEditListModal = () => {
    setIsEditListModalOpen(false);
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

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

  const handleColorChange = (color) => {
    setSelectedColor(color);
  }

  const toggleGroupOnly = () => {
    updateSettings("groupOnly", !isGroupOnlySelected);
    setIsGroupOnlySelected(prevState => !prevState);
  }



  return (

    <div className='app'>
      <FirstTimeLoginModal open={isFirstTimeLoginModalOpen} onClose={closeNewLoginModal} />
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


              {isMobile ? (
                <BottomDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} >
                  {/* First row */}
                  {isLoggedIn && (
                    <div className={`listSelection${isMobile ? '-mobile' : ''}`}>
                      <div className={`list-selection-settings${isMobile ? '-mobile' : ''}`}>
                        <div className={`list-checkbox-container${isMobile ? '-mobile' : ''}`}>
                          <FormControlLabel
                            control={<Checkbox
                              checked={isGroupOnlySelected}
                              onChange={toggleGroupOnly}
                            />}
                            label="Show groups only"
                          />
                        </div>
                      </div>
                      <FormControl variant='standard' style={{ width: '22em', margin: '10px' }}>
                        <InputLabel id="active-list-label" style={{ fontWeight: 'bold' }}>Active Project </InputLabel>
                        <Select
                          labelId="active-list-label"
                          label="Active listt"
                          className={`select-list${isMobile ? '-mobile' : ''}`}
                          size='small'
                          value={loggedInUser.activeList || ""}
                          onChange={handleListChange}
                        >
                          {loggedInUser.myLists && loggedInUser.myLists
                            .filter(list => !isGroupOnlySelected || list.ownerModel === "Group")
                            .map(list => {
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

                      <div className={`icon-buttons${isMobile ? '-mobile' : ''}`}>
                        <div className={`icon-button add${isMobile ? '-mobile' : ''}`}
                          onClick={openCreateListModal}
                          style={{ marginLeft: 10 }}
                        >
                          <Icon path={mdiPlus} size={1.6} />
                        </div>

                        <div
                          className={`icon-button edit${isMobile ? '-mobile' : ''}`}
                          onClick={() => openEditListModal(loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList))}
                          onMouseEnter={() => setIsEditHovered(true)}
                          onMouseLeave={() => setIsEditHovered(false)}
                        >
                          <Icon path={isEditHovered ? mdiPencil : mdiTextBoxEditOutline} size={1.4} />
                        </div>

                        <div className={`icon-button description${isMobile ? '-mobile' : ''}`} onClick={toggleDetails}>
                          <Icon path={isShowDetailsSelected ? mdiArchiveArrowUpOutline : mdiArchiveArrowDownOutline} size={1.4} />
                        </div>

                        <div
                          className={`icon-button delete${isMobile ? '-mobile' : ''}`}
                          onClick={openDeleteListModal}
                          onMouseEnter={() => setIsDeleteHovered(true)}
                          onMouseLeave={() => setIsDeleteHovered(false)}
                        >
                          <Icon path={isDeleteHovered ? mdiDeleteEmpty : mdiDelete} size={1.4} />
                        </div>

                        <div className={`list-details-section${isMobile ? '-mobile' : ''}`}>
                        </div>
                      </div>


                    </div>
                  )}

                  {isShowDetailsSelected && (
                    <div className={`details-rows${isMobile ? '-mobile' : ''}`}>
                      <div className={`details-container${isMobile ? '-mobile' : ''}`}>
                        {activeList?.description ? (
                          <div style={{ flex: 1 }}>
                            <strong className={`list-description-title${isMobile ? '-mobile' : ''}`}>Description</strong>
                            <br />
                            <span className={`list-description-text${isMobile ? '-mobile' : ''}`}>
                              {activeList.description}
                            </span>
                          </div>
                        ) : null}
                        <div className={`details-grid${isMobile ? '-mobile' : ''}`} style={{ flex: 2 }}>
                          <Tooltip title="Owner of this project">
                            <div>
                              <Icon path={mdiBadgeAccountOutline} size={1.2} />
                              {activeList?.type === 'userList' ? activeList?.owner.username : activeList?.owner.name}
                            </div>
                          </Tooltip>
                          <Tooltip title="Type of list, Group or Personal">
                            <div>
                              <Icon className={`details-icon${isMobile ? '-mobile' : ''}`} path={mdiFormatListBulletedType} size={1.2} />
                              {activeList?.ownerModel === 'User' ? 'Personal' : 'Group'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Date when the list was created">
                            <div>
                              <Icon path={mdiFolderPlusOutline} size={1.2} />
                              {activeList?.createdAt ? formatDate(activeList.createdAt) : 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Visibility of the list">
                            <div>
                              <Icon path={mdiEyeOutline} size={1.2} />
                              {activeList?.visibility}
                            </div>
                          </Tooltip>
                          <Tooltip title="Estimated time to complete the project">
                            <div>
                              <Icon path={mdiTimerCheckOutline} size={1.2} />
                              {totalTimeToComplete || 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Date when the list was last modified">
                            <div>
                              <Icon path={mdiWrenchClock} size={1.2} />
                              {activeList?.updatedAt ? formatDate(activeList.updatedAt) : 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Total time spent on the project">
                            <div>
                              <Icon path={mdiTimelineClockOutline} size={1.2} />
                              {totalTimeSpent || 'N/A'}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                      <div className={`details-settings${isMobile ? '-mobile' : ''}`}>
                        <div className={`settings-section${isMobile ? '-mobile' : ''}`}>
                          <h6 className={`title${isMobile ? '-mobile' : ''}`}>Settings</h6>
                          {/* Add relevant settings here */}
                        </div>
                        <div className={`share-section${isMobile ? '-mobile' : ''}`}>
                          <h6 className={`title${isMobile ? '-mobile' : ''}`}>Share</h6>
                          {/* Add share details here */}
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className={`functions-container${isMobile ? '-mobile' : ''}`} ref={containerRef} style={{}}>
                      <div className={`progress-bar-container${isMobile ? '-mobile' : ''}`} style={{ width: `${progressBarWidth + 20}%` }}>
                        <>
                          <ProgressArea tasksInActiveList={entriesInActiveList}>
                            {/* Children components or elements go here */}
                          </ProgressArea>
                        </>
                      </div>

                      <div className={`icons-container${isMobile ? '-mobile' : ''}`} style={{ display: 'flex', gap: '5px', width: `${100 - progressBarWidth}%` }}>
                        <IconButton className={`icon-button${isMobile ? '-mobile' : ''}`} onClick={openExportModal}>
                          <Icon path={mdiFileExport} size={1.2} />
                        </IconButton>
                      </div>
                    </div>
                  )}

                  <ExportListModal isOpen={isOpenListModalOpen} onClose={closeExportListModal} />


                  {isLoggedIn && (
                    <div className={`tags-container${isMobile ? '-mobile' : ''}`}>
                      <div className={`tags${isMobile ? '-mobile' : ''}`} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {loggedInUser.myLists
                          .find(list => list.listName === loggedInUser.activeList)?.tags.slice(0, showAll ? undefined : 3)
                          .map((tag, index) => {
                            return (
                              <Chip
                                key={index}
                                label={tag.label}
                                className={`chip${isMobile ? '-mobile' : ''}`}
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
                                    className={`delete-icon${isMobile ? '-mobile' : ''}`} // Apply CSS class
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
                            className={`add-tag${isMobile ? '-mobile' : ''}`}
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
                  <Popper open={isNewTagPopperOpen} ref={popperRef} anchorEl={newTagAnchorRef.current} placement='top' className="popper-content-mobile">
                    <div className={`new-tag-popper-container${isMobile ? '-mobile' : ''}`}>
                      <h5 style={{ margin: '8px', marginBottom: '8px' }}>Create new tag</h5>
                      <form className={`new-tag-popper-form${isMobile ? '-mobile' : ''}`} onSubmit={handleNewTagSubmit}>
                        <div className={`new-tag-inputs${isMobile ? '-mobile' : ''}`}>
                          <TextField label="Tag name" variant="outlined" size="small" />
                          <ColorPickerButton webSafeColors={webSafeColors} selectedColor={selectedColor} handleColorSelect={handleColorChange} />
                        </div>
                        <Button type="submit" variant="contained" >
                          Submit
                        </Button>
                      </form>
                    </div>
                  </Popper>

                </BottomDrawer>
              ) : (
                <>
                  {isLoggedIn && (
                    <div className="listSelection">
                      <div className="list-selection-settings">
                        <div className="list-checkbox-container">
                          <FormControlLabel
                            control={<Checkbox
                              checked={isGroupOnlySelected}
                              onChange={toggleGroupOnly}
                            />}
                            label="Show groups only"
                          />
                        </div>
                      </div>
                      <FormControl variant='standard' style={{ width: '22em', margin: '10px' }}>
                        <InputLabel id="active-list-label" style={{ fontWeight: 'bold' }}>Active Project </InputLabel>
                        <Select
                          labelId="active-list-label"
                          label="Active listt"
                          className="select-list"
                          size='small'
                          value={loggedInUser.activeList || ""}
                          onChange={handleListChange}
                        >

                          {loggedInUser.myLists && loggedInUser.myLists
                            .filter(list => !isGroupOnlySelected || list.ownerModel === "Group")
                            .map(list => {
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
                        <div className="icon-button add"
                          onClick={openCreateListModal}
                          style={{ marginLeft: 10 }}
                        >
                          <Icon path={mdiPlus} size={1.6} />
                        </div>

                        <div
                          className="icon-button edit"
                          onClick={() => openEditListModal(loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList))}
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


                    </div>
                  )}



                  {isShowDetailsSelected && (
                    <div className="details-rows">
                      <div className="details-container">
                        {activeList?.description ? (
                          <div style={{ flex: 1 }}>
                            <strong className="list-description-title">Description</strong>
                            <br />
                            <span className="list-description-text">
                              {activeList.description}
                            </span>
                          </div>
                        ) : null}
                        <div className="details-grid" style={{ flex: 2 }}>
                          <Tooltip title="Owner of this project">
                            <div>
                              <Icon path={mdiBadgeAccountOutline} size={1.2} />
                              {activeList?.type === 'userList' ? activeList?.owner.username : activeList?.owner.name}
                            </div>
                          </Tooltip>
                          <Tooltip title="Type of list, Group or Personal">
                            <div>
                              <Icon className="details-icon" path={mdiFormatListBulletedType} size={1.2} />
                              {activeList?.ownerModel === 'User' ? 'Personal' : 'Group'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Date when the list was created">
                            <div>
                              <Icon path={mdiFolderPlusOutline} size={1.2} />
                              {activeList?.createdAt ? formatDate(activeList.createdAt) : 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Visibility of the list">
                            <div>
                              <Icon path={mdiEyeOutline} size={1.2} />
                              {activeList?.visibility}
                            </div>
                          </Tooltip>
                          <Tooltip title="Estimated time to complete the project">
                            <div>
                              <Icon path={mdiTimerCheckOutline} size={1.2} />
                              {totalTimeToComplete || 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Date when the list was last modified">
                            <div>
                              <Icon path={mdiWrenchClock} size={1.2} />
                              {activeList?.updatedAt ? formatDate(activeList.updatedAt) : 'N/A'}
                            </div>
                          </Tooltip>
                          <Tooltip title="Total time spent on the project">
                            <div>
                              <Icon path={mdiTimelineClockOutline} size={1.2} />
                              {totalTimeSpent || 'N/A'}
                            </div>
                          </Tooltip>
                        </div>

                      </div>
                      <div className="details-settings">
                        <div className="settings-section">
                          <h6 className="title">Settings</h6>
                          {/* Add relevant settings here */}
                        </div>
                        <div className="share-section">
                          <h6 className="title">Share</h6>
                          {/* Add share details here */}
                        </div>
                      </div>
                    </div>

                  )}


                  {isLoggedIn && (
                    <div className="functions-container" ref={containerRef} style={{

                    }}>
                      <div className="progress-bar-container" style={{ width: `${progressBarWidth + 20}%` }}>
                        <>
                          <ProgressArea tasksInActiveList={entriesInActiveList}>
                            {/* Children components or elements go here */}
                          </ProgressArea>
                        </>
                      </div>

                      <div className="icons-container" style={{ display: 'flex', gap: '5px', width: `${100 - progressBarWidth}%` }}>
                        <IconButton className="icon-button" onClick={openGroupModal}>
                          <Icon path={mdiAccountGroup} size={1.2} />
                        </IconButton>
                        <IconButton className="icon-button" onClick={openVoteModal}>
                          <Icon path={mdiVoteOutline} size={1.2} />
                        </IconButton>
                        <IconButton className="icon-button" onClick={openExportModal}>
                          <Icon path={mdiFileExport} size={1.2} />
                        </IconButton>
                      </div>
                    </div>
                  )}


                  <GroupModal isOpen={isGroupModalOpen} onClose={closeGroupModal} />
                  <VoteModal isOpen={isVoteModalOpen} onClose={closeVoteModal} />



                  {isLoggedIn && (

                    <div className="tags-container">
                      <div className='tags' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

                        {loggedInUser.myLists
                          .find(list => list.listName === loggedInUser.activeList)?.tags.slice(0, showAll ? undefined : 3)
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
                  <Popper open={isNewTagPopperOpen} ref={popperRef} anchorEl={newTagAnchorRef.current} placement='bottom'>
                    <div className='new-tag-popper-container'>
                      <h5 style={{ margin: '8px', marginBottom: '8px' }}>Create new tag</h5>
                      <form className='new-tag-popper-form' onSubmit={handleNewTagSubmit}>
                        <div className="new-tag-inputs">
                          <TextField label="Tag name" variant="outlined" size="small" />
                          <ColorPickerButton webSafeColors={webSafeColors} selectedColor={selectedColor} handleColorSelect={handleColorChange} />
                        </div>
                        <Button type="submit" variant="contained" >
                          Submit
                        </Button>
                      </form>
                    </div>
                  </Popper>
                </>
              )}

              {isLoggedIn && !isMobile && <hr style={{ width: '80%', margin: '1em auto' }}></hr>}

              {/* Second row */}
              <div className='sticky-container'>
                <div style={{ display: 'flex', justifyContent: 'center', position: 'sticky', top: 0 }}>
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
            </div>

            <CreateListModal
              isOpen={isCreateListModalOpen}
              onRequestClose={closeCreateListModal}

            />

            <EditListModal
              isOpen={isEditListModalOpen}
              onRequestClose={CloseEditListModal}
              listData={loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList)}
            />

            <DeleteListModal
              isOpen={isdDeleteListModalOpen}
              onRequestClose={handleCloseDeleteListModal}
              listName={loggedInUser.activeList}
              onDelete={(event) => {
                event.preventDefault();
                handleDelete(loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList), event);
              }}
              onCancel={handleCloseDeleteListModal}
              errorMessage={deleteListError}
            />

            <ExportListModal isOpen={isOpenListModalOpen} onClose={closeExportListModal} />

            <AnythingList type={activeView} />
            {isMobile && (
              <div className="bottom-drawer-button-wrapper">
                <BottomDrawerButton listName={loggedInUser.activeList} onOpen={handleOpenDrawer} />
              </div>
            )}
          </Card>

        </div>
      )}
      {!isLoggedIn && !loggedInUser && <LandingPage />}
    </div>
  )
}

export default App
