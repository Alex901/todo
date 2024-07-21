import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useGroupContext } from './GroupContexts';
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
  const [dataFetched, setDataFetched] = useState(false);
  const { loggedInUser, userList } = useUserContext(); //Logged in username&&list
  const { userGroupList } = useGroupContext();
  //TODO: This is just silly and should be fixed
  //TODO: this is a hotfix, remember to fix this sillyness
  const groupMembers = userGroupList.flatMap(group => group.members.map(member => member.member_id));
  const groupLists = userGroupList.flatMap(group => group.groupLists.map(list => list.name));
  const groupMemberNames = userList
    ? userList
      .filter(user => groupMembers.includes(user._id) && user._id !== loggedInUser._id)
      .map(user => user.username)
    : [];
  


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

  //API interactions


  const fetchTodoList = async () => {
    console.log("DEBUG: f groupLists: ", groupLists)
    console.log("DEBUG: f groupMemberNames: ", groupMemberNames)

    if(!loggedInUser) {
      return;
    }

    try {
      const url = isMobileDevice() ? `${BASE_URL}/api/todos/mobile` : `${BASE_URL}/api/todos`;
      const response = await axios.get(url, {
        withCredentials: !isMobileDevice(),
        headers: isMobileDevice() && loggedInUser ? { 'User': loggedInUser.username } : {},
      });

      let parsedData = response.data.map(todo => ({
        ...todo,
        created: new Date(todo.created),
        completed: todo.completed ? new Date(todo.completed) : null,
        started: todo.started ? new Date(todo.started) : null,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null
      }));

      // Filter the parsedData array
      if (loggedInUser) {
        console.log("DEBUG: ParsedData: ", parsedData)
        parsedData = parsedData.filter(todo =>
          (todo.owner === loggedInUser.username) 
        );
      } else {
        parsedData = parsedData.filter(todo => todo.owner === null);
      }
      setTodoList(parsedData);

    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addTodo = async (newTaskData) => {
    // console.log("addTodo: newTaskData", newTaskData);
    try {
      const newId = parseInt(Date.now().toString(36) + Math.random().toString(36).substr(2), 36); //but why? xD

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
        owner: loggedInUser ? loggedInUser.username : null, //TODO: _id 
        difficulty: newTaskData.difficulty || "",
        //  assignee: [...User],
        steps: newTaskData.steps || [],
        priority: newTaskData.priority || "NORMAL",
        //  observers: [...User],
        dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : null, //TODO: remember to parse
        description: newTaskData.description || null,
        isUrgent: newTaskData.isUrgent || false, //And this one
        inList: loggedInUser ? ['all'].concat(loggedInUser.activeList !== 'all' ? [loggedInUser.activeList] : []) : []
      };

      // console.log("addTodo: newTodo", newTodo);

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

  const getTodoCount = (isUrgent = false) => {
    return todoList.filter(todo => !todo.isDone && !todo.isStarted && (!isUrgent || todo.isUrgent)).length;
  }

  const getDoneCount = (isUrgent = false) => {
    return todoList.filter(todo => todo.isDone && (!isUrgent || todo.isUrgent)).length;
  }

  const getDoingCount = (isUrgent = false) => {
    return todoList.filter(todo => todo.isStarted && !todo.isDone && (!isUrgent || todo.isUrgent)).length;
  }

  const getActiveListTodoCount = () => {
    return todoList.filter(todo => todo.inList.includes(loggedInUser.activeList) && !todo.isDone && !todo.isStarted).length;
  }

  const getActiveListDoneCount = () => {
    return todoList.filter(todo => todo.inList.includes(loggedInUser.activeList) && todo.isDone).length;
  }

  const getActiveListDoingCount = () => {
    return todoList.filter(todo => todo.inList.includes(loggedInUser.activeList) && todo.isStarted && !todo.isDone).length;
  }

  const getListTodoCount = (listName) => {
    return todoList.filter(todo => todo.inList.includes(listName) && !todo.isDone && !todo.isStarted).length;
  }

  const getListDoneCount = (listName) => {
    return todoList.filter(todo => todo.inList.includes(listName) && todo.isDone).length;
  }

  const getListDoingCount = (listName) => {
    return todoList.filter(todo => todo.inList.includes(listName) && todo.isStarted && !todo.isDone).length;
  }



  // Adding some dummy-data
  /*   useEffect(() => {
      setTodoList([
        { id: 1, task: 'Entry button: finnish look', isDone: true, created: new Date(), completed: new Date() },
        { id: 2, task: 'toggle arrow', isDone: true, created: new Date(), completed: new Date() },
        { id: 3, task: 'editEntry (modal)', isDone: true, created: new Date(), completed: new Date() },
        { id: 4, task: 'Sub tasks', isDone: false, created: new Date(), completed: null },
        { id: 5, task: 'Count todo/done', isDone: true, created: new Date(), completed: new Date() },
        { id: 6, task: 'Connect database', isDone: false, created: new Date(), completed: null },
        { id: 7, task: 'save/load lists from db', isDone: false, created: new Date(), completed: null },
      ]);
    }, []);
   */

  return (
    <TodoContext.Provider value={{
      todoList, addTodo, cancelTodo, removeTodo, toggleTodoComplete,
      getTodoCount, getDoneCount, getDoingCount, editTodo, toggleTodoStart, refreshTodoList,
      getActiveListDoingCount, getActiveListTodoCount, getActiveListDoneCount, getListDoingCount,
      getListDoneCount, getListTodoCount, setStepCompleted, setStepUncomplete
    }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };