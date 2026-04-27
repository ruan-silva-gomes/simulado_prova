# ENTREGA 02 – Diagrama Entidade Relacionamento (DER)

O diagrama abaixo representa a estrutura do banco de dados `saep_db`, garantindo a rastreabilidade e integridade das informações.

```mermaid
erDiagram
    USUARIOS ||--o{ MOVIMENTACOES : "realiza"
    PRODUTOS ||--o{ MOVIMENTACOES : "sofre"

    USUARIOS {
        int id PK
        string nome
        string email
        string senha
    }

    PRODUTOS {
        int id PK
        string nome
        int estoque_minimo
        int estoque_atual
        string especificacoes
    }

    MOVIMENTACOES {
        int id PK
        int produto_id FK
        int usuario_id FK
        enum tipo "entrada / saida"
        int quantidade
        datetime data
    }
```

### Descrição das Tabelas:

1.  **USUARIOS**: Armazena os dados dos funcionários do almoxarifado que operam o sistema.
2.  **PRODUTOS**: Contém o catálogo de equipamentos (Smartphones, Notebooks, TVs) com seus respectivos níveis de estoque e especificações técnicas.
3.  **MOVIMENTACOES**: Tabela de junção que registra cada entrada e saída, vinculando o produto ao usuário responsável, com data e hora.
