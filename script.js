// Configuração do Jogo
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('capa', 'capa.jpg');
    this.load.image('helo', 'helo.jpg');
    this.load.image('lis', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
    this.load.image('agua', 'agua.jpg');
    this.load.image('carne', 'carne.jpg');
    this.load.image('osso', 'osso.jpg');
    this.load.image('secador', 'secador.jpg');
    this.load.image('escova', 'escova.jpg');
    this.load.image('oculos', 'oculos.jpg');
    this.load.image('tenis1', 'tenis1.jpg');
    this.load.image('tenis2', 'tenis2.jpg');
    
    this.load.audio('trilha', 'musica.mp3'); 
    this.load.audio('latido', 'latido.mp3');
    this.load.audio('fogos', 'Fogo.mp3');
}

function create() {
    // Aqui entra o seu código de criação (background, sprites, etc)
    // Exemplo: this.add.image(200, 300, 'capa');
    // ... seu código atual ...
}

function update() {
    // ... seu código de movimentação ...
}

function vitoria(scene) {
    if(!gameStarted) return;
    gameStarted = false; 
    scene.physics.pause();
    
    // Tocar o som
    scene.sound.play('fogos');
    
    // Texto de vitória
    scene.add.text(200, 300, 'VOCÊ VENCEU!\nPARABÉNS!', { 
        fontSize: '40px', fill: '#008000', fontStyle: 'bold', align: 'center', stroke: '#fff', strokeThickness: 4 
    }).setOrigin(0.5).setDepth(30);
    
    // Botão Reiniciar
    scene.add.text(200, 450, 'REINICIAR', { 
        fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 
    }).setOrigin(0.5).setInteractive().setDepth(30).on('pointerup', () => location.reload());
}
