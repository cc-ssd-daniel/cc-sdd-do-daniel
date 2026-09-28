import { MinigameContract, MinigameResult } from '../../core/contract';
export class FocoMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    constructor(id: string) { this.container = document.getElementById(id) as HTMLElement; }
    start() {
        this.container.innerHTML = '<h3>Foco Minigame</h3><button id=\"f-win\">Ganhar Foco</button><button id=\"f-lose\">Perder Foco</button>';
        document.getElementById('f-win')?.addEventListener('click', () => this.successCb?.({success:true, score:100}));
        document.getElementById('f-lose')?.addEventListener('click', () => this.failureCb?.({success:false, score:0}));
    }
    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    restart() { this.start(); }
}
