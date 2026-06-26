const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, obstacles, cursors;
// Troque para 'liz' se quiser que ela seja a principal
let personagemEscolhido = 'helo'; 

function preload() {
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    this.load.image('thor', 'thor.jpg'); // Este é o obstáculo
}

function create() {
    // 1. Jogador
    player = this.physics.add.sprite(200, 500, personagemEscolhido).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    // Efeito de movimento constante (para não ficar estático)
    this.tweens.add({
        targets: player,
        y: 490, 
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    // 2. Grupo de Obstáculos
    obstacles = this.physics.add.group();

    // 3. Spawner: Thor aparece como obstáculo descendo
    this.time.addEvent({
        delay: 1200,
        callback: () => {
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let obs = obstacles.create(xPos, -50, 'thor').setDisplaySize(50, 50);
            obs.setVelocityY(350); 
        },
        loop: true
    });

    // 4. Controles (Clique nas 3 faixas)
    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < 133) player.x = 66;
        else if (pointer.x < 266) player.x = 200;
        else player.x = 333;
    });

    // 5. Colisão
    this.physics.add.overlap(player, obstacles, () => {
        alert("Ops! O Thor ainda não foi alcançado!");
        location.reload();
    });
}

function update() {
    // Espaço para lógica futura
}
