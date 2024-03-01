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
  getDoneCount: () => { }
});

const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);

  const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
  //console.log("Base_url: ", BASE_URL);

  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/todos`);
        //console.log("fetchTodoList: response: ", response.data)
        const parsedData = response.data.map(todo => ({
          ...todo,
          created: new Date(todo.created),
          completed: todo.completed ? new Date(todo.completed) : null
        }));
        //console.log("fetchTodoList: parseData: ", parsedData);
        setTodoList(parsedData);

      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchTodoList();
  }, [todoList]);


  //Just for logging
  useEffect(() => {
    //console.log("useEffect: todoList: ", todoList)
  }, [todoList]);

  const addTodo = async (task) => {
    try {
      const newId = todoList.length + 1;
      const newTodo = {
        id: newId,
        task,
        isDone: false,
        created: new Date(),
        completed: null,
      };

      const response = await axios.post(`${BASE_URL}/api/`, newTodo);
      if (response.status === 201) {
        const updatedTodoList = [
          ...todoList,
          {
            ...response.data,
            comleted: response.data.completed ? new Date(response.data.comleted) : null,
            created: new Date(response.data.created)
          }
        ];
        setTodoList(updatedTodoList);
      } else {
        console.error('Error adding todo:', response.statusText)
      }
    } catch (error) {
      console.error('error adding todo: ');
    }
  };




  /*     setTodoList(prevTodoList => {
        const newTodo = {
          id: prevTodoList.length + 1,
          task,
          isDone: false,
          created: new Date(),
          completed: null,
        };
        return [...prevTodoList, newTodo];
      });
    }; */

  const toggleTodoComplete = (id) => {
    setTodoList(prevTodoList => prevTodoList.map(todo => {
      if (todo.id === id) {
        todo.completed = new Date();
        console.log(todo)
        return { ...todo, isDone: !todo.isDone };
      }
      return todo;
    }));
  };

  const removeTodo = (id) => {
    const updatedTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(updatedTodoList);
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
    <TodoContext.Provider value={{ todoList, addTodo, removeTodo, toggleTodoComplete, getTodoCount, getDoneCount, editTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };