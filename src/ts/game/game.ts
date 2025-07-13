import { Board } from "./board.ts";
import { Renderer } from "./renderer.ts";
import { Stadistics } from "./stadistics.ts";

export class Game {
    board: Board;
    config: any; //?
    renderer: Renderer; //?
    stadistics: Stadistics;
    kdeHandler: any;

    constructor(rows: number, columns: number, config: any) {
        
        this.board = new Board(rows, columns);
        this.config = config;
        this.renderer = new Renderer(rows, columns);

        this.stadistics = new Stadistics(this.renderer);

        this.kdeHandler = this.keyDownEvent.bind(this)
        document.addEventListener('keydown', this.kdeHandler);

        this.newValue();
        this.newValue();
    }

    keyDownEvent(event: KeyboardEvent) {
        const updatedPositions: boolean[][] = this.board.getStatesBoard();
        const boardBuffer: number[][] = this.board.getBoardBuffer();
        const movMatrix: number[][] = this.board.getNewMovMatrix();
    
        switch (event.key) {
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
             this.stadistics.score += this.getMovScore(updatedPositions);
             this.stadistics.totalMoves++;

             this.renderer.slideTiles(event.key, movMatrix);
             this.renderer.updateTiles(this.board.tiles, updatedPositions);
             this.newValue();
        }

        if (this.stadistics.gameOver = this.checkGameOver()) {
            console.log('Game over!');
            this.pause();
        }
    }

    newValue() {
        const freeCoords: number[][] = [];
        this.board.tiles.forEach( (r, i) => r.forEach( (c, j) => {
            if (c === 0) freeCoords.push([i, j])
        }));
        
        const coord: number[] = freeCoords[Math.floor(Math.random() * freeCoords.length)];
        const value = Math.random() > .9 ? 4 : 2
        this.board.tiles[coord[0]][coord[1]] = value;
        this.renderer.createTile(coord[1], coord[0], value);
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

    pause() {
        document.removeEventListener('keydown', this.kdeHandler);
        this.stadistics.paused = true;
    }

    resume() {
        document.addEventListener('keydown', this.kdeHandler);
        this.stadistics.paused = false;
    }
}