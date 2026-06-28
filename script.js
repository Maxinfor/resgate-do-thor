// Configuração do Jogo
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let player, items, scoreText, levelText, livesText, musica, latido;
let gameStarted = false;
let vidas = 3;
let dificuldade = 300; 
let nomeDificuldade = "Fácil"; 
let estado = { personagem: 'helo', placar: { helo: 0, lis: 0, thor: 0 } };

function preload() {
    // Personagens e Capa
    this.load.image('capa', 'capa.jpg');
    this.load.image('helo', 'helo.jpg');
    this.load.image('lis', 'liz.jpg');
    this.load.image('thor', 'thor.jpg');
    
    // Itens Base
    this.load.image('agua', 'agua.jpg');
    this.load.image('carne', 'carne.jpg');
    this.load.image('osso', 'osso.jpg');
    this.load.image('secador', 'secador.jpg');
    this.load.image('escova', 'escova.jpg');
    this.load.image('oculos', 'oculos.jpg');
    this.load.image('tenis1', 'tenis1.jpg');
    this.load.image('tenis2', 'tenis2.jpg');

    // Novos Itens
    this.load.image('meninas', 'meninas.png');
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
    this.cameras.main.setBackgroundColor('#ffffff');
    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });
    items = this.physics.add.group();
    
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' }).setDepth(5);
    levelText = this.add.text(20, 50, `Nível: ${nomeDificuldade}`, { fontSize: '18px', fill: '#555', fontStyle: 'bold' }).setDepth(5);
    livesText = this.add.text(380, 20, 'VIDAS: ❤️❤️❤️', { fontSize: '20px', fill: '#ff0000' }).setOrigin(1, 0).setDepth(5);

    player = this.physics.add.sprite(200, 400, estado.personagem).setDisplaySize(120, 120);
    player.setCollideWorldBounds(true);

    this.physics.add.overlap(player, items, (p, item) => {
        let pontos = item.isGold ? 60 : 10;
        estado.placar[estado.personagem] += pontos;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();
        if (estado.placar[estado.personagem] % 100 === 0) dificuldade += 20;
        let meta = (nomeDificuldade === 'Fácil') ? 500 : (nomeDificuldade === 'Médio' ? 1000 : 2000);
        if (estado.placar[estado.personagem] >= meta) vitoria(this);
    });

    this.input.on('pointermove', (p) => { 
        if(p.isDown && gameStarted) player.x = Math.round(Phaser.Math.Clamp(p.x, 60, 340));
    });

    this.time.addEvent({
        delay: 800, callback: () => {
            if(!gameStarted || items.countActive() > 10) return;
            
            let itensThor = ['agua', 'carne', 'osso'];
            let itensGeral = ['secador', 'escova', 'oculos', 'tenis1', 'tenis2', 'agenda', 'caderno', 'estojo', 'garrafa', 'kit', 'lapis', 'livro', 'mochila1', 'mochila2', 'mochila3', 'lanche'];
            let itensExtra = ['meninas']; 
            
            let tipos;
            if (estado.personagem === 'thor') {
                tipos = itensThor.concat(itensGeral);
            } else {
                tipos = itensGeral;
            }
            
            if (nomeDificuldade !== 'Fácil') tipos = tipos.concat(itensExtra);

            let key = tipos[Phaser.Math.Between(0, tipos.length - 1)];
            let isGold = Phaser.Math.Between(1, 10) === 1;
            let item = items.create(Phaser.Math.Between(50, 350), -50, key);
            item.setDisplaySize(80, 80);
            item.setVelocityY(dificuldade);
            item.isGold = isGold;
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
    let btnF = criarBotaoDif(scene, 80, 400, 'Fácil', 300, 0x90EE90);
    let btnM = criarBotaoDif(scene, 200, 400, 'Médio', 450, 0xDDDDDD);
    let btnD = criarBotaoDif(scene, 320, 400, 'Difícil', 600, 0xFFB6C1);
    let btnJogar = scene.add.text(200, 450, 'JOGAR', { fontSize: '32px', backgroundColor: '#000', color: '#fff', padding: 15 }).setOrigin(0.5).setDepth(20).setInteractive();

    btnJogar.on('pointerup', () => { 
        gameStarted = true; musica.play(); levelText.setText(`Nível: ${nomeDificuldade}`);
        bg.destroy(); btnJogar.destroy(); [btnF, btnM, btnD].forEach(b => b.destroy());
    });
}

function criarBotaoDif(scene, x, y, texto, vel, cor) {
    let b = scene.add.text(x, y, texto, { backgroundColor: '#' + cor.toString(16).padStart(6, '0'), padding: 10, color: '#000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(20).setInteractive();
    b.on('pointerup', () => { dificuldade = vel; nomeDificuldade = texto; });
    return b;
}

function vitoria(scene) {
    if(!gameStarted) return;
    gameStarted = false; scene.physics.pause();
    scene.sound.play('fogos'); 
    scene.add.text(200, 300, 'VOCÊ VENCEU!\nPARABÉNS!', { fontSize: '40px', fill: '#008000', fontStyle: 'bold', align: 'center' }).setOrigin(0.5).setDepth(20);
    scene.add.text(200, 450, 'REINICIAR', { fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 }).setOrigin(0.5).setInteractive().setDepth(20).on('pointerup', () => location.reload());
}

function criarBotao(scene, x, y, texto, key) {
    scene.add.text(x, y, texto, { backgroundColor: '#2c3e50', padding: 5, color: '#ffffff' }).setOrigin(0.5).setInteractive().setDepth(15)
        .on('pointerup', () => { 
            estado.personagem = key; player.setTexture(key);
            if (key === 'thor') { musica.stop(); latido.play(); setTimeout(() => musica.play(), 1500); }
        });
}

function gameOver(scene) {
    if(!gameStarted) return;
    gameStarted = false; scene.physics.pause();
    scene.add.text(200, 300, 'GAME OVER', { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(20);
    scene.add.text(200, 400, 'REINICIAR', { fontSize: '20px', backgroundColor: '#000', color: '#fff', padding: 10 }).setOrigin(0.5).setInteractive().setDepth(20).on('pointerup', () => location.reload());
}
