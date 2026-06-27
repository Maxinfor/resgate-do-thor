const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    // Adicionado pixelArt: true para evitar "tremidas" (anti-aliasing de movimento)
    pixelArt: true, 
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, items, scoreText, musica, latido;
let gameStarted = false;
let estado = { personagem: 'helo', placar: { helo: 0, liz: 0, thor: 0 } };

function preload() {
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
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
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

    player = this.physics.add.sprite(200, 400, estado.personagem).setDisplaySize(120, 120);
    player.setCollideWorldBounds(true);

    criarBotao(this, 100, 550, 'Helo', 'helo');
    criarBotao(this, 200, 550, 'Liz', 'liz');
    criarBotao(this, 300, 550, 'Thor', 'thor');

    this.physics.add.overlap(player, items, (p, item) => {
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });

    this.input.on('pointermove', (p) => { 
        if(p.isDown && gameStarted) {
            // Arredondar a posição para evitar "tremida" visual
            player.x = Math.round(Phaser.Math.Clamp(p.x, 60, 340));
        }
    });

    this.time.addEvent({
        delay: 800,
        callback: () => {
            if(!gameStarted) return;
            let tipos = (estado.personagem === 'thor') ? ['osso', 'carne', 'agua'] : ['secador', 'escova', 'oculos', 'tenis1', 'tenis2'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, tipos.length - 1)]);
            item.setDisplaySize(80, 80);
            item.setVelocityY(350);
        },
        loop: true
    });

    criarCapa(this);
}

function update() {
    if (!gameStarted) return;
    
    // Força o arredondamento dos itens para evitar jitter visual
    items.children.iterate((item) => {
        if (item) {
            item.x = Math.round(item.x);
            item.y = Math.round(item.y);
            if (item.y > 600) gameOver(this); 
        }
    });
}

// ... (funções criarBotao, criarCapa e gameOver permanecem iguais)
