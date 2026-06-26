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
    this.load.image('helo', 'Helo.jpg');
    this.load.image('liz', 'Liz.jpg');
    this.load.image('thor', 'Thor.jpg');
}

function create() {
    // 1. Jogador
    player = this.physics.add.sprite(200, 500, personagemEscolhido).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    // Animação de balanço suave
    this.tweens.add({
        targets: player,
        y: 490, 
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    // 2. Texto de Pontuação
    scoreText = this.add.text(20, 20, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontFamily: 'sans-serif' 
    });

    // 3. Grupo de Obstáculos
    obstacles = this.physics.add.group();

    // 4. Spawner de Thor (Obstáculos)
    this.time.addEvent({
        delay: 1200,
        callback: () => {
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let obs = obstacles.create(xPos, -50, 'thor').setDisplaySize(50, 50);
            obs.setVelocityY(350);
            
            // Atualiza pontuação
            score += 10;
            scoreText.setText('Score: ' + score);
        },
        loop: true
    });

    // 5. Controles de Toque
    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < 133) player.x = 66;
        else if (pointer.x < 266) player.x = 200;
        else player.x = 333;
    });

    // 6. Colisão
    this.physics.add.overlap(player, obstacles, (p, o) => {
        this.physics.pause();
        o.disableBody(true, true); // Faz o obstáculo desaparecer
        alert("Ops! O Thor ainda não foi alcançado! Pontuação: " + score);
        location.reload(); 
    });
}

function update() {
    // Espaço reservado para atualizações constantes
}
