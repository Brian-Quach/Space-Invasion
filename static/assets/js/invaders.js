
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

let scoreText;
let livesText;

let score = 0;
let lives = 3;

let game = new Phaser.Game(config);

function preload ()
{

    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ship', 'http://labs.phaser.io/assets/sprites/ship.png');
    this.load.image('bullet', 'http://labs.phaser.io/assets/sprites/eggplant.png');
    this.load.image('enemy', 'http://labs.phaser.io/assets/sprites/apple.png');

}

let enemyLocations = [[100, 100], [200, 100], [300, 100], [400, 100], [500, 100]];

function create ()
{
    // Background
    this.add.image(400, 300, 'sky');

    // Player
    player = this.physics.add.sprite(100, 450, 'ship');
    player.setCollideWorldBounds(true);

    // Player Bullets
    bullets = this.physics.add.group();

    // Enemies
    enemies = this.physics.add.group();

    // Kill enemy if shot
    this.physics.add.overlap(bullets, enemies, killEnemy, null, this);

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

function update ()
{
    let moveSpeed = 200;

    if (cursors.left.isDown) {
        player.setVelocityX(-moveSpeed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(moveSpeed);
    } else {
        player.setVelocityX(0);
    }

    if(fireButton.isDown){
        if(bulletDelay === 0){
            fireBullet();
            bulletDelay = 5;
        } else {
            bulletDelay--;
        }
    }
}

function fireBullet(){
    let bullet = bullets.create(player.x, player.y, 'bullet');
    bullet.setVelocityY(-500);
    bullet.outOfBoundsKill = true;
}

function spawnEnemy(x, y){
    let enemy = enemies.create(x, y, 'enemy');
}

function killEnemy(bullet, enemy){
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);

    score++;
    scoreText.setText('Score: ' + score);
}