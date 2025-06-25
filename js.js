const itemInput = document.getElementById('itemInput');
const quantityInput = document.getElementById('quantityInput');
const priceInput = document.getElementById('priceInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');
const cartList = document.getElementById('cartList');
const totalCarrinho = document.getElementById('totalCarrinho');
const searchInput = document.getElementById('searchInput');
const clearProductsBtn = document.getElementById('clearProducts');
const clearCartBtn = document.getElementById('clearCart');
const toast = document.getElementById('toast');
const cartCounter = document.getElementById('cart-count');

let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Salva no localStorage
function salvarLocal() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Mostrar toast animado
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Atualiza contador no header
function atualizarContador() {
  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  cartCounter.textContent = totalItens;
}

// Renderiza produtos, com filtro de busca
function renderProdutos() {
  const filtro = searchInput.value.trim().toLowerCase();
  itemList.innerHTML = '';

  produtos
    .filter(p => p.nome.toLowerCase().includes(filtro))
    .forEach((produto, index) => {
      const li = document.createElement('li');

      const info = document.createElement('div');
      info.classList.add('item-info');
      info.innerHTML = `<strong>${produto.nome}</strong>
        <small>Qtd: ${produto.qtd}</small>
        <small>Preço: R$ ${produto.preco.toFixed(2)}</small>`;

      const botoes = document.createElement('div');
      botoes.classList.add('botoes-produto');

      const btnAdd = document.createElement('button');
      btnAdd.textContent = 'Adicionar ao carrinho';
      btnAdd.classList.add('adicionar');
      btnAdd.addEventListener('click', () => {
        adicionarAoCarrinho(produto);
        showToast(`Adicionado "${produto.nome}" ao carrinho!`);
      });

      const btnRemover = document.createElement('button');
      btnRemover.textContent = '🗑️';
      btnRemover.title = 'Remover produto';
      btnRemover.classList.add('remover');
      btnRemover.addEventListener('click', () => {
        if (confirm(`Remover "${produto.nome}" da lista?`)) {
          produtos.splice(index, 1);
          salvarLocal();
          renderProdutos();
          showToast(`"${produto.nome}" removido da lista!`);
        }
      });

      botoes.appendChild(btnAdd);
      botoes.appendChild(btnRemover);

      li.appendChild(info);
      li.appendChild(botoes);
      itemList.appendChild(li);
    });
}

// Renderiza carrinho
function renderCarrinho() {
  cartList.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.classList.add('item-info');
    const subtotal = item.qtd * item.preco;
    info.innerHTML = `<strong>${item.nome}</strong>
      <small>Qtd: ${item.qtd}</small>
      <small>Subtotal: R$ ${subtotal.toFixed(2)}</small>`;

    const btnRemover = document.createElement('button');
    btnRemover.textContent = '🗑️';
    btnRemover.title = 'Remover do carrinho';
    btnRemover.classList.add('remover');
    btnRemover.addEventListener('click', () => {
      if (confirm(`Remover "${item.nome}" do carrinho?`)) {
        carrinho.splice(index, 1);
        salvarLocal();
        renderCarrinho();
        atualizarContador();
        showToast(`"${item.nome}" removido do carrinho!`);
      }
    });

    li.appendChild(info);
    li.appendChild(btnRemover);
    cartList.appendChild(li);

    total += subtotal;
  });

  totalCarrinho.textContent = total.toFixed(2);
  atualizarContador();
}

// Adiciona produto na lista
function adicionarItem() {
  const nome = itemInput.value.trim();
  const qtd = parseInt(quantityInput.value);
  const preco = parseFloat(priceInput.value);

  if (nome === '' || isNaN(qtd) || qtd <= 0 || isNaN(preco) || preco < 0) {
    alert('Por favor, preencha nome, quantidade (>0) e preço (≥0) válidos!');
    return;
  }

  produtos.push({ nome, qtd, preco });

  itemInput.value = '';
  quantityInput.value = '1';
  priceInput.value = '';

  salvarLocal();
  renderProdutos();
  showToast(`Produto "${nome}" adicionado!`);
}

// Adiciona ao carrinho (soma se já existir)
function adicionarAoCarrinho(produto) {
  const existente = carrinho.find(p => p.nome === produto.nome);
  if (existente) {
    existente.qtd += produto.qtd;
  } else {
    carrinho.push({ ...produto });
  }
  salvarLocal();
  renderCarrinho();
  atualizarContador();
}

// Busca na lista de produtos
searchInput.addEventListener('input', renderProdutos);

// Botões limpar
clearProductsBtn.addEventListener('click', () => {
  if (produtos.length === 0) {
    alert('A lista de produtos já está vazia!');
    return;
  }
  if (confirm('Tem certeza que deseja limpar toda a lista de produtos?')) {
    produtos = [];
    salvarLocal();
    renderProdutos();
    showToast('Lista de produtos limpa!');
  }
});

clearCartBtn.addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('O carrinho já está vazio!');
    return;
  }
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    carrinho = [];
    salvarLocal();
    renderCarrinho();
    atualizarContador();
    showToast('Carrinho limpo!');
  }
});

// Eventos para adicionar com Enter
[itemInput, quantityInput, priceInput].forEach(input => {
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      adicionarItem();
    }
  });
});

addBtn.addEventListener('click', adicionarItem);

// Inicialização
renderProdutos();
renderCarrinho();
atualizarContador();
