import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { MinigameContract, MinigameResult } from '../../core/contract';
import FocoMilimetrico from '../react-apps/foco/FocoMilimetrico';
import { DEFAULT_CONFIG } from '../react-apps/foco/focoConfig';

export class FocoMinigame implements MinigameContract {
    private successCb?: (res: MinigameResult) => void;
    private failureCb?: (res: MinigameResult) => void;
    private container: HTMLElement;
    private root?: Root;

    constructor(id: string) { 
        this.container = document.getElementById(id) as HTMLElement; 
    }

    start() {
        if (!this.root) {
            this.root = createRoot(this.container);
        }

        const realServices = {
            patience: {
                applyDelta: (n: number) => {
                    window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: n } }));
                }
            },
            audio: {
                play: () => {},
                vibrate: () => {}
            },
            storage: {
                get: () => null,
                set: () => {}
            }
        };

        this.root.render(
            <FocoMilimetrico 
                config={DEFAULT_CONFIG} 
                services={realServices}
                onComplete={() => this.successCb?.({ success: true, score: 100 })}
                onFail={() => this.failureCb?.({ success: false, score: 0 })}
            />
        );
    }

    onSuccess(cb: any) { this.successCb = cb; }
    onFailure(cb: any) { this.failureCb = cb; }
    
    restart() { this.start(); }

    unmount() {
        if (this.root) {
            this.root.unmount();
            this.root = undefined;
        }
    }
}
