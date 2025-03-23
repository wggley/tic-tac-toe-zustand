import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Square from './Square';

interface GameState {
  history: Array<(string | null)[]>;
  currentMove: number;
}

interface GameActions {  
  setHistory: (nextHistory: Array<Array<(string | null)[]>>) => void;
  setCurrentMove: (nextCurrentMove: number) => void;
}

const useGameStore = create(  
  combine({ history: [Array(9).fill(null)], currentMove: 0 }, (set) => {
    return {      
      setHistory: (nextHistory ) => {
        set((state: GameState) => ({
          ...state,
          history: nextHistory,
        }))
      },
      setCurrentMove: (nextCurrentMove) => {
        set((state: GameState) => ({
          ...state,
          currentMove: nextCurrentMove,
        }))
      },
    } as GameActions;
  }),
)

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return
    }
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  function calculateWinner(squares: (string | null)[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
  
    return null
  }
  
  function calculateTurns(squares: (string | null)[]) {
    return squares.filter((square) => !square).length
  }
  
  function calculateStatus(winner: string | null, turns: number, player: string) {
    if (!winner && !turns) return 'Draw'
    if (winner) return `Winner ${winner}`
    return `Next player: ${player}`
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square key={squareIndex} value={square} onSquareClick={() => handleClick(squareIndex)}/>
        ))}
      </div>
    </>    
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)  
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  
  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
      <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `Go to move #${historyIndex}`
                : 'Go to game start'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}