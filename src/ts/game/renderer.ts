import { getCssVariablePx } from "../utils";

export class Renderer {
    domBoard: HTMLDivElement;
    transitionTimeMs = 150; // <- Make sure it is synchronized with CSS
    namesMap = new Map<number, string>();
    rows: number = 0;
    colums: number = 0;
    tileSize: number = 0;
    tileGap: number = 0;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.colums = columns;

        this.tileSize = getCssVariablePx('--tile-size');
        this.tileGap = getCssVariablePx('--tile-gap');

        this.namesMap.set(2, '가');
        this.namesMap.set(4, '나');
        this.namesMap.set(8, '다');
        this.namesMap.set(16, '라');
        this.namesMap.set(32, '마');
        this.namesMap.set(64, '바');
        this.namesMap.set(128, '사');
        this.namesMap.set(256, '아');
        this.namesMap.set(512, '자');
        this.namesMap.set(1024, '차');
        this.namesMap.set(2048, '카');
        this.namesMap.set(4096, '타');
        this.namesMap.set(8192, '파');
        this.namesMap.set(16384, '하');
        this.namesMap.set(32768, '빠');

        // Changing the value of global css variables
        const root = document.documentElement;
        root.style.setProperty('--grid-rows-size', rows.toString());
        root.style.setProperty('--grid-columns-size', columns.toString());

        this.domBoard = document.createElement('div') as HTMLDivElement;
        this.domBoard.id = 'board';

        for (let i = 0; i < rows * columns; i++) {
            const tp = document.createElement('div') as HTMLDivElement;
            tp.classList.add('cell');
            if (i === 0) tp.id = 'cell-reference';
            this.domBoard.appendChild(tp);
        }

        window.addEventListener('resize', () => {
            this.tileSize = getCssVariablePx('--tile-size');
            this.tileGap = getCssVariablePx('--tile-gap');

            const tiles = document.querySelectorAll<HTMLDivElement>('.tile');

            tiles.forEach(tile => {
                tile.classList.add('no-transition');
                const x = parseInt(tile.dataset.x!);
                const y = parseInt(tile.dataset.y!);
                const { top, left } = this.getTilePosition(x, y);
                tile.style.top = `${top}px`;
                tile.style.left = `${left}px`;
            });

            requestAnimationFrame(() => {
                tiles.forEach(tile => tile.classList.remove('no-transition'));
            });
        })

        const mainContainer = document.querySelector<HTMLDivElement>('.board-container');
        mainContainer?.appendChild(this.domBoard);
    }

    getTilePosition(x: number, y: number): { top: number; left: number } {
        return {
            top: y * (this.tileSize + this.tileGap) + this.tileGap,
            left: x * (this.tileSize + this.tileGap) + this.tileGap
        };
    }

    createTile(x: number, y: number, value: number, animation: boolean = true): HTMLDivElement {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (!animation) {
            tile.classList.add('no-animation');
        }
        
        tile.dataset.x = x.toString();
        tile.dataset.y = y.toString();
        tile.classList.add(`c${value}`);
        tile.textContent = this.namesMap.get(value)!;

        const { top, left } = this.getTilePosition(x, y);
        tile.style.top = `${top}px`;
        tile.style.left = `${left}px`;
        tile.style.width = 'var(--tile-size)';
        tile.style.height = 'var(--tile-size)';

        document.getElementById('board')!.appendChild(tile);

        return tile;
    }

    moveTile(tile: HTMLDivElement, x: number, y: number) {
        const { top, left } = this.getTilePosition(x, y);
        tile.style.top = `${top}px`;
        tile.style.left = `${left}px`;
        tile.dataset.x = x.toString();
        tile.dataset.y = y.toString();
    }

    changeTilePosition(tile: HTMLDivElement, x: number, y: number) {
        tile.dataset.x = x.toString();
        tile.dataset.y = y.toString();
    }

    getTilesAt(x: number, y: number): HTMLDivElement[] | null {
        return Array.from(document.querySelectorAll(`.tile[data-x="${x}"][data-y="${y}"]`));
    }

    removeTilesAt(x: number, y: number) {
        const tiles = this.getTilesAt(x, y);
        tiles?.forEach(t => t.remove());
    }

    removeTiles(updatedTiles: boolean[][]) {
        updatedTiles.forEach((r, i) => r.forEach((c, j) => {
            if (c) {
                this.removeTilesAt(j, i);
            }
        }));
    }

    slideTiles(key: string, slideTiles: number[][]) {

        const vertical = key === 'ArrowDown';
        const reverse = key === 'ArrowRight';

        for (let i = 0; i < slideTiles.length; i++) {
            for (let j = 0; j < slideTiles[0].length; j++) {

                const ni = vertical ? slideTiles.length - 1 - i : i;
                const nj = reverse ? slideTiles[0].length - 1 - j : j;
                const c = slideTiles[ni][nj];
                
                if (c !== 0) {
                    const tiles = this.getTilesAt(nj, ni);
                    if (tiles && tiles[0]) {
                        if (key === 'ArrowUp') {
                            this.moveTile(tiles[0], nj, ni - c);
                        }
                        else if (key === 'ArrowDown') {
                            this.moveTile(tiles[0], nj, ni + c);
                        }
                        else if (key === "ArrowLeft") {
                            this.moveTile(tiles[0], nj - c, ni);
                        }
                        else if (key === 'ArrowRight') {
                            this.moveTile(tiles[0], nj + c, ni);
                        }
                    }
                }
            }
        }
    }

    updateTiles(board: number[][], updatedTiles: boolean[][]) {
        updatedTiles.forEach((r, i) => r.forEach((c, j) => {
            if (c) {
                const tilesDel = this.getTilesAt(j, i);
                tilesDel?.forEach(t => {
                    t.style.zIndex = '1';
                    t.dataset.x = '-1';
                    t.dataset.y = '-1';
                });

                this.createTile(j, i, board[i][j]);
                
                setTimeout(() => {
                    tilesDel?.forEach(t => t.remove());
                }, this.transitionTimeMs);
            }
        }));
    }

    resetTiles(board: number[][]) {
        board.forEach((r, i) => r.forEach((v, j) => {
            const tilesDel = this.getTilesAt(j, i);
            tilesDel?.forEach(t => t.remove());

            if (board[i][j] !== 0) {
                this.createTile(j, i, v, false);
            }
        }));
    }

    destroy() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.colums; j++) {
                const tilesDel = this.getTilesAt(j, i);
                tilesDel?.forEach(t => t.remove());
            }
        }

        this.domBoard.remove();
    }
}