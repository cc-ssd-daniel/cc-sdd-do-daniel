import type { MinigameContract } from './contract';
import { PatienceMeter } from './patience';
import { FocoMinigame } from '../minigames/foco/foco';
import { RebootMinigame } from '../minigames/reboot/reboot';
import { RoletaMinigame } from '../minigames/roleta/roleta';
import { CaboMinigame } from '../minigames/cabo/CaboMinigame';
import { EquilibrioMinigame } from '../minigames/equilibrio/EquilibrioMinigame';
import { SenhaMinigame } from '../minigames/senha/SenhaMinigame';
import { CutsceneManager } from './cutscenes';
import type { DialogueLine } from './cutscenes';

interface MinigameEntry {
    GameClass: new (id: string) => MinigameContract;
    cutscene: DialogueLine[];
}

export class CoreLoop {
    private currentState: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER' | 'VICTORY' = 'MENU';
    private container: HTMLElement;
    private currentMinigame?: MinigameContract;
    private patienceMeter: PatienceMeter;
    private cutsceneManager: CutsceneManager;
    private minigameQueue: MinigameEntry[] = [];

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.patienceMeter = new PatienceMeter();

        window.addEventListener('game:patience-changed', (e: any) => {
            const patience = e.detail.current;
            this.updatePatienceHud(patience);
            if (patience <= 0 && this.currentState !== 'GAME_OVER') {
                this.setState('GAME_OVER');
            }
        });

        this.render();
        // Inicializa o manager de cutscenes passando o id do container principal
        this.cutsceneManager = new CutsceneManager(containerId);
    }

    private setState(newState: 'MENU' | 'ROOM' | 'REPAIR' | 'GAME_OVER' | 'VICTORY') {
        if (this.currentMinigame) {
            this.currentMinigame.unmount?.();
            this.currentMinigame = undefined;
        }
        this.currentState = newState;

        if (newState === 'ROOM' || newState === 'REPAIR') {
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
                    <button id="btn-repair" class="btn btn--primary">Modo Conserto (1ª Pessoa)</button>
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

    private renderRepairMode(container: HTMLElement) {
        container.innerHTML = `
            <section class="screen screen--repair">
                <h2 class="title title--md" id="repair-title">Reparos em Andamento...</h2>
                <div id="minigame-container" class="minigame-stage" style="background:#111; border: 2px solid #444;"></div>
                <button id="btn-abandon" class="btn btn--quiet" style="margin-top: 15px;">Abandonar conserto</button>
            </section>
        `;
        document.getElementById('btn-abandon')?.addEventListener('click', () => {
            this.currentMinigame?.unmount?.();
            this.setState('ROOM');
        });

        this.minigameQueue = [
            {
                GameClass: CaboMinigame,
                cutscene: [
                    { speaker: "Prof. Carlos", text: "Graças a Deus a TI chegou! Os alunos estão me engolindo vivo..." },
                    { speaker: "Prof. Carlos", text: "O cabo VGA desconectou do teto de novo. Mas tem um problema pior..." },
                    { speaker: "Prof. Carlos", text: "A lâmpada quebrou a trava de segurança. Ela tá disparando um flash de 5.000 lúmens que cega qualquer um!" },
                    { speaker: "Você (TI)", text: "...Deixa comigo. Vou no escuro.", color: "#ff3366" }
                ]
            },
            {
                GameClass: FocoMinigame,
                cutscene: [
                    { speaker: "Aluno no Fundo", text: "Ih, a imagem tá toda borrada! Não dá pra ler nada!" },
                    { speaker: "Prof. Carlos", text: "TI, ajusta o foco milimétrico! Rápido, eles estão perdendo a paciência!" },
                    { speaker: "Você (TI)", text: "Essas lentes velhas são impossíveis de girar. Lá vou eu...", color: "#ff3366" }
                ]
            },
            {
                GameClass: EquilibrioMinigame,
                cutscene: [
                    { speaker: "Prof. Carlos", text: "O projetor desalinhou, você vai ter que subir ali." },
                    { speaker: "Você (TI)", text: "Não tem escada?", color: "#ff3366" },
                    { speaker: "Prof. Carlos", text: "Use aquela cadeira de rodinhas quebrada. Só tenta não cair, por favor." }
                ]
            },
            {
                GameClass: RebootMinigame,
                cutscene: [
                    { speaker: "Sistema do Projetor", text: "[ERRO 404] - TELA AZUL DE PROJEÇÃO" },
                    { speaker: "Você (TI)", text: "Vou ter que segurar o botão de power por 10 segundos para forçar o reboot.", color: "#ff3366" },
                    { speaker: "Turma", text: "ARRUMA LOGO ISSO!!!" }
                ]
            },
            {
                GameClass: RoletaMinigame,
                cutscene: [
                    { speaker: "Você (TI)", text: "Falta só configurar a entrada. Vamos ver em qual canal o PC tá conectado...", color: "#ff3366" },
                    { speaker: "Prof. Carlos", text: "Cuidado! Esse modelo antigo é uma roleta russa. Se escolher a entrada errada, ele queima!" }
                ]
            },
            {
                GameClass: SenhaMinigame,
                cutscene: [
                    { speaker: "Projetor", text: "INSIRA A SENHA ADMINISTRATIVA PARA LIBERAR A PROJEÇÃO" },
                    { speaker: "Prof. Carlos", text: "Nossa, eu esqueci a senha! Acho que era Pr0jetor@123!" },
                    { speaker: "Você (TI)", text: "Tenho poucos segundos para digitar antes do bloqueio de segurança...", color: "#ff3366" }
                ]
            }
        ];
        this.playNextMinigame();
    }

    private playNextMinigame() {
        if (this.currentMinigame) {
            this.currentMinigame.unmount?.();
        }

        if (this.minigameQueue.length === 0) {
            window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: 20 } }));
            this.setState('VICTORY');
            return;
        }

        const nextEntry = this.minigameQueue.shift()!;
        
        // Show cutscene first
        this.cutsceneManager.play(nextEntry.cutscene, () => {
            // Cutscene done, start minigame
            this.currentMinigame = new nextEntry.GameClass('minigame-container');

            this.currentMinigame!.onSuccess(() => {
                window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: 15 } }));
                this.playNextMinigame();
            });

            this.currentMinigame!.onFailure(() => {
                window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: -30 } }));
                this.currentMinigame?.unmount?.();
                this.setState('ROOM');
            });

            this.currentMinigame!.start();
        });
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
