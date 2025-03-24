interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

export default function Square({ value, onSquareClick }: SquareProps) {
    return (
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          color: value === 'X' ? '#22013d': '#f6f6f6',
          backgroundColor: 'rgb(166, 99, 221)',
          border: '1px solid #f6f6f6',
          outline: 0,
          borderRadius: 0,
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
        onClick={onSquareClick}
      >
        {value}
      </button>
    )
  }
  