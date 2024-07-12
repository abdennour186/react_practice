import './App.css';
import { useState } from 'react';


export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if(move === currentMove){
        description = "you are at move #" + move;
        return(
          <li key={move}>
            <span>{description}</span>
          </li>
        )
      }
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function handleToggle(){
    setIsAscending(!isAscending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleToggle}>Toggle Order</button>
        <ol>{isAscending ? moves : [...moves].reverse()}</ol>
      </div>
    </div>
  );
}
function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo.winner;
  const winningLine = winnerInfo.winningLine || [];

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if(checkDraw(squares)){
      status = "Draw!";
    }else{
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  const boardSize = 3;

  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const rowSquares = [];
    for (let col = 0; col < boardSize; col++) {
      rowSquares.push(renderSquare(row * boardSize + col));
    }
    rows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
        winner: squares[a],
        winningLine: [a, b, c]
      };
      }
    }
    return{
      winner: null,
        winningLine: null
    };
  }
  function checkDraw(squares) {
    // Check if all squares are filled
    const allFilled = squares.every(square => square !== null);
    return allFilled;
  }
