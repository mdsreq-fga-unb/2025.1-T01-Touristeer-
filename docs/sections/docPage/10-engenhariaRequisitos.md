## 1. Elicitação e Descoberta

**Análise Documental**: Utilizar para revisar documentos existentes que fornecem informações sobre o domínio do problema, requisitos anteriores ou projetos similares, a fim de identificar necessidades e soluções já propostas.

**Entrevista**: Realizar para obter informações diretamente dos stakeholders, identificando necessidades, expectativas e limitações iniciais para o produto, com perguntas estruturadas e semi-estruturadas para capturar dados relevantes.

**Prompt de IA**: A equipe utilizou também prompts de Inteligência Artificial (IA) como uma ferramenta complementar para enriquecer o processo de levantamento de requisitos


## 2. Análise e Consenso

**Priorização**: Utilzou-se o método MoSCoW para classificar os requisitos conforme sua importância e urgência, garantindo que as funcionalidades mais críticas sejam tratadas primeiro.

**Análise de Viabilidade**: Realizar para avaliar a viabilidade técnica e econômica das funcionalidades propostas, garantindo que o MVP esteja de acordo com os recursos disponíveis atualmente.

**Reuniões de Alinhamento**: Conduzir reuniões de alinhamento para assegurar que todos os envolvidos no projeto tenham uma compreensão comum dos requisitos e das expectativas.


## 3. Representação

**Protótipos de Baixa Fidelidade**: A criação de protótipos de baixa fidelidade tem o objetivo de realizar esboços de fluxos de navegação e a estrutura geral da aplicação. Como objetivo, é esperado obter um mapa de fluxos e estruturação de páginas, ambos aprovados pelo clientes. Essa etapa pode ser realizada pelo Figma, Miro ou Photoshop, visando uma rápida criação e amostragem.

**Protótipos de Alta Fidelidade**: A criação dos protótipos de alta fidelidade tem o objetivo de produzir e validar os designs, layouts, tipografia e cores com o cliente, além da validação de grandes funcionalidades, garantindo que as funcionalidades sejam desenvolvidas conforme o esperado e minimizando a necessidade de retrabalho.


## 4. Declaração de Requisitos

**Critérios de Aceitação**: São definidos critérios que servirão de base para definir ser um requisito ou user story possui as características necessárias para ser considerado aceito e poder ser desenvolvido.

**User Stories**: Optou-se por utilizar User Stories como forma principal de declaração dos requisitos funcionais, por se tratar de uma técnica ágil, centrada no usuário, que favorece a comunicação entre desenvolvedores e stakeholders


## 5. Verificação e Validação de Requisitos

**Revisão por Pares**: Aplicar como estratégia de verificação dos requisitos, permitindo identificar inconsistências, omissões ou ambiguidades por meio da análise colaborativa entre membros da equipe.

**Checklists:** Auxílio na validação da completude, clareza e coerência de cada requisito, contribuindo para a garantia da qualidade no processo, com auxílio de membros da equipe e de outras equipes.

**DoR - Definition of Ready**: Conjunto de critérios que um requisito precisa atender antes de ser considerado pronto para desenvolvimento.

**DoD - Definition of Done**: Critérios de validação para garantir que a implementação de um requisito estivesse completa e em conformidade com os objetivos definidos.

**Feedback do Cliente**: O cliente possui espaço ativo para avaliar as entregas realizadas, fornecendo comentários e sugestões. Esse retorno é fundamental para identificar possíveis ajustes ou correções nas funcionalidades, assegurando que os requisitos estejam plenamente atendidos antes da validação final.


## 6. Organização e Atualização de Requisitos 

**Backlog de Requisitos**: Requisitos organizados em forma de lista contendo código sequencial e visão da funcionalidade do ponto de vista de usuário, seguindo o formato de *user stories*

**Rastreabilidade de Requisitos**: Foi elaborada a declaração de requisitos no formato de códigos sequenciais (**RF**X) onde "RF" significa "Requisito Funcional" e "X" representa o número do requisito.  Esse formato atribui um identificador único para cada requisito e facilita a referência cruzada com testes, protótipos e funcionalidades implementadas.

**MoSCoW**: Os requisitos são organizados e atualizados por meio de uma tabela detalhada contendo colunas com informações como: <br>
    - **ID:** código sequencial único do requisito <br>
    - **Descrição:** texto explicativo sobre o requisito; <br>
    - **Prioridade:** nível de prioridade atribuído de acordo com o método MoSCoW (Must Have, Should Have, Could Have, Won't Have); <br>
    - **MVP(Sim/Não):** define se um requisito está ou não incluído no MVP. <br>

## **Processo de Engenharia de Requisitos (RAD)**

|**Fase do Processo**| **Atividades ER** | **Prática** | **Técnica** | **Resultado Esperado** |
|----------------|---------------|---------|---------|--------------------|
| **Planejamento de requisitos** | **Elicitação e descoberta** | Levantamento de Requisitos | Análise Documental, Entrevista e Prompt de IA. | Identificar os requisitos de alto nível do projeto. |
|| **Análise e Consenso** | Refinamento de Requisitos | Priorização, Análise de Viabilidade e Reuniões de Alinhamento. | Lista de requisitos bem definidos e a definição da prioridade dos requisitos. |
|| **Declaração**  | Registro de Requisitos | Critérios de Aceitação, User Stories, Rastrabilidade de Requisitos. | Estabelecer os requisitos; Estabelecer user stories que descrevem funcionalidades do projeto. |
|| **Organização e Atualização**| Ordenar os requisitos por prioridade | Backlog de Requisitos, Priorização do Backlog e Rastreabilidade de requisitos. | Lista de requisitos organizada com grau de prioridade. |
|| **Verificação e Validação de Requisitos** | Verificar e validar os requisitos levantados | Revisão por Pares, Checklists, Feedback do Cliente. | Revisar e alinhar com o cliente sobre os requisitos levantados. |
| **User Design** | **Representação** | Elaboração de protótipos |  Protótipos de Baixa Fidelidade e Protótipos de Alta Fidelidade. | Design validado com o cliente. |
|| **Verificação e Validação** | Validação dos Requisitos | Feedback do Cliente | Confirmação de que cada requisito foi implementado conforme especificado e atende às necessidades dos usuários. |
| **Construção** | **Verificação e Validação** | Revisão por Pares; Testes de Aceitação | Critérios de Aceitação definidos; Integração Contínua; | Cada funcionalidade validada contra requisitos e sem regressões antes de avançar para produção |
| **Cutover (Implementação Final)** |-|-|-|-


??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |21/05/2025| 1.0 | Criação do documento de DoR e DoD | Gabriel Soares | Leonardo Sauma|