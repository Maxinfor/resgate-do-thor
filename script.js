 
    
    //===================================================
// AS AVENTURAS DE HELÔ, LIS E THOR
// Versão 2.0 - Runner estilo Subway Surfers
//===================================================

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

//===========================
// PISTAS
//===========================

const lanes = [100, 200, 300];
let lane = 1;

let pulando = false;

//===========================
// VELOCIDADE
//===========================

let velocidadeFundo = 8;
let dificuldade = 320;

//===========================
// GAME
//===========================

let player;
let moldura;
let items;

let scoreText;
let livesText;

let musica;
let latido;

let fundo1;
let fundo2;

let gameStarted = false;
let vidas = 3;

//===========================
// ESTADO
//===========================

let estado = {

    personagem: "helo",

    placar: {
        helo: 0,
        lis: 0,
        thor: 0
    }

};

//===========================
// PRELOAD
//===========================

function preload(){

    this.load.image("capa","capa.jpg");

    this.load.image("fundoThor","casa.jpg");
    this.load.image("fundoMeninas","quarto.jpg");

    this.load.image("helo","helo.png");
    this.load.image("lis","lis.png");
    this.load.image("thor","thor.png");

    //=====================
    // ITENS
    //=====================

    this.load.image("agua","agua.png");
    this.load.image("carne","carne.png");
    this.load.image("osso","osso.png");
    this.load.image("secador","secador.png");
    this.load.image("escova","escova.png");
    this.load.image("oculos","oculos.png");

    this.load.image("tenis1","tenis1.png");
    this.load.image("tenis2","tenis2.png");

    this.load.image("amigos","amigos.png");
    this.load.image("agenda","agenda.png");
    this.load.image("caderno","caderno.png");
    this.load.image("estojo","estojo.png");
    this.load.image("garrafa","garrafa.png");
    this.load.image("kit","kit.png");
    this.load.image("lapis","lapis.png");
    this.load.image("livro","livro.png");

    this.load.image("mochila1","mochila1.png");
    this.load.image("mochila2","mochila2.png");
    this.load.image("mochila3","mochila3.png");

    this.load.image("lanche","lanche.png");

    // NOVO
    this.load.image("moeda","moeda.png");

    //=====================
    // OBSTÁCULOS
    //=====================

    this.load.image("urso","urso.png");
    this.load.image("leao","leao.png");
    this.load.image("onca","onca.png");

    //=====================
    // AUDIO
    //=====================

    this.load.audio("trilha","musica.mp3");
    this.load.audio("latido","latido.mp3");
    this.load.audio("fogos","Fogo.mp3");

}

//===========================
// CREATE
//===========================

