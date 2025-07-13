import { getCssVariablePx } from "../utils";

export class Renderer {
    domBoard: HTMLDivElement;
    transitionTimeMs = 200; // <- Make sure it is synchronized with CSS
    namesMap = new Map<number, string>();

    constructor(rows: number, columns: number) {
        this.namesMap.set(2, '이');
        this.namesMap.set(4, '산');
        this.namesMap.set(8, '남');
        this.namesMap.set(16, '북');
        this.namesMap.set(32, '서');
        this.namesMap.set(64, '덩');
        this.namesMap.set(128, '비');
        this.namesMap.set(256, '술');
        this.namesMap.set(512, '꽃');
        this.namesMap.set(1024, '말');
        this.namesMap.set(2048, '한');
        this.namesMap.set(4096, '애');
        this.namesMap.set(8192, '네');
        this.namesMap.set(16384, '빛');
        this.namesMap.set(32768, '별');

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

        const mainContainer = document.querySelector<HTMLDivElement>('.main-container');
        mainContainer?.appendChild(this.domBoard);
    }

    getTilePosition(x: number, y: number): { top: number; left: number } {
        const tileSize = getCssVariablePx('--tile-size');
        const tileGap = getCssVariablePx('--tile-gap');
        return {
            top: y * (tileSize + tileGap) + tileGap,
            left: x * (tileSize + tileGap) + tileGap
        };
    }

    createTile(x: number, y: number, value: number): HTMLDivElement {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.x = x.toString();
        tile.dataset.y = y.toString();
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
}