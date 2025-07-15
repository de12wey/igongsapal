import type { Game } from "./game";

export class GameState {

    tiles: number[][] = [];
    score: number = 0;
    moves: number = 0;

    lastPosition?: number[][] = [];
    lastScore: number = 0;
    lastMoves: number = 0;

    paused: boolean = false;
    gameOver: boolean = false;

    constructor(game: Game) {
        this.tiles = game.board.tiles;
        this.score = game.score;
        this.moves = game.moves;
        this.lastPosition = game.lastPosition;
        this.lastScore = game.lastScore;
        this.lastMoves = game.lastMoves;
        this.paused = game.paused;
        this.gameOver = game.gameOver;
    }
}