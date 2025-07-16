import { Game } from './game/game';

window.addEventListener('load', () => {
    const spanScore = document.querySelector<HTMLSpanElement>('#score');
    const spanBest = document.querySelector<HTMLSpanElement>('#best');
    const spanMoves = document.querySelector<HTMLSpanElement>('#moves');
    const buttonUndo = document.querySelector<HTMLButtonElement>('#undo');
    const buttonNewGame = document.querySelector<HTMLButtonElement>('#new-game');

    let game = new Game(4, 4, updateHtml);
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
    
    buttonNewGame!.addEventListener('click', () => {
        game.destroy();
        game = new Game(4, 4, updateHtml);
        game.stateUpdated();
    });

    buttonUndo!.addEventListener('click', () => { 
        game.undo(); 
        buttonUndo!.disabled = true;
        buttonUndo!.classList.add('disabled');
    });
});

