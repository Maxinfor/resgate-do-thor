const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, items, scoreText, livesText, musica, latido, fundo;
let gameStarted = false;
let vidas = 3;
let nivel = '';
let dificuldade = 300;
let estado = { personagem: "helo", placar: { helo: 0, lis: 0, thor: 0 } };

function preload() {
    this.load.image("capa", "capa.jpg");
    this.load.image("fundoThor", "casa.jpg");
    this.load.image("fundoMeninas", "quarto.jpg");
    this.load.image("helo", "helo.png");
    this.load.image("lis", "lis.png");
    this.load.image("thor", "thor.png");
    // Itens
    this.load.image("agua", "agua.png"); this.load.image("carne", "carne.png"); this.load.image("osso", "osso.png");
    this.load.image("secador", "secador.png"); this.load.image("escova", "escova.png"); this.load.image("oculos", "oculos.png");
    this.load.image("tenis1", "tenis1.png"); this.load.image("tenis2", "tenis2.png"); this.load.image("amigos", "amigos.png");
    this.load.image("agenda", "agenda.png"); this.load.image("caderno", "caderno.png"); this.load.image("estojo", "estojo.png");
    this.load.image("garrafa", "garrafa.png"); this.load.image("kit", "kit.png"); this.load.image("lapis", "lapis.png");
    this.load.image("livro", "livro.png"); this.load.image("mochila1", "mochila1.png"); this.load.image("mochila2", "mochila2.png");
    this.load.image("mochila3", "mochila3.png"); this.load.image("lanche", "lanche.png");
    this.load.audio("trilha", "musica.mp3"); this.load.audio("latido", "latido.mp3"); this.load.audio("fogos", "Fogo.mp3");
}

function create() {
    fundo = this.add.image(200, 300, "fundoMeninas").setDisplaySize(400, 600);
    musica = this.sound.add("trilha", { loop: true, volume: 0.35 });
    latido = this.sound.add("latido", { volume: 0.6 });
    items = this.physics.add.group();

    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setDepth(5);
    livesText = this.add.text(380, 20, 'VIDAS: ❤️❤️❤️', { fontSize: '20px', fill: '#ff0000' }).setOrigin(1, 0).setDepth(5);

    player = this.physics.add.sprite(200, 500, estado.personagem).setDisplaySize(100, 80).setDepth(4);
    player.setCollideWorldBounds(true);

    this.physics.add.overlap(player, items, (p, item) => {
        let pontos = item.isGold ? 60 : 10;
        estado.placar[estado.personagem] += pontos;
        let score = estado.placar[estado.personagem];
        scoreText.setText(`SCORE: ${score}`);
        item.destroy();

        // Lógica de Negocio
        if (nivel === 'facil' && score >= 500) vitoria(this, "PARABÉNS! VOCÊ VENCEU!");
        else if (nivel === 'medio') {
            if (score >= 500) dificuldade = 500;
            if (score >= 1000) vitoria(this, "PARABÉNS! VOCÊ É UM MESTRE!");
        } else if (nivel === 'dificil') {
            if (score >= 500) dificuldade = 600;
            if (score >= 2000) vitoria(this, "PARABÉNS! VOCÊ É UMA LENDA!");
        }
    });

    this.input.on('pointermove', (p) => { if (p.isDown && gameStarted) player.x = Phaser.Math.Clamp(p.x, 50, 350); });

    this.time.addEvent({
        delay: 800, callback: () => {
            if (!gameStarted || items.countActive() > 10) return;
            let tipos = (estado.personagem === 'thor') ? ['agua', 'carne', 'osso'] : ['secador', 'escova', 'oculos', 'tenis1', 'tenis2', 'amigos', 'agenda', 'caderno', 'estojo', 'garrafa', 'kit', 'lapis', 'livro', 'mochila1', 'mochila2', 'mochila3', 'lanche'];
            let item = items.create(Phaser.Math.Between(50, 350), -50, tipos[Phaser.Math.Between(0, tipos.length - 1)]);
            item.setDisplaySize(70, 70).setVelocityY(dificuldade);
            item.isGold = Phaser.Math.Between(1, 10) === 1;
            if (item.isGold) item.setTint(0xFFD700);
        }, loop: true
    });

    criarBotao(this, 100, 550, 'Helo', 'helo');
    criarBotao(this, 200, 550, 'Lis', 'lis');
    criarBotao(this, 300, 550, 'Thor', 'thor');
    criarCapa(this);
}

function criarCapa(scene) {
    let bg = scene.add.image(200, 300, 'capa').setDisplaySize(400, 600).setDepth(20);
    let txt = scene.add.text(200, 150, 'ESCOLHA O NÍVEL:', { fontSize: '28px', color: '#fff', backgroundColor: '#000', padding: 10 }).setOrigin(0.5).setDepth(21);
    
    let btnF = scene.add.text(200, 250, 'FÁCIL', { fontSize: '24px', backgroundColor: '#2ecc71', color: '#000', padding: 15, fixedWidth: 150, align: 'center' }).setOrigin(0.5).setDepth(21).setInteractive();
    let btnM = scene.add.text(200, 350, 'MÉDIO', { fontSize: '24px', backgroundColor: '#f1c40f', color: '#000', padding: 15, fixedWidth: 150, align: 'center' }).setOrigin(0.5).setDepth(21).setInteractive();
    let btnD = scene.add.text(200, 450, 'DIFÍCIL', { fontSize: '24px', backgroundColor: '#e74c3c', color: '#fff', padding: 15, fixedWidth: 150, align: 'center' }).setOrigin(0.5).setDepth(21).setInteractive();

    btnF.on('pointerup', () => iniciarJogo(scene, 'facil', 300, bg, [txt, btnF, btnM, btnD]));
    btnM.on('pointerup', () => iniciarJogo(scene, 'medio', 400, bg, [txt, btnF, btnM, btnD]));
    btnD.on('pointerup', () => iniciarJogo(scene, 'dificil', 450, bg, [txt, btnF, btnM, btnD]));
}

function iniciarJogo(scene, n, vel, bg, elementos) {
    nivel = n; dificuldade = vel; gameStarted = true; musica.play();
    bg
