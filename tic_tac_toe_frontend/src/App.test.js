import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders game title and initial turn indicator', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByText(/turn:\s*x/i)).toBeInTheDocument();
});

test('allows play and detects a win', () => {
  render(<App />);

  const board = screen.getByRole('grid', { name: /3 by 3 board/i });
  const cells = board.querySelectorAll('button');
  expect(cells).toHaveLength(9);

  // X: 0, O: 3, X: 1, O: 4, X: 2 => X wins top row
  fireEvent.click(cells[0]);
  fireEvent.click(cells[3]);
  fireEvent.click(cells[1]);
  fireEvent.click(cells[4]);
  fireEvent.click(cells[2]);

  expect(screen.getByText(/x wins!/i)).toBeInTheDocument();
});

test('new game resets the board state', () => {
  render(<App />);

  const board = screen.getByRole('grid', { name: /3 by 3 board/i });
  const cells = board.querySelectorAll('button');

  fireEvent.click(cells[0]);
  expect(cells[0].textContent).toMatch(/x/i);

  fireEvent.click(screen.getByRole('button', { name: /new game/i }));
  expect(cells[0].textContent).toBe('');
  expect(screen.getByText(/turn:\s*x/i)).toBeInTheDocument();
});
