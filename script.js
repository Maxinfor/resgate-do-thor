let energia = 100;

function iniciarJogo() {
    document.getElementById("som-latido").play();
    document.getElementById("tela-capa").style.display = "none";
    document.getElementById("jogo-container").style.display = "block";
}

function evento(tipo) {
    let thor = document.getElementById("thor-img");
    let balao = document.getElementById("balao");
    
    thor.style.left = "70%";
    setTimeout(() => { thor.style.left = "0%"; }, 2000);

    energia -= 10;
    document.getElementById("valor-energia").innerText = energia;
    document.getElementById("energia-bar").style.width = energia + "%";
    
    balao.innerText = tipo === 'chuva' ? "Helô: Protegidas da chuva!" : "Liz: Óculos salvos da poeira!";
}
