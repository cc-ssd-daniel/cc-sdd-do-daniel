// Taxa padrão de decaimento da paciência por tempo (pontos por segundo).
// Ponto único de configuração (Requirement 1.4).
const DEFAULT_DECAY_RATE = 0.8;
const TICK_MS = 200;

export class PatienceMeter {
    private currentPatience: number = 100;
    private maxPatience: number = 100;
    private gameOverEmitted: boolean = false;
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
        this.currentPatience = Math.min(
            this.maxPatience,
            Math.max(0, this.currentPatience + delta)
        );

        window.dispatchEvent(new CustomEvent('game:patience-changed', {
            detail: { current: this.currentPatience }
        }));

        if (this.currentPatience > 0) {
            this.gameOverEmitted = false;
        } else if (!this.gameOverEmitted) {
            this.gameOverEmitted = true;
            this.stopDecay();
            window.dispatchEvent(new CustomEvent('game:game-over'));
        }
    }

    /**
     * Inicia ou reinicia o decaimento por tempo.
     * Sempre limpa o timer anterior para evitar decaimento duplicado.
     */
    public startDecay(ratePerSecond: number = DEFAULT_DECAY_RATE) {
        this.stopDecay();
        this.decayRate = ratePerSecond;
        const perTick = this.decayRate * (TICK_MS / 1000);
        this.decayTimer = setInterval(() => {
            this.applyDelta(-perTick);
        }, TICK_MS);
    }

    /** Para o decaimento por tempo. */
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
