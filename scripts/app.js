const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
const startButton = document.querySelector('.startBtn')
let startPoint = 150;
let doodlerLeftSpace = 50;
let doodlerBottomSpace = startPoint
let platformCount = 5;
let platforms = [];
let upTimerId, downTimerId;
let isJumping = true;
let isGoingLeft, isGoingRight = false;
let leftTimerId, rightTimerId;
let score = 0;

let isGameOver = false;

class Platform {
    constructor(newPlatBottom) {
        this.bottom = newPlatBottom
        this.left = Math.random() * 315;
        this.visual = document.createElement('div');

        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom= this.bottom + 'px';
        grid.appendChild(visual);

    }
}

const createDoodler = () => {
    grid.appendChild(doodler);
    
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
}

const createPlatforms = () => {
    for (let i = 0; i < platformCount; i++) {
        let platGap = 600 / platformCount;
        let newPlatBottom = 100 + i * platGap;
        let newPlatform = new Platform(newPlatBottom);
        platforms.push(newPlatform);
        console.log(platforms)
    }
}

const moveplatforms = () => {
    if (doodlerBottomSpace > 200) {
        platforms.forEach(platform => {
            platform.bottom -= 4;
            let visual = platform.visual;
            visual.style.bottom = platform.bottom + 'px';

            if (platform.bottom <= 10) {
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove('platform');
                platforms.shift();
                console.log(platforms)
                let newPlatform = new Platform(600);
                platforms.push(newPlatform);
                score++;
            }
        })
    }
}

const jump = () => {
    isJumping = true;
    clearInterval(downTimerId);
    upTimerId = setInterval(function() {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (doodlerBottomSpace > startPoint + 200) {
            fall();
        }
    },30)
}

const fall = () => {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(function() {
        doodlerBottomSpace -= 8;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (doodlerBottomSpace <= 0) {
            gameOver()
        }
        platforms.forEach(platform => {
            if (
                (doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= platform.bottom + 15) &&
                ((doodlerLeftSpace + 60) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)) &&
                !isJumping 
            ) {
                console.log("landed")
                startPoint = doodlerBottomSpace;
                jump();
        }
        })
    },20)
}

const controls = (e) => {
    if (e.key === "ArrowLeft") {
        moveLeft();
    }
    else if (e.key === 'ArrowRight') {
        moveRight();
    }
    else if (e.key === 'ArrowUp') {
        moveStraight();
    }
}

const moveLeft = () => {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    doodler.style.transform = 'scaleX(-1)'
    isGoingLeft = true;
    leftTimerId = setInterval(function() {
        if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 5;
            doodler.style.left = doodlerLeftSpace + 'px';       
        }
        else moveRight();

    },20)
}
const moveRight = () => {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    doodler.style.transform = 'scaleX(1)'
    isGoingRight = true;
    rightTimerId = setInterval(function() {
        if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
        }
        else moveLeft();
    },20)
}
const moveStraight = () => {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);

}

const start = (isGameOver) => {
    console.log(isGameOver);
    if (!isGameOver) {
        createPlatforms();
        createDoodler();
        setInterval(moveplatforms,30);
        jump();
        document.addEventListener('keyup',controls)
;    }
}

const gameOver = () => {
    console.log("game over")
    isGameOver = true;
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    platforms = [];

}

startButton.addEventListener('click', function() {
    startPoint = 150;
    doodler.style.bottom = 0 + 'px'
    doodlerLeftSpace = 50;
    doodlerBottomSpace = startPoint
    platforms = [];
    isJumping = true;
    isGoingLeft, isGoingRight = false;
    score = 0;
    grid.innerHTML = "";
    isGameOver = false;
    start(isGameOver);
});
