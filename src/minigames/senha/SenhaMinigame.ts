import type { MinigameContract, MinigameResult } from '../../core/contract';

export class SenhaMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    private gameActive = false;
    private passwordStr = "Pr0jetor@123!";
    private currentInput = "";
    private timeRemaining = 10;
    private timerInterval: any;
    private domElements: any = {};
    private boundKeyDown: (e: KeyboardEvent) => void;

    constructor(id: string) {
        this.container = document.getElementById(id) as HTMLElement;
        this.boundKeyDown = this.onKeyDown.bind(this);
    }

    start() {
        this.render();
        this.gameActive = true;
        this.currentInput = "";
        this.timeRemaining = 10;
        
        document.addEventListener('keydown', this.boundKeyDown);
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            if (this.domElements.timer) {
                this.domElements.timer.innerText = `00:0${this.timeRemaining}`;
                if(this.timeRemaining <= 3) this.domElements.timer.style.color = 'red';
            }
            if (this.timeRemaining <= 0) {
                this.lose();
            }
        }, 1000);
    }

    private render() {
        this.container.innerHTML = `
            <div id="senha-game" style="position:relative; width:100%; height:400px; background: #111; overflow:hidden; border-radius: 8px; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:monospace;">
                <div style="position:absolute; top:10px; left:10px; color:white;">
                    <div>OBJETIVO: Digite a senha antes que a turma grite!</div>
                    <div id="timer" style="font-size: 1.5rem; color: #00ffcc; margin-top:5px;">00:10</div>
                </div>

                <div style="color:#aaa; margin-bottom:10px; font-size:1.2rem;">Acesso Administrativo</div>
                <div id="target-pwd" style="color:var(--blue-on-dark); font-size:2rem; letter-spacing:3px; margin-bottom:20px; background:#222; padding:10px; border-radius:5px;">${this.passwordStr}</div>
                
                <div id="input-pwd" style="color:white; font-size:2rem; letter-spacing:3px; height:50px; border-bottom:2px solid #555; min-width:300px; text-align:center;"></div>
            </div>
        `;

        this.domElements = {
            timer: this.container.querySelector('#timer'),
            inputPwd: this.container.querySelector('#input-pwd')
        };
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.gameActive) return;

        if (e.key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
        } else if (e.key.length === 1) { // Normal keys
            this.currentInput += e.key;
        }

        if (this.domElements.inputPwd) {
            this.domElements.inputPwd.innerText = this.currentInput;
        }

        // Check if correct
        if (this.currentInput === this.passwordStr) {
            this.win();
        } else if (this.currentInput.length >= this.passwordStr.length) {
            // Se errou
            this.domElements.inputPwd.style.color = 'red';
            setTimeout(() => {
                if(this.gameActive) {
                    this.currentInput = "";
                    this.domElements.inputPwd.innerText = "";
                    this.domElements.inputPwd.style.color = 'white';
                }
            }, 200);
        }
    }

    private win() {
        this.cleanup();
        if(this.domElements.inputPwd) this.domElements.inputPwd.style.color = '#00ffcc';
        setTimeout(() => {
            this.successCb?.({ success: true, score: 100 });
        }, 500);
    }

    private lose() {
        this.cleanup();
        setTimeout(() => {
            this.failureCb?.({ success: false, score: 0 });
        }, 500);
    }

    private cleanup() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        document.removeEventListener('keydown', this.boundKeyDown);
    }

    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    restart() { this.start(); }
    unmount() {
        this.cleanup();
        this.container.innerHTML = '';
    }
}
