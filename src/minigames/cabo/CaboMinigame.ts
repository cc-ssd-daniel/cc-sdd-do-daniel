import type { MinigameContract, MinigameResult } from '../../core/contract';

export class CaboMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    private gameActive = false;
    private isFlashing = false;
    private playerVision = 100;
    private mouseX = 0;
    private mouseY = 0;
    private lastMouseX = 0;
    private lastMouseY = 0;
    private flashInterval: any;
    private domElements: any = {};
    private boundMouseMove: (e: MouseEvent) => void;

    constructor(id: string) {
        this.container = document.getElementById(id) as HTMLElement;
        this.boundMouseMove = this.onMouseMove.bind(this);
    }

    start() {
        this.render();
        this.gameActive = true;
        this.playerVision = 100;
        document.addEventListener('mousemove', this.boundMouseMove);
        this.startFlashCycle();
    }

    private render() {
        this.container.innerHTML = `
            <div style="padding: 12px 16px; color: #fff; background: #19191b; border-radius: 8px 8px 0 0;">
                <div style="font-weight: 700;">OBJETIVO: Clique na peça azul do projetor.</div>
                <div id="cabo-status" role="status" aria-live="polite" style="font-size: 0.9rem; margin-top: 4px;">
                    Aguarde o flash terminar. Mova o mouse somente quando a luz estiver apagada.
                </div>
                <div style="width:150px; height:10px; background:#333; border:1px solid #777; margin-top:8px;">
                    <div id="hp-fill" style="width:100%; height:100%; background:#00ffcc; transition:width 0.2s;"></div>
                </div>
            </div>
            <div id="cabo-game" style="position:relative; width:100%; height:400px; background: radial-gradient(circle at center, #3a3a3a 0%, #111 100%); overflow:hidden; cursor:crosshair; border-radius: 0 0 8px 8px;">
                <div id="flash-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background-color: rgba(255,255,255,0); pointer-events:none; z-index:30; transition: background-color 0.1s;"></div>
                
                <div id="projector" style="position:absolute; top:20px; left:50%; transform:translateX(-50%); width:120px; height:60px; background:#ccc; border-radius:10px; border-bottom:5px solid #888; display:flex; justify-content:center; align-items:flex-end;">
                    <div id="projector-lens" style="width:30px; height:30px; background:#111; border-radius:50%; margin-bottom:10px; border:3px solid #555;"></div>
                    <button id="vga-port" type="button" aria-label="Conectar o cabo VGA" title="Clique aqui quando o flash parar" style="position:absolute; top:40px; left:17%; width:42px; height:24px; padding:0; background:#064de0; border:3px solid #001b66; border-radius:3px; cursor:pointer; z-index:20; box-shadow:0 0 8px rgba(41,151,255,.85);"></button>
                </div>

                <div id="player-arm" style="position:absolute; bottom:-50px; left:50%; width:80px; height:300px; background:linear-gradient(to right, #c18f76, #9c6c56); border-radius:40px 40px 0 0; pointer-events:none; z-index:15; display:flex; justify-content:center;">
                    <div style="width:30px; height:40px; background:#0033cc; position:absolute; top:-30px; border-radius:5px; border-top:8px solid silver;"></div>
                </div>
            </div>
        `;

        this.domElements = {
            game: this.container.querySelector('#cabo-game'),
            flashOverlay: this.container.querySelector('#flash-overlay'),
            projectorLens: this.container.querySelector('#projector-lens'),
            vgaPort: this.container.querySelector('#vga-port'),
            arm: this.container.querySelector('#player-arm'),
            hpFill: this.container.querySelector('#hp-fill'),
            status: this.container.querySelector('#cabo-status')
        };

        this.domElements.vgaPort.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            if(!this.gameActive) return;
            if (this.isFlashing) {
                this.updateStatus('Você clicou durante o flash! Espere a luz apagar.', '#ff8a8a');
                this.takeDamage();
            } else {
                this.win();
            }
        });
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.gameActive) return;
        
        const rect = this.domElements.game.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        if (this.domElements.arm) {
            this.domElements.arm.style.left = `${this.mouseX - 40}px`;
            const armHeight = (400 - this.mouseY) + 50;
            this.domElements.arm.style.height = `${armHeight}px`;
        }

        if (this.isFlashing) {
            const movement = Math.abs(this.mouseX - this.lastMouseX) + Math.abs(this.mouseY - this.lastMouseY);
            if (movement > 5) {
                this.takeDamage();
            }
        }

        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
    }

    private startFlashCycle() {
        if (!this.gameActive) return;
        const darkTime = Math.random() * 1500 + 1500;
        this.flashInterval = setTimeout(() => this.triggerFlash(), darkTime);
    }

    private triggerFlash() {
        if (!this.gameActive) return;
        this.isFlashing = true;
        this.updateStatus('FLASH! Fique parado e não clique.', '#ff8a8a');
        
        this.domElements.projectorLens.style.background = '#fff';
        this.domElements.projectorLens.style.boxShadow = '0 0 50px 20px #fff';
        this.domElements.flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        
        const flashDuration = Math.random() * 800 + 1000;

        setTimeout(() => {
            this.isFlashing = false;
            if (this.domElements.projectorLens) {
                this.domElements.projectorLens.style.background = '#111';
                this.domElements.projectorLens.style.boxShadow = 'none';
                this.domElements.flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                this.updateStatus('Luz apagada! Clique na peça azul do projetor agora.', '#8fffe0');
            }
            this.startFlashCycle();
        }, flashDuration);
    }

    private updateStatus(message: string, color: string) {
        if (this.domElements.status) {
            this.domElements.status.textContent = message;
            this.domElements.status.style.color = color;
        }
    }

    private takeDamage() {
        this.playerVision -= 5;
        if (this.playerVision < 0) this.playerVision = 0;
        if (this.domElements.hpFill) {
            this.domElements.hpFill.style.width = `${this.playerVision}%`;
        }
        
        if (this.playerVision <= 0) {
            this.lose();
        }
    }

    private win() {
        this.cleanup();
        this.domElements.flashOverlay.style.backgroundColor = 'rgba(0, 255, 204, 0.5)';
        setTimeout(() => {
            this.successCb?.({ success: true, score: 100 });
        }, 500);
    }

    private lose() {
        this.cleanup();
        this.domElements.flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        setTimeout(() => {
            this.failureCb?.({ success: false, score: 0 });
        }, 500);
    }

    private cleanup() {
        this.gameActive = false;
        clearTimeout(this.flashInterval);
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
