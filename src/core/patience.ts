// Taxa padrão de decaimento da paciência por tempo (pontos por segundo).
// Ponto único de configuração (Requirement 1.4).
const DEFAULT_DECAY_RATE = 2; // -2% por segundo enquanto o jogo está ativo
const TICK_MS = 200;          // frequência do temporizador de decaimento

export class PatienceMeter {
    private currentPatience: number = 100;
    private maxPatience: number = 100;
    private decayTimer: ReturnType<typeof setInterval> | null = null;
    private decayRate: number = DEFAULT_DECAY_RATE;

    constructor() {
        this.setupListeners();
    }

    private setupListeners() {
        window.addEventListener('game:delta-patience', (e: Event) => {
            const customEvent = e as CustomEvent;
            const delta = customEvent.detail.delta;
            this.applyDelta(delta);
        });
    }

    private applyDelta(delta: number) {
        this.currentPatience = Math.min(this.maxPatience, Math.max(0, this.currentPatience + delta));

        window.dispatchEvent(new CustomEvent('game:patience-changed', {
            detail: { current: this.currentPatience }
        }));

        if (this.currentPatience === 0) {
            this.stopDecay(); // não continua decaindo após o fim de jogo
            window.dispatchEvent(new CustomEvent('game:game-over'));
        }
    }

    /**
     * Inicia (ou reinicia) o decaimento por tempo. (Requirements 1.1, 1.2, 1.3)
     * Sempre limpa um timer anterior para evitar decaimento duplicado (Requirement 2.4).
     */
    public startDecay(ratePerSecond: number = DEFAULT_DECAY_RATE) {
        this.stopDecay();
        this.decayRate = ratePerSecond;
        const perTick = this.decayRate * (TICK_MS / 1000);
        this.decayTimer = setInterval(() => {
            this.applyDelta(-perTick);
        }, TICK_MS);
    }

    /** Para o decaimento por tempo. (Requirements 2.1, 2.2, 2.4) */
    public stopDecay() {
        if (this.decayTimer !== null) {
            clearInterval(this.decayTimer);
            this.decayTimer = null;
        }
    }

    public getPatience(): number {
        return this.currentPatience;
    }
}
