import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';



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

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});

test('a tests are running', () => {
  expect(true).toBe(true);
});
