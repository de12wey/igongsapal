import { Game } from './game/game';

window.addEventListener('load', () => {
    const spanScore = document.querySelector<HTMLSpanElement>('#score');
    const spanBest = document.querySelector<HTMLSpanElement>('#best');
    const spanMoves = document.querySelector<HTMLSpanElement>('#moves');
    const buttonUndo = document.querySelector<HTMLButtonElement>('#undo');
    const buttonNewGame = document.querySelector<HTMLButtonElement>('#new-game');
    const divNgOverlay = document.querySelector<HTMLDivElement>('.ng-overlay');
    const buttonNewGameModal = document.querySelector<HTMLButtonElement>('#modal-new-game');
    const buttonCancelModal = document.querySelector<HTMLButtonElement>('#modal-cancel');

    let game = new Game(4, 4, updateHtml, gameOver);
    game.stateUpdated();

    if (!game.lastPosition) {
        buttonUndo!.disabled = true;
        buttonUndo!.classList.add('disabled');
    }

    function updateHtml() {
        if (spanScore) {
            spanScore.innerText = game.score.toString();
        }
        
        if (spanMoves) {
            spanMoves.innerText = game.moves.toString();
        }
        
        if (spanBest) {
            spanBest.innerText = game.best.toString();
        }

        if (buttonUndo) {
            buttonUndo.disabled = false;
            buttonUndo.classList.remove('disabled');
        }
    }

    function gameOver() {
        const board = document.querySelector<HTMLDivElement>('#board');
        if (board) {
            board.classList.add('game-over');
        }
    }
    
    buttonNewGame!.addEventListener('click', () => {
        game.pause();
        divNgOverlay?.classList.remove('hidden');
    });
    
    buttonNewGameModal!.addEventListener('click', () => {
        game.destroy();
        game = new Game(4, 4, updateHtml, gameOver);
        game.stateUpdated();
        divNgOverlay?.classList.add('hidden');
    });
    
    buttonCancelModal!.addEventListener('click', () => {
        game.resume();
        divNgOverlay?.classList.add('hidden');
    });

    buttonUndo!.addEventListener('click', () => { 
        game.undo(); 
        buttonUndo!.disabled = true;
        buttonUndo!.classList.add('disabled');
        
        if (game.gameOver) {
            game.gameOver = false;
            game.resume();
            const board = document.querySelector<HTMLDivElement>('#board');
            if (board) {
                board.classList.remove('game-over');
            }
        }
    });
});

