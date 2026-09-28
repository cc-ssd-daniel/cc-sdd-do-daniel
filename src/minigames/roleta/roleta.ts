import { MinigameContract, MinigameResult } from '../../core/contract';
export class RoletaMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    constructor(id: string) { this.container = document.getElementById(id) as HTMLElement; }
    start() {
        this.container.innerHTML = '<h3>Roleta Minigame</h3><button id=\"ro-win\">Ganhar Roleta</button><button id=\"ro-lose\">Perder Roleta</button>';
        document.getElementById('ro-win')?.addEventListener('click', () => this.successCb?.({success:true, score:100}));
        document.getElementById('ro-lose')?.addEventListener('click', () => this.failureCb?.({success:false, score:0}));
    }
    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    restart() { this.start(); }
}
