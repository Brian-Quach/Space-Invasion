
let gameState = {
    preload: preload,
    create: create,
    update: update
};

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: gameState
};

let cursors;
let fireButton;
let player;
let bullets;
let enemies;
let enemyBullets;

let userInterface;

let UFO;
let currUFO;

let playerDead = false;

let scoreText;
let livesText;
let stateText;

let score = 0;
let lives = 3;

function Reset(){

    cursors = null;
    fireButton = null;
    player = null;
    bullets = null;
    enemies = null;
    enemyBullets = null;

    UFO = null;
    currUFO = null;

    playerDead = false;

    scoreText = null;
    livesText = null;
    stateText = null;

    score = 0;
    lives = 3;

}

let game = new Phaser.Game(config);


function preload () {
    this.load.image('sky', '/assets/sprites/starfield.png');
    this.load.image('ship', '/assets/sprites/player.png');
    this.load.image('bullet', '/assets/sprites/bullet.png');
    this.load.image('bullet2', '/assets/sprites/enemy-bullet.png');

    this.load.spritesheet('enemy',
        '/assets/sprites/invader32x32x4.png',
        { frameWidth: 32, frameHeight: 32 }
    );

    this.load.spritesheet('explode',
        '/assets/sprites/explode.png',
        {frameWidth: 128, frameHeight: 128}
    );


    this.load.image('enemy2', '/assets/sprites/invader.png');
}

let enemyCount = 0


function create () {
    // Background
    this.add.image(400, 300, 'sky');

    // Player
    player = this.physics.add.sprite(100, 500, 'ship');
    player.setCollideWorldBounds(true);

    // Enemies
    enemies = this.physics.add.group();
    UFO = this.physics.add.group();

    // Bullets
    bullets = this.physics.add.group();
    enemyBullets = this.physics.add.group();

    // Bullet collisions
    this.physics.add.overlap(bullets, enemies, killEnemy, null, this);
    this.physics.add.overlap(bullets, UFO, killUFO, null, this);
    this.physics.add.overlap(player, enemyBullets, playerHit, null, this);
    this.physics.add.overlap(player, UFO, UFOCollide, null, this);

    userInterface = this.physics.add.group();

    // Spawn Enemy ships
    let enemyLocs = getEnemyLocations();
    enemyLocs.forEach(location => {
        spawnEnemy(location[0], location[1]);
    });
    enemyCount = enemyLocs.length;

    //Animations

    this.anims.create({
        key: 'enemyIdle',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'explosion',
        frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 15 }),
        frameRate: 10
    });


    //
    scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#ffffff' });
    livesText = this.add.text(16, 46, 'LIVES: 3', { fontSize: '32px', fill: '#ffffff' });

    stateText = this.add.text(150, 150, ' ', { fontSize: '84px', fill: '#ffffff' });
    stateText.visible = true;


    // Control Listeners
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

let bulletDelay = 0;

let shootDelay = 50;
let shootChance = 0.3;

let enemyMoveCounter = 0;
let enemyMoveThreshold = 100;

function update() {

    if(playerDead){
        return;
    }

    let moveSpeed = 200;

    if (lives <= 0) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-moveSpeed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(moveSpeed);
    } else {
        player.setVelocityX(0);
    }

    if(fireButton.isDown) {
        if(bulletDelay === 0) {
            fireBullet();
            bulletDelay = 20;
        } else {
            --bulletDelay;
        }

    }

    if(shootDelay-- === 0){
        shootDelay = 50;
        enemies.getChildren().forEach(enemy =>{
            if(Math.random() < shootChance){
                enemyFire(enemy);
            }
        });
    }

    if(enemyMoveCounter <= enemyMoveThreshold){
        enemies.setVelocityX(100);
    } else {
        enemies.setVelocityX(-100);
    }

    if(enemyMoveCounter <= enemyMoveThreshold*.25){
        enemies.setVelocityY(50);
    } else if(enemyMoveCounter <= enemyMoveThreshold*.5){
        enemies.setVelocityY(-50);
    } else if (enemyMoveCounter <= enemyMoveThreshold*.75){
        enemies.setVelocityY(50);
    } else if(enemyMoveCounter <= enemyMoveThreshold){
        enemies.setVelocityY(-50);
    } else if (enemyMoveCounter <= enemyMoveThreshold*1.25){
        enemies.setVelocityY(50);
    } else if(enemyMoveCounter <= enemyMoveThreshold*1.5){
        enemies.setVelocityY(-50);
    } else if (enemyMoveCounter <= enemyMoveThreshold*1.75){
        enemies.setVelocityY(50);
    } else {
        enemies.setVelocityY(-50);
    }

    if(enemyMoveCounter++ > enemyMoveThreshold*2){
        enemyMoveCounter = 0;
    }

    UFOAttack();

}

