export interface MinigameResult {
    success: boolean;
    score: number;
}

export interface MinigameContract {
    start(): void;
    onSuccess(callback: (result: MinigameResult) => void): void;
    onFailure(callback: (result: MinigameResult) => void): void;
    restart(): void;
    unmount?(): void;
}
