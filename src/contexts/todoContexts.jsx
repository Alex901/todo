import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of the data
const TodoContext = createContext({
  todoList: [],
  addTodo: () => {},
  removeTodo: () => {},
  toggleTodoComplete: () => {}
});

const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (task) => {
    setTodoList(prevTodoList => {
      const newTodo = {
        id: prevTodoList.length + 1,
        task,
        isDone: false,
        created: new Date(),
        completed: null,
      };
      return [...prevTodoList, newTodo];
    });
  };

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

    // Adding some dummy-data
    useEffect(() => {
        setTodoList([
          { id: 1, task: 'Planera labb2', isDone: false, created: new Date(), completed: null },
          { id: 2, task: 'todoApp: connect database: firebase?', isDone: false, created: new Date(), completed: null },
          { id: 3, task: 'todoApp: sub-task', isDone: false, created: new Date(), completed: null },
          { id: 4, task: 'todoApp: task description', isDone: false, created: new Date(), completed: null },
          { id: 5, task: 'todoApp: edit todoEntry', isDone: false, created: new Date(), completed: null },
          { id: 6, task: 'todoApp: count completed', isDone: false, created: new Date(), completed: null },
          { id: 7, task: 'todoApp: save/load lists from db', isDone: false, created: new Date(), completed: null },
        ]);
      }, []);

  return (
    <TodoContext.Provider value={{ todoList, addTodo, removeTodo, toggleTodoComplete }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };