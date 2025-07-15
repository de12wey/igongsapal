import { Board } from "./board.ts";
import { GameState } from "./game-state.ts";
import { Renderer } from "./renderer.ts";

export class Game {
    board: Board;
    renderer: Renderer;

    /* Game state */
    best: number = 0;
    score: number = 0;
    moves: number = 0;
    paused: boolean = false;
    gameOver: boolean = false;
    stateUpdated: () => void;
    
    /* Undo buffer */
    lastPosition?: number[][];
    lastScore: number = 0;
    lastMoves: number = 0;

    /* Event handlers */
    kdeHandler: any;
    tsHandler: any;
    teHandler: any;

    startX: number = 0;
    startY: number = 0;
    swipeDirection: string | null = null;

    constructor(rows: number, columns: number, stateUpdated: () => void) {
        this.board = new Board(rows, columns);
        this.stateUpdated = stateUpdated;
        this.renderer = new Renderer(rows, columns);
        
        const best = localStorage.getItem('best');
        if (best) {
            this.best = parseFloat(best);
        }

        /* Try to get game state from local storage */
        const restored: GameState = JSON.parse(localStorage.getItem('gameState')!);
        if (restored) {
            this.board.tiles = restored.tiles;
            this.score = restored.score;
            this.moves = restored.moves;
            this.lastPosition = restored.lastPosition;
            this.lastScore = restored.lastScore;
            this.lastMoves = restored.lastMoves;
            this.paused = restored.paused;
            this.gameOver = restored.gameOver;
            this.renderer.resetTiles(this.board.tiles);
        }
        else {
            this.newValue();
            this.newValue();
            // this.newValueDebug();
        }

        this.kdeHandler = this.keyDownEvent.bind(this);
        this.tsHandler = this.handleTouchStart.bind(this);
        this.teHandler = this.handleTouchEnd.bind(this);
        document.addEventListener('keydown', this.kdeHandler);
        document.addEventListener('touchstart', this.tsHandler);
        document.addEventListener('touchend', this.teHandler);
    }

    keyDownEvent(event: KeyboardEvent) {
        this.gameAction(event.key);
    }

    handleTouchStart(event: TouchEvent) {
        const touch = event.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
    }

    handleTouchEnd(event: TouchEvent) {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.startX;
        const deltaY = touch.clientY - this.startY;

        const threshold = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > threshold) {
                this.swipeDirection = deltaX > 0 ? 'ArrowRight' : 'ArrowLeft';
            }
        } else {
            if (Math.abs(deltaY) > threshold) {
                this.swipeDirection = deltaY > 0 ? 'ArrowDown' : 'ArrowUp';
            }
        }

        if (this.swipeDirection) {
            this.gameAction(this.swipeDirection);
        }

        this.swipeDirection = null;
    }

    gameAction(key: string) {
        this.lastPosition = this.board.getBoardBuffer();
        this.lastScore = this.score;
        this.lastMoves = this.moves;

        const updatedPositions: boolean[][] = this.board.getStatesBoard();
        const boardBuffer: number[][] = this.board.getBoardBuffer();
        const movMatrix: number[][] = this.board.getNewMovMatrix();
    
        switch (key) {
            case 'ArrowUp':
                for (let i = 1; i < this.board.tiles.length; i++) {
                    for (let j = 0; j < this.board.tiles[i].length; j++) {
                        if (this.board.tiles[i][j] !== 0) {
                            let mov = 0;
                            for (let x = i - 1; x >= 0; x--) {
                                mov++;
                                if (this.board.tiles[x][j] == this.board.tiles[i][j] && !updatedPositions[x][j]) {
                                    this.board.tiles[x][j] += this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    updatedPositions[x][j] = true;
                                    break;
                                }
                                else if (this.board.tiles[x][j] != 0) {
                                    let buffer = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    this.board.tiles[x+1][j] = buffer;
                                    mov--;
                                    break;
                                }
                                else if (x == 0) {
                                    this.board.tiles[x][j] = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                }
                            }
                            movMatrix[i][j] = mov;
                        }
                    }
                }
                break;
            case 'ArrowDown':
                for (let i = this.board.tiles.length - 2; i >= 0; i--) {
                    for (let j = 0; j < this.board.tiles[i].length; j++) {
                        if (this.board.tiles[i][j] !== 0) {
                            let mov = 0;
                            for (let x = i + 1; x < this.board.tiles.length; x++) {
                                mov++;
                                if (this.board.tiles[x][j] == this.board.tiles[i][j] && !updatedPositions[x][j]) {
                                    this.board.tiles[x][j] += this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    updatedPositions[x][j] = true;
                                    break;
                                }
                                else if (this.board.tiles[x][j] != 0) {
                                    let buffer = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    this.board.tiles[x-1][j] = buffer;
                                    mov--;
                                    break;
                                }
                                else if (x == this.board.tiles.length - 1) {
                                    this.board.tiles[x][j] = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                }
                            }
                            movMatrix[i][j] = mov;
                        }
                    }
                }
                break;
            case 'ArrowLeft':
                for (let i = 0; i < this.board.tiles.length; i++) {
                    for (let j = 1; j < this.board.tiles[i].length; j++) {
                        if (this.board.tiles[i][j] !== 0) {
                            let mov = 0;
                            for (let x = j - 1; x >= 0; x--) {
                                mov++;
                                if (this.board.tiles[i][x] == this.board.tiles[i][j] && !updatedPositions[i][x]) {
                                    this.board.tiles[i][x] += this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    updatedPositions[i][x] = true;
                                    break;
                                }
                                else if (this.board.tiles[i][x] != 0) {
                                    let buffer = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    this.board.tiles[i][x+1] = buffer;
                                    mov--;
                                    break;
                                }
                                else if (x == 0) {
                                    this.board.tiles[i][x] = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                }
                            }
                            movMatrix[i][j] = mov;
                        }
                    }
                }
                break;
            case 'ArrowRight':
                for (let i = 0; i < this.board.tiles.length; i++) {
                    for (let j = this.board.tiles[i].length - 2; j >= 0; j--) {
                        if (this.board.tiles[i][j] !== 0) {
                            let mov = 0;
                            for (let x = j + 1; x < this.board.tiles[i].length; x++) {
                                mov++;
                                if (this.board.tiles[i][x] == this.board.tiles[i][j] && !updatedPositions[i][x]) {
                                    this.board.tiles[i][x] += this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    updatedPositions[i][x] = true;
                                    break;
                                }
                                else if (this.board.tiles[i][x] != 0) {
                                    let buffer = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                    this.board.tiles[i][x-1] = buffer;
                                    mov--;
                                    break;
                                }
                                else if (x == this.board.tiles[i].length - 1) {
                                    this.board.tiles[i][x] = this.board.tiles[i][j];
                                    this.board.tiles[i][j] = 0;
                                }
                            }
                            movMatrix[i][j] = mov;
                        }
                    }
                }
                break;
        }

        if (this.board.compareBoardTo(boardBuffer)) {
            this.score += this.getMovScore(updatedPositions);
            this.moves++;
            this.stateUpdated();

            this.renderer.slideTiles(key, movMatrix);
            this.renderer.updateTiles(this.board.tiles, updatedPositions);
            this.newValue();
            this.saveToLocal();
        }

        if (this.gameOver = this.checkGameOver()) {
            console.log('Game over!');
            this.pause();
        }
    }

    newValue(v: number = 0) {
        const freeCoords: number[][] = [];
        this.board.tiles.forEach( (r, i) => r.forEach( (c, j) => {
            if (c === 0) freeCoords.push([i, j])
        }));
        
        const coord: number[] = freeCoords[Math.floor(Math.random() * freeCoords.length)];
        const value = v > 0 ? v : Math.random() > .9 ? 4 : 2
        this.board.tiles[coord[0]][coord[1]] = value;
        this.renderer.createTile(coord[1], coord[0], value);
    }

    newValueDebug() {
        let pow = 2;
        this.board.tiles.forEach(r => r.forEach(() => {
            this.newValue(pow);
            pow *= 2;
        }));
    }

    getMovScore(updatedPositions: boolean[][]): number {
        let result = 0;
        updatedPositions.forEach((r, i) => r.forEach((c, j) => {
            if (c) result += this.board.tiles[i][j]; 
        }));
        return result;
    } 

    checkGameOver(): boolean {
        if (this.board.tiles.every(r => r.every(c => c !== 0))) {
            for (let i = 0; i < this.board.tiles.length; i++) {
                for (let j = 0; j < this.board.tiles[i].length; j++) {
                    if ((i < this.board.tiles.length - 1 && this.board.tiles[i][j] === this.board.tiles[i + 1][j]) ||
                        (j < this.board.tiles[i].length - 1 && this.board.tiles[i][j] === this.board.tiles[i][j + 1])) {
                            return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    undo() {
        if (this.lastPosition !== undefined) {
            this.score = this.lastScore;
            this.moves = this.lastMoves;
            this.stateUpdated();
            this.board.tiles = this.lastPosition;
            this.renderer.resetTiles(this.board.tiles);
            this.saveToLocal();
        }
    }

    pause() {
        document.removeEventListener('keydown', this.kdeHandler);
        document.removeEventListener('touchstart', this.tsHandler);
        document.removeEventListener('touchend', this.teHandler);
        this.paused = true;
    }

    resume() {
        document.addEventListener('keydown', this.kdeHandler);
        document.addEventListener('touchstart', this.tsHandler);
        document.addEventListener('touchend', this.teHandler);
        this.paused = false;
    }

    saveToLocal() {
        localStorage.setItem('gameState', JSON.stringify(new GameState(this)));

        const best = localStorage.getItem('best');
        if (!best || parseFloat(best) <= this.score) {
            this.best = this.score;
            localStorage.setItem('best', this.best.toString());
            this.stateUpdated();
        }
    }

    destroy() {
        localStorage.removeItem('gameState');
        this.pause();
        this.renderer.destroy();
    }
}