function create(){

    //-----------------------------------
    // Fundo infinito
    //-----------------------------------

    fundo1 = this.add.image(
        200,
        300,
        "fundoMeninas"
    ).setDisplaySize(400,600);

    fundo2 = this.add.image(
        200,
        -300,
        "fundoMeninas"
    ).setDisplaySize(400,600);

    this.add.rectangle(
        200,
        300,
        400,
        600,
        0x000000,
        0.15
    );

    //-----------------------------------
    // Sons
    //-----------------------------------

    musica = this.sound.add("trilha",{
        loop:true,
        volume:0.35
    });

    latido = this.sound.add("latido",{
        volume:0.6
    });

    //-----------------------------------
    // Grupo
    //-----------------------------------

    items = this.physics.add.group();

    //-----------------------------------
    // HUD
    //-----------------------------------

    scoreText = this.add.text(

        15,
        15,

        "SCORE: 0",

        {
            fontSize:"24px",
            fill:"#ffffff",
            fontStyle:"bold"
        }

    );

    livesText = this.add.text(

        385,
        15,

        "VIDAS: ❤️❤️❤️",

        {
            fontSize:"20px",
            fill:"#ff4444"
        }

    ).setOrigin(1,0);

    //-----------------------------------
    // Personagem
    //-----------------------------------

    player = this.physics.add.sprite(

        lanes[lane],
        450,

        estado.personagem

    );

    player.setDisplaySize(100,90);

    player.setCollideWorldBounds(true);

    //-----------------------------------
    // Moldura
    //-----------------------------------

    moldura = this.add.ellipse(

        lanes[lane],
        455,

        110,
        90,

        0xffffff

    );

    moldura.setStrokeStyle(
        4,
        0x000000
    );

    //-----------------------------------
    // Colisão
    //-----------------------------------

    this.physics.add.overlap(

        player,

        items,

        (player,item)=>{

            //--------------------------------

            if(item.tipo=="obstaculo"){

                item.destroy();

                perderVida(this);

                return;

            }

            //--------------------------------
            // Moedas
            //--------------------------------

            if(item.texture.key=="moeda"){

                estado.placar[
                    estado.personagem
                ] += 5;

            }

            //--------------------------------
            // Itens dourados
            //--------------------------------

            else{

                let pontos =
                    item.isGold ? 60 : 10;

                estado.placar[
                    estado.personagem
                ] += pontos;

            }

            //--------------------------------

            scoreText.setText(

                "SCORE: " +

                estado.placar[
                    estado.personagem
                ]

            );

            //--------------------------------
            // aumenta dificuldade
            //--------------------------------

            velocidadeFundo += 0.03;

            dificuldade += 1;

            //--------------------------------

            item.destroy();

        }

    );

    //-----------------------------------
    // TECLADO
    //-----------------------------------

    this.input.keyboard.on(

        "keydown-LEFT",

        ()=>{

            if(lane>0){

                lane--;

                this.tweens.add({

                    targets:player,

                    x:lanes[lane],

                    duration:120

                });

            }

        }

    );

    //-----------------------------------

    this.input.keyboard.on(

        "keydown-RIGHT",

        ()=>{

            if(lane<2){

                lane++;

                this.tweens.add({

                    targets:player,

                    x:lanes[lane],

                    duration:120

                });

            }

        }

    );

    //-----------------------------------

    this.input.keyboard.on(

        "keydown-UP",

        ()=>{

            if(!pulando){

                pulando=true;

                this.tweens.add({

                    targets:player,

                    y:340,

                    duration:220,

                    yoyo:true,

                    onComplete:()=>{

                        pulando=false;

                    }

                });

            }

        }

    );

    //-----------------------------------
    // Spawn
    //-----------------------------------

    this.time.addEvent({

        delay:700,

        loop:true,

        callback:()=>{

            if(!gameStarted) return;

            if(items.countActive()>12) return;

            let obstaculos=[
                "urso",
                "leao",
                "onca"
            ];

            let premios=[

                "moeda",

                "livro",

                "agenda",

                "caderno",

                "garrafa",

                "lanche",

                "tenis1",

                "tenis2",

                "mochila1",

                "mochila2",

                "mochila3"

            ];

            let criarObstaculo=
                Phaser.Math.Between(1,4)==1;

            let sprite;

            if(criarObstaculo){

                sprite=items.create(

                    lanes[
                        Phaser.Math.Between(0,2)
                    ],

                    -80,

                    obstaculos[
                        Phaser.Math.Between(0,2)
                    ]

                );

                sprite.tipo="obstaculo";

                sprite.setDisplaySize(120,120);

            }

            else{

                sprite=items.create(

                    lanes[
                        Phaser.Math.Between(0,2)
                    ],

                    -80,

                    premios[
                        Phaser.Math.Between(
                            0,
                            premios.length-1
                        )
                    ]

                );

                sprite.tipo="premio";

                sprite.isGold=
                    Phaser.Math.Between(1,10)==1;

                sprite.setDisplaySize(70,70);

                if(sprite.isGold){

                    sprite.setTint(0xFFD700);

                }

            }

            sprite.setVelocityY(dificuldade);

        }

    });

    //-----------------------------------
    // Botões
    //-----------------------------------

    criarBotao(this,100,550,"Helô","helo");
    criarBotao(this,200,550,"Lis","lis");
    criarBotao(this,300,550,"Thor","thor");

    //-----------------------------------

    criarCapa(this);

}
    
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
