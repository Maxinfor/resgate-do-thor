function create() {
    // 1. Fundo (Pode substituir por this.add.image(200, 300, 'fundo_parque'))
    this.cameras.main.setBackgroundColor('#87CEEB'); 

    // 2. Painel de UI Superior (A caixa dos botões)
    const uiPanel = this.add.rectangle(200, 40, 400, 80, 0xecf0f1).setStrokeStyle(4, 0xbdc3c7);
    
    // 3. Score Centralizado
    scoreText = this.add.text(200, 100, 'SCORE: 0', { 
        fontSize: '28px', fill: '#2c3e50', fontStyle: 'bold', fontFamily: 'Arial' 
    }).setOrigin(0.5);

    // 4. Configuração do Jogador
    player = this.physics.add.sprite(200, 520, estado.personagem).setDisplaySize(80, 80);
    player.setCollideWorldBounds(true);

    items = this.physics.add.group();

    // 5. Sistema de Partículas (O "Brilho" ao pegar o item)
    const particles = this.add.particles('osso'); // Use uma imagem pequena de brilho/estrela
    const emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        active: false,
        lifespan: 500
    });

    // 6. Colisão com Feedback
    this.physics.add.overlap(player, items, (p, item) => {
        // Efeito Visual
        emitter.setPosition(item.x, item.y);
        emitter.explode(10); // Cria 10 partículas no local
        
        // Atualiza lógica
        estado.placar[estado.personagem] += 10;
        scoreText.setText(`SCORE: ${estado.placar[estado.personagem]}`);
        item.destroy();
    });

    // Criar botões (use a função abaixo)
    ['helo', 'liz', 'thor'].forEach((p, i) => criarBotao(this, 70 + (i * 90), 40, p.toUpperCase(), p));
}

function criarBotao(scene, x, y, texto, key) {
    const btn = scene.add.container(x, y);
    const bg = scene.add.rectangle(0, 0, 80, 40, 0x34495e, 0.8).setStrokeStyle(2, 0x3498db);
    const txt = scene.add.text(0, 0, texto, { fontSize: '12px', fill: '#fff' }).setOrigin(0.5);
    
    btn.add([bg, txt]);
    btn.setInteractive(new Phaser.Geom.Rectangle(-40, -20, 80, 40), Phaser.Geom.Rectangle.Contains);
    
    btn.on('pointerdown', () => {
        estado.personagem = key;
        player.setTexture(key);
        // Efeito de "pop" ao clicar
        scene.tweens.add({ targets: btn, scale: 1.1, yoyo: true, duration: 100 });
    });
}
