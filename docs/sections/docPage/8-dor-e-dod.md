=== "Definition of Ready (DoR)"

    !!! info "Sobre"

        O Definition of Ready (DoR) é um conjunto de critérios que fala sobre quando um item, independente de ser uma história, tarefa ou épico, está pronto para a equipe de desenvolvimento trabalhar nela ou outro grupo no projeto. O que significa que é um acordo feito entre as partes interessadas – Product Owner, equipe de desenvolvimento, stakeholders, etc. – o qual garante clareza, alinhamento e pré-requisitos para o trabalho poder ser feito. Os critérios para realização do DoR serão listados abaixo:

    | **Critério**                | **Descrição**                                                                                                                                                                                                                              |
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Clareza da User Story**   | Cada funcionalidade deve ser descrita como uma user story no formato: _"Como [usuário], quero [ação] para [objetivo]"_. Exemplo: _"Como turista, quero ver minha localização em tempo real no mapa para não me perder durante o passeio"_. |
    | **Critérios de Aceitação**  | Condições específicas e mensuráveis para validar a funcionalidade. Exemplo: _"A localização deve atualizar a cada 15 segundos com precisão ≤10 metros"_.                                                                                   |
    | **Dependências Resolvidas** | APIs, designs e recursos externos necessários já estão disponíveis. Exemplo: _Integração com a API do Google Maps concluída_.                                                                                                              |
    | **Recursos Alocados**       | Equipe e ferramentas definidas. Exemplo: _Desenvolvedor front-end (React Native) e biblioteca de geolocalização instalada_.                                                                                                                |
    | **Riscos Mitigados**        | Problemas potenciais identificados e soluções propostas. Exemplo: _Fallback para redes móveis caso o GPS falhe_.                                                                                                                           |
    | **Dados para Teste**        | Dados fictícios ou cenários prontos para validação. Exemplo: _Coordenadas de teste (São Paulo, Nova York)_.                                                                                                                                |
    | **Validação do PO**         | Aprovação do Product Owner em reunião formal. Exemplo: _PO validou a priorização da precisão sobre velocidade_.                                                                                                                            |

=== "Definition of Done (DoD)"

    !!! info "Sobre"

        O Definition of Done (DoD) é usado para garantir a qualidade e a consistência do trabalho entregue pela equipe a partir de uma definição clara e objetiva de critérios que precisam ser atendidos para que um item do backlog (User Story) seja considerado como concluído. A seguir, será apresentado os critérios escolhidos pela equipe para composição do DoD:

    | **Critério**                | **Descrição**                                                                                                                                                                  |
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Implementação Completa**  | Código desenvolvido, integrado ao repositório principal e funcionando nas plataformas-alvo.                                                                                    |
    | **Testes Realizados**       | - Testes em unidades individuais do código de forma isolada.  <br>- Testes de integração com APIs (Google Maps, Firebase).  <br>- Testes de usabilidade com 5+ usuários reais. |
    | **Documentação Atualizada** | - Comentários no código explicando lógicas complexas.    <br>- Documentação técnica de APIs e fluxos.                                                                          |
    | **Revisão de Código**       | Peer review realizado, seguindo padrões de código (ex: ESLint para JavaScript) e boas práticas de segurança.                                                                   |
    | **Performance Validada**    | - Tempo de resposta ≤2 segundos para ações do usuário.                                                                                                                         |
    | **Conformidade Legal**      | - LGPD aplicada para coleta de dados (ex: avaliações de rotas).  <br>- Termos de uso e política de privacidade atualizados.                                                    |
    | **Validação do Cliente**    | Aprovado pelo Product Owner em reunião formal, com demonstração da funcionalidade em ambiente de staging.                                                                      |

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do documento de DoR e DoD | Gabriel Soares | Leonardo Sauma e Gustavo Gontijo|