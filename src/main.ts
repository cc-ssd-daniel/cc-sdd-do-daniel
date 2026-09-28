import './style.css';
import { CoreLoop } from './core/loop';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-container"></div>
`;

new CoreLoop('game-container');
