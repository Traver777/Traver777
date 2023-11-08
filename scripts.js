let carrinho = [];

function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  document.getElementById('carrinho').innerHTML = `<h2>Carrinho:</h2> ${carrinho.join(', ')}`;
}
