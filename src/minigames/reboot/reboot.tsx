import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { MinigameContract, MinigameResult } from '../../core/contract';
import RebootGame from '../react-apps/reboot/RebootGame';

export class RebootMinigame implements MinigameContract {
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

        const handleComplete = (result: any) => {
            if (result.success) {
                this.successCb?.({ success: true, score: result.score || 100 });
            } else {
                this.failureCb?.({ success: false, score: 0 });
            }
        };

        this.root.render(
            <RebootGame onComplete={handleComplete} />
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
