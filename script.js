const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
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
    this.load.audio('trilha', 'musica.mp3'); 
    this.load.audio('latido', 'latido.mp3');
}

function create() {
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Inicialização segura dos sons
    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });

    // Grupo de itens
    items = this.physics.add.group();

    // UI
    this.add.rectangle(200, 40, 400, 80, 0x34495e);
    scoreText = this.add.text(20, 80, 'Score: 0', { fontSize: '24px', fill: '#fff' });

    // Jogador
    player = this.physics.add.sprite(200, 500, estado.personagem).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);

    // Botões
    criarBotao(this, 50, 30, 'Helo', 'helo');
    criarBotao(this, 150, 30, 'Liz', 'liz');
    criarBotao(this, 250, 30, 'Thor', 'thor');

    // Colisão
    this.physics.add.overlap(player, items, (p, item) => {
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`${estado.personagem.toUpperCase()}: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });

    // Controle
    this.input.on('pointermove', (p) => { if(p.isDown && gameStarted) player.x = Phaser.Math.Clamp(p.x, 30, 370); });

    // Gerador
    this.time.addEvent({
        delay: 800,
        callback: () => {
            if(!gameStarted) return;
            let tipos = ['osso', 'carne', 'agua'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, 2)]).setDisplaySize(50, 50);
            item.setVelocityY(400);
        },
        loop: true
    });

    // Criar a tela de início por último
    criarCapa(this);
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#000', padding: 5 })
        .setInteractive()
        .on('pointerdown', () => {
            estado.personagem = key;
            player.setTexture(key);
            if (key === 'thor') { musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500); }
        });
}

function criarCapa(scene) {
    let overlay = scene.add.rectangle(200, 300, 400, 600, 0x000, 0.9).setDepth(10);
    let btn = scene.add.text(200, 300, 'JOGAR', { fontSize: '30px', backgroundColor: '#0f0', padding: 10 }).setOrigin(0.5).setDepth(11).setInteractive();
    btn.on('pointerdown', () => { 
        gameStarted = true; 
        musica.play(); 
        overlay.destroy(); 
        btn.destroy(); 
    });
}

function update() {}
