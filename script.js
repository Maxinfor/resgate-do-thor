const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { 
        default: 'arcade', 
        arcade: { debug: false } 
    },
    scene: { 
        preload: preload, 
        create: create, 
        update: update 
    }
};

const game = new Phaser.Game(config);

let player;
let items;
let score = 0;
let scoreText;
let personagem = 'helo';
let musica;

function preload() {
    // Imagens dos Personagens
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
    
    // Imagens dos Itens
    this.load.image('agua', 'agua.jpg');
    this.load.image('carne', 'carne.jpg');
    this.load.image('osso', 'osso.jpg');
    
    // Áudio
    this.load.audio('trilha', 'som do jogo.mp3');
}

function create() {
    // Cor de fundo
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Música contínua
    musica = this.sound.add('trilha', { loop: true, volume: 0.5 });
    musica.play();

    // Botão de Trocar Personagem
    this.add.text(260, 20, 'Trocar Pers.', { fontSize: '18px', fill: '#ff0', backgroundColor: '#000' })
        .setInteractive()
        .on('pointerdown', () => {
            if (personagem === 'helo') personagem = 'liz';
            else if (personagem === 'liz') personagem = 'thor';
            else personagem = 'helo';
            player.setTexture(personagem);
        });

    // Jogador
    player = this.physics.add.sprite(200, 500, personagem).setDisplaySize(60, 100);
    player.setCollideWorldBounds(true);
    
    // Texto de Pontuação
    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Grupo de Itens
    items = this.physics.add.group();

    // Spawner de itens
    this.time.addEvent({
        delay: 800,
        callback: () => {
            let tipos = ['osso', 'carne', 'agua'];
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let item = items.create(xPos, -50, tipos[Phaser.Math.Between(0, 2)]).setDisplaySize(50, 50);
            item.setVelocityY(400);
        },
        loop: true
    });

    // Controle de arraste instantâneo
    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            player.x = Phaser.Math.Clamp(pointer.x, 66, 333);
        }
    });

    // Colisão (Coleta e Penalidade)
    this.physics.add.overlap(player, items, (p, item) => {
        if (item.texture.key === 'agua') {
            score -= 20;
            this.cameras.main.shake(100, 0.01);
        } else {
            score += 10;
        }
        if (score < 0) score = 0;
        scoreText.setText('Score: ' + score);
        item.destroy();
    });
}

function update() {}
