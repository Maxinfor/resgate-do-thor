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
    // 1. Fundo Branco
    this.cameras.main.setBackgroundColor('#ffffff');

    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });

    items = this.physics.add.group();

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

    player = this.physics.add.sprite(200, 500, estado.personagem).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);

    criarBotao(this, 50, 30, 'Helo', 'helo');
    criarBotao(this, 150, 30, 'Liz', 'liz');
    criarBotao(this, 250, 30, 'Thor', 'thor');

    // Colisão e Lógica de Pontos
    this.physics.add.overlap(player, items, (p, item) => {
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`${estado.personagem.toUpperCase()}: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });

    this.input.on('pointermove', (p) => { if(p.isDown && gameStarted) player.x = Phaser.Math.Clamp(p.x, 30, 370); });

    // Gerador de itens com Lógica de Derrota (Game Over se cair)
    this.time.addEvent({
        delay: 800,
        callback: () => {
            if(!gameStarted) return;
            let tipos = ['osso', 'carne', 'agua'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, 2)]).setDisplaySize(50, 50);
            item.setVelocityY(400);
            
            // Verifica se o item caiu abaixo da tela
            this.physics.add.collider(item, this.physics.world.bounds, (i) => {
                if (i.y > 580) gameOver(this);
            });
        },
        loop: true
    });

    criarCapa(this);
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#2c3e50', padding: 5, color: '#ffffff' })
        .setInteractive()
        .on('pointerdown', () => {
            estado.personagem = key;
            player.setTexture(key);
            if (key === 'thor') { musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500); }
        });
}

function criarCapa(scene) {
    let overlay = scene.add.rectangle(200, 300, 400, 600, 0xffffff).setDepth(10);
    // 2. Botão verde com palavra JOGAR em preto
    let btn = scene.add.rectangle(200, 300, 150, 50, 0x00ff00).setDepth(11).setInteractive();
    let txt = scene.add.text(200, 300, 'JOGAR', { fontSize: '24px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
    
    btn.on('pointerdown', () => { 
        gameStarted = true; 
        musica.play(); 
        overlay.destroy(); btn.destroy(); txt.destroy(); 
    });
}

function gameOver(scene) {
    if(!gameStarted) return;
    gameStarted = false;
    scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#f00' }).setOrigin(0.5);
}

function update() {}
