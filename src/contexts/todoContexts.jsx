import React, { createContext, useContext, useState, useEffect } from 'react';

// Define functions
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
          { id: 1, task: 'Entry button: finnish look', isDone: true, created: new Date(), completed: new Date() },
          { id: 2, task: 'toggle arrow', isDone: true, created: new Date(), completed: new Date() },
          { id: 3, task: 'editEntry (modal)', isDone: false, created: new Date(), completed: null },
          { id: 4, task: 'Sub tasks', isDone: false, created: new Date(), completed: null },
          { id: 5, task: 'Count todo/done', isDone: false, created: new Date(), completed: null },
          { id: 6, task: 'Connect database', isDone: false, created: new Date(), completed: null },
          { id: 7, task: 'save/load lists from db', isDone: false, created: new Date(), completed: null },
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