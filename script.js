const form = document.getElementById('form');
const tabela = document.getElementById('tabela');
const busca = document.getElementById('busca');
const contador = document.getElementById('contador');
const toast = document.getElementById('toast');

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function salvarLocalStorage() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function atualizarContador() {
  contador.textContent = `Usuários: ${usuarios.length}`;
}

function validar() {
  let valido = true;

  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const telefone = document.getElementById('telefone');

  if (nome.value.trim().length < 3) {
    document.getElementById('erro-nome').textContent = 'Nome inválido';
    nome.classList.add('erro-input');
    valido = false;
  } else {
    document.getElementById('erro-nome').textContent = '';
    nome.classList.remove('erro-input');
    nome.classList.add('sucesso');
  }

  if (!email.value.includes('@')) {
    document.getElementById('erro-email').textContent = 'Email inválido';
    email.classList.add('erro-input');
    valido = false;
  } else {
    document.getElementById('erro-email').textContent = '';
    email.classList.remove('erro-input');
    email.classList.add('sucesso');
  }

  if (telefone.value.length < 8) {
    document.getElementById('erro-telefone').textContent = 'Telefone inválido';
    telefone.classList.add('erro-input');
    valido = false;
  } else {
    document.getElementById('erro-telefone').textContent = '';
    telefone.classList.remove('erro-input');
    telefone.classList.add('sucesso');
  }

  return valido;
}

function renderizar(lista = usuarios) {
  tabela.innerHTML = '';

  lista.forEach(user => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td>${user.telefone}</td>
      <td>
        <button class="edit" onclick="editar(${user.id})">✏️</button>
        <button class="delete" onclick="excluir(${user.id})">🗑️</button>
      </td>
    `;

    tabela.appendChild(tr);
  });

  atualizarContador();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!validar()) return;

  const id = document.getElementById('id').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;

  if (id) {
    usuarios = usuarios.map(u =>
      u.id == id ? { id: Number(id), nome, email, telefone } : u
    );
    mostrarToast('Usuário atualizado!');
  } else {
    usuarios.push({
      id: Date.now(),
      nome,
      email,
      telefone
    });
    mostrarToast('Usuário cadastrado!');
  }

  salvarLocalStorage();
  form.reset();
  document.getElementById('id').value = '';

  document.querySelectorAll('input').forEach(i => i.classList.remove('sucesso'));

  renderizar();
});

function editar(id) {
  const user = usuarios.find(u => u.id === id);

  document.getElementById('id').value = user.id;
  document.getElementById('nome').value = user.nome;
  document.getElementById('email').value = user.email;
  document.getElementById('telefone').value = user.telefone;
}

function excluir(id) {
  if (confirm('Deseja excluir este usuário?')) {
    usuarios = usuarios.filter(u => u.id !== id);
    salvarLocalStorage();
    renderizar();
    mostrarToast('Usuário excluído!');
  }
}

busca.addEventListener('input', () => {
  const valor = busca.value.toLowerCase();

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(valor) ||
    u.email.toLowerCase().includes(valor) ||
    u.telefone.includes(valor)
  );

  renderizar(filtrados);
});

renderizar();