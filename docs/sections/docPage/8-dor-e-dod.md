=== "Definition of Ready (DoR)"

    !!! info "Sobre"

        O Definition of Ready (DoR) é um conjunto de critérios que fala sobre quando um item, independente de ser uma história, tarefa ou épico, está pronto para a equipe de desenvolvimento trabalhar. O que significa que é um acordo feito entre as partes interessadas – Product Owner e equipe de desenvolvimento. O qual garante clareza, alinhamento e pré-requisitos para o trabalho poder ser feito. Os critérios para realização do DoR serão listados abaixo:

    | **Critério**                | **Descrição**                                                                                                                                                                                                                              |
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Requisitos em forma de user story?**   | Com o objetivo de facilitar o entendimento para a equipe, representar os requisitos em forma de user story no formato:<br> - _"Como [usuário], quero [ação] para [objetivo]"_.|
    | **Critérios de aceitação definidos?**  | Condições específicas e mensuráveis para validar o requisito devem estar presentes para garantir que o requisito esteja claramente definido.|
    | **Dependências resolvidas?**| APIs, designs e recursos externos necessários já estão disponíveis.|
    | **Validação do PO** | Aprovação formal do Product Owner de que o item de backlog cumpre todos os requisitos para ser considerado pronto e apto para desenvolvimento. |

=== "Definition of Done (DoD)"

    !!! info "Sobre"

        O Definition of Done (DoD) é usado para garantir a qualidade e a consistência do trabalho entregue pela equipe a partir de uma definição clara e objetiva de critérios que precisam ser atendidos para que um item do backlog (User Story) seja considerado como concluído. A seguir, será apresentado os critérios escolhidos pela equipe para composição do DoD:

    | **Critério**| **Descrição**|
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Contempla os requisitos estabelecidos?**| - Validar se a funcionalidade cumpre com os requisitos estabelecidos.|
    | **Entrega um incremento do produto?**| - Código desenvolvido e integrado. <br> - Deve agragar valor ao produto como um todo. <br> - Funcionalidade deve ser implementada por completo e respeitar requisitos estabelecidos.|
    | **Testes Realizados?**| - Testes de unidade serão implementados para as funcionalidades do Produto Mínimo Viável (MVP), garantindo a validação isolada do código para as features essenciais.  <br>- Testes de integração com APIs (Google Maps, Firebase).  |
    | **Documentação Atualizada?** | - A documentação do sistema será voltada para o usuário final, explicando como utilizar as funcionalidades. Já a documentação técnica será para os desenvolvedores, detalhando a arquitetura, o design e as APIs do projeto.<br> - O código será documentado internamente utilizando comentários inline para lógicas específicas e docstrings/JSDoc para funções, classes e módulos.<br> - O padrão de documentação seguirá as convenções e melhores práticas específicas para Node.js. |
    | **Código e Funcionalidade Revisada?**| - Funcionalidade e código revisado pela equipe de QA.<br> - Evidências da revisão incluem relatórios de teste, aprovações de Pull Requests e checklists.|
    

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do documento de DoR e DoD | Gabriel Soares | Leonardo Sauma e Gustavo Gontijo|
    |26/05/2025| 1.1 | Realizadas correções baseadas nos comentários do Professor em sala | Gabriel Soares | Gustavo Gontijo e Rodrigo