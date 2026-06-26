const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { 
        default: 'arcade', 
        arcade: { debug: false } 
    },
    scene: { 
        preload: preload, 
        create: create, 
        update: update 
    }
};

const game = new Phaser.Game(config);

let player;
let obstacles;
let score = 0;
let scoreText;
let personagemEscolhido = 'helo'; 

function preload() {
    // Carregando imagens com log de erro para depuração
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');

    this.load.on('loaderror', (file) => {
        console.error("Erro ao carregar: " + file.src);
    });
}

function create() {
    // Fundo para garantir que não fique tudo rosa ou invisível
    this.cameras.main.setBackgroundColor('#2c3e50');

    player = this.physics.add.sprite(200, 500, personagemEscolhido).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    this.tweens.add({
        targets: player,
        y: 490, 
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#ffffff' 
    });

    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1200,
        callback: () => {
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let obs = obstacles.create(xPos, -50, 'thor').setDisplaySize(50, 50);
            obs.setVelocityY(350);
            score += 10;
            scoreText.setText('Score: ' + score);
        },
        loop: true
    });

    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < 133) player.x = 66;
        else if (pointer.x < 266) player.x = 200;
        else player.x = 333;
    });

    this.physics.add.overlap(player, obstacles, () => {
        this.physics.pause();
        alert("Fim de jogo! Pontuação: " + score);
        location.reload();
    });
}

function update() {}
