# ENTREGA 01 – Requisitos Funcionais

Este documento descreve as funcionalidades do sistema de controle de estoque para o comércio de equipamentos eletrônicos.

| ID | Nome do Requisito | Descrição |
|:---:|:---|:---|
| **RF01** | Autenticação de Usuário | O sistema deve permitir que usuários registrados acessem a área administrativa mediante e-mail e senha. |
| **RF02** | Tratamento de Erro no Login | Em caso de falha na autenticação, o sistema deve informar o motivo e permitir nova tentativa. |
| **RF03** | Interface Principal | A tela principal deve exibir o nome do usuário logado e fornecer links para as demais áreas do sistema. |
| **RF04** | Logout | O sistema deve permitir que o usuário encerre sua sessão e retorne à tela de login. |
| **RF05** | Cadastro de Produtos | O sistema deve permitir cadastrar, editar e excluir produtos (smartphones, notebooks, TVs, etc). |
| **RF06** | Listagem de Produtos | Exibir todos os produtos cadastrados em uma tabela com carregamento automático. |
| **RF07** | Busca de Produtos | Permitir filtrar a listagem de produtos por termo de busca (nome). |
| **RF08** | Validação de Dados | Validar o preenchimento dos campos obrigatórios no cadastro e edição de produtos, exibindo alertas. |
| **RF09** | Gestão de Estoque | Listar produtos em ordem alfabética para facilitar a conferência e movimentação. |
| **RF10** | Movimentação de Entrada/Saída | Permitir registrar entradas e saídas de estoque, informando quantidade e data. |
| **RF11** | Alerta de Estoque Mínimo | Emitir alerta automático sempre que uma saída resultar em estoque abaixo do valor mínimo configurado. |
| **RF12** | Histórico de Movimentações | Registrar e exibir o histórico completo de movimentações (data, produto, tipo, quantidade e responsável). |
