<?php
// Configurações de Conexão (MySQLi)
$host = 'localhost';
$db   = 'saep_db';
$user = 'root';
$pass = ''; // Senha padrão do XAMPP é vazia

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['erro' => 'Conexão falhou: ' . $conn->connect_error]));
}

$conn->set_charset("utf8");

// Roteamento de Ações
$acao = $_GET['acao'] ?? '';
$dados = json_decode(file_get_contents('php://input'), true);

switch ($acao) {
    case 'login':
        $stmt = $conn->prepare("SELECT id, nome FROM usuarios WHERE email = ? AND senha = ?");
        $stmt->bind_param("ss", $dados['email'], $dados['senha']);
        $stmt->execute();
        $res = $stmt->get_result();
        echo json_encode(['usuario' => $res->fetch_assoc()]);
        break;

    case 'listar':
        $busca = $_GET['busca'] ?? '';
        $param = "%$busca%";
        $stmt = $conn->prepare("SELECT * FROM produtos WHERE nome LIKE ?");
        $stmt->bind_param("s", $param);
        $stmt->execute();
        $res = $stmt->get_result();
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case 'salvar':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("UPDATE produtos SET nome = ?, estoque_minimo = ?, especificacoes = ? WHERE id = ?");
            $stmt->bind_param("sisi", $dados['nome'], $dados['min'], $dados['specs'], $id);
        } else {
            $stmt = $conn->prepare("INSERT INTO produtos (nome, estoque_minimo, estoque_atual, especificacoes) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("siis", $dados['nome'], $dados['min'], $dados['atual'], $dados['specs']);
        }
        $stmt->execute();
        echo json_encode(['sucesso' => true]);
        break;

    case 'excluir':
        $id = $_GET['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['sucesso' => true]);
        break;

    case 'movimentar':
        // 0. Verifica se há estoque suficiente para saída
        if ($dados['tipo'] === 'saida') {
            $stmt = $conn->prepare("SELECT estoque_atual FROM produtos WHERE id = ?");
            $stmt->bind_param("i", $dados['produto_id']);
            $stmt->execute();
            $prod = $stmt->get_result()->fetch_assoc();
            if ($prod['estoque_atual'] < $dados['qtd']) {
                die(json_encode(['erro' => 'Estoque insuficiente para esta saída!']));
            }
        }

        // 1. Registra a movimentação
        $stmt = $conn->prepare("INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $dados['produto_id'], $dados['usuario_id'], $dados['tipo'], $dados['qtd'], $dados['data']);
        $stmt->execute();

        // 2. Atualiza o estoque atual no cadastro do produto
        $sinal = $dados['tipo'] === 'entrada' ? '+' : '-';
        $query = "UPDATE produtos SET estoque_atual = estoque_atual $sinal ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $dados['qtd'], $dados['produto_id']);
        $stmt->execute();

        // 3. Verifica se o estoque ficou abaixo do mínimo
        $stmt = $conn->prepare("SELECT estoque_atual, estoque_minimo FROM produtos WHERE id = ?");
        $stmt->bind_param("i", $dados['produto_id']);
        $stmt->execute();
        $prod = $stmt->get_result()->fetch_assoc();

        $alerta = ($prod['estoque_atual'] < $prod['estoque_minimo']);
        echo json_encode(['alerta' => $alerta, 'novo_estoque' => $prod['estoque_atual']]);
        break;

    case 'historico':
        $sql = "SELECT m.data, p.nome as prod_nome, m.tipo, m.quantidade, u.nome as user_nome 
                FROM movimentacoes m 
                JOIN produtos p ON m.produto_id = p.id 
                JOIN usuarios u ON m.usuario_id = u.id 
                ORDER BY m.data DESC";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;
}

$conn->close();