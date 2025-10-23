// Detecta quando o usuário chega na parte de baixo (ex: seção Serviços)
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  const servicos = document.getElementById("servicos");
  const scrollPosition = window.scrollY;

  // Quando o scroll ultrapassa o topo da seção de serviços
  if (scrollPosition > servicos.offsetTop - 100) {
    header.classList.add("transparent");
  } else {
    header.classList.remove("transparent");
  }
});
