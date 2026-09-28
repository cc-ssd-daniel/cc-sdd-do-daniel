import { MinigameContract, MinigameResult } from '../../core/contract';
export class RebootMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    constructor(id: string) { this.container = document.getElementById(id) as HTMLElement; }
    start() {
        this.container.innerHTML = '<h3>Reboot Minigame</h3><button id=\"r-win\">Ganhar Reboot</button><button id=\"r-lose\">Perder Reboot</button>';
        document.getElementById('r-win')?.addEventListener('click', () => this.successCb?.({success:true, score:100}));
        document.getElementById('r-lose')?.addEventListener('click', () => this.failureCb?.({success:false, score:0}));
    }
    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    restart() { this.start(); }
}
