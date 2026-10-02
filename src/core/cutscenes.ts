export interface DialogueLine {
    speaker: string;
    text: string;
    color?: string;
}

export class CutsceneManager {
    private container: HTMLElement;
    private cutsceneLayer: HTMLElement;
    private onCompleteCallback: (() => void) | null = null;
    private dialogues: DialogueLine[] = [];
    private currentLine = 0;
    private isTyping = false;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId)!;
        this.cutsceneLayer = document.createElement('div');
        this.cutsceneLayer.className = 'cutscene-layer';
        this.cutsceneLayer.style.display = 'none';
        
        this.cutsceneLayer.innerHTML = `
            <div class="cinema-bar" id="bar-top"></div>
            <div class="dialogue-box">
                <div class="speaker-name" id="speaker-name"></div>
                <div class="dialogue-text" id="dialogue-text"></div>
                <div class="click-prompt">[Clique para continuar]</div>
            </div>
            <div class="cinema-bar" id="bar-bottom"></div>
        `;
        
        this.container.appendChild(this.cutsceneLayer);
        
        this.cutsceneLayer.querySelector('.dialogue-box')!.addEventListener('click', () => {
            this.advanceDialogue();
        });
    }

    public play(dialogues: DialogueLine[], onComplete: () => void) {
        if (this.cutsceneLayer.parentElement !== this.container) {
            this.container.appendChild(this.cutsceneLayer);
        }

        this.dialogues = dialogues;
        this.currentLine = 0;
        this.isTyping = false;
        this.onCompleteCallback = onComplete;
        this.cutsceneLayer.style.display = 'flex';
        this.cutsceneLayer.style.opacity = '1';
        this.advanceDialogue();
    }

    private advanceDialogue() {
        if (this.isTyping) return;
        
        if (this.currentLine < this.dialogues.length) {
            const line = this.dialogues[this.currentLine];
            const speakerEl = this.cutsceneLayer.querySelector('#speaker-name') as HTMLElement;
            speakerEl.innerText = line.speaker;
            if (line.color) {
                speakerEl.style.color = line.color;
            } else {
                speakerEl.style.color = 'var(--blue-on-dark)';
            }
            
            this.typeWriter(line.text, 0, () => {
                this.isTyping = false;
            });
            this.isTyping = true;
            this.currentLine++;
        } else {
            this.endCutscene();
        }
    }

    private typeWriter(text: string, i: number, fnCallback: () => void) {
        const dialogueEl = this.cutsceneLayer.querySelector('#dialogue-text') as HTMLElement;
        if (i < text.length) {
            dialogueEl.innerHTML = text.substring(0, i + 1);
            setTimeout(() => {
                this.typeWriter(text, i + 1, fnCallback);
            }, 30);
        } else {
            fnCallback();
        }
    }

    private endCutscene() {
        this.cutsceneLayer.style.opacity = '0';
        setTimeout(() => {
            this.cutsceneLayer.style.display = 'none';
            if (this.onCompleteCallback) this.onCompleteCallback();
        }, 500);
    }
}
