# Backlog do Produto
O backlog do produto é uma lista priorizada e evolutiva de funcionalidades, melhorias, correções e outras entregas necessárias para atingir os objetivos do sistema. Ele representa tudo aquilo que precisa ser desenvolvido ao longo do projeto e serve como principal fonte de trabalho da equipe de desenvolvimento. Cada item do backlog — como histórias de usuário, tarefas técnicas ou épicos — deve estar descrito de forma clara e alinhada com as necessidades do cliente. O backlog é constantemente refinado e reorganizado, acompanhando a evolução do projeto, o feedback dos stakeholders e mudanças de prioridade.

!!! info "Importante"
    Ressalta-se que as histórias de usuário descritas a seguir foram construídas com base na lista de requisitos funcionais previamente apresentada neste documento. Esta composição representa uma versão preliminar, passível de revisões e aprimoramentos contínuos ao longo do processo de desenvolvimento do Touristeer.


## Backlog Geral
**US01** - Como usuário, quero criar rotas turísticas escolhendo até 5 pontos turísticos e adicionando à essa rota. <br>
**US02** - Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos. <br>
**US03** - Como usuário, quero consultar rotas turísticas e ver informações como: nome da rota, distância, pontos turísticos escolhidos. <br>
**US04** - Como usuário, quero visualizar a rota turística que eu escolher ver em um mapa. <br>
**US05** - Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas. <br>
**US06** - Como administrador, quero criar um ponto turístico para fique há disposição dos usuários para incluírem em uma rota turística, além dos pontos turísticos mais conhecidos. <br>
**US07** - Como administrador, quero atualizar um ponto turístico para modificar suas informações. <br>
**US08a** - Como administrador, quero consultar os pontos turísticos cadastrados para um fácil acesso para possíveis manutenções. <br>
**US08b** - Como usuário, quero consultar os pontos turísticos para saber mais informações sobre para possivelmente adicioná-lo em alguma rota turística. <br>
**US09** - Como administrador, quero excluir pontos turísticos que não achar mais adequados. <br>
**US10** - Como usuário, quero decidir uma data e horário de início para minha rota turística. <br>
**US11** - Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback. <br>
**US12** - Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo. <br>
**US13** - Como usuário, quero atualizar informações de grupos de viajantes. <br>
**US14** - Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário. <br>
**US15** - Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos. <br>
**US16** - Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada. <br>
**US17** - Como usuário, quero receber notificações automáticas por e-mail 15 minutos antes do início agendado de uma rota turística, para me preparar adequadamente para o passeio. <br>
**US18** - Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada. <br>
**US19** - Como usuário, quero que o sistema acesse minha localização atual via navegador, para que eu consiga ver os pontos turísticos mais próximos a mim. <br>
**US20** - Como usuário, quero filtrar rotas turísticas por distância, para visualizar apenas aquelas que estejam dentro do meu alcance de deslocamento. <br>
**US21** - Como usuário, quero salvar rotas turísticas em PDF, para consultá-las posteriormente, mesmo sem conexão com a internet. <br>
**US22** - Como usuário, quero compartilhar rotas turísticas por e-mail, a fim de enviar sugestões de passeios para amigos ou grupos de viagem. <br>
**US23** - Como usuário, quero alterar o idioma da aplicação a qualquer momento, para utilizá-la no idioma de minha preferência. <br>
**US24** - Como usuário, quero utilizar um conversor de moedas com seleção de moeda de origem e destino, para não ser pego de surpresa com conversões após os gastos. <br>

## Priorização do Backlog
Empregamos a técnica MoSCoW nesta etapa para estabelecer a importância de cada elemento do backlog, dividindo as funcionalidades em quatro grupos primordiais: <br>
➤ **Must have**: Recursos indispensáveis para o funcionamento do produto, com entrega obrigatória. <br>
➤ **Should have**: Funcionalidades relevantes, cuja implementação pode ocorrer depois das essenciais. <br>
➤ **Could have**: Recursos que valorizam o produto, mas não são prioridade nesta fase inicial. <br>
➤ **Won't have**: Funcionalidades que não serão incluídas agora, com possível consideração no futuro. <br>

A priorização buscou assegurar que o desenvolvimento se concentre nas funcionalidades mais cruciais, harmonizando o produto com as demandas do negócio e os recursos existentes. A tabela especifica a classificação de cada item do backlog, oferecendo transparência e estrutura para as fases seguintes do projeto.

| ID    | Descrição                                                                         | Prioridade  | MVP |
|-------|-----------------------------------------------------------------------------------|-------------|-----|
| US01  | Criar rotas turísticas                                                        | Must Have   |  X  |
| US02  | Atualizar rotas turísticas                                                        | Must Have   |  X  |
| US03  | Consultar rotas turísticas                                                        | Must have   |  X  |
| US04  | Exibir rotas turísticas no mapa                                                   | Must have   |  X  |
| US05  | Excluir rotas turísticas                                                          | Should have |     |
| US06  | Cadastrar pontos turísticos                                                       | Could have |     |
| US07  | Atualizar pontos turísticos                                                       | Could have |     |
| US08  | Consultar pontos turísticos                                                       | Must have |  X  |
| US09  | Excluir pontos turísticos                                                         | Could have |     |
| US10  | Agendar início de rota turística                                                  | Could have   |    |
| US11  | Avaliar rota turística                                                            | Could have  |     |
| US12  | Cadastrar grupos de viajantes                                                     | Should have |     |
| US13  | Atualizar grupos de viajantes                                                     | Should have |     |
| US14  | Excluir grupos de viajantes                                                       | Should have |     |
| US15  | Convidar para grupos de viajantes                                                 | Should have |     |
| US16  | Sair de grupos de viajantes                                                       | Should have |     |
| US17  | Enviar notificações de início de rota turística                                   | Should have   |   |
| US18  | Adicionar grupo de viajante à rotas turísticas                                    | Should have |     |
| US19  | Obter localização atual                                                           | Must have   |  X  |
| US20  | Filtrar rotas turísticas por distância                                            | Must have |  X  |
| US21  | Salvar rotas turísticas em PDF                                                    | Must have   |  X  |
| US22  | Compartilhar rotas turísticas por e-mail                                          | Could have  |     |
| US23  | Mudar idioma durante a execução da aplicação                                      | Should have |     |
| US24  | Exibir um conversor de moedas funcional, informando a moeda origem e destino      | Won't have  |     |

