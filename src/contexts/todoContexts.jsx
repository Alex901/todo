import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of the data
const TodoContext = createContext({
  todoList: [],
  addTodo: () => {},
  removeTodo: () => {},
});

const TodoProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([
    { id: 1, task: 'Do laundry', isDone: false, created: new Date(), completed: null },
    { id: 2, task: 'Buy groceries', isDone: false, created: new Date(), completed: null },
  ]);

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

  const removeTodo = (id) => {
    const updatedTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(updatedTodoList);
  };

    // Adding some dummy-data
    useEffect(() => {
        setTodoList([
          { id: 1, task: 'Do laundry', isDone: false, created: new Date(), completed: null },
          { id: 2, task: 'Buy groceries', isDone: false, created: new Date(), completed: null },
          { id: 3, task: 'Do Dishes', isDone: false, created: new Date(), completed: null },
          { id: 4, task: 'Conquer the world', isDone: false, created: new Date(), completed: null },
        ]);
      }, []);

  return (
    <TodoContext.Provider value={{ todoList, addTodo, removeTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };