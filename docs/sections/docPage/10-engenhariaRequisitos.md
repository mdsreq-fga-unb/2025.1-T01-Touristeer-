## 1. Elicitação e Descoberta

**Análise Documental**: Utilizar para revisar documentos existentes que fornecem informações sobre o domínio do problema, requisitos anteriores ou projetos similares, a fim de identificar necessidades e soluções já propostas.

**Entrevista**: Realizar para obter informações diretamente dos stakeholders, identificando necessidades, expectativas e limitações iniciais para o produto, com perguntas estruturadas e semi-estruturadas para capturar dados relevantes.

**Prompt de IA**: A equipe utilizou também prompts de Inteligência Artificial (IA) como uma ferramenta complementar para enriquecer o processo de levantamento de requisitos


## 2. Análise e Consenso

**Priorização**: Utilzou-se o método MoSCoW para classificar os requisitos conforme sua importância e urgência, garantindo que as funcionalidades mais críticas sejam tratadas primeiro.

**Análise de Viabilidade**: Realizar para avaliar a viabilidade técnica e econômica das funcionalidades propostas, garantindo que o MVP esteja de acordo com os recursos disponíveis atualmente.

**Sessões de Elicitação de Requisitos**: Conduzir reuniões de alinhamento para assegurar que todos os envolvidos no projeto tenham uma compreensão comum dos requisitos e das expectativas.


## 3. Representação

**Protótipos de Alta Fidelidade**: A criação dos protótipos será feita com alto nível de detalhamento, utilizando a plataforma Figma para representar as telas do projeto. Esses protótipos serão apresentados aos stakeholders para validação, garantindo que as funcionalidades sejam desenvolvidas conforme o esperado e minimizando a necessidade de retrabalho.


## 4. Declarações de Requisitos

**Critérios de Aceitação**: São definidos critérios que servirão de base para definir ser um requisito ou user story possui as características necessárias para ser considerado aceito e poder ser desenvolvido.

**User Stories**: Optou-se por utilizar User Stories como forma principal de declaração dos requisitos funcionais, por se tratar de uma técnica ágil, centrada no usuário, que favorece a comunicação entre desenvolvedores e stakeholders

**Rastreabilidade de Requisitos**: Foi elaborada a declaração de requisitos no formato de códigos sequenciais (**RF**X) onde "RF" significa "Requisito Funcional" e "X" representa o número do requisito.  Esse formato facilita a referência cruzada com testes, protótipos e funcionalidades implementadas, além de ser compatível com modelos tradicionais de documentação de requisitos.


## 5. Verificação e Validação de Requisitos

**Revisão por Pares e Checklists**: Aplicar como estratégia de validação dos requisitos, permitindo identificar inconsistências, omissões ou ambiguidades por meio da análise colaborativa entre membros da equipe e de outras equipes, assim como o uso de checklists para o auxilio na verificação da completude, clareza e coerência de cada requisito, contribuindo para a garantia da qualidade no processo.

**DoR - Definition of Ready**: Utilizou-se um conjunto de critérios que um requisito (ou user story) precisava atender antes de ser considerado pronto para desenvolvimento.

**DoD - Definition of Done**: Foram elaborados critérios de validação para garantir que a implementação de um requisito estivesse completa e em conformidade com os objetivos definidos.

**Feedback do Cliente**: O cliente possui espaço ativo para avaliar as entregas realizadas, fornecendo comentários e sugestões. Esse retorno é fundamental para identificar possíveis ajustes ou correções nas funcionalidades, assegurando que os requisitos estejam plenamente atendidos antes da validação final.


## 6. Organização e Atualização de Requisitos 

**Backlog de Requisios**: Requisitos organizados em forma de lista contendo código sequencial e visão da funcionalidade do ponto de vista de usuário, seguindo o formato de *user storie*

**Priorização do Backlog**: Os requisitos são organizados e atualizados por meio de uma tabela detalhada contendo colunas com informações como:
    - ID: código sequencial único do requisito
    - Descrição: texto explicativo sobre o requisito
    - Prioridade: nível de prioridade atribuído de acordo com o método MoSCoW
    - MVP(Sim/Não): define se um requisito está ou não incluído no MVP

## **Processo de Engenharia de Requisitos (RAD)**

| **Fases do Processo**       | **Atividades ER**                     | **Prática**                                      | **Técnica**                                           | **Resultado Esperado**                                                    |
|-----------------------------|-------------------------------------|-------------------------------------------------|-------------------------------------------------------|---------------------------------------------------------------------------|
| **Planejamento Inicial**     | Elicitação Inicial de Requisitos    | Reuniões rápidas com stakeholders, workshops    | Brainstorming, Entrevistas estruturadas, Análise Doc. | Identificação preliminar das funcionalidades principais e escopo geral   |
| **Protótipo Inicial**        | Levantamento de requisitos para protótipo | Ciclos curtos de iteração com os usuários      | Prototipagem de baixa fidelidade, Storyboards          | Protótipo inicial baseado nos requisitos essenciais definidos rapidamente |
| **Feedback Rápido**          | Validação dos requisitos prototipados | Sessões de feedback com o cliente               | Apresentação de protótipos, Validação com critérios    | Requisitos ajustados com base no retorno imediato do usuário              |
| **Refinamento Contínuo**     | Atualização de requisitos com feedback | Refinamento incremental e iterativo             | User Stories, RF*Número*, Workshops de refinamento     | Requisitos claros, completos e alinhados com a real necessidade do cliente|
| **Priorização Dinâmica**     | Priorização de funcionalidades em tempo real | Discussões frequentes com cliente e equipe     | Técnica MoSCoW, Planning Game                           | Foco nas funcionalidades com maior valor percebido pelo cliente          |
| **Verificação e Validação**  | Validação rápida e contínua dos requisitos | Revisões constantes entre entregas e feedbacks | Definition of Done (DoD), Revisão por pares e cliente  | Garantia que requisitos atendem expectativas antes da entrega final       |
| **Organização Iterativa**    | Organização dos requisitos por ciclos | Revisão e reclassificação frequente do backlog  | Backlog Dinâmico, Story Mapping                         | Requisitos organizados conforme prioridades evoluem durante o desenvolvimento |
| **Entrega Incremental**      | Declaração final dos requisitos implementados | Validação incremental em cada entrega parcial   | Critérios de Aceitação, DoR/DoD                         | Funcionalidades validadas e aprovadas ao final de cada ciclo RAD          |
| **Encerramento**             | Requisitos consolidados e documentados | Reuniões de finalização, análise retroativa     | Documentação final com base em User Stories e protótipos validados | Base formalizada refletindo o produto final                              |


??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |21/05/2025| 1.0 | Criação do documento de DoR e DoD | Gabriel Soares | Leonardo Sauma|