## Épicos do Projeto 

### Épico: Gerenciamento de Rotas Turísticas

| Feature                  | História de Usuário                                                                                                                                     | Tasks                                                                                     |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| CRUD de Rotas            | Como usuário, quero criar rotas turísticas escolhendo até 5 pontos turísticos e adicionando à essa rota.                                             | - Criar formulário de cadastro<br>- Implementar limite de 5 pontos<br>- Validar entradas |
| CRUD de Rotas            | Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos.                                                     | - Criar interface de edição                    |
| CRUD de Rotas            | Como usuário, quero consultar rotas turísticas e ver informações como: nome da rota, distância, pontos turísticos escolhidos.                                  | - Criar listagem de rotas<br>- Mostrar detalhes de cada rota                            |
| CRUD de Rotas            |Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas.                                                                      | - Implementar botão de exclusão<br>- Criar lógica de confirmação                         |
| Visualização no Mapa     | Como usuário, quero visualizar a rota turística que eu escolher ver em um mapa.                                                                   | - Integrar API de mapa<br>- Plotar pontos no mapa<br>- Garantir carregamento em até 10s   |
| Agendamento de Rota      | Como usuário, quero decidir uma data e horário de início para minha rota turística.                                                                                | - Criar formulário de agendamento<br>- Salvar data/hora no backend                       |
| Avaliação de Rota        | Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback.                                                                   | - Criar componente de estrelas<br>- Armazenar avaliação no backend                       |

---

### Épico: Gerenciamento de Pontos Turísticos

| Feature                  | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CRUD de Pontos Turísticos| Como administrador, quero criar um ponto turístico para fique há disposição dos usuários para incluírem em uma rota turística, além dos pontos turísticos mais conhecidos.                              | - Criar formulário de cadastro<br>- Validar e salvar informações       |
| CRUD de Pontos Turísticos| Como administrador, quero atualizar um ponto turístico para modificar suas informações.                                    | - Criar tela de edição<br>- Atualizar no banco de dados                |
| CRUD de Pontos Turísticos| Como administrador, quero consultar os pontos turísticos cadastrados para um fácil acesso para possíveis manutenções.              |
| CRUD de Pontos Turísticos| Como usuário, quero consultar os pontos turísticos para saber mais informações sobre para possivelmente adicioná-lo em alguma rota turística.             |
| CRUD de Pontos Turísticos| Como administrador, quero excluir pontos turísticos que não achar mais adequados.                |

---

### Épico: Grupos de Viajantes

| Feature              | História de Usuário                                                                                   | Tasks                                                                         |
|----------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Gestão de Grupos     | Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo.                      | - Criar formulário de criação<br>- Salvar grupo no banco                     |
| Gestão de Grupos     | Como usuário, quero atualizar informações de grupos de viajantes.                                                         | - Criar tela de edição<br>- Atualizar backend                                |
| Gestão de Grupos     | Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário.                                                       | - Criar ação de exclusão<br>- Confirmar e remover grupo                      |
| Convites             | Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos.                                        | - Criar envio de convite por e-mail ou link<br>- Validar aceite              |
| Saída de Grupo       | Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada.                                          | - Implementar opção \"Sair do grupo\"<br>- Remover usuário do grupo          |
| Grupo em Rota        |Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada.                  | - Vincular grupo à rota<br>- Exibir relação na interface                     |

---

### Épico: Notificações

| Feature                | História de Usuário                                                                                         | Tasks                                                                         |
|------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Lembrete de Rota       | Como usuário, quero receber notificações automáticas por e-mail 15 minutos antes do início agendado de uma rota turística, para me preparar adequadamente para o passeio.              | - Agendar trigger para 15 minutos antes<br>- Enviar e-mail automático        |

---

### Épico: Personalização e Acessibilidade

| Feature            | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Idioma             | Como usuário, quero alterar o idioma da aplicação a qualquer momento, para utilizá-la no idioma de minha preferência.                             | - Criar seleção de idioma<br>- Traduzir interface (PT e EN)            |
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
| Filtrar Rotas        | Como usuário, quero filtrar rotas turísticas por distância, para visualizar apenas aquelas que estejam dentro do meu alcance de deslocamento.                                                        | - Criar campo de filtro por distância<br>- Aplicar lógica de filtro    |
| Localização Atual    |  Como usuário, quero que o sistema acesse minha localização atual via navegador, para que eu consiga ver os pontos turísticos mais próximos a mim.                                                     | - Solicitar permissão do navegador<br>- Usar API de geolocalização     |

---

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do backlog | Leonardo Sauma | Gabriel Soares e Gustavo Gontijo|
    |26/05/2025| 2.0 | Atualização do Backlog | Mylena Mendonça | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|
    |26/05/2025| 2.1 | Atualização do Backlog | Leonardo Sauma | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|