// ... (mantenha o início do arquivo igual)

let player, items, scoreText, levelText, livesText, musica, latido;
let gameStarted = false;
let vidas = 3; // Nova variável de vidas
let dificuldade = 300; 
let nomeDificuldade = "Fácil"; 
let estado = { personagem: 'helo', placar: { helo: 0, lis: 0, thor: 0 } };

// ... (preload igual)

function create() {
    this.cameras.main.setBackgroundColor('#ffffff');
    musica = this.sound.add('trilha', { loop: true, volume: 0.3 });
    latido = this.sound.add('latido', { volume: 0.5 });

    items = this.physics.add.group();
    
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', fill: '#000', fontStyle: 'bold' }).setDepth(5);
    levelText = this.add.text(20, 50, `Nível: ${nomeDificuldade}`, { fontSize: '18px', fill: '#555', fontStyle: 'bold' }).setDepth(5);
    
    // Novo display de vidas
    livesText = this.add.text(380, 20, 'VIDAS: ❤️❤️❤️', { fontSize: '20px', fill: '#ff0000' }).setOrigin(1, 0).setDepth(5);

    player = this.physics.add.sprite(200, 400, estado.personagem).setDisplaySize(120, 120);
    player.setCollideWorldBounds(true);

    // ... (criarBotao igual)

    this.physics.add.overlap(player, items, (p, item) => {
        let pontos = item.isGold ? 60 : 10;
        estado.placar[estado.personagem] += pontos;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();

        if (estado.placar[estado.personagem] % 100 === 0) dificuldade += 20;
        
        let meta = (nomeDificuldade === 'Fácil') ? 500 : (nomeDificuldade === 'Médio' ? 1000 : 2000);
        if (estado.placar[estado.personagem] >= meta) vitoria(this);
        if (estado.placar[estado.personagem] % 500 === 0) dispararFogos(this, player.x, player.y);
    });

    // ... (input e time igual)
}

function update() {
    if (!gameStarted) return;
    
    items.children.iterate((item) => {
        if (item && item.y > 600) {
            item.destroy(); // Remove o item
            perderVida(this); // Chama a função de perder vida
        }
    });
}

function perderVida(scene) {
    vidas--;
    // Atualiza o texto visualmente
    let coracoes = "❤️".repeat(vidas);
    livesText.setText(`VIDAS: ${coracoes}`);

    if (vidas <= 0) {
        gameOver(scene);
    } else {
        // Feedback visual quando perde vida (o player pisca)
        scene.tweens.add({ targets: player, alpha: 0, duration: 100, yoyo: true, repeat: 2 });
    }
}

// ... (resto das funções igual)
