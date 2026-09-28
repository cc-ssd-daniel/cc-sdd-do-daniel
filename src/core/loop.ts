import { MinigameContract } from './contract';
import { FakeMinigame } from '../minigames/fake/fake-minigame';
import { PatienceMeter } from './patience';

export class CoreLoop {
    private currentState: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER' = 'MENU';
    private container: HTMLElement;
    private currentMinigame?: MinigameContract;
    private patienceMeter: PatienceMeter;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.patienceMeter = new PatienceMeter();
        
        window.addEventListener('game:game-over', () => {
            this.setState('GAME_OVER');
        });

        window.addEventListener('game:patience-changed', (e: Event) => {
            const ce = e as CustomEvent;
            const patienceDisplay = document.getElementById('patience-display');
            if (patienceDisplay) {
                patienceDisplay.innerText = \`Paciência da Turma: \${ce.detail.current}%\`;
            }
        });

        this.render();
    }

    private setState(state: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER') {
        this.currentState = state;
        this.render();
    }

    private render() {
        this.container.innerHTML = \`
            <div id="hud" style="position: absolute; top: 10px; right: 10px; background: #eee; padding: 10px; border: 1px solid #000;">
                <span id="patience-display">Paciência da Turma: \${this.patienceMeter.getPatience()}%</span>
            </div>
        \`;
        
        const screenContainer = document.createElement('div');
        this.container.appendChild(screenContainer);

        switch (this.currentState) {
            case 'MENU':
                this.renderMenu(screenContainer);
                break;
            case 'ROOM':
                this.renderRoom(screenContainer);
                break;
            case 'REPAIR':
                this.renderRepairMode(screenContainer);
                break;
            case 'GAME_OVER':
                this.renderGameOver(screenContainer);
                break;
        }
    }

    private renderMenu(container: HTMLElement) {
        container.innerHTML = \`
            <div class="screen">
                <h1>Game Menu</h1>
                <button id="btn-start">Entrar na Sala</button>
            </div>
        \`;
        document.getElementById('btn-start')?.addEventListener('click', () => this.setState('ROOM'));
    }

    private renderRoom(container: HTMLElement) {
        container.innerHTML = \`
            <div class="screen">
                <h2>A Sala</h2>
                <p>O equipamento quebrou!</p>
                <button id="btn-repair">Modo Conserto</button>
                <button id="btn-annoy">Irritar Turma (-20)</button>
                <button id="btn-back">Voltar ao Menu</button>
            </div>
        \`;
        document.getElementById('btn-repair')?.addEventListener('click', () => this.setState('REPAIR'));
        document.getElementById('btn-back')?.addEventListener('click', () => this.setState('MENU'));
        document.getElementById('btn-annoy')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: -20 } }));
        });
    }

    private renderRepairMode(container: HTMLElement) {
        container.innerHTML = \`
            <div class="screen">
                <h2>Modo Conserto</h2>
                <div id="minigame-container"></div>
                <button id="btn-abandon" style="margin-top: 20px;">Abandonar Conserto</button>
            </div>
        \`;
        document.getElementById('btn-abandon')?.addEventListener('click', () => this.setState('ROOM'));

        // Inject fake minigame
        this.currentMinigame = new FakeMinigame('minigame-container');
        this.currentMinigame.onSuccess((res) => {
            alert(\`Conserto Bem-sucedido! Score: \${res.score}\`);
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: 10 } }));
            this.setState('ROOM');
        });
        this.currentMinigame.onFailure((res) => {
            alert('Falha no conserto! A turma ficou mais impaciente.');
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: -30 } }));
            this.setState('ROOM');
        });
        this.currentMinigame.start();
    }

    private renderGameOver(container: HTMLElement) {
        container.innerHTML = \`
            <div class="screen">
                <h2>GAME OVER</h2>
                <p>A paciência da turma acabou e você foi expulso da sala.</p>
                <button id="btn-restart">Tentar Novamente</button>
            </div>
        \`;
        document.getElementById('btn-restart')?.addEventListener('click', () => {
            window.location.reload();
        });
    }
}
