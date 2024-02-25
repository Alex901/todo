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
/*     useEffect(() => {
        setTodoList([
          { id: 1, task: 'Do laundry', isDone: false, created: new Date(), completed: null },
          { id: 2, task: 'Buy groceries', isDone: false, created: new Date(), completed: null },
          { id: 3, task: 'Do Dishes', isDone: false, created: new Date(), completed: null },
          { id: 4, task: 'Conquer the world', isDone: true, created: new Date(), completed: new Date() },
          { id: 5, task: 'Kill a hooker', isDone: true, created: new Date(), completed: new Date() },
          { id: 6, task: 'Sell the drugs to the neighbor', isDone: true, created: new Date(), completed: new Date() },
        ]);
      }, []);
 */
  return (
    <TodoContext.Provider value={{ todoList, addTodo, removeTodo, toggleTodoComplete }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };