# Backlog do Produto
O backlog do produto é uma lista priorizada e evolutiva de funcionalidades, melhorias, correções e outras entregas necessárias para atingir os objetivos do sistema. Ele representa tudo aquilo que precisa ser desenvolvido ao longo do projeto e serve como principal fonte de trabalho da equipe de desenvolvimento. Cada item do backlog — como histórias de usuário, tarefas técnicas ou épicos — deve estar descrito de forma clara e alinhada com as necessidades do cliente. O backlog é constantemente refinado e reorganizado, acompanhando a evolução do projeto, o feedback dos stakeholders e mudanças de prioridade.

!!! info "Importante"
    Ressalta-se que as histórias de usuário descritas a seguir foram construídas com base na lista de requisitos funcionais previamente apresentada neste documento. Esta composição representa uma versão preliminar, passível de revisões e aprimoramentos contínuos ao longo do processo de desenvolvimento do Touristeer.


## Backlog Geral
**US01** - Como usuário, quero criar rotas turísticas e agendar seu horário de início. <br>
**US02** - Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos. <br>
**US03** - Como usuário, quero consultar **rotas turísticas** e ver suas informações, além de filtrar por distância, para visualizar apenas aquelas que estejam dentro do meu alcance de deslocamento. <br>
**US04** - Como usuário, quero visualizar a rota turística que eu escolher ver em um mapa. <br>
**US05** - Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas. <br>
**US06** - Como administrador, quero criar um ponto turístico. <br>
**US07** - Como administrador, quero atualizar um ponto turístico para modificar suas informações. <br>
**US08** - Como usuário, quero consultar os **pontos turísticos** para saber mais informações para possivelmente adicioná-lo em alguma rota turística. <br>
**US09** - Como administrador, quero excluir pontos turísticos que não achar mais adequados. <br>
**US10** - Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback. <br>
**US11** - Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo. <br>
**US12** - Como usuário, quero atualizar informações de grupos de viajantes, caso haja alguma mudança no grupo durante a viagem. <br>
**US13** - Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário. <br>
**US14** - Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos. <br>
**US15** - Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada. <br>
**US16** - Como usuário, quero receber notificações por e-mail antes do início agendado de uma rota turística. <br>
**US17** - Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada. <br>
**US18** - Como usuário, quero visualizar minha localização em tempo real. <br>
**US19** - Como usuário, quero salvar rotas turísticas em PDF, para consultá-las posteriormente, mesmo sem conexão com a internet. <br>
**US20** - Como usuário, quero compartilhar rotas turísticas por e-mail, a fim de enviar sugestões de passeios para amigos ou grupos de viagem. <br>
**US21** - Como usuário, quero utilizar um conversor de moedas com seleção de moeda de origem e destino, para não ser pego de surpresa com conversões após os gastos. <br>

## Priorização do Backlog
**MoSCoW**

Empregamos a técnica MoSCoW nesta etapa para estabelecer a importância de cada elemento do backlog, dividindo as funcionalidades em quatro grupos primordiais: <br>
➤ **Must have**: Recursos indispensáveis para o funcionamento do produto, com entrega obrigatória. <br>
➤ **Should have**: Funcionalidades relevantes, cuja implementação pode ocorrer depois das essenciais. <br>
➤ **Could have**: Recursos que valorizam o produto, mas não são prioridade nesta fase inicial. <br>
➤ **Won't have**: Funcionalidades que não serão incluídas agora, com possível consideração no futuro. <br>

**WSJF**

Além disso, também utilizamos a técnica WSJF para priorizar os elementos do backlog de acordo com a relação entre o valor entregue pela funcionalidade e o esforço para implementá-la.

Fatores avaliados:
- Valor do Negócio: Utilizamos como valor de negócio, pesos atribuídos às classificações na técnica MoSCoW, sendo peso 4 para funcionalidades "Must Have" e peso 1 para funcionalidades "Won't Have"
- Urgência: Escala de urgência de entrega da funcionalidade (1 a 5)
- Redução de Risco: Escala do quanto a funcionalidade ajuda a reduzir riscos sendo peso 1 para o mais arriscado e peso 5 para o menos arriscado
- Tamanho do Trabalho: Quanto tempo (dias) para concluir a tarefa

