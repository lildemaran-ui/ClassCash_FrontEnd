interface SpinnerProps {
  local?: boolean
}

export default function Spinner({ local = false }: SpinnerProps) {
  const containerStyle: React.CSSProperties = local
    ? {
        position: 'absolute',
        inset: 0,
        background: 'rgba(255, 255, 255, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
       
      }
    : {
        position: 'fixed',
        inset: 0,
        background: 'rgba(255, 255, 255, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }

  return (
    <div style={containerStyle}>
      <div style={{ width: 48, height: 48, animation: 'morph 1.6s ease-in-out infinite' }} />
      <style>{`
        @keyframes morph {
          0%,100% { border-radius: 6px;  transform: rotate(0deg)   scale(1);    background: #184184; }
          25%      { border-radius: 50%; transform: rotate(90deg)  scale(0.85); background: #0c2143; }
          50%      { border-radius: 6px;  transform: rotate(180deg) scale(1);    background: #2461c5; }
          75%      { border-radius: 50%; transform: rotate(270deg) scale(0.85); background: #184d8a; }
        }
      `}</style>
    </div>
  )
}