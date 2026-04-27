# ENTREGA 08 – Descritivo de Casos de Teste de Software

## 8.1 Casos de Teste

| ID | Requisito Relacionado | Descrição do Teste | Passos | Resultado Esperado |
|:---:|:---:|:---|:---|:---|
| **CT01** | RF01 / RF02 | Autenticação Inválida | 1. Inserir e-mail não cadastrado.<br>2. Clicar em Entrar. | Mensagem "E-mail ou senha incorretos" e retorno ao login. |
| **CT02** | RF01 | Autenticação Válida | 1. Inserir e-mail e senha corretos.<br>2. Clicar em Entrar. | Redirecionamento para a Interface Principal com nome do usuário. |
| **CT03** | RF07 | Busca de Produto | 1. Digitar "Samsung" no campo de busca. | A tabela deve filtrar e exibir apenas produtos com "Samsung" no nome. |
| **CT04** | RF08 | Validação de Cadastro | 1. Abrir Novo Produto.<br>2. Tentar salvar sem preencher o nome. | Exibição de alerta "Por favor, preencha todos os campos obrigatórios". |
| **CT05** | RF11 | Alerta de Estoque Mínimo | 1. Registrar saída que deixe o estoque abaixo do mínimo. | Exibição de alerta visual (pop-up) com o novo saldo do estoque. |
| **CT06** | RF12 | Rastreabilidade | 1. Realizar uma movimentação.<br>2. Verificar tabela de histórico. | O registro deve conter a data exata e o nome do usuário logado. |

## 8.2 Ferramentas e Ambientes de Teste

*   **Ferramentas:** Google Chrome DevTools (para inspeção de rede e console), PHPMyAdmin (para validação dos dados no banco).
*   **Ambiente:** Servidor Local XAMPP (Apache 2.4, PHP 8.x, MariaDB).
*   **Navegador:** Microsoft Edge / Google Chrome.
