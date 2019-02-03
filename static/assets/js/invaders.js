
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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let cursors;
let fireButton;
let player;
let bullets;
let enemies;
let enemyBullets;

let UFO;
let currUFO;


let scoreText;
let livesText;

let score = 0;
let lives = 3;

let game = new Phaser.Game(config);

function preload () {
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ship', 'http://labs.phaser.io/assets/sprites/ship.png');
    this.load.image('bullet', 'http://labs.phaser.io/assets/sprites/eggplant.png');
    this.load.image('enemy', 'http://labs.phaser.io/assets/sprites/apple.png');

    this.load.image('enemy2', 'http://labs.phaser.io/assets/sprites/ufo.png');
}

let enemyLocations = [[100, 100], [200, 100], [300, 100], [400, 100], [500, 100]];

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


    // Spawn Enemy ships
    enemyLocations.forEach(location => {
        spawnEnemy(location[0], location[1]);
    });

    //
    scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#ffffff' });
    livesText = this.add.text(16, 46, 'LIVES: 3', { fontSize: '32px', fill: '#ffffff' });



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
    let moveSpeed = 200;

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
        currUFO = UFO.create(100, 100, 'enemy');
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
    let bullet = enemyBullets.create(enemy.x, enemy.y, 'bullet');
    bullet.setVelocityY(300);
    bullet.outOfBoundsKill = true;
}

function killEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);

    ++score;
    scoreText.setText('Score: ' + score);
}

function killUFO(bullet, enemy){
    bullet.destroy();
    enemy.destroy();

    activeUFO = false;

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

function gameOver(){
    console.log("rip");
}