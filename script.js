const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, items, gameStarted = false;

function preload() {
    this.load.image('helo', 'helo.jpg');
    this.load.image('lis', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
    // Carregando apenas o essencial para testar
}

function create() {
    this.cameras.main.setBackgroundColor('#ffffff');
    
    // Botão simples de Início para testar se o clique funciona
    let startBtn = this.add.text(200, 300, 'CLIQUE PARA INICIAR', { 
        fontSize: '24px', backgroundColor: '#000', color: '#fff', padding: 10 
    }).setOrigin(0.5).setInteractive();

    startBtn.on('pointerup', () => {
        gameStarted = true;
        startBtn.destroy();
        player = this.physics.add.sprite(200, 400, 'helo').setDisplaySize(100, 100);
        this.add.text(20, 20, 'JOGO RODANDO!', { fill: '#000' });
    });
}

function update() {
    if (!gameStarted) return;
}
