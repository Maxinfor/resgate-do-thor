const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, moldura, items, scoreText, livesText, musica, latido, fundo;
let gameStarted = false;
let vidas = 3;
let dificuldade = 300; 
let estado = { personagem: 'helo', placar: { helo: 0, lis: 0, thor: 0 } };

function preload() {
    this.load.image('capa', 'capa.jpg');
    this.load.image('fundoThor', 'casa.jpg');
    this.load.image('fundoMeninas', 'quarto.jpg');
    
    // Ajuste de extensões conforme sua lista atualizada
    this.load.image('helo', 'helo.png'); 
    this.load.image('lis', 'lis.png');
    this.load.image('thor', 'thor.png');
    
    this.load.image('agua', 'agua.png'); 
    this.load.image('carne', 'carne.png');
    this.load.image('osso', 'osso.png');
    this.load.image('secador', 'secador.png');
    this.load.image('escova', 'escova.png');
    this.load.image('oculos', 'oculos.png'); 
    this.load.image('tenis1', 'tenis1.png');
    this.load.image('tenis2', 'tenis2.png');
    this.load.image('amigos', 'amigos.png');
    this.load.image('agenda', 'agenda.png');
    this.load.image('caderno', 'caderno.png');
    this.load.image('estojo', 'estojo.png');
    this.load.image('garrafa', 'garrafa.png');
    this.load.image('kit', 'kit.png');
    this.load.image('lapis', 'lapis.png');
    this.load.image('livro', 'livro.png');
    this.load.image('mochila1', 'mochila1.png');
    this.load.image('mochila2', 'mochila2.png');
    this.load.image('mochila3', 'mochila3.png');
    this.load.image('lanche', 'lanche.png');
    
    this.load.audio('trilha', 'musica.mp3'); 
    this.load.audio('latido', 'latido.mp3');
    this.load.audio('fogos', 'Fogo.mp3');
}

function create() {
    fundo = this.add.image(200, 300, 'fundoMeninas').setDisplaySize(400, 600).setDepth(0);
    this.add.rectangle(200, 300, 400, 600, 0x000000, 0.2).setDepth(1);

    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });
    items = this.physics.add.group();
    
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setDepth(5);
    livesText = this.add.text(380, 20, 'VIDAS: ❤️❤️❤️', { fontSize: '20px', fill: '#ff0000' }).setOrigin(1, 0).setDepth(5);

    // Moldura e player inicializados corretamente
    moldura = this.add.ellipse(200, 450, 110, 90, 0xffffff).setStrokeStyle(4, 0x000000).setDepth(3);
    player = this.physics.add.sprite(200, 450, estado.personagem).setDisplaySize(100, 80).setDepth(4);
    player.setCollideWorldBounds(true);

    this.physics.add.overlap(player, items, (p, item) => {
        let pontos = item.isGold ? 60 : 10;
        estado.placar[estado.personagem] += pontos;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();
        if (estado.placar[estado.personagem] % 100 === 0) dificuldade += 20;
        if (estado.placar[estado.personagem] >= 500) vitoria(this);
    });

    this.input.on('pointermove', (p) => { 
        if(p.isDown && gameStarted) {
            let posX = Phaser.Math.Clamp(p.x, 60, 340);
            player.x = posX;
            moldura.x = posX;
        }
    });

    this.time.addEvent({
        delay: 800, callback: () => {
            if(!gameStarted || items.countActive() > 10) return;
            let itensThor = ['agua', 'carne', 'osso'];
            let itensGeral = ['secador', 'escova', 'oculos', 'tenis1', 'tenis2', 'amigos', 'agenda', 'caderno', 'estojo', 'garrafa', 'kit', 'lapis', 'livro', 'mochila1', 'mochila2', 'mochila3', 'lanche'];
            let tipos = (estado.personagem === 'thor') ? itensThor : itensGeral;
            let key = tipos[Phaser.Math.Between(0, tipos.length - 1)];
            let isGold = Phaser.Math.Between(1, 10) === 1;
            let item = items.create(Phaser.Math.Between(50, 350), -50, key);
            item.setDisplaySize(80, 80).setVelocityY(dificuldade);
            if (isGold) item.setTint(0xFFD700);
        }, loop: true
    });

    criarBotao(this, 100, 550, 'Helo', 'helo');
    criarBotao(this, 200, 550, 'Lis', 'lis');
    criarBotao(this, 300, 550, 'Thor', 'thor');
    criarCapa(this);
}

function update() {
    if (!gameStarted) return;
    items.children.iterate((item) => {
        if (item && item.y > 600) { item.destroy(); perderVida(this); }
    });
}

function perderVida(scene) {
    vidas--;
    livesText.setText(`VIDAS: ${"❤️".repeat(vidas)}`);
    if (vidas <= 0) gameOver(scene);
}

function criarCapa(scene) {
    let bg = scene.add.image(200, 300, 'capa').setDisplaySize(400, 600).setDepth(10);
    let btnJogar = scene.add.text(200, 450, 'JOGAR', { fontSize: '32px', backgroundColor: '#000', color: '#fff', padding: 15 }).setOrigin(0.5).setDepth(20).setInteractive();
    btnJogar.on('pointerup', () => { gameStarted = true; musica.play(); bg.destroy(); btnJogar.destroy(); });
}

function vitoria(scene) {
    if(!gameStarted) return;
    gameStarted = false; scene.physics.pause();
    scene.sound.play('fogos'); 
    scene.add.text(200, 300, 'VOCÊ VENCEU!', { fontSize: '40px', fill: '#008000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(20);
    scene.add.text(200, 450, 'REINICIAR', { fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 }).setOrigin(0.5).setInteractive().setDepth(20).on('pointerup', () => location.reload());
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#2c3e50', padding: 5, color: '#ffffff' }).setOrigin(0.5).setInteractive().setDepth(15)
        .on('pointerup', () => { 
            estado.personagem = key; 
            player.setTexture(key);
            player.setDisplaySize(100, 80); 
            if (key === 'thor') {
                fundo.setTexture('fundoThor');
                musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500);
            } else {
                fundo.setTexture('fundoMeninas');
            }
        });
}

function gameOver(scene) {
    if(!gameStarted) return;
    gameStarted = false; scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(20);
    scene.add.text(200, 400, 'REINICIAR', { fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 }).setOrigin(0.5).setInteractive().setDepth(20).on('pointerup', () => location.reload());
}
