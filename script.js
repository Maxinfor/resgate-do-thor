const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, items, scoreText, levelText, musica, latido;
let gameStarted = false;
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

    player = this.physics.add.sprite(200, 400, estado.personagem).setDisplaySize(120, 120);
    player.setCollideWorldBounds(true);

    criarBotao(this, 100, 550, 'Helo', 'helo');
    criarBotao(this, 200, 550, 'Lis', 'lis');
    criarBotao(this, 300, 550, 'Thor', 'thor');

    this.physics.add.overlap(player, items, (p, item) => {
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();

        // Fogos de artifício a cada 50 objetos (50 * 10 pontos = 500)
        if (estado.placar[estado.personagem] % 500 === 0) {
            dispararFogos(this, player.x, player.y);
        }
    });

    this.input.on('pointermove', (p) => { 
        if(p.isDown && gameStarted) player.x = Math.round(Phaser.Math.Clamp(p.x, 60, 340));
    });

    this.time.addEvent({
        delay: 800,
        callback: () => {
            if(!gameStarted) return;
            let tipos = (estado.personagem === 'thor') ? ['osso', 'carne', 'agua'] : ['secador', 'escova', 'oculos', 'tenis1', 'tenis2'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, tipos.length - 1)]);
            item.setDisplaySize(80, 80);
            item.setVelocityY(dificuldade);
        },
        loop: true
    });

    criarCapa(this);
}

function update() {
    if (!gameStarted) return;
    items.children.iterate((item) => {
        if (item) {
            item.x = Math.round(item.x);
            item.y = Math.round(item.y);
            if (item.y > 600) gameOver(this);
        }
    });
}

function criarCapa(scene) {
    let background = scene.add.image(200, 300, 'capa').setDisplaySize(400, 600).setDepth(10);
    
    criarBotaoDif(scene, 80, 480, 'Fácil', 300, 0x90EE90);
    criarBotaoDif(scene, 200, 480, 'Médio', 450, 0xDDDDDD);
    criarBotaoDif(scene, 320, 480, 'Difícil', 600, 0xFFB6C1);

    let btnJogar = scene.add.text(200, 530, 'JOGAR', { fontSize: '32px', backgroundColor: '#000', color: '#fff', padding: 15 })
        .setOrigin(0.5).setDepth(11).setInteractive();

    btnJogar.on('pointerdown', () => { 
        gameStarted = true; 
        musica.play(); 
        levelText.setText(`Nível: ${nomeDificuldade}`);
        background.destroy(); 
        btnJogar.destroy(); 
        scene.children.list.forEach(c => { if(c.dificuldadeBtn) c.destroy(); });
    });
}

function criarBotaoDif(scene, x, y, texto, vel, cor) {
    let btn = scene.add.text(x, y, texto, { 
        backgroundColor: '#' + cor.toString(16).padStart(6, '0'), 
        padding: 10, color: '#000000', fontStyle: 'bold' 
    }).setOrigin(0.5).setDepth(11).setInteractive();
    
    btn.dificuldadeBtn = true;
    
    if (texto === 'Fácil') {
        btn.setStroke('#ffffff', 6);
        btn.setAlpha(1);
    } else {
        btn.setAlpha(0.6);
    }

    btn.on('pointerdown', () => {
        dificuldade = vel;
        nomeDificuldade = texto; 
        scene.children.list.forEach(c => {
            if (c.dificuldadeBtn) {
                c.setStroke(c === btn ? '#ffffff' : 'none', c === btn ? 6 : 0);
                c.setAlpha(c === btn ? 1 : 0.6);
            }
        });
    });
}

function dispararFogos(scene, x, y) {
    let particles = scene.add.particles('helo'); 
    let emitter = particles.createEmitter({
        x: x, y: y,
        speed: { min: -300, max: 300 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.8, end: 0 },
        blendMode: 'ADD',
        lifespan: 800,
        quantity: 30,
        tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]
    });
    scene.time.delayedCall(800, () => particles.destroy());
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#2c3e50', padding: 5, color: '#ffffff' })
        .setOrigin(0.5).setInteractive()
        .on('pointerdown', () => {
            estado.personagem = key;
            player.setTexture(key);
            if (key === 'thor') { musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500); }
        });
}

function gameOver(scene) {
    if(!gameStarted) return;
    gameStarted = false;
    scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(20);
    let btnReset = scene.add.text(200, 400, 'REINICIAR', { fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 }).setOrigin(0.5).setInteractive().setDepth(20);
    btnReset.on('pointerdown', () => location.reload());
}
