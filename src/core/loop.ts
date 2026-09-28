import { MinigameContract } from './contract';
import { FakeMinigame } from '../minigames/fake/fake-minigame';

export class CoreLoop {
    private currentState: 'MENU' | 'ROOM' | 'REPAIR' = 'MENU';
    private container: HTMLElement;
    private currentMinigame?: MinigameContract;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.render();
    }

    private setState(state: 'MENU' | 'ROOM' | 'REPAIR') {
        this.currentState = state;
        this.render();
    }

    private render() {
        this.container.innerHTML = '';
        
        switch (this.currentState) {
            case 'MENU':
                this.renderMenu();
                break;
            case 'ROOM':
                this.renderRoom();
                break;
            case 'REPAIR':
                this.renderRepairMode();
                break;
        }
    }

    private renderMenu() {
        this.container.innerHTML = `
            <div class="screen">
                <h1>Game Menu</h1>
                <button id="btn-start">Entrar na Sala</button>
            </div>
        `;
        document.getElementById('btn-start')?.addEventListener('click', () => this.setState('ROOM'));
    }

    private renderRoom() {
        this.container.innerHTML = `
            <div class="screen">
                <h2>A Sala</h2>
                <p>O equipamento quebrou!</p>
                <button id="btn-repair">Modo Conserto</button>
                <button id="btn-back">Voltar ao Menu</button>
            </div>
        `;
        document.getElementById('btn-repair')?.addEventListener('click', () => this.setState('REPAIR'));
        document.getElementById('btn-back')?.addEventListener('click', () => this.setState('MENU'));
    }

    private renderRepairMode() {
        this.container.innerHTML = `
            <div class="screen">
                <h2>Modo Conserto</h2>
                <div id="minigame-container"></div>
                <button id="btn-abandon" style="margin-top: 20px;">Abandonar Conserto</button>
            </div>
        `;
        document.getElementById('btn-abandon')?.addEventListener('click', () => this.setState('ROOM'));

        // Inject fake minigame
        this.currentMinigame = new FakeMinigame('minigame-container');
        this.currentMinigame.onSuccess((res) => {
            alert(`Conserto Bem-sucedido! Score: ${res.score}`);
            this.setState('ROOM');
        });
        this.currentMinigame.onFailure((res) => {
            alert('Falha no conserto!');
            this.setState('ROOM');
        });
        this.currentMinigame.start();
    }
}
