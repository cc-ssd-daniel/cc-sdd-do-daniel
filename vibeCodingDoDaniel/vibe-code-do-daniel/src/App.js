import logo from './logo.svg';
import './App.css';
import FocoHarness from './minigames/foco/FocoHarness';
import FocoErrorBoundary from './minigames/foco/FocoErrorBoundary';

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
