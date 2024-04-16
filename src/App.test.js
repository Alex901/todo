import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import React from 'react';

import { TodoProvider } from './contexts/todoContexts.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { GroupProvider } from './contexts/GroupContexts.jsx';
import { NotificationProvider } from './contexts/NotificationContexts.jsx';
import LoginModal from './components/Layout/header/HeaderModals/LoginModal.jsx';
import RegisterModal from './components/Layout/header/HeaderModals/RegisterModal';
import Header from './components/Layout/header/Header';
import { UserContext } from './contexts/UserContext'; // adjust the path as necessary


jest.mock('react-modal', () => {
  const original = jest.requireActual('react-modal');
  return {
    ...original,
    setAppElement: () => { },
  };
});



test('a tests are running', () => {
  expect(true).toBe(true);
});

test('LoginModal has two inputs and a button', () => {
  // Mock the context value
  const mockContextValue = {
    login: jest.fn(),
    // add other necessary context values here
  };

  // Render LoginModal with the context provider
  render(
    <UserContext.Provider value={mockContextValue}>
      <LoginModal />
    </UserContext.Provider>
  );

  const inputs = screen.getAllByRole('textbox');
  const button = screen.getByRole('button');

  expect(inputs.length).toBe(2);
  expect(button).toBeInTheDocument();
});