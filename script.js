const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player;
let items;
let scoreText;
let musica;
let latido;
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

    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });
    musica.play();

    // Botões de Seleção
    criarBotao(this, 50, 30, 'Helo', 'helo');
    criarBotao(this, 150, 30, 'Liz', 'liz');
    criarBotao(this, 250, 30, 'Thor', 'thor');

    // Botão de Finalizar
    this.add.text(320, 30, 'Fim', { backgroundColor: '#ff0000', padding: 5 })
        .setInteractive()
        .on('pointerdown', () => {
            console.log("--- RESULTADO FINAL ---");
            console.log("Helô:", estado.placar.helo);
            console.log("Liz:", estado.placar.liz);
            console.log("Thor:", estado.placar.thor);
            alert(`Fim de jogo!\nHelô: ${estado.placar.helo}\nLiz: ${estado.placar.liz}\nThor: ${estado.placar.thor}`);
            location.reload(); // Reinicia o jogo
        });

    player = this.physics.add.sprite(200, 500, estado.personagem).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);

    scoreText = this.add.text(20, 80, 'Score: 0', { fontSize: '24px', fill: '#fff' });

    items = this.physics.add.group();

    this.time.addEvent({
        delay: 800,
        callback: () => {
            let tipos = ['osso', 'carne', 'agua'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, 2)]).setDisplaySize(50, 50);
            let velocidade = estado.personagem === 'thor' ? 600 : 400;
            item.setVelocityY(velocidade);
        },
        loop: true
    });

    this.input.on('pointermove', (p) => { if(p.isDown) player.x = Phaser.Math.Clamp(p.x, 30, 370); });

    this.physics.add.overlap(player, items, (p, item) => {
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`${estado.personagem.toUpperCase()}: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#000', padding: 5 })
        .setInteractive()
        .on('pointerdown', () => {
            estado.personagem = key;
            player.setTexture(key);
            if (key === 'thor') {
                musica.stop();
                latido.play();
                setTimeout(() => musica.play(), 1500);
            }
        });
}

function update() {}
