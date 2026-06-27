const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, items, scoreText, levelText, livesText, musica, latido;
let gameStarted = false;
let vidas = 3;
let dificuldade = 300; 
let nomeDificuldade = "Fácil"; 
let estado = { personagem: 'helo', placar: { helo: 0, lis: 0, thor: 0 } };

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
}

function create() {
    this.cameras.main.setBackgroundColor('#ffffff');
    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });
    items = this.physics.add.group();
    
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' }).setDepth(5);
    levelText = this.add.text(20, 50, `Nível: ${nomeDificuldade}`, { fontSize: '18px', fill: '#555', fontStyle: 'bold' }).setDepth(5);
    livesText = this.add.text(380, 20, 'VIDAS: ❤️❤️❤️', { fontSize: '20px', fill: '#ff0000' }).setOrigin(1, 0).setDepth(5);

    player = this.physics.add.sprite(200, 400, estado.personagem).setDisplaySize(120, 120);
    player.setCollideWorldBounds(true);

    this.physics.add.overlap(player, items, (p, item) => {
        let pontos = item.isGold ? 60 : 10;
        estado.placar[estado.personagem] += pontos;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();

        if (estado.placar[estado.personagem] % 100 === 0) dificuldade += 20;

        let meta = (nomeDificuldade === 'Fácil') ? 500 : (nomeDificuldade === 'Médio' ? 1000 : 2000);
        if (estado.placar[estado.personagem] >= meta) vitoria(this);
    });

    this.input.on('pointermove', (p) => { 
        if(p.isDown && gameStarted) player.x = Math.round(Phaser.Math.Clamp(p.x, 60, 340));
    });

    this.time.addEvent({
        delay: 800, callback: () => {
            if(!gameStarted || items.countActive() > 10) return;
            let tipos = (estado.personagem === 'thor') ? ['osso', 'carne', 'agua'] : ['secador', 'escova', 'oculos', 'tenis1', 'tenis2'];
            let key = tipos[Phaser.Math.Between(0, tipos.length - 1)];
            let isGold = Phaser.Math.Between(1, 10) === 1;
            let item = items.create(Phaser.Math.Between(50, 350), -50, key);
            item.setDisplaySize(80, 80);
            item.setVelocityY(dificuldade);
            item.isGold = isGold;
            if (isGold) item.setTint(0xFFD700);
        }, loop: true
    });

    criarBotao(this, 100, 550, 'Helo', 'helo');
    criarBotao(this, 200, 550, 'Lis', 'lis');
    criarBotao(this, 300, 550, 'Thor', 'thor');
    criarCapa(this);
}

function update() {
    if (!gameStarted) return;
    items.children.iterate((item) => {
        if (item && item.y > 600) { item.destroy(); perderVida(this); }
    });
}

function perderVida(scene) {
    vidas--;
    lives
