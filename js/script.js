// Variaveis gerais do projeto
var input = document.getElementById("input-busca");
var botao = document.getElementById("btn-custom");
let tempAtual = 0;
// Chave para a API/openweather
const apiKey = "b37788054ccb0594cd46e6be1d1f96fc";
// Chave para a API NEWS Api
const apiKeyNews = "c4cd5a7e18174029be8527a75865167e";
// Chave para a GNEWSapi
const gNewsApi = "92a9dfdafdc509d87dbd603c8543cf40";
function botaoDeBusca() {
    const inputValue = input.value;
    movimentoInput(inputValue);
}
// Função de abrirInput
function abrirInput() {
    input.style.visibility = "visible";
    botao.classList.add('btn-custom');
    input.classList.add('animacao_aumentar_caixa');
    input.value = "";
}
// Função de fechar Input
function fecharInput() {
    input.style.visibility = "hidden";
    botao.classList.remove('btn-custom2');
    input.classList.remove('animacao_aumentar_caixa');
    input.value = "";
}
// Função para decidir qual função deve ser chamada
function movimentoInput(valorInput) {
    const visibilidade = input.style.visibility;
    valorInput && procurarCidade(valorInput);
    visibilidade === 'hidden' ? abrirInput() : fecharInput();
}

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        let valorInput = input.value;
        movimentoInput(valorInput);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fecharInput();
});

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// Função assincrona para capiturar e tratar as informações dos dados de tempo
async function procurarCidade(valorInput) {
    try {
        const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valorInput}&appid=${apiKey}&units=metric&lang=pt_br`);
        if (dados.status === 200) {
            const resultado = await dados.json();
            mostrarClimaNaTela(resultado);
        } else {
            throw new Error;
        }
    } catch (error) {
        alert('A pesquisa por cidade deu errado!');
    }
}
// Função para mudar as imagens de fundo
function updateBackground(tempAtual){
    console.log(tempAtual);
    const home = document.getElementById("home");
    let background = document.getElementById('background-video');
    let backgroundImg = document.getElementById('background');
    if(window.innerWidth <= 600){
        if(tempAtual >= 25){
            background.style.display = 'none';
            backgroundImg.style.backgroundImage = "url('img/desert2.jpg')";
        }else if(tempAtual <= 12){
            background.style.display = 'none';
            backgroundImg.style.backgroundImage = "url('img/neve2.jpg')";
        }else{
            background.style.display = 'none';
            backgroundImg.style.backgroundImage = "url('img/beach2.jpg')";
        }
    }else{
        home.style.height = '100%';
        if(tempAtual >= 25){
            background.style.display = 'block';
            background.src = 'videos/desert2.mp4';
        }else if(tempAtual <= 12){
            background.style.display = 'block';
            background.src = 'videos/snow.mp4';
        }else{
            background.style.display = 'block';
            background.src = 'videos/beach.mp4';
        }
    }
}
// Função para colocar de forma dinamica na tela
async function mostrarClimaNaTela(resultado) {
    const country = resultado.sys.country.toLowerCase();
    obterNoticiaPais(country);
    tempAtual = resultado.main.temp;
    updateBackground(tempAtual);    
    document.querySelector('.icone-tempo').src = `https://openweathermap.org/img/wn/${resultado.weather[0].icon}@2x.png`;
    document.querySelector('.nome-cidade').innerHTML = `${resultado.name}`;
    document.querySelector('.temperatura').innerHTML = `${resultado.main.temp.toFixed(0)} ºC`;
    document.querySelector('.maxTemperatura').innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}`;
    document.querySelector('.minTemperatura').innerHTML = `min: ${resultado.main.temp_min.toFixed(0)}`;
}
// API DO GOOGLE NEWS API por país
async function obterNoticiaPais(country) {
    try {
        const url = `https://gnews.io/api/v4/top-headlines?country=${country}&max=3&apikey=${gNewsApi}`;
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            const resultado = data.articles.map(item => ({
                title: item.title,
                image: item.image,
                description: item.description,
                url: item.url
            }));
            console.log(resultado);
            mostrarNewsNaTela(resultado);

        } else {
            throw new Error;
        }
    } catch (error) {
        alert('Erro');
    }
}

function mostrarNewsNaTela(resultado) {
    console.log(resultado);
    let noticiaCaixa = document.querySelector(".noticia-caixa");
    const home = document.getElementById("home");
    // let imagemCaixa = document.querySelector(".imagem-caixa");
    noticiaCaixa.innerHTML = "<h2>Notícias</h2>";
    if(window.innerWidth < 600){
        home.style.height = "300%";
    }
    for (let i = 0; i < 3; i++) {
        noticiaCaixa.innerHTML += `
        <a href="${resultado[i].url}" target="_blank">
        <div class="row mb-3 pt-3 pb-3 fileira-conteudo">
                <div class="col-8 col-lg-2 mx-auto">
                    <img class="img-fluid noticia-img" src="${resultado[i].image}" alt="noticia-img">
                </div>
                <div class="col-12 col-lg-8 me-auto">
                    <p class="mt-3"> ${resultado[i].title} </p>
                </div>
                </div>
        </a>
        `
        
        // imagemCaixa.innerHTML += `
        // <img src="${resultado[i].image}" width="100px" alt="noticia-icon">
        // `
    }
}


// Adicione um ouvinte de evento para verificar a largura da tela e chamar a função updateBackground
window.addEventListener('resize', function () {
    updateBackground(tempAtual);
});

// Chame a função updateBackground quando a página for carregada pela primeira vez
window.onload = function () {
    updateBackground(tempAtual); 
};