// Flags and variables we'll need for the game
let isSpinning = false;
let score = 0;
let cardPos = {
    "1": 0,
    "3": 100,
    "7": 200
};
let choices = ["1", "3", "7"];
let audio = {};

let container = document.querySelector('#symbols>div');
let spinBtn = document.getElementById('spin');
let scoreCont = document.getElementById('score');

// Some constants
const SUPERBIGWIN_CHANCE = .043;
const BIGWIN_CHANCE = .1;

export default function startGame(aud) {
    // Get the sounds into our modules scope
    audio = aud;

    // Set event listener for spinner and animation ending
    spinBtn.addEventListener('click', () => {
        startSpinning(audio.sfx.play('spin'));
    })
}

function startSpinning(id) {

    if (!isSpinning) {
        isSpinning = true;

        let points = {
            "1": 0,
            "3": 0,
            "7": 0
        };

        // Get a chance value for us to use to determine the result shown on screen
        const chance = Math.random();

        // We'll store our result here
        let currentPattern = "";

        // 7% chance of the player getting a "SUPER WIN!!!!!"
        if (chance < SUPERBIGWIN_CHANCE) {
            currentPattern = '777';
        }
        // A normal big win has a 10% chance of occuring
        else if (chance < BIGWIN_CHANCE) {
            // 
            currentPattern = Math.random() > .5 ? '111' : '333';
        }
        // We can also just leave it to chance
        else {
            currentPattern = "" + choices[Math.floor(Math.random() * 3)];
            currentPattern += "" + choices[Math.floor(Math.random() * 3)];
            currentPattern += "" + choices[Math.floor(Math.random() * 3)];
        }

        console.log('Current Pattern:', currentPattern);


        for (let ix2 = 0, length = container.children.length; ix2 < length; ix2++) {
            // The symbol container
            let spinner = container.children[ix2];

            // Pick the card that will show
            let choice = currentPattern[ix2];

            points[choice]++;

            console.log('Choice', ix2 + 1 + ':', choice);

            for (let ix3 = 0, length = spinner.children.length; ix3 < length; ix3++) {
                // Our symbol
                let sym = spinner.children[ix3];
                sym.style.transform = `translateY(0)`;
                sym.classList.add('spin');
            }

            // Set the translation to the currently selected element
            setTimeout(function () {
                for (let ix3 = 0, length = spinner.children.length; ix3 < length; ix3++) {
                    // Our symbol
                    let sym = spinner.children[ix3];
                    sym.classList.remove('spin');
                    sym.style.transform = `translateY(-${cardPos[choice]}%)`;
                }

                // Check if this is the last element
                const lastEle = ix2 + 1 === length;

                if (lastEle) {
                    // Stop!
                    audio.sfx.stop(id);

                    // Calculate score
                    score = calcScore(points);
                    scoreCont.innerText = Math.max(parseInt(scoreCont.innerText) - 15 + score, 0);

                    // Reset flag
                    isSpinning = false;

                    if (parseInt(scoreCont.innerText) === 0) {
                        gameOver(audio);
                    }
                }
            }, (ix2 + 1) * 1400);
        }
    }
}

function calcScore(points) {
    // Our score
    let score = 0;

    for (let point in points) {
        if (points.hasOwnProperty(point)) {
            // Get the correct score based on how many points we have in each point group
            let newScore = 0;
            switch (points[point]) {
                case 1:
                    newScore = 0;
                    break;
                case 2:
                    newScore = 10;
                    break;
                case 3:
                    newScore = 20;
                    break;
                default:
                    break;
            }

            console.log('[New Score] [Old Score]:', newScore, score);

            score = Math.max(newScore, score);
        }
    }

    // If you get 3 in a roll play the big win audio
    if (points["1"] === 3 || points["3"] === 3) {
        audio.bigwin.play();
    } else if (points['7'] === 3) {
        // But if you get 3 in a roll and it's the number 7 say "SUPER BIG WIN!!!"
        audio.superbigwin.play();
        score = 140;
    }

    return score;
}

function gameOver() {
    alert('Game Overrrrrrrrrrr!!!!!!!!!');

    scoreCont.innerText = 70;
}