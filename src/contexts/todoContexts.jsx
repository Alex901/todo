import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useGroupContext } from './GroupContexts';
import { toast } from "react-toastify";
let BASE_URL;

if (process.env.NODE_ENV === 'test') {
  import('../../config').then((config) => {
    BASE_URL = config.default;
  });
} else {
  import('../../config.vite').then((config) => {
    BASE_URL = config.default;
  });
}

// TODO: Get rid of this mess
const TodoContext = createContext({
  todoList: [],
  listToday: [],
  addTodo: () => { },
  editTodo: () => { },
  removeTodo: () => { },
  toggleTodoComplete: () => { },
  getTodoCount: () => { },
  getDoneCount: () => { },
  getDoingCount: () => { },
  toggleTodoStart: () => { },
  fetchTodoList: () => { },
  refreshTodoList: () => { },
  cancelTodo: () => { },
  getActiveListDoingCount: () => { },
  getActiveListDoneCount: () => { },
  getActiveListTodoCount: () => { },
  getListTodoCount: () => { },
  getListDoneCount: () => { },
  getListDoingCount: () => { },
  setStepUncomplete: () => { },
});




const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);
  const [listToday, setListToday] = useState([]); //List of repeatable tasks for today
  const [dataFetched, setDataFetched] = useState(false);
  const { loggedInUser, userList } = useUserContext(); //Logged in username&&list
  const { userGroupList } = useGroupContext();

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  //Not sure if this is the best solution
  useEffect(() => {
    if (!dataFetched || loggedInUser) {
      fetchTodoList();
    }
  }, [dataFetched, loggedInUser]);

  const refreshTodoList = () => {

  };

  useEffect(() => {
    if (loggedInUser && todoList.length > 0) {
      console.log("DEBUG -- todoList -- todoContext", todoList);
  
      const tasksIsToday = todoList.filter(task => task.isToday);
      const tasksInTodayList = todoList.filter(task => task.inListNew.some(list => list.listName === 'today'));
  
      console.log("Tasks with isToday:", tasksIsToday);
      console.log("Tasks in 'today' list:", tasksInTodayList);
  
      const filteredTasks = todoList.filter(task =>
          task.isToday || task.inListNew.some(list => list.listName === 'today')
      );
  
      setListToday(filteredTasks);
    }
  }, [todoList, loggedInUser]);

  // useEffect(() => {
  //   if (loggedInUser && listToday.length > 0) {
  //     console.log("DEBUG -- listToday -- todoContext", listToday);

  //   }
  // }, [listToday]);

  //API interactions


  const fetchTodoList = async () => {
    //console.log("DEBUG: Fetching todo list, checking group lists: ", userGroupList);

    if (!loggedInUser) {
      return;
    }

    try {
      const url = isMobileDevice() ? `${BASE_URL}/api/todos/mobile` : `${BASE_URL}/api/todos`;
      const response = await axios.get(url, {
        withCredentials: !isMobileDevice(),
        headers: isMobileDevice() && loggedInUser ? { 'User': loggedInUser._id } : {},
      });

      let parsedData = response.data.map(todo => ({
        ...todo,
        created: new Date(todo.created),
        completed: todo.completed ? new Date(todo.completed) : null,
        started: todo.started ? new Date(todo.started) : null,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null
      }));

      //console.log("\x1b[31mDEBUG\x1b[0m - parsedData.length", parsedData.length);
      setTodoList(parsedData);


    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addTodo = async (newTaskData) => {
    console.log("addTodo: newTaskData", newTaskData);
    try {
      let groupOwner = loggedInUser ? loggedInUser._id : null;


      const newId = parseInt(Date.now().toString(36) + Math.random().toString(36).substr(2), 36); //but why? xD
      const allListId = loggedInUser.myLists.find(list => list.listName === 'all')._id;

      let inListNewTmp = [allListId];

      if (loggedInUser.activeList !== 'all') {
        const activeListId = loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList);
        if (activeListId) {
          if (activeListId.type === 'groupList') {
            groupOwner = activeListId.owner; //lists can be owned by groups, so in case of group the group owns the todo

            const index = inListNewTmp.indexOf(allListId);
            if (index !== -1) {
              inListNewTmp.splice(index, 1);
            }
          }
          inListNewTmp.push(activeListId._id);
        }
      }

      // Get today's date range
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Check if dueDate is within today's date range
      if (newTaskData.dueDate) {
        const dueDate = new Date(newTaskData.dueDate);
        if (dueDate >= todayStart && dueDate <= todayEnd) {
          const todayListId = loggedInUser.myLists.find(list => list.listName === 'today');
          if (todayListId) {
            inListNewTmp.push(todayListId._id);
          }
        }
      }

      //TODO: some typesafety here, also this is really dumb. Remake this at some point
      const newTodo = {
        id: newId,
        task: newTaskData.taskName,
        tags: newTaskData.tags || [],
        isDone: false,
        created: new Date(),
        completed: null,
        isStarted: false,
        estimatedTime: newTaskData.estimatedTime || null,
        started: null,
        owner: groupOwner, //TODO: remember to change this to references if I ever need to populate
        difficulty: newTaskData.difficulty || "",
        //  assignee: [...User],
        steps: newTaskData.steps || [],
        priority: newTaskData.priority || "NORMAL",
        //  observers: [...User],
        dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : null, //TODO: remember to parse
        description: newTaskData.description || null,
        isUrgent: newTaskData.isUrgent || false, //And this one
        inList: loggedInUser ? ['all'].concat(loggedInUser.activeList !== 'all' ? [loggedInUser.activeList] : []) : [], //Mark for deletion
        inListNew: inListNewTmp,
      };
      // console.log("DEBUG -- NewTodo", newTodo);
      // console.log("addTodo: newTodo", newTodo);
      if (newTaskData.repeatable) {
        Object.assign(newTodo, {
          repeatable: newTaskData.repeatable,
          repeatInterval: newTaskData.repeatInterval,
          repeatableEmoji: newTaskData.repeatableEmoji,
          repeatNotify: newTaskData.repeatNotify,
          ...(newTaskData.repeatDays && newTaskData.repeatDays.length > 0 ? { repeatDays: newTaskData.repeatDays } : {}),
          ...(newTaskData.repeatMonthlyOption ? { repeatMonthlyOption: newTaskData.repeatMonthlyOption } : {}),
          ...(newTaskData.repeatYearlyOption ? { repeatYearlyOption: newTaskData.repeatYearlyOption } : {}),
          ...(newTaskData.repeatUntil ? { repeatUntil: newTaskData.repeatUntil } : {}),
        })
      }

      if (loggedInUser.activeList === 'today') {
        Object.assign(newTodo, {
          isToday: true
        })
      }

      const response = await axios.post(`${BASE_URL}/api/`, newTodo);
      if (response.status === 201) {
        const updatedTodoList = [
          ...todoList,
          {
            ...response.data,
            comleted: response.data.completed ? new Date(response.data.comleted) : null,
            created: new Date(response.data.created),
            isStarted: response.data.isStarted ? true : false,
            started: response.data.completed ? new Date(response.data.started) : null,
            dueDate: response.data.dueDate ? new Date(response.data.dueDate) : null //TODO: remember to change this
          }
        ];

        fetchTodoList();
      } else {
        console.error('Error adding todo:', response.statusText)
      }
    } catch (error) {
      console.error('error adding todo: ');
    }
  };

  const toggleTodoComplete = async (id) => {
    //console.log("todoContext > toggleTodoComplete -> id: ", id);
    try {
      const todo = todoList.find(todo => todo.id === id);
      if (!todo) {
        console.error("Todo not found in database");
        return;
      }
      //extract _id
      const taskId = todo._id;

      const response = await axios.patch(`${BASE_URL}/api/done`, { taskId });
      if (response.status === 200) {
        const updatedTodoList = todoList.map(todo => {
          if (todo.id === id) {
            return { ...todo, isDone: true, completed: new Date() };
          }
          return todo;
        });
        setTodoList(updatedTodoList);
        fetchTodoList();
        console.log('Task marked as done successfully');
      } else {
        console.error('Error marking task as done:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  };

  const removeTodo = async (id) => {
    try {
      const todo = todoList.find(todo => todo.id === id);
      if (!todo) {
        console.error("Todo not found in database");
        return;
      }
      //extract _id
      const taskId = todo._id;

      const response = await axios.delete(`${BASE_URL}/api/delete/${taskId}`);
      if (response.status === 200) {
        setTodoList(prevTodoList => prevTodoList.filter(todo => todo.id !== id));
        toast.success(`Your task has been deleted.`);
      } else {
        console.error('Error deleting todo ', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo: ', error);
      return;
    }
  };

  const toggleTodoStart = async (id) => {
    try {
      const todo = todoList.find(todo => todo.id === id);
      if (!todo) {
        console.error("Todo not found in database");
        return;
      }
      //extract _id
      const taskId = todo._id;

      const response = await axios.patch(`${BASE_URL}/api/start`, { taskId });
      if (response.status === 200) {
        const updatedTodoList = todoList.map(todo => {
          if (todo.id === id) {
            return { ...todo, isStarted: true, started: new Date() };
          }
          return todo;
        });
        setTodoList(updatedTodoList);
        fetchTodoList();
      } else {
        console.error('Error marking task as done:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  }

  const cancelTodo = async (id) => {
    try {
      const todo = todoList.find(todo => todo.id === id);
      if (!todo) {
        console.error("Todo not found in database");
        return;
      }
      //extract _id
      const taskId = todo._id;

      const response = await axios.patch(`${BASE_URL}/api/cancel`, { taskId });
      //console.log("cancelTask: response", response);
      if (response.status === 200) {
        const updatedTodoList = todoList.map(todo => {
          if (todo.id === id) {
            console.log("todo: ", todo);
            return { ...todo, isStarted: false, started: null };
          }
          return todo;
        });
        setTodoList(updatedTodoList);
        fetchTodoList();


      } else {
        console.error('Error Cancling task', response.statusText);
      }
    } catch (error) {
      return;
    }
  };

  const editTodo = async (updatedTask) => {
    console.log("todoContext: editTodo: updatedTask", updatedTask);
    try {
      const taskId = todoList.find(todo => todo.id === updatedTask.id)._id;

      const response = await axios.patch(`${BASE_URL}/api/edit`, {
        taskId,
        updatedTask
      });

      if (response.status === 200) {
        setTodoList(prevTodoList => prevTodoList.map(todo => {
          if (todo._id === taskId) {
            return { ...todo, ...updatedTask }
          }
          return todo;
        }));
      } else {
        console.error("Error updating task: ", response.statusText);
      }
    } catch (error) {
      console.error('Internal Server error: ', error);
    }

    setTodoList(prevTodoList => prevTodoList.map(todo => {
      if (todo.id === updatedTask.id) {
        return { ...todo, ...updatedTask }
      }
      return todo;
    }));
  }

  //Helper function to easilly update my database, this is quite dumb
  const updateDatabase = async () => {
    try {
      const updatedData = {
        owner: 'Alzner',
        steps: [],
        dueDate: new Date(),
        inList: ['all', 'TaskForge'],
        isUrgent: false,
        priority: 'NORMAL',
        description: null,
        difficulty: 'EASY',
        estimatedTime: null,
      };

      const response = await axios.patch(`${BASE_URL}/api/update`, updatedData);
      if (response.status === 200) {
        console.log("Database updated successfully");
      } else {
        console.error("Error updating database: ", response.statusText);
      }
    } catch (error) {
      console.error("Error updating database: ", error);
    }
  }
  //Find task with id -> step id and set it to completed
  const setStepCompleted = async (taskId, stepId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/stepComplete`, { taskId, stepId });
      if (response.status === 200) {
        console.log("Step marked as done successfully");

        // Update local state here
        setTodoList(prevTodoList => {
          const updatedTodoList = prevTodoList.map(todo => { //TODO: this is quite inefficient
            if (todo._id === taskId) {
              const updatedSteps = todo.steps.map(step =>
                step.id === stepId ? { ...step, isDone: true } : step
              );
              return { ...todo, steps: updatedSteps };
            } else {
              return todo;
            }
          });
          return updatedTodoList;
        });
      } else {
        console.error("Error marking step as done: ", response.statusText);
      }
    } catch (error) {
      console.error("Error marking step as done: ", error);
    }
  }

  const setStepUncomplete = async (taskId, stepId) => {
    console.log("todoContext: setStepUncomplete: taskId, stepId", taskId, stepId);
    try {
      const response = await axios.patch(`${BASE_URL}/api/stepUncomplete`, { taskId, stepId });
      if (response.status === 200) {

        // Update local state here
        setTodoList(prevTodoList => {
          const updatedTodoList = prevTodoList.map(todo => { //TODO: this is quite inefficient
            if (todo._id === taskId) {
              const updatedSteps = todo.steps.map(step =>
                step.id === stepId ? { ...step, isDone: false } : step
              );
              return { ...todo, steps: updatedSteps };
            } else {
              return todo;
            }
          });
          return updatedTodoList;
        });
      } else {
        console.error("Error marking step as undone: ", response.statusText);
      }
    } catch (error) {
      console.error("Error marking step as undone: ", error);
    }
  }




  //Other functions

  //TODO: Clean up this mess and make it into a single function

  const getCount = (filterFn) => {
    return todoList.filter(filterFn).length;
};

const getTodoCount = (isUrgent = false) => {
    return getCount(todo => !todo.isDone && !todo.isStarted && (!isUrgent || todo.isUrgent));
};

const getDoneCount = (isUrgent = false) => {
    return getCount(todo => todo.isDone && (!isUrgent || todo.isUrgent));
};

const getDoingCount = (isUrgent = false) => {
    return getCount(todo => todo.isStarted && !todo.isDone && (!isUrgent || todo.isUrgent));
};

const getActiveListTodoCount = () => {
    return getCount(todo => todo.inListNew.some(list => list.listName === loggedInUser.activeList) && !todo.isDone && !todo.isStarted);
};

const getActiveListDoneCount = () => {
    return getCount(todo => todo.inListNew.some(list => list.listName === loggedInUser.activeList) && todo.isDone);
};

const getActiveListDoingCount = () => {
    return getCount(todo => todo.inListNew.some(list => list.listName === loggedInUser.activeList) && todo.isStarted && !todo.isDone);
};

const getListTodoCount = (listName) => {
    return getCount(todo => todo.inListNew.some(list => list.listName === listName) && !todo.isDone && !todo.isStarted);
};

const getListDoneCount = (listName) => {
    return getCount(todo => todo.inListNew.some(list => list.listName === listName) && todo.isDone);
};

const getListDoingCount = (listName) => {
    return getCount(todo => todo.inListNew.some(list => list.listName === listName) && todo.isStarted && !todo.isDone);
};


  return (
    <TodoContext.Provider value={{
      todoList, listToday: listToday, addTodo, cancelTodo, removeTodo, toggleTodoComplete,
      getTodoCount, getDoneCount, getDoingCount, editTodo, toggleTodoStart, refreshTodoList,
      getActiveListDoingCount, getActiveListTodoCount, getActiveListDoneCount, getListDoingCount,
      getListDoneCount, getListTodoCount, setStepCompleted, setStepUncomplete,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };