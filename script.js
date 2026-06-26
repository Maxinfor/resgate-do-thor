const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player;
let items; // Agora são itens (osso, carne, água, etc)
let score = 0;
let scoreText;
let personagem = 'helo';

function preload() {
    this.load.image('helo', 'helo.jpg');
    this.load.image('liz', 'liz.jpg');
    // Carregando os novos itens
    this.load.image('osso', 'thor.jpg'); // O "Thor" agora coleta ossos
    this.load.image('carne', 'thor.jpg');
    this.load.image('agua', 'thor.jpg');
}

function create() {
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Botão de Trocar Personagem (no canto superior direito)
    let btnTroca = this.add.text(300, 20, 'Trocar', { fontSize: '20px', fill: '#ff0' })
        .setInteractive()
        .on('pointerdown', () => {
            personagem = (personagem === 'helo') ? 'liz' : 'helo';
            player.setTexture(personagem);
        });

    // Jogador com resposta rápida
    player = this.physics.add.sprite(200, 500, personagem).setDisplaySize(60, 100);
    
    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Grupo de Itens para coletar
    items = this.physics.add.group();

    // Spawner de itens (caindo lá de cima)
    this.time.addEvent({
        delay: 800, // Mais rápido
        callback: () => {
            let tipos = ['osso', 'carne', 'agua'];
            let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
            let item = items.create(xPos, -50, tipos[Phaser.Math.Between(0, 2)])
                            .setDisplaySize(50, 50);
            item.setVelocityY(400); // Velocidade de queda
        },
        loop: true
    });

    // Controle de toque ultra-rápido (instantâneo)
    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            // Define a posição X instantaneamente, sem delay
            player.x = Phaser.Math.Clamp(pointer.x, 66, 333);
        }
    });

    // Colisão: Coletar itens aumenta o score
    this.physics.add.overlap(player, items, (p, item) => {
        item.destroy();
        score += 10;
        scoreText.setText('Score: ' + score);
    });
}

function update() {}
