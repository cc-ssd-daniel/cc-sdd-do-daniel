import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { MinigameContract, MinigameResult } from '../../core/contract';
import InputRoulette from '../react-apps/roleta/InputRoulette';

export class RoletaMinigame implements MinigameContract {
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
            complete: (result: any) => {
                this.successCb?.({ success: true, score: result.score || 100 });
            },
            fail: () => {
                this.failureCb?.({ success: false, score: 0 });
            },
            audio: {
                cue: () => {}
            }
        };

        const handleEvent = (event: { type: string; payload?: { delta?: number } }) => {
            if (event.type === 'game:delta-patience') {
                window.dispatchEvent(new CustomEvent('game:delta-patience', { detail: { delta: event.payload?.delta || -5 } }));
            }
        };

        this.root.render(
            <InputRoulette 
                services={realServices}
                onEvent={handleEvent}
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
