<script>
const config = {
    type: Phaser.AUTO,
    width: 400, // Ajustado para formato de celular
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, cursors;

function preload() {
    // Carregando as imagens que você tem
    this.load.image('helo', 'helo.jpg.jpg');
    this.load.image('obstaculo', 'Thor.jpg.jpg'); // O Thor será o obstáculo? 
}

function create() {
    // Definindo as 3 faixas (X = 66, 200, 333)
    player = this.physics.add.sprite(200, 500, 'helo').setDisplaySize(50, 80);
    player.setCollideWorldBounds(true);
this.physics.add.overlap(player, grupoObstaculos, fimDeJogo, null, this);
    cursors = this.input.keyboard.createCursorKeys();

    // Controle de toque para celular (Subway Surfers style)
    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < 133) player.x = 66;      // Faixa Esquerda
        else if (pointer.x < 266) player.x = 200; // Faixa Centro
        else player.x = 333;                     // Faixa Direita
    });
}

function update() {
    // Aqui entra a lógica dos obstáculos vindo de cima para baixo
    this.time.addEvent({
    delay: 1000,
    callback: () => {
        let xPos = [66, 200, 333][Phaser.Math.Between(0, 2)];
        let obs = this.physics.add.sprite(xPos, 0, 'obstaculo').setVelocityY(300);
    },
    loop: true
});
}
</script>
