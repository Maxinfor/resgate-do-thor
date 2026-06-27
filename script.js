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
    this.cameras.main.setBackgroundColor('#ffffff');

    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });

    items = this.physics.add.group();
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

    player = this.physics.add.sprite(200, 520, estado.personagem).setDisplaySize(80, 80);
    player.setCollideWorldBounds(true);

    // Regras de colisão
    this.physics.add.overlap(player, items, (p, item) => {
        // Thor ganha com tudo; outros pets mantêm a pontuação normal
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });

    this.input.on('pointermove', (p) => { if(p.isDown && gameStarted) player.x = Phaser.Math.Clamp(p.x, 40, 360); });

    this.time.addEvent({
        delay: 800,
        callback: () => {
            if(!gameStarted) return;
            let tipos = ['osso', 'carne', 'agua'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, 2)]);
            item.setDisplaySize(50, 50);
            item.setVelocityY(350);
            
            // Ativa detecção de borda para o item
            item.setCollideWorldBounds(true);
            item.body.onWorldBounds = true;
        },
        loop: true
    });

    // Detecta se o item passou da tela (Game Over)
    this.physics.world.on('worldbounds', (body) => {
        if (body.gameObject.y > 500) {
            gameOver(this);
        }
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
    let overlay = scene.add.rectangle(200, 300, 400, 600, 0xffffff, 1).setDepth(10);
    let btn = scene.add.rectangle(200, 300, 200, 60, 0x2ecc71).setDepth(11).setInteractive();
    let txt = scene.add.text(200, 300, 'JOGAR', { fontSize: '24px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
    
    // Botões de seleção de pet na capa
    criarBotao(scene, 100, 400, 'Helo', 'helo');
    criarBotao(scene, 180, 400, 'Liz', 'liz');
    criarBotao(scene, 260, 400, 'Thor', 'thor');

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
    scene.add.text(200, 3
