export class PatienceMeter {
    private currentPatience: number = 100;
    private maxPatience: number = 100;

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
            window.dispatchEvent(new CustomEvent('game:game-over'));
        }
    }

    public getPatience(): number {
        return this.currentPatience;
    }
}