let activeUFO = false;
let UFOChance = 0.005;
function UFOAttack(){
    if(activeUFO === true){

        if(currUFO.body.x > player.body.x){
            currUFO.setVelocityX(-120);
        } else {
            currUFO.setVelocityX(120);
        }

        if(currUFO.body.y > player.body.y){
            currUFO = null;
            activeUFO = false;
        }

    } else if (Math.random() < UFOChance){
        currUFO = UFO.create((Math.random() * 800), 0, 'enemy2');
        currUFO.outOfBoundsKill = true;
        currUFO.setVelocityY(100);
        activeUFO = true;
    }
}

function fireBullet() {
    let bullet = bullets.create(player.x, player.y, 'bullet');
    bullet.setVelocityY(-500);
    bullet.outOfBoundsKill = true;
}

function spawnEnemy(x, y) {
    let enemy = enemies.create(x, y, 'enemy');
}

function enemyFire(enemy){
    let bullet = enemyBullets.create(enemy.x, enemy.y, 'bullet2');
    bullet.setVelocityY(300);
    bullet.outOfBoundsKill = true;
}

function killEnemy(bullet, enemy) {
    bullet.destroy();

    enemy.setTexture('explode');

    enemy.anims.play('explosion', true);

    enemy.on('animationcomplete', function(){
        enemy.destroy();
        enemyCount--;
    }, this);

    ++score;

    scoreText.setText('Score: ' + score);

    if(enemyCount < 1){
        spawnNewWave();
    }
}

function getEnemyLocations(){
    let levels = [
        [[100,100],[150,100],[100,200],[150,200],[100,300],[150,300],
            [200,100],[250,100],[200,200],[250,200],[200,300],[250,300],
            [300,100],[350,100],[300,200],[350,200],[300,300],[350,300],
            [400,100],[450,100],[400,200],[450,200],[400,300],[450,300]],
        [[100,150],[125,150],[150,150],[175,150],[200,150],[225,150],
            [250,150],[275,150],[300,150],[325,150],[350,150],[375,150],
            [400,150],[425,150],[450,150],[475,150],[500,150]],
        [[100,100],[150,150],[200,100],[250,150],[300,100],[350,150],[400,100],
        [450,150],[500,100]],
        [[100,250],[150,250],[200,250],[250,250],[300,250],[350,250],[400,250],[450,250],[500,250],
        [150,200],[450,200]]
    ];

    return levels[Math.floor(Math.random()*levels.length)];
}

function spawnNewWave(){

    let enemyLocs = getEnemyLocations();
    enemyLocs.forEach(location => {
        spawnEnemy(location[0], location[1]);
    });
    enemyCount = enemyLocs.length;

    shootDelay -= 5;
    shootChance += 0.05;
    UFOChance += 0.005;
}

function killUFO(bullet, enemy){
    bullet.destroy();

    activeUFO = false;

    enemy.anims.play('explosion', true);

    enemy.on('animationcomplete', function(){
        enemy.destroy();
    }, this);

    score+=5;
    scoreText.setText('Score: ' + score);
}


function playerHit(player, bullet){
    bullet.destroy();
    lives--;
    livesText.setText('LIVES: ' + lives);

    if(lives === 0){
        gameOver();
    }

}


function UFOCollide(player, UFO){
    UFO.destroy();
    lives--;
    livesText.setText('LIVES: ' + lives);

    activeUFO = false;

    if(lives === 0){
        gameOver();
    }

}

let button;

function gameOver(){

    playerDead = true;

    enemies.getChildren().forEach(enemy => {
        enemy.setVelocity(0);
    });

    player.setVelocity(0);

    stateText.text = "GAME OVER \n SCORE: " + score;
    stateText.visible = true;

    setTimeout(function(){
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", '/newscore', true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let body = {username: window.localStorage.getItem('currentUser'), score: score};
        xmlHttp.send(JSON.stringify(body));

        let searchStr = "?user1=" + body.username
        window.location.href = "../home.html" + searchStr;
    },3000);

}
