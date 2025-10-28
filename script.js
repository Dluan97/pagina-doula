
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
    autoRotateTimer = setInterval(nextSlide, intervalTime);
}

function resetAutoRotate() {
    clearInterval(autoRotateTimer);
    startAutoRotate();
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
    
    // Se o slide ativo já tiver 3 depoimentos, não adicionamos ao HTML.
    // (A rotação do lado do cliente torna isso complexo para gerenciar)
    if (activeSlide.children.length < 3) {
         activeSlide.insertAdjacentHTML('beforeend', novoDepoimentoHTML);
         feedbackMsg.textContent = "Seu depoimento foi adicionado! Em breve você poderá vê-lo girando.";
         feedbackMsg.style.color = "green";
         // Limpa o formulário
         form.reset();
    } else {
         feedbackMsg.textContent = "O slide está cheio! Seu depoimento foi enviado, mas será adicionado após a aprovação manual.";
         feedbackMsg.style.color = "orange";
         
         // Limpa o formulário e envia o dado para você por e-mail (usando a técnica mailto)
         window.location.href = `mailto:SEUEMAIL@dominio.com?subject=Novo Depoimento&body=Autor: ${novoAutor}%0ADepoimento: ${novoDepoimento}`;
         form.reset();
    }
    
    // Rola para a próxima slide após submissão (se houver mais slides)
    if (slides.length > 1) {
         nextSlide();
    }
});


// --- INICIALIZAÇÃO ---

if (slides.length > 0) {
    updateCarrossel();
    startAutoRotate();
    
    // Eventos de clique nos botões
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}