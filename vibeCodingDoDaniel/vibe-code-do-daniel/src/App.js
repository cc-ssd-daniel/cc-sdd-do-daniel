import './App.css';
import FocoHarness from './minigames/foco/FocoHarness';
import FocoErrorBoundary from './minigames/foco/FocoErrorBoundary';
import RebootGame from './minigames/reboot/RebootGame';

function App() {
  // Ligação de teste reversível: abra com ?minigame=foco para jogar o Foco isolado.
  // Sem esse parâmetro, a tela padrão continua igual (não invade a parte do core).
  const params = new URLSearchParams(window.location.search);
  if (params.get('minigame') === 'foco') {
    return (
      <FocoErrorBoundary>
        <FocoHarness />
      </FocoErrorBoundary>
    );
  }

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
