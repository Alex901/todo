jest.mock('react-modal', () => {
  const original = jest.requireActual('react-modal');
  return {
    ...original,
    setAppElement: () => {},
  };
});

import { render, screen } from '@testing-library/react';
import App from './App';
import BASE_URL from '../config';

test('a test is running', () => {
  expect(true).toBe(true);
});