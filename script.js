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
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000' });

    player = this.physics.add.sprite(200, 520, estado.personagem).setDisplaySize(80, 80);
    player.setCollideWorldBounds(true);

    // Lógica de colisão corrigida
    this.physics.add.overlap(player, items, (p, item) => {
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
            
            // Lógica de derrota simples: se chegar no chão
            this.physics.add.collider(item, this.physics.world.bounds, () => {
                if(gameStarted) gameOver(this);
            });
        },
        loop: true
    });

    // Botão verde com texto preto na Capa
    let overlay = this.add.rectangle(200, 300, 400, 600, 0xffffff).setDepth(10);
    let btn = this.add.rectangle(200, 300, 200, 60, 0x2ecc71).setDepth(11).setInteractive();
    let txt = this.add.text(200, 300, 'JOGAR', { fontSize: '24px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);

    btn.on('pointerdown', () => {
        gameStarted = true;
        musica.play();
        overlay.destroy(); btn.destroy(); txt.destroy();
    });
}

function gameOver(scene) {
    gameStarted = false;
    scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5).setDepth(20);
}

function update() {}
