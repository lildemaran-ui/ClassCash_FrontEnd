export default function Spinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#d9e8ff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
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
  );
}