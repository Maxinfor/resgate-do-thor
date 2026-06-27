const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

// Variáveis Globais
let player, items, scoreText, musica, latido, emitter;
let gameStarted = false;
let estado = {
    personagem: 'helo',
    placar: { helo: 0, liz: 0, thor: 0 }
};

function preload() {
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
    this.load.image('agua', 'agua.jpg');
    this.load.image('carne', 'carne.jpg');
    this.load.image('osso', 'osso.jpg');
    this.load.audio('trilha', 'musica.mp3'); 
    this.load.audio('latido', 'latido.mp3');
}

function create() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    
    // Música
    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });

    // Grupo de itens com detecção de borda
    items = this.physics.add.group({ onWorldBounds: true });
    this.physics.world.on('worldbounds', (body) => gameOver(this));

    // Sistema de Partículas
    const particles = this.add.particles('osso');
    emitter = particles.createEmitter({
        speed: 150, scale: { start: 0.4, end: 0 },
        blendMode: 'ADD', active: false, lifespan: 400
    });

    // UI Superior
    this.add.rectangle(200, 40, 400, 80, 0x34495e).setStrokeStyle(2, 0xecf0f1);
    scoreText = this.add.text(20, 80, 'SCORE: 0', { fontSize: '24px', fill: '#f1c40f' });

    // Jogador
    player = this.physics.add.sprite(200, 520, estado.personagem).setDisplaySize(70, 70).setCollideWorldBounds(true);

    // Botões
    ['helo', 'liz', 'thor'].forEach((p, i) => criarBotao(this, 70 + (i * 90), 40, p.toUpperCase(), p));

    // Colisão
    this.physics.add.overlap(player, items, (p, item) => {
        emitter.setPosition(item.x, item.y).explode(10);
        estado.placar[estado.personagem] += 10;
        let total = Object.values(estado.placar).reduce((a, b) => a + b, 0);
        scoreText.setText(`${estado.personagem.toUpperCase()}: ${total}`);
        item.destroy();
    });

    // Input
    this.input.on('pointermove', (p) => { if(p.isDown && gameStarted) player.x = Phaser.Math.Clamp(p.x, 30, 370); });

    // Gerador de Itens
    this.time.addEvent({
        delay: 800,
        callback: () => {
            if (!gameStarted) return;
            let tipos = ['osso', 'carne', 'agua'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, 2)]).setDisplaySize(50, 50);
            let vel = 400 + (Math.floor(Object.values(estado.placar).reduce((a,b)=>a+b, 0) / 100) * 50) + (estado.personagem === 'thor' ? 100 : 0);
            item.setVelocityY(Math.min(vel, 900));
        },
        loop: true
    });

    criarCapa(this);
}

function criarBotao(scene, x, y, texto, key) {
    let btn = scene.add.container(x, y);
    let bg = scene.add.rectangle(0, 0, 70, 30, 0x3498db).setInteractive();
    btn.add([bg, scene.add.text(0, 0, texto, { fontSize: '12px' }).setOrigin(0.5)]);
    bg.on('pointerdown', () => {
        estado.personagem = key;
        player.setTexture(key);
        if (key === 'thor') { musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500); }
    });
}

function criarCapa(scene) {
    let overlay = scene.add.rectangle(200, 300, 400, 600, 0x000, 0.8).setDepth(10);
    let btn = scene.add.text(200, 300, 'JOGAR', { fontSize: '32px', backgroundColor: '#2ecc71', padding: 20 }).setOrigin(0.5).setDepth(11).setInteractive();
    btn.on('pointerdown', () => { gameStarted = true; musica.play(); overlay.destroy(); btn.destroy(); });
}

function gameOver(scene) {
    if (!gameStarted) return;
    gameStarted = false;
    scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5);
    scene.add.text(200, 350, 'Clique para reiniciar', { fontSize: '18px' }).setOrigin(0.5).setInteractive().on('pointerdown', () => location.reload());
}

function update() {}
