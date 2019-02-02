
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

let game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('bullet', 'assets/sprites/poo.png', 20, 20);
}

function create ()
{
    // Background
    this.add.image(400, 300, 'sky');

    // Player
    player = this.physics.add.sprite(100, 450, 'ship');
    player.setCollideWorldBounds(true);

    // Player Bullets
    bullets = this.physics.add.group();

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
    //} else if (cursors.up.isDown) {
    //    player.setVelocityY(-moveSpeed);
    //} else if (cursors.down.isDown) {
    //    player.setVelocityY(moveSpeed);
    } else {
        player.setVelocityX(0);
    }

    if(fireButton.isDown){
        if(bulletDelay === 0){
            fireBullet();
            bulletDelay = 10;
        } else {
            bulletDelay--;
        }
    }
}

function fireBullet(){
    console.log("FIRE");
    let bullet = bullets.create(player.x, player.y, 'bullet');
    bullet.setVelocityY(-500);
    //bullet.setCollideWorldBounds(true);
    bullet.outOfBoundsKill = true;

}
