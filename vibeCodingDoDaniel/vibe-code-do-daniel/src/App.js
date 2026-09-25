import './App.css';
import RebootGame from './minigames/reboot/RebootGame';

function App() {
  return (
    <div className="App">
      <main className="app-shell">
        <header className="app-shell__header">
          <p className="app-shell__eyebrow">Projetor Simulator</p>
          <h1>Chamado da TI</h1>
          <p className="app-shell__subtitle">Sala 12B • Projetor travado • Diagnóstico em andamento</p>
        </header>

        <RebootGame />
      </main>
    </div>
  );
}

export default App;
