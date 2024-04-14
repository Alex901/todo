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



