// CONFIGURAÇÕES: Endereço da API e variáveis globais de controle
const URL_API = 'api.php';
let usuarioLogado = null;
let listaProdutos = []; // Cache para evitar buscar no banco toda vez que for editar

// PADRÃO DE REQUISIÇÃO (FUNÇÃO API): Realiza chamadas ao PHP de forma padronizada
async function api(acao, dados = null, params = '') {
    const config = {
        method: dados ? 'POST' : 'GET',
        body: dados ? JSON.stringify(dados) : null
    };
    const resposta = await fetch(`${URL_API}?acao=${acao}${params}`, config);
    return await resposta.json().catch(() => ({}));
}

// NAVEGAÇÃO: Mostra apenas a tela desejada e esconde as outras
function mostrarTela(nomeTela) {
    document.getElementById('view-produtos').classList.add('hide');
    document.getElementById('view-estoque').classList.add('hide');

    document.getElementById(`view-${nomeTela}`).classList.remove('hide');
    if (nomeTela === 'produtos') carregarProdutos();
    if (nomeTela === 'estoque') carregarEstoque();
}

// RF01: LOGIN - Valida usuário e alterna para a área administrativa
async function login() {
    const email = document.getElementById('l-email').value;
    const senha = document.getElementById('l-senha').value;

    const res = await api('login', { email, senha });
    if (res.usuario) {
        usuarioLogado = res.usuario;
        document.getElementById('u-nome').innerText = usuarioLogado.nome;
        document.getElementById('scr-login').classList.add('hide');
        document.getElementById('scr-app').classList.remove('hide');
    } else {
        alert('E-mail ou senha incorretos!');
    }
}

// RF04/05/06: LISTAGEM E BUSCA - Renderiza a tabela de produtos e permite filtro
async function carregarProdutos() {
    const busca = document.getElementById('p-busca').value;
    listaProdutos = await api('listar', null, `&busca=${busca}`);

    const tabela = document.getElementById('tbody-produtos');
    tabela.innerHTML = listaProdutos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.nome}</strong><br><small>${p.especificacoes}</small></td>
            <td>${p.estoque_minimo}</td>
            <td>${p.estoque_atual}</td>
            <td>
                <button onclick="abrirModal(${p.id})">Editar</button>
                <button onclick="excluirProduto(${p.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// RF04: SALVAR - Cria ou atualiza um produto baseado na presença do ID
async function salvarProduto() {
    const id = document.getElementById('m-id').value;
    const nome = document.getElementById('m-nome').value;
    const min = document.getElementById('m-min').value;
    const atual = document.getElementById('m-atual').value;
    const specs = document.getElementById('m-specs').value;

    // VALIDAÇÃO (RF06)
    if (!nome || !min || (!id && !atual)) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    const dados = { nome, min, atual, specs };

    await api('salvar', dados, id ? `&id=${id}` : '');
    fecharModal();
    carregarProdutos();
}

// RF04: EXCLUIR - Deleta um produto após confirmação
async function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        await api('excluir', null, `&id=${id}`);
        carregarProdutos();
    }
}

// RF08/09: GESTÃO DE ESTOQUE - Listagem em ordem alfabética e preenchimento de selects
async function carregarEstoque() {
    const produtos = await api('listar');

    // ORDENAÇÃO: Garante que a lista esteja em ordem alfabética (A-Z)
    produtos.sort((a, b) => a.nome.localeCompare(b.nome));

    // TABELA DE STATUS: Mostra estoque atual e indica se está baixo
    const tabela = document.getElementById('tbody-estoque');
    tabela.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.estoque_atual}</td>
            <td>${p.estoque_minimo}</td>
            <td class="${p.estoque_atual < p.estoque_minimo ? 'danger' : 'success'}">
                ${p.estoque_atual < p.estoque_minimo ? '⚠️ BAIXO' : '✅ OK'}
            </td>
        </tr>
    `).join('');

    // SELECT: Preenche as opções para movimentação
    const select = document.getElementById('mov-produto-id');
    select.innerHTML = produtos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

    // DATA: Define a data/hora atual como padrão
    document.getElementById('mov-data').value = new Date().toISOString().slice(0, 16);

    carregarHistorico();
}

// RF08/11: MOVIMENTAÇÃO - Envia entrada/saída e exibe alerta se o estoque ficar baixo
async function realizarMovimentacao() {
    const qtd = document.getElementById('mov-qtd').value;
    const data = document.getElementById('mov-data').value;

    if (!qtd || !data) {
        alert('Preencha a quantidade e a data!');
        return;
    }

    const dados = {
        produto_id: document.getElementById('mov-produto-id').value,
        usuario_id: usuarioLogado.id,
        tipo: document.getElementById('mov-tipo').value,
        qtd: qtd,
        data: data
    };

    const res = await api('movimentar', dados);
    if (res.erro) {
        alert(`❌ ERRO: ${res.erro}`);
        return;
    }
    if (res.alerta) {
        alert(`🚨 ALERTA DE ESTOQUE MÍNIMO!\nO estoque caiu para ${res.novo_estoque}.`);
    }
    carregarEstoque();
}

// RF12: HISTÓRICO - Mostra todas as operações realizadas
async function carregarHistorico() {
    const historico = await api('historico');
    const tabela = document.getElementById('tbody-historico');
    tabela.innerHTML = historico.map(h => `
        <tr>
            <td>${h.data}</td>
            <td>${h.prod_nome}</td>
            <td>${h.tipo === 'entrada' ? 'ENTRADA' : 'SAÍDA'}</td>
            <td>${h.quantidade}</td>
            <td>${h.user_nome}</td>
        </tr>
    `).join('');
}

// UTILITÁRIOS: Controle do modal de produto
function abrirModal(id = null) {
    document.getElementById('modal-produto').style.display = 'flex';
    if (id) {
        const p = listaProdutos.find(item => item.id == id);
        document.getElementById('modal-titulo').innerText = 'Editar Produto';
        document.getElementById('m-id').value = p.id;
        document.getElementById('m-nome').value = p.nome;
        document.getElementById('m-min').value = p.estoque_minimo;
        document.getElementById('m-specs').value = p.especificacoes;
        document.getElementById('div-atual').classList.add('hide');
    } else {
        document.getElementById('modal-titulo').innerText = 'Novo Produto';
        document.getElementById('m-id').value = '';
        document.getElementById('m-form').reset();
        document.getElementById('div-atual').classList.remove('hide');
    }
}

function fecharModal() {
    document.getElementById('modal-produto').style.display = 'none';
}
