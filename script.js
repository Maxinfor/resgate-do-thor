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
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
}

function create() {
    // Cor de fundo do jogo
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Desenhar linhas divisórias de faixa
    let graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 0.2);
    graphics.lineBetween(133, 0, 133, 600);
    graphics.lineBetween(266, 0, 266, 600);

    // 1. Jogador
    player = this.physics.add.sprite(200, 500, personagemEscolhido).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    this.tweens.add({
        targets: player,
        y: 490, 
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    // 2. Pontuação
    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    // 3. Obstáculos
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

    // 5. Controles de Arrastar (Drag)
    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            if (pointer.x < 133) player.x = 66;
            else if (pointer.x < 266) player.x = 200;
            else player.x = 333;
        }
    });

    // 6. Colisão
    this.physics.add.overlap(player, obstacles, () => {
        this.physics.pause();
        alert("Fim de jogo! Pontuação final: " + score);
        location.reload();
    });
}

function update() {}
