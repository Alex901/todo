import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


// Define functions
const TodoContext = createContext({
  todoList: [],
  addTodo: () => { },
  editTodo: () => { },
  removeTodo: () => { },
  toggleTodoComplete: () => { },
  getTodoCount: () => { },
  getDoneCount: () => { },
  toggleTodoStart: () => { }, 
  fetchTodoList: () => { },
  refreshTodoList: () => { }
});

const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
  //console.log("Base_url: ", BASE_URL);

  const fetchTodoList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/todos`);
      const parsedData = response.data.map(todo => ({
        ...todo,
        created: new Date(todo.created),
        completed: todo.completed ? new Date(todo.completed) : null
      }));
      setTodoList(parsedData);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    if(!dataFetched){
      fetchTodoList();
    }
  }, [dataFetched]);

  const refreshTodoList = () => {
    setDataFetched(false); // Set dataFetched to false to trigger re-fetching
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
        //  observer: null
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
    console.log("todoContext > toggleTodoComplete -> id: ", id);
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
    }
  };

  const getTodoCount = () => {
    return todoList.filter(todo => !todo.isDone).length;
  }

  const getDoneCount = () => {
    return todoList.filter(todo => todo.isDone).length;
  }

  const editTodo = (updatedTask) => {
    setTodoList(prevTodoList => prevTodoList.map(todo => {
      if (todo.id === updatedTask.id) {
        return { ...todo, ...updatedTask }
      }
      return todo;
    }));
  }

  const toggleTodoStart = (id) => {

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
    <TodoContext.Provider value={{ todoList, addTodo, removeTodo, toggleTodoComplete, getTodoCount, getDoneCount, editTodo, toggleTodoStart, refreshTodoList }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };