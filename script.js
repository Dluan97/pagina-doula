
// Detecta a rolagem e aplica classe
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const header = document.querySelector('header');
const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
  let scroll = window.scrollY;
  const scrollLimit = 80;
  const scrollTrigger = 80; // Ponto em que a mudança visual começa

  // Adiciona a classe 'shrink' quando rolar mais que 50px
  if(scroll > scrollTrigger) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }

  // Reduz tamanho da logo proporcional (opcional, mas recomendado)
  const maxLogo = 200;
  const minLogo = 80;
  let newLogo = maxLogo - (scroll / scrollLimit) * (maxLogo - minLogo);
  newLogo = Math.max(minLogo, Math.min(maxLogo, newLogo));
  logo.style.width = `${newLogo}px`;
});


// ===============================================
// Lógica para o Carrossel de Depoimentos de 3 Caixas
// ===============================================

const carrosselContainer = document.querySelector('.depoimentos-carrossel');
const slides = document.querySelectorAll('.carrossel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicadoresContainer = document.querySelector('.carrossel-indicadores');

// Variáveis para o formulário de Recado (Novas Adições/Uso)
const toggleButton = document.getElementById('toggleFormBtn'); // NOVO: Botão Deixar Recado
const formContainer = document.getElementById('novoDepoimentoContainer'); // NOVO: Container do formulário

// Variáveis existentes do formulário
const form = document.getElementById('depoimentoForm');
const depoimentoInput = document.getElementById('depoimentoInput');
const autorInput = document.getElementById('autorInput');
const feedbackMsg = document.getElementById('mensagemFeedback');

let currentSlide = 0;
let autoRotateTimer;
const intervalTime = 7000; // Rotação a cada 7 segundos


// --- FUNÇÕES DE ROTAÇÃO ---

function updateCarrossel() {
    // Calcula o deslocamento horizontal necessário
    const offset = -currentSlide * 100; // 100% de largura para cada slide
    carrosselContainer.style.transform = `translateX(${offset}%)`;
    
    // Atualiza os indicadores (pontinhos)
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarrossel();
    resetAutoRotate();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarrossel();
    resetAutoRotate();
}

function startAutoRotate() {
    // Evita iniciar se houver apenas 1 slide
    if (slides.length > 1) {
        autoRotateTimer = setInterval(nextSlide, intervalTime);
    }
}

function resetAutoRotate() {
    clearInterval(autoRotateTimer);
    startAutoRotate();
}


// --- LÓGICA DO BOTÃO DEIXAR RECADO (ITEM 2) ---

if (toggleButton && formContainer) {
    toggleButton.addEventListener('click', () => {
        // Alterna a classe 'hidden' para mostrar/esconder
        formContainer.classList.toggle('hidden'); 

        // Altera o texto do botão
        if (formContainer.classList.contains('hidden')) {
            toggleButton.textContent = 'Deixar um Recado';
        } else {
            toggleButton.textContent = 'Esconder Formulário';
            // Opcional: Rola para o formulário ao abrir
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}


// --- LIGAÇÃO DOS BOTÕES DE NAVEGAÇÃO (ITEM 1) ---

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}


// --- FUNÇÃO DE SUBMISSÃO DO FORMULÁRIO ---

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novoDepoimento = depoimentoInput.value;
    const novoAutor = autorInput.value || "Anônimo";

    // 1. Cria a estrutura do novo depoimento
    const novoDepoimentoHTML = `
        <div class="depoimento-item novo-item">
            <blockquote>"${novoDepoimento}"</blockquote>
            <p class="autor">— ${novoAutor}</p>
        </div>
    `;

    // 2. Tenta adicioná-lo ao slide ativo (o slide que está sendo visualizado)
    const activeSlide = slides[currentSlide];
    
    // ATENÇÃO: Adicionar depoimentos via JS no cliente é temporário
    // O ideal é enviar para um servidor/email para aprovação.
    if (activeSlide && activeSlide.children.length < 3) {
        activeSlide.insertAdjacentHTML('beforeend', novoDepoimentoHTML);
        feedbackMsg.textContent = "Seu depoimento foi adicionado! Em breve você poderá vê-lo girando.";
        feedbackMsg.style.color = "green";
        
        // Limpa o formulário
        form.reset();
    } else {
        feedbackMsg.textContent = "Seu depoimento foi enviado! Será adicionado após a aprovação manual.";
        feedbackMsg.style.color = "orange";
        
        // Substituído para apenas mostrar a mensagem, sem o mailto que interrompe a experiência.
        // Se precisar do envio, implemente um backend ou serviço de formulário.
        
        // Limpa o formulário
        form.reset();
    }
    
    // Rola para a próxima slide após submissão (se houver mais slides)
    if (slides.length > 1) {
        // Pequeno delay para que o usuário veja a mensagem antes de rolar
        setTimeout(nextSlide, 500); 
    }
});


// --- INICIALIZAÇÃO ---

// Cria os indicadores (dots) dinamicamente
slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) {
        dot.classList.add('active');
    }
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarrossel();
        resetAutoRotate();
    });
    indicadoresContainer.appendChild(dot);
});


// Inicia o carrossel na montagem do DOM
document.addEventListener('DOMContentLoaded', () => {
    updateCarrossel();
    startAutoRotate();
});

// --- INICIALIZAÇÃO ---

if (slides.length > 0) {
    updateCarrossel();
    startAutoRotate();
    
    // Eventos de clique nos botões
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}