Fórmula:

WSJF = (Valor do Negócio + Urgência + Redução de Risco) / Tamanho do Trabalho
<br><br>
A priorização buscou assegurar que o desenvolvimento se concentre nas funcionalidades mais cruciais, harmonizando o produto com as demandas do negócio e os recursos existentes. A tabela especifica a classificação de cada item do backlog, oferecendo transparência e estrutura para as fases seguintes do projeto.

| ID    | Descrição                                                                         | Prioridade  | WSJF | MVP | Requisito |
|-------|-----------------------------------------------------------------------------------|-------------|-----|-----|-----|
| US01  | Criar rotas turísticas                                                        | Must Have   | 4 | **X** | RF01 |
| US02  | Atualizar rotas turísticas                                                        | Must Have   | 14 | **X** | RF02 |
| US03  | Consultar rotas turísticas                                                        | Must have   | 7 | **X** | RF03 |
| US04  | Exibir rotas turísticas no mapa                                                   | Must have   | 7 |X  | RF04 |
| US05  | Excluir rotas turísticas                                                          | Should have | 12 |    | RF05 |
| US06  | Cadastrar pontos turísticos                                                       | Could have | 2 |     | RF06 | 
| US07  | Atualizar pontos turísticos                                                       | Could have | 5 |    | RF07 |
| US08  | Consultar pontos turísticos                                                       | Must have | 7 | **X** | RF08 |
| US09  | Excluir pontos turísticos                                                         | Could have | 9 |     | RF09 |
| US10  | Avaliar rota turística                                                            | Could have  | 5 |     | RF10 |
| US11  | Cadastrar grupos de viajantes                                                     | Should have | 5 |     | RF11 |
| US12  | Atualizar grupos de viajantes                                                     | Should have | 9 |     | RF12 |
| US13  | Excluir grupos de viajantes                                                       | Should have | 9 |     | RF13 |
| US14  | Convidar para grupos de viajantes                                                 | Should have | 5 |     | RF14 |
| US15  | Sair de grupos de viajantes                                                       | Should have | 9 |     | RF15 |
| US16  | Enviar notificações de início de rota turística                                   | Should have   | 4 |   | RF16 |
| US17  | Adicionar grupo de viajante à rotas turísticas                                    | Should have | 5 |     | RF17 |
| US18  | Obter localização atual                                                           | Must have   | 7 | **X** | RF18 |
| US19  | Salvar rotas turísticas em PDF                                                    | Must have   | 7 | **X** | RF19 |
| US20  | Compartilhar rotas turísticas por e-mail                                          | Could have  | 8 |     | RF20 |
| US21  | Exibir um conversor de moedas funcional, informando a moeda origem e destino      | Won't have  | 4 |     | RF21 |

## Épicos do Projeto 

### Épico: Gerenciamento de Rotas Turísticas

| Feature                  | História de Usuário                                                                                                                                     | Tasks                                                                                     |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| CRUD de Rotas            | Como usuário, quero criar rotas turísticas e agendar seu horário de início.                                            | - Criar formulário de cadastro<br>- Validar entradas |
| CRUD de Rotas            | Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos.                                                     | - Criar interface de edição                    |
| CRUD de Rotas            | Como usuário, quero consultar **rotas turísticas** e ver informações como: nome da rota, distância, pontos turísticos escolhidos.                                  | - Criar listagem de rotas<br>- Mostrar detalhes de cada rota                            |
| CRUD de Rotas            |Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas.                                                                      | - Implementar botão de exclusão<br>- Criar lógica de confirmação                         |
| Visualização no Mapa     | Como usuário, quero visualizar a rota turística que eu escolher ver em um mapa.                                                                   | - Integrar API de mapa<br>- Plotar pontos no mapa<br>- Garantir carregamento em até 10s   |
| Agendamento de Rota      | Como usuário, quero decidir uma data e horário de início para minha rota turística.                                                                                | - Criar formulário de agendamento<br>- Salvar data/hora no backend                       |
| Avaliação de Rota        | Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback.                                                                   | - Criar componente de estrelas<br>- Armazenar avaliação no backend                       |

---

### Épico: Gerenciamento de Pontos Turísticos

| Feature                  | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CRUD de Pontos Turísticos| Como administrador, quero criar um ponto turístico.                              | - Criar formulário de cadastro<br>- Validar e salvar informações       |
| CRUD de Pontos Turísticos| Como administrador, quero atualizar um ponto turístico para modificar suas informações.                                    | - Criar tela de edição<br>- Atualizar no banco de dados                |
| CRUD de Pontos Turísticos| Como administrador, quero consultar os pontos turísticos cadastrados para um fácil acesso para possíveis manutenções.              |
| CRUD de Pontos Turísticos| Como usuário, quero consultar os **pontos turísticos** para saber mais informações para possivelmente adicioná-lo em alguma rota turística.             |
| CRUD de Pontos Turísticos| Como administrador, quero excluir pontos turísticos que não achar mais adequados.                |

---

### Épico: Grupos de Viajantes

| Feature              | História de Usuário                                                                                   | Tasks                                                                         |
|----------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Gestão de Grupos     | Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo.                      | - Criar formulário de criação<br>- Salvar grupo no banco                     |
| Gestão de Grupos     | Como usuário, quero atualizar informações de grupos de viajantes, caso haja alguma mudança no grupo durante a viagem.                                                         | - Criar tela de edição<br>- Atualizar backend                                |
| Gestão de Grupos     | Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário.                                                       | - Criar ação de exclusão<br>- Confirmar e remover grupo                      |
| Convites             | Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos.                                        | - Criar envio de convite por e-mail ou link<br>- Validar aceite              |
| Saída de Grupo       | Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada.                                          | - Implementar opção \"Sair do grupo\"<br>- Remover usuário do grupo          |
| Grupo em Rota        |Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada.                  | - Vincular grupo à rota<br>- Exibir relação na interface                     |

---

### Épico: Notificações

| Feature                | História de Usuário                                                                                         | Tasks                                                                         |
|------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Lembrete de Rota       | Como usuário, quero receber notificações por e-mail antes do início agendado de uma rota turística.              | - Agendar trigger para 15 minutos antes<br>- Enviar e-mail automático        |

---

### Épico: Personalização e Acessibilidade

| Feature            | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Conversor de Moedas| Como usuário, quero utilizar um conversor de moedas com seleção de moeda de origem e destino, para não ser pego de surpresa com conversões após os gastos.                          | - Criar interface do conversor<br>- Usar API de cotação de moedas      |

---

### Épico: Compartilhamento e Exportação

| Feature                 | História de Usuário                                                                                         | Tasks                                                                 |
|-------------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Exportar PDF            | Como usuário, quero salvar rotas turísticas em PDF, para consultá-las posteriormente, mesmo sem conexão com a internet.                                         | - Gerar PDF com dados da rota<br>- Adicionar botão de download        |
| Compartilhar por E-mail | Como usuário, quero compartilhar rotas turísticas por e-mail, a fim de enviar sugestões de passeios para amigos ou grupos de viagem.                                               | - Criar formulário de envio<br>- Integrar com serviço de e-mail       |

---

### Épico: Filtragem e Localização

| Feature              | História de Usuário                                                                                      | Tasks                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Filtrar Rotas        | Como usuário, quero consultar **rotas turísticas** e ver suas informações, além de filtrar por distância, para visualizar apenas aquelas que estejam dentro do meu alcance de deslocamento.                                                        | - Criar campo de filtro por distância<br>- Aplicar lógica de filtro    |
| Localização Atual    |  Como usuário, quero visualizar minha localização em tempo real.                                                     | - Solicitar permissão do navegador<br>- Usar API de geolocalização     |

---

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do backlog | Leonardo Sauma | Gabriel Soares e Gustavo Gontijo|
    |26/05/2025| 2.0 | Atualização do Backlog | Mylena Mendonça | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|
    |26/05/2025| 2.1 | Atualização do Backlog | Leonardo Sauma | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|