import '../styles/style.css';
import { Game } from './game/game';


const spanScore = document.querySelector<HTMLSpanElement>('#score');
const spanBest = document.querySelector<HTMLSpanElement>('#best');
const spanMoves = document.querySelector<HTMLSpanElement>('#moves');
const buttonUndo = document.querySelector<HTMLButtonElement>('#undo');
const buttonNewGame = document.querySelector<HTMLButtonElement>('#new-game');

window.addEventListener('load', () => {
    let game = new Game(4, 4, updateHtml);
    game.stateUpdated();

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
    }
    
    buttonNewGame?.addEventListener('click', () => {
        game.destroy();
        game = new Game(4, 4, updateHtml);
        game.stateUpdated();
    });

    document.querySelector<HTMLButtonElement>('#undo')?.addEventListener('click', () => { game.undo(); })

});

