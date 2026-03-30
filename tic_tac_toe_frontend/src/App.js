import React, { useMemo, useState } from 'react';
import './App.css';

const BOARD_SIZE = 9;
const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diags
  [0, 4, 8],
  [2, 4, 6],
];

function getWinningLine(squares) {
  for (const [a, b, c] of LINES) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return [a, b, c];
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe application (local 2-player). */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winningLine = useMemo(() => getWinningLine(squares), [squares]);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const isDraw = !winner && isBoardFull(squares);

  const statusText = useMemo(() => {
    if (winner) return `${winner} wins!`;
    if (isDraw) return `It's a draw.`;
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  function handleSquareClick(index) {
    if (winner || squares[index] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function resetGame() {
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  }

  function renderSquare(index) {
    const value = squares[index];
    const isWinning = winningLine?.includes(index) ?? false;

    return (
      <button
        key={index}
        type="button"
        className={`ttt-square ${value ? 'is-filled' : ''} ${
          isWinning ? 'is-winning' : ''
        }`}
        onClick={() => handleSquareClick(index)}
        aria-label={`Square ${index + 1}${value ? `, ${value}` : ''}`}
        disabled={Boolean(winner) || squares[index] !== null}
      >
        <span className="ttt-squareValue" aria-hidden="true">
          {value}
        </span>
      </button>
    );
  }

  return (
    <div className="app">
      <main className="card" aria-label="Tic Tac Toe game">
        <header className="header">
          <div>
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">Local 2-player (X vs O)</p>
          </div>

          <div className="statusWrap" aria-live="polite">
            <div
              className={`statusPill ${
                winner ? 'is-winner' : isDraw ? 'is-draw' : 'is-turn'
              }`}
            >
              {statusText}
            </div>
          </div>
        </header>

        <section className="boardSection">
          <div className="board" role="grid" aria-label="3 by 3 board">
            {Array.from({ length: BOARD_SIZE }, (_, i) => renderSquare(i))}
          </div>

          <div className="controls">
            <button type="button" className="btn btnPrimary" onClick={resetGame}>
              New game
            </button>
            <button
              type="button"
              className="btn btnGhost"
              onClick={resetGame}
              aria-label="Reset board and start with X"
            >
              Reset
            </button>
          </div>

          <p className="hint">
            Tip: Click a tile to place your mark. Game ends on win or draw.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span className="footerText">
          Accents: <span className="swatch swatchPrimary" /> #3b82f6 and{' '}
          <span className="swatch swatchSuccess" /> #06b6d4
        </span>
      </footer>
    </div>
  );
}

export default App;
