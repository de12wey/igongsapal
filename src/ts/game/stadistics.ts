import type { Renderer } from "./renderer.ts";

export class Stadistics {
    renderer: Renderer;
    score = 0;
    totalMoves = 0;
    paused = false;
    gameOver = false;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }
}