import type { MinigameContract } from './contract';
import { PatienceMeter } from './patience';
import { FocoMinigame } from '../minigames/foco/foco';
import { RebootMinigame } from '../minigames/reboot/reboot';
import { RoletaMinigame } from '../minigames/roleta/roleta';

export class CoreLoop {
    private currentState: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER' | 'VICTORY' = 'MENU';
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
            this.updatePatienceHud(ce.detail.current);
        });

        this.render();
    }

    private setState(state: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER' | 'VICTORY') {
        this.currentState = state;

        // Pressão de tempo: a paciência decai enquanto o jogo está ativo.
        // (Requirements 2.1, 2.2, 2.3)
        if (state === 'ROOM' || state === 'REPAIR') {
            this.patienceMeter.startDecay();
        } else {
            this.patienceMeter.stopDecay();
        }

        this.render();
    }

    private render() {
        const patience = this.patienceMeter.getPatience();
        this.container.innerHTML = `
            <div id="hud" class="hud">
                <span class="hud__label">Paciência da Turma</span>
                <div class="meter" id="patience-meter">
                    <div class="meter__fill" id="patience-fill"></div>
                </div>
                <span class="hud__value" id="patience-display">${patience}%</span>
            </div>
        `;

        const screenContainer = document.createElement('div');
        screenContainer.className = 'screen-host';
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
            case 'VICTORY':
                this.renderVictory(screenContainer);
                break;
        }

        this.updatePatienceHud(patience);
    }

    private updatePatienceHud(current: number) {
        const display = document.getElementById('patience-display');
        const fill = document.getElementById('patience-fill');
        const meter = document.getElementById('patience-meter');
        if (display) display.innerText = `${Math.round(current)}%`;
        if (fill) fill.style.width = `${Math.max(0, Math.min(100, current))}%`;
        // Estado crítico por mais de um canal: classe (cor) + rótulo textual. (Requirement 3.2)
        if (meter) {
            meter.classList.remove('meter--ok', 'meter--warn', 'meter--crit');
            if (current <= 30) meter.classList.add('meter--crit');
            else if (current <= 60) meter.classList.add('meter--warn');
            else meter.classList.add('meter--ok');
        }
        if (display) {
            display.classList.toggle('hud__value--crit', current <= 30);
            display.innerText = current <= 30 ? `${Math.round(current)}% · crítico` : `${Math.round(current)}%`;
        }
    }

    private renderMenu(container: HTMLElement) {
        container.innerHTML = `
            <section class="screen screen--hero">
                <p class="eyebrow">Consertando o Projetor</p>
                <h1 class="title">A aula vai começar.<br/>O projetor, não.</h1>
                <p class="lead">Conserte o projetor antes que a turma perca a paciência.</p>
                <button id="btn-start" class="btn btn--primary">Entrar na sala</button>
            </section>
        `;
        document.getElementById('btn-start')?.addEventListener('click', () => this.setState('ROOM'));
    }

    private renderRoom(container: HTMLElement) {
        container.innerHTML = `
            <section class="screen">
                <h2 class="title title--md">A sala</h2>
                <p class="lead">O equipamento quebrou. A turma está esperando.</p>
                <div class="btn-row">
                    <button id="btn-repair" class="btn btn--primary">Modo Conserto</button>
                    <button id="btn-annoy" class="btn btn--ghost">Irritar turma (-20)</button>
                    <button id="btn-back" class="btn btn--quiet">Voltar ao menu</button>
                </div>
            </section>
        `;
        document.getElementById('btn-repair')?.addEventListener('click', () => this.setState('REPAIR'));
        document.getElementById('btn-back')?.addEventListener('click', () => this.setState('MENU'));
        document.getElementById('btn-annoy')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: -20 } }));
        });
    }

    private minigameQueue: any[] = [];

    private renderRepairMode(container: HTMLElement) {
        container.innerHTML = `
            <section class="screen screen--repair">
                <h2 class="title title--md" id="repair-title">Modo Conserto</h2>
                <div id="minigame-container" class="minigame-stage"></div>
                <button id="btn-abandon" class="btn btn--quiet">Abandonar conserto</button>
            </section>
        `;
        document.getElementById('btn-abandon')?.addEventListener('click', () => {
            this.currentMinigame?.unmount?.();
            this.setState('ROOM');
        });

        this.minigameQueue = [FocoMinigame, RebootMinigame, RoletaMinigame];
        this.playNextMinigame();
    }

    private playNextMinigame() {
        if (this.currentMinigame) {
            this.currentMinigame.unmount?.();
        }

        if (this.minigameQueue.length === 0) {
            // Bônus por consertar tudo, e vai para a tela de vitória.
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: 20 } }));
            this.setState('VICTORY');
            return;
        }

        const NextGame = this.minigameQueue.shift();
        this.currentMinigame = new NextGame('minigame-container');

        this.currentMinigame!.onSuccess(() => {
            this.playNextMinigame();
        });

        this.currentMinigame!.onFailure(() => {
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: -30 } }));
            this.currentMinigame?.unmount?.();
            this.setState('ROOM');
        });

        this.currentMinigame!.start();
    }

    private renderGameOver(container: HTMLElement) {
        container.innerHTML = `
            <section class="screen screen--hero">
                <p class="eyebrow eyebrow--crit">Fim de jogo</p>
                <h1 class="title">A turma perdeu a paciência.</h1>
                <p class="lead">Você foi convidado a se retirar da sala.</p>
                <button id="btn-restart" class="btn btn--primary">Tentar novamente</button>
            </section>
        `;
        document.getElementById('btn-restart')?.addEventListener('click', () => {
            window.location.reload();
        });
    }

    private renderVictory(container: HTMLElement) {
        const patience = Math.round(this.patienceMeter.getPatience());
        // Mensagem varia conforme a paciência que sobrou.
        let medalha: string;
        let recado: string;
        if (patience >= 80) {
            medalha = 'Mestre do Projetor';
            recado = 'A turma nem percebeu que algo quebrou. Aula salva com folga.';
        } else if (patience >= 50) {
            medalha = 'Técnico da Sala';
            recado = 'A imagem voltou a tempo. A turma respira aliviada.';
        } else {
            medalha = 'No sufoco';
            recado = 'Foi por pouco, mas o projetor voltou antes da revolta.';
        }

        container.innerHTML = `
            <section class="screen screen--hero screen--victory">
                <p class="eyebrow">Conserto concluído</p>
                <h1 class="title">Projetor consertado!</h1>
                <p class="lead">${recado}</p>
                <div class="victory-card">
                    <span class="victory-card__badge">${medalha}</span>
                    <div class="victory-card__meter">
                        <div class="victory-card__fill" style="width:${patience}%"></div>
                    </div>
                    <span class="victory-card__score">Paciência da turma: ${patience}%</span>
                </div>
                <div class="btn-row">
                    <button id="btn-continue" class="btn btn--primary">Continuar na sala</button>
                    <button id="btn-menu" class="btn btn--quiet">Voltar ao menu</button>
                </div>
            </section>
        `;
        document.getElementById('btn-continue')?.addEventListener('click', () => this.setState('ROOM'));
        document.getElementById('btn-menu')?.addEventListener('click', () => this.setState('MENU'));
    }
}
