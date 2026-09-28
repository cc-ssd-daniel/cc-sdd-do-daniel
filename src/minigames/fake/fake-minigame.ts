import { MinigameContract, MinigameResult } from '../core/contract';

export class FakeMinigame implements MinigameContract {
    private successCb?: (result: MinigameResult) => void;
    private failureCb?: (result: MinigameResult) => void;
    private container: HTMLElement;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
    }

    start(): void {
        this.container.innerHTML = `
            <div style="border: 2px dashed #ccc; padding: 20px; text-align: center;">
                <h3>[Fake Minigame]</h3>
                <button id="btn-win">Simular Vitória</button>
                <button id="btn-lose">Simular Derrota</button>
            </div>
        `;
        document.getElementById('btn-win')?.addEventListener('click', () => {
            if (this.successCb) this.successCb({ success: true, score: 100 });
        });
        document.getElementById('btn-lose')?.addEventListener('click', () => {
            if (this.failureCb) this.failureCb({ success: false, score: 0 });
        });
    }

    onSuccess(callback: (result: MinigameResult) => void): void {
        this.successCb = callback;
    }

    onFailure(callback: (result: MinigameResult) => void): void {
        this.failureCb = callback;
    }

    restart(): void {
        this.start();
    }
}
