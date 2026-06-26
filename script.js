const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, obstacles, cursors;
let personagemEscolhido = 'helo'; // Você pode mudar para 'liz' aqui

function preload() {
    this.load.image('helo', 'helo.jpg.jpg');
    this.load.image('liz', 'liz.jpg.jpg'); // Carregando a Liz
    this.load.image('obstaculo', 'Thor.jpg.jpg');
}

function create() {
    // 1. Jogador (Carrega a imagem baseada na escolha)
    player = this.physics.add.sprite(200, 500, personagemEscolhido).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    // Efeito de balanço constante para o personagem não ficar estático
    this.tweens.add({
        targets: player,
        y: 490, 
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    // 2. Grupo de Obstáculos
    obstacles = this.physics.add.group();

    // 3. Spawner de obstáculos
    this.time.addEvent({
        delay: 1200,
        callback: () => {
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let obs = obstacles.create(xPos, -50, 'obstaculo').setDisplaySize(50, 50);
            obs.setVelocityY(350); 
        },
        loop: true
    });

    // 4. Controles (Clique nas faixas)
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
    // Aqui você pode adicionar lógica de pontuação conforme o tempo
}
