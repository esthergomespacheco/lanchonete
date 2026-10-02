const products = [
  {
    id: 1,
    name: "X-Burger",
    category: "hamburguer",
    description: "Pão, hambúrguer, queijo e molho especial.",
    price: 22.90,
    image: "imagens/xburger.png"
  },

  {
    id: 2,
    name: "X-Bacon",
    category: "hamburguer",
    description: "Hambúrguer, queijo, bacon crocante e molho.",
    price: 27.90,
    image: "imagens/xbacon.png"
  },

  {
    id: 3,
    name: "X-Salada",
    category: "hamburguer",
    description: "Hambúrguer, queijo, alface, tomate e molho.",
    price: 24.90,
    image: "imagens/xsalada.png"
  },

  {
    id: 4,
    name: "Batata Frita",
    category: "porcao",
    description: "Porção de batata frita crocante.",
    price: 15.90,
    image: "imagens/batata.png"
  },

  {
    id: 5,
    name: "Batata com Cheddar",
    category: "porcao",
    description: "Batata frita com cheddar cremoso.",
    price: 19.90,
    image: "imagens/batatacheddar.png"
  },

  {
    id: 6,
    name: "Pepsi",
    category: "bebida",
    description: "Refrigerante gelado 350ml.",
    price: 6.00,
    image: "imagens/pepsi.png"
  },

  {
    id: 7,
    name: "Coca-Cola",
    category: "bebida",
    description: "Refrigerante gelado 350ml.",
    price: 6.00,
    image: "imagens/coca.png"
  },

  {
    id: 8,
    name: "Suco Laranja",
    category: "bebida",
    description: "Suco de laranja feito na hora.",
    price: 8.90,
    image: "imagens/suco.png"
  }
];

let cart = [];

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

let falando = false;
let utteranceAtual = null;

function getTextoParaLeitura() {
  const texto = document.getElementById("conteudo");
  if (!texto) return "";
  return texto.innerText.replace(/\s+/g, " ").trim();
}

function falarPagina() {
  if (!("speechSynthesis" in window)) {
    alert("Seu navegador não oferece leitura de voz. Tente usar Chrome, Edge ou Safari atualizado.");
    return;
  }

  window.speechSynthesis.cancel();

  const texto = getTextoParaLeitura();
  if (!texto) return;

  utteranceAtual = new SpeechSynthesisUtterance(texto);
  utteranceAtual.lang = "pt-BR";
  utteranceAtual.rate = 0.95;
  utteranceAtual.pitch = 1;
  utteranceAtual.onend = pararAudioVisual;
  utteranceAtual.onerror = pararAudioVisual;

  falando = true;
  atualizarBotaoAudio();
  window.speechSynthesis.speak(utteranceAtual);
}

function pararAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  pararAudioVisual();
}

function pararAudioVisual() {
  falando = false;
  atualizarBotaoAudio();
}

function toggleAudio() {
  if (falando) {
    pararAudio();
  } else {
    falarPagina();
  }
}

function atualizarBotaoAudio() {
  const botao = document.getElementById("audioButton");
  if (!botao) return;

  botao.setAttribute("aria-pressed", falando ? "true" : "false");
  botao.textContent = falando ? "⏹ Parar leitura" : "🔊 Ler página";
  botao.setAttribute(
    "aria-label",
    falando ? "Parar leitura em voz alta" : "Ler o conteúdo da página em voz alta"
  );
}

function renderProducts(list = products) {

  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = `
      <p>Nenhum produto encontrado.</p>
    `;

    return;
  }

  list.forEach(product => {

    const card = document.createElement("div");

    card.className = "product";

    card.innerHTML = `
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
      >

      <div class="product-info">

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <span class="price">
            ${formatPrice(product.price)}
          </span>

          <button
            class="add-button"
            onclick="addToCart(${product.id})"
          >
            + Adicionar
          </button>

        </div>

      </div>
    `;

    productsContainer.appendChild(card);
  });
}

function addToCart(id) {

  const product = products.find(item => item.id === id);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  renderCart();
}

