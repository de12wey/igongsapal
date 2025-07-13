export class Board {
    rows: number;
    columns: number;
    tiles: number[][] = [];

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;

        for (let i = 0; i < rows; i++) {
            this.tiles.push([]);
            for (let j = 0; j < columns; j++) {
                this.tiles[i].push(0);
            }
        }
    }

    getStatesBoard(): boolean[][] {
        return this.tiles.map(x => x.map(() => false));
    }

    getBoardBuffer(): number[][] {
        return this.tiles.map(x => x.map(y => y));
    }

    getNewMovMatrix(): number[][] {
        return this.tiles.map(x => x.map(() => 0));
    }

    compareBoardTo(boardToCompare: number[][]): boolean {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                if (this.tiles[i][j] !== boardToCompare[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }
}