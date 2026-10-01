import type { MinigameContract, MinigameResult } from '../../core/contract';

export class EquilibrioMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    private gameActive = false;
    private balance = 50;
    private targetTime = 5000;
    private currentTime = 0;
    private lastTick = 0;
    private animationFrameId = 0;
    private gravity = 0;
    private domElements: any = {};
    private boundMouseMove: (e: MouseEvent) => void;

    constructor(id: string) {
        this.container = document.getElementById(id) as HTMLElement;
        this.boundMouseMove = this.onMouseMove.bind(this);
    }

    start() {
        this.render();
        this.gameActive = true;
        this.balance = 50;
        this.currentTime = 0;
        this.gravity = (Math.random() > 0.5 ? 1 : -1) * 20;
        this.lastTick = performance.now();
        
        document.addEventListener('mousemove', this.boundMouseMove);
        this.tick(performance.now());
    }

    private render() {
        this.container.innerHTML = `
            <div id="equilibrio-game" style="position:relative; width:100%; height:400px; background: #222; overflow:hidden; border-radius: 8px;">
                <div style="position:absolute; top:10px; left:10px; color:white; z-index:15;">
                    <div>OBJETIVO: Mantenha o equilíbrio na cadeira giratória por 5s!</div>
                    <div style="font-size: 0.8rem; color: #aaa; margin-top:5px;">Mova o mouse para os lados opostos para estabilizar.</div>
                    <div style="width:200px; height:10px; background:#333; border:1px solid white; margin-top:5px;">
                        <div id="time-fill" style="width:0%; height:100%; background:#00ffcc; transition:width 0.1s;"></div>
                    </div>
                </div>

                <div style="position:absolute; bottom:50px; left:50%; transform:translateX(-50%); width:300px; height:20px; background:#444; border-radius:10px;">
                    <div id="balance-marker" style="position:absolute; top:-10px; left:50%; width:20px; height:40px; background:var(--warn); border-radius:4px; transform:translateX(-50%); transition:left 0.1s;"></div>
                </div>
                
                <div id="view-tilt" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; pointer-events:none; transition: transform 0.1s;">
                    <div style="font-size: 4rem;">😵‍💫</div>
                </div>
            </div>
        `;

        this.domElements = {
            marker: this.container.querySelector('#balance-marker'),
            timeFill: this.container.querySelector('#time-fill'),
            tilt: this.container.querySelector('#view-tilt')
        };
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.gameActive) return;
        // Mouse movement counters gravity
        const delta = e.movementX;
        this.balance -= delta * 0.5; // Inverte: mover pra direita joga pra esquerda (para contrabalancear)
        
        // Clamping manual
        if(this.balance < 0) this.balance = 0;
        if(this.balance > 100) this.balance = 100;
    }

    private tick(now: number) {
        if (!this.gameActive) return;
        
        const dt = now - this.lastTick;
        this.lastTick = now;

        // Gravity gets stronger over time and randomizes
        if (Math.random() < 0.05) {
            this.gravity = (Math.random() - 0.5) * 40;
        }

        this.balance += this.gravity * (dt / 1000);

        if (this.domElements.marker) {
            this.domElements.marker.style.left = `${this.balance}%`;
            const rotation = (this.balance - 50) * 0.5;
            this.domElements.tilt.style.transform = `rotate(${rotation}deg)`;
        }

        // Condições de vitória / derrota
        if (this.balance <= 0 || this.balance >= 100) {
            this.lose();
            return;
        }

        // Increment time if within safe zone
        if (this.balance > 20 && this.balance < 80) {
            this.currentTime += dt;
            if (this.domElements.timeFill) {
                this.domElements.timeFill.style.width = `${(this.currentTime / this.targetTime) * 100}%`;
            }
        }

        if (this.currentTime >= this.targetTime) {
            this.win();
            return;
        }

        this.animationFrameId = requestAnimationFrame((n) => this.tick(n));
    }

    private win() {
        this.cleanup();
        setTimeout(() => {
            this.successCb?.({ success: true, score: 100 });
        }, 500);
    }

    private lose() {
        this.cleanup();
        if (this.domElements.marker) {
            this.domElements.marker.style.background = 'red';
        }
        setTimeout(() => {
            this.failureCb?.({ success: false, score: 0 });
        }, 500);
    }

    private cleanup() {
        this.gameActive = false;
        cancelAnimationFrame(this.animationFrameId);
        document.removeEventListener('mousemove', this.boundMouseMove);
    }

    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    restart() { this.start(); }
    unmount() {
        this.cleanup();
        this.container.innerHTML = '';
    }
}