function removeFromCart(id) {

  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function renderCart() {

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        Seu carrinho está vazio.
      </p>
    `;

  } else {

    cart.forEach(item => {

      const element = document.createElement("div");

      element.className = "cart-item";

      element.innerHTML = `

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p>
            ${formatPrice(item.price)}
          </p>

          <div class="quantity">

            <button onclick="removeFromCart(${item.id})">
              −
            </button>

            <span>${item.quantity}</span>

            <button onclick="addToCart(${item.id})">
              +
            </button>

          </div>

        </div>

        <strong>
          ${formatPrice(item.price * item.quantity)}
        </strong>
      `;

      cartItems.appendChild(element);

    });

  }

  const quantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = quantity;
  cartCount.setAttribute("aria-label", `${quantity} item(ns) no carrinho`);
  cartTotal.textContent = formatPrice(total);
}

function filterProducts(category, button) {

  document
    .querySelectorAll(".category")
    .forEach(item => item.classList.remove("active"));

  button.classList.add("active");

  if (category === "todos") {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(
    product => product.category === category
  );

  renderProducts(filtered);
}

searchInput.addEventListener("input", function() {

  const search = this.value
    .toLowerCase()
    .trim();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.description.toLowerCase().includes(search)
  );

  renderProducts(filtered);
});

function toggleCart() {

  const cartElement = document.getElementById("cart");

  cartElement.classList.toggle("open");
}

function openCheckout() {

  if (cart.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  document
    .getElementById("checkoutModal")
    .classList.add("active");
}

function closeCheckout() {

  document
    .getElementById("checkoutModal")
    .classList.remove("active");
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
      document.getElementById("customerName").value;

    const phone =
      document.getElementById("customerPhone").value;

    const address =
      document.getElementById("customerAddress").value;

    const number =
      document.getElementById("customerNumber").value;

    const complement =
      document.getElementById("customerComplement").value;

    const payment =
      document.getElementById("payment").value;

    const deliveryDate =
      document.getElementById("deliveryDate").value;

    const deliveryTime =
      document.getElementById("deliveryTime").value;
    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    console.log({
  cliente: name,
  telefone: phone,
  dataEntrega: deliveryDate,
  horarioEntrega: deliveryTime,
  endereco: address,
  numero: number,
  complemento: complement,
  pagamento: payment,
  produtos: cart,
  total: total
});

    alert(
  `Pedido confirmado, ${name}!\n\n` +
  `Data: ${deliveryDate}\n` +
  `Horário: ${deliveryTime}\n` +
  `Total: ${formatPrice(total)}\n` +
  `Pagamento: ${payment}\n\n` +
  `Obrigado pela preferência!`
);

    cart = [];

    renderCart();
    closeCheckout();

    this.reset();
  });

  function configurarDataEntrega() {
  const campoData = document.getElementById("deliveryDate");

  if (!campoData) return;

  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  // Data mínima: hoje
  const dataMinima = `${ano}-${mes}-${dia}`;

  // Data máxima: 30 dias a partir de hoje
  const dataMaximaObj = new Date(hoje);
  dataMaximaObj.setDate(dataMaximaObj.getDate() + 30);

  const anoMax = dataMaximaObj.getFullYear();
  const mesMax = String(dataMaximaObj.getMonth() + 1).padStart(2, "0");
  const diaMax = String(dataMaximaObj.getDate()).padStart(2, "0");

  const dataMaxima = `${anoMax}-${mesMax}-${diaMax}`;

  campoData.min = dataMinima;
  campoData.max = dataMaxima;

  const dataSelecionada = new Date(deliveryDate + "T00:00:00");
  
  
  function configurarHorarioEntrega() {
  const campoData = document.getElementById("deliveryDate");
  const campoHorario = document.getElementById("deliveryTime");

  if (!campoData || !campoHorario) return;

  function atualizarHorario() {
    const hoje = new Date();

    // Pega a data de hoje no formato YYYY-MM-DD
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataHoje = `${ano}-${mes}-${dia}`;

    if (campoData.value === dataHoje) {

      // Se for hoje, o horário mínimo será o horário atual
      const horas = String(hoje.getHours()).padStart(2, "0");
      const minutos = String(hoje.getMinutes()).padStart(2, "0");

      campoHorario.min = `${horas}:${minutos}`;

    } else {

      // Se for outro dia, não existe limite de horário mínimo
      campoHorario.removeAttribute("min");
    }
  }

  campoData.addEventListener("change", atualizarHorario);

  atualizarHorario();
}
}

renderProducts();
renderCart();
configurarDataEntrega();
configurarHorarioEntrega();