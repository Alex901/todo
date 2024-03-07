import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';


// Define functions
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
  cancelTodo: () => { }
});

const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const { loggedInUser } = useUserContext(); //Logged in username&&list

  const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
  //console.log("Base_url: ", BASE_URL);

  //Not sure if i need it, but it works :shrug:
  useEffect(() => {
    if (!dataFetched) {
      fetchTodoList();
    }
  }, [dataFetched]);

  const refreshTodoList = () => {
    setDataFetched(false); // Set dataFetched to false to trigger re-fetching
  };

  //API functions

  const fetchTodoList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/todos`);
      const parsedData = response.data.map(todo => ({
        ...todo,
        created: new Date(todo.created),
        completed: todo.completed ? new Date(todo.completed) : null,
        started: todo.started ? new Date(todo.started) : null
      }));
      setTodoList(parsedData);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addTodo = async (task) => {
    try {
      const newId = parseInt(Date.now().toString(36) + Math.random().toString(36).substr(2), 36);

      //TODO: some typesafety here
      const newTodo = {
        id: newId,
        task,
        isDone: false,
        created: new Date(),
        completed: null,
        isStarted: false,
        started: null,
        // owner: null,
        //  assignee: null,
        //  subTasks: [],
        //  priority: null,
        //  observer: null,
        //  dueDate: null
      };

      console.log("newTodo", newTodo);

      const response = await axios.post(`${BASE_URL}/api/`, newTodo);
      if (response.status === 201) {
        const updatedTodoList = [
          ...todoList,
          {
            ...response.data,
            comleted: response.data.completed ? new Date(response.data.comleted) : null,
            created: new Date(response.data.created),
            isStarted: response.data.isStarted ? true : false,
            started: response.data.completed ? new Date(response.data.started) : null
          }
        ];
        setTodoList(updatedTodoList);
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
    console.log("todoContext > toggleTodoStart -> id: ", id);
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
        console.log('Task started successfully');
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
        console.log('Task canceled successfully');


      } else {
        console.error('Error Cancling task', response.statusText);
      }
    } catch (error) {
      console.log('Error Canceling todoTask', error);
      return;
    }
  };

  const editTodo = async (updatedTask) => {
    console.log("editTodo updatedTask:", updatedTask);
    try {
      const taskId = todoList.find(todo => todo.id === updatedTask.id)._id;
      console.log("editTodo > taskId to edit:", taskId);

      const response = await axios.patch(`${BASE_URL}/api/edit`, {
        taskId,
        updatedTask
      });

      if (response.status === 200) {
        setTodoList(prevTodoList => prevTodoList.map(todo => {
          if(todo._id === taskId){
            return{...todo, ...updatedTask}
          }
          return todo;
        }));
        console.log('Updated task successfully');
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

  //Other functions

  const getTodoCount = () => {
    return todoList.filter(todo => !todo.isDone).length;
  }

  const getDoneCount = () => {
    return todoList.filter(todo => todo.isDone).length;
  }

  const getDoingCount = () => {
    return todoList.filter(todo => todo.isStarted && !todo.isDone).length;
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
    <TodoContext.Provider value={{ todoList, addTodo, cancelTodo, removeTodo, toggleTodoComplete, getTodoCount, getDoneCount, getDoingCount, editTodo, toggleTodoStart, refreshTodoList }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };