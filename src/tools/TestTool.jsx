export default function TestTool({ onBack }) {
  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#00ff9d',fontFamily:'monospace',padding:15}}>
      <button onClick={onBack} style={{background:'transparent',color:'#00ff9d',border:'1px solid #00ff9d',padding:'5px 10px',marginBottom:10}}>← BACK</button>
      <h2>🧪 TEST TOOL</h2>
      <p>Jika kamu melihat ini, routing React berfungsi!</p>
      <p>Tool ini tidak fetch apa-apa, hanya statis.</p>
    </div>
  );
}
