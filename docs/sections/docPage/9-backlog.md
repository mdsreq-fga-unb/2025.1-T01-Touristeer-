# Backlog do Produto
O backlog do produto é uma lista priorizada e evolutiva de funcionalidades, melhorias, correções e outras entregas necessárias para atingir os objetivos do sistema. Ele representa tudo aquilo que precisa ser desenvolvido ao longo do projeto e serve como principal fonte de trabalho da equipe de desenvolvimento. Cada item do backlog — como histórias de usuário, tarefas técnicas ou épicos — deve estar descrito de forma clara e alinhada com as necessidades do cliente. O backlog é constantemente refinado e reorganizado, acompanhando a evolução do projeto, o feedback dos stakeholders e mudanças de prioridade.

!!! info "Importante"
    Ressalta-se que as histórias de usuário descritas a seguir foram construídas com base na lista de requisitos funcionais previamente apresentada neste documento. Esta composição representa uma versão preliminar, passível de revisões e aprimoramentos contínuos ao longo do processo de desenvolvimento do Touristeer.


## Backlog Geral
**US01** - Como usuário, quero criar rotas turísticas e agendar seu horário de início, para otimizar meu planejamento de visitas. <br>
**US02** - Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos. <br>
**US03** - Como usuário, quero consultar rotas turísticas, filtrar por distância para ver apenas as que estão ao meu alcance, e visualizar a rota selecionada em um mapa com todas as suas informações. <br>
**US04** - Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas. <br>
**US05** - Como administrador, quero cadastrar novos pontos turísticos, para ampliar o portfólio de destinos. <br>
**US06** - Como administrador, quero atualizar um ponto turístico para modificar suas informações. <br>
**US07** - Como usuário, quero consultar os pontos turísticos para saber mais informações para possivelmente adicioná-lo em alguma rota turística. <br>
**US08** - Como administrador, quero excluir pontos turísticos que não achar mais adequa0dos. <br>
**US09** - Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback. <br>
**US10** - Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo. <br>
**US11** - Como usuário, quero atualizar informações de grupos de viajantes, caso haja alguma mudança no grupo durante a viagem. <br>
**US12** - Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário. <br>
**US13** - Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos. <br>
**US14** - Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada. <br>
**US15** - Como usuário, quero receber notificações por e-mail antes do início agendado de uma rota turística. <br>
**US16** - Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada. <br>
**US17** - Como usuário, quero visualizar minha localização em tempo real. <br>
**US18** - Como usuário, quero salvar rotas turísticas em PDF, para consultá-las posteriormente, mesmo sem conexão com a internet. <br>
**US19** - Como usuário, quero compartilhar rotas turísticas por e-mail, a fim de enviar sugestões de passeios para amigos ou grupos de viagem. <br>
**US20** - Como usuário, quero utilizar um conversor de moedas com seleção de moeda de origem e destino, para não ser pego de surpresa com conversões após os gastos. <br>

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
Para a fórmula, nós aplicamos um peso maior para o valor de negócio e para a urgência (os dois receberam peso 5), sendo assim, a nota de corte para uma US entrar no MVP é **17**.

WSJF = (5 * Valor do Negócio + 5 * Urgência + Redução de Risco) / Tamanho do Trabalho
<br><br>
A priorização buscou assegurar que o desenvolvimento se concentre nas funcionalidades mais cruciais, harmonizando o produto com as demandas do negócio e os recursos existentes. A tabela especifica a classificação de cada item do backlog, oferecendo transparência e estrutura para as fases seguintes do projeto.

| ID    | Descrição                                                                         | Prioridade  | WSJF | MVP | Requisito |
|-------|-----------------------------------------------------------------------------------|-------------|-----|-----|-----|
| US01  | Criar rotas turísticas                                                        | Must Have   | 17 | **X** | RF01 |
| US02  | Atualizar rotas turísticas                                                        | Must Have   | 25 | **X** | RF02 |
| US03  | Consultar rotas turísticas                                                        | Must have   | 50 | **X** | RF03 |
| US04  | Excluir rotas turísticas                                                          | Must have | 45 | **X** | RF04 |
| US05  | Cadastrar pontos turísticos                                                       | Could have | 8 |     | RF05 | 
| US06  | Atualizar pontos turísticos                                                       | Could have | 13 |    | RF06 |
| US07  | Consultar pontos turísticos                                                       | Must have | 23 | **X** | RF07 |
| US08  | Excluir pontos turísticos                                                         | Could have | 13 |     | RF08 |
| US09 | Avaliar rota turística                                                            | Could have  | 13 |     | RF09 |
| US10  | Cadastrar grupos de viajantes                                                     | Should have | 13 |     | RF10 |
| US11  | Atualizar grupos de viajantes                                                     | Should have | 13 |     | RF11 |
| US12  | Excluir grupos de viajantes                                                       | Should have | 13 |     | RF12 |
| US13  | Convidar para grupos de viajantes                                                 | Should have | 13 |     | RF13 |
| US14  | Sair de grupos de viajantes                                                       | Should have | 13 |     | RF14 |
| US15  | Enviar notificações de início de rota turística                                   | Should have   | 15 |   | RF15 |
| US16  | Adicionar grupo de viajante à rotas turísticas                                    | Should have | 13 |     | RF16 |
| US17  | Obter localização atual                                                           | Must have   | 25 | **X** | RF17 |
| US18  | Salvar rotas turísticas em PDF                                                    | Must have   | 25 | **X** | RF18 |
| US19  | Compartilhar rotas turísticas por e-mail                                          | Could have  | 13 |     | RF19 |
| US20  | Exibir um conversor de moedas funcional, informando a moeda origem e destino      | Won't have  | 8 |     | RF20 |

## Critérios de Aceitação

| ID    | História de Usuário                                                                         | Critério de Aceitação  |
|-------|-----------------------------------------------------------------------------------|-
| US01  | Como usuário, quero criar rotas turísticas e agendar seu horário de início, para otimizar meu planejamento de visitas. | - O usuário deve poder acessar uma opção "Criar Nova Rota" a partir de um menu principal ou painel de controle. <br> - Na tela de criação, deve haver campos para inserir um nome para a rota e para selecionar uma data e hora de início. <br> - O usuário deve poder pesquisar e adicionar pelo menos um ponto turístico existente à rota. <br> - O sistema deve impedir a criação de uma rota sem nome ou sem pelo menos um ponto turístico. <br> - A data de início agendada não pode ser uma data ou hora que já passou.|
| US02  | Como usuário, quero atualizar rotas turísticas para poder alterar informações sobre essa rota ou modificar os pontos turísticos.                                                    | - O usuário deve poder selecionar uma de suas rotas existentes para edição. <br> - O usuário deve poder alterar o nome e a data/hora de início da rota.<br> - O usuário deve poder adicionar novos pontos turísticos à rota. <br> - O usuário deve poder remover pontos turísticos existentes da rota.   |
| US03  | Como usuário, quero consultar rotas turísticas, filtrar por distância para ver apenas as que estão ao meu alcance, e visualizar a rota selecionada em um mapa com todas as suas informações. | - O sistema deve exibir uma lista de rotas turísticas disponíveis. <br> - Deve haver uma opção de filtro visível (ex: slider, menu dropdown) para selecionar um raio de distância máximo (ex: "até 5 km", "até 10 km"). <br> - A lista de rotas deve ser atualizada automaticamente para mostrar apenas as rotas cujo ponto de partida está dentro da distância selecionada a partir da localização atual do usuário. <br> - Ao selecionar uma rota da lista, o usuário deve ser levado a uma tela de detalhes.   |
| US04  | Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas. | - Na lista "Minhas Rotas", cada rota deve ter uma opção para exclusão (ex: um ícone de lixeira ou um botão "Excluir"). <br> - O usuário só pode excluir rotas que ele mesmo criou. <br> - Ao clicar para excluir, o sistema deve exibir uma mensagem de confirmação (ex: "Você tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita."). <br> - Se o usuário confirmar, a rota deve ser permanentemente removida do sistema. |
| US05  | Como administrador, quero cadastrar novos pontos turísticos, para ampliar o portfólio de destinos.                                                       | - Um usuário com perfil de "Administrador" deve ter acesso a um painel de gerenciamento de pontos turísticos. <br> - O formulário de cadastro deve conter campos obrigatórios como: Nome, Endereço/Coordenadas, Descrição e Categoria. <br> - O formulário deve conter campos opcionais como: Horário de funcionamento, Preço do ingresso, website e imagem. <br> - O sistema deve validar que os campos obrigatórios foram preenchidos antes de salvar. | 
| US06  | Como administrador, quero atualizar um ponto turístico para modificar suas informações. | - O administrador deve poder pesquisar e selecionar um ponto turístico existente para editar. <br> - Todos os campos preenchidos durante o cadastro devem estar disponíveis para edição. <br> - Após salvar, as informações do ponto turístico devem ser atualizadas em todo o sistema, incluindo nas rotas que o utilizam. <br> - O administrador deve receber uma mensagem de confirmação de sucesso.  |
| US07  | Como usuário, quero consultar os pontos turísticos para saber mais informações para possivelmente adicioná-lo em alguma rota turística.                                                       | - O usuário deve poder visualizar uma lista ou mapa com todos os pontos turísticos cadastrados. <br> - Deve haver uma função de busca por nome e filtros por categoria. <br> - Ao selecionar um ponto turístico, uma página de detalhes deve ser exibida com todas as suas informações (descrição, fotos, localização no mapa, horário, etc.). <br> - Na página de detalhes do ponto turístico, deve haver um botão ou funcionalidade clara para "Adicionar a uma Rota".  |
| US08  | Como administrador, quero excluir pontos turísticos que não achar mais adequados.                                                         | - O administrador deve poder pesquisar e selecionar um ponto turístico para exclusão. <br> - O sistema deve exibir uma mensagem de confirmação antes de deletar permanentemente o ponto turístico. <br> - Se o ponto turístico estiver associado a alguma rota de usuário, o sistema deve impedir a exclusão e informar ao administrador em quais rotas ele está sendo utilizado. <br> - Após a exclusão, o ponto turístico não deve mais aparecer nos resultados de busca ou mapas. |
| US09 | Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback. | - Um usuário só pode avaliar uma rota após a data e hora de início agendadas terem passado. <br> - A opção de avaliação deve permitir que o usuário dê uma nota (ex: de 1 a 5 estrelas). <br> - O usuário deve poder escrever um comentário opcional junto com a nota. <br> - A avaliação (nota e comentário) deve ser salva e associada à rota.  |
| US10  | Como usuário, quero criar grupos de viajantes para adicionar as pessoas que estão viajando comigo nesse grupo.                                                     | - O usuário deve ter acesso a uma seção "Grupos" onde pode selecionar a opção "Criar Grupo". <br> - Para criar um grupo, o usuário deve obrigatoriamente fornecer um nome para o grupo. <br> - O usuário que cria o grupo é automaticamente definido como seu proprietário/administrador. <br> - Após a criação, o grupo deve aparecer na lista de grupos do usuário. |
| US11  | Como usuário, quero atualizar informações de grupos de viajantes, caso haja alguma mudança no grupo durante a viagem. | - O proprietário do grupo deve poder editar o nome do grupo. <br> - O proprietário do grupo deve poder remover membros do grupo. <br> - As alterações devem ser salvas e refletidas para todos os membros do grupo.  |
| US12  | Como usuário, desejo excluir um grupo de viajantes previamente criado, a fim de encerrar sua utilização quando este não for mais considerado adequado ou necessário.                                                       | - Apenas o proprietário do grupo pode excluí-lo. <br> - O sistema deve solicitar uma confirmação antes de excluir o grupo. <br> - Após a confirmação, o grupo é removido permanentemente e deixa de ser visível para todos os ex-membros. <br> - Rotas que estavam associadas ao grupo perdem essa associação.  |
| US13  | Como usuário, quero convidar outros viajantes para participar de um grupo, a fim de facilitar a organização conjunta dos roteiros turísticos.                                                 | - Qualquer membro de um grupo pode acessar a função "Convidar". <br> - O usuário deve poder convidar outro usuário através de seu e-mail ou nome de usuário no sistema. <br> - O usuário convidado deve receber uma notificação (por e-mail e/ou dentro da plataforma) com opções para aceitar ou recusar o convite. <br> - Ao aceitar o convite, o novo membro é adicionado à lista de participantes do grupo. |
| US14  | Como usuário, quero sair de um grupo de viajantes quando não desejar mais participar, para manter minha experiência personalizada.                                                       | - Todo membro de um grupo (que não seja o único proprietário) deve ter um botão "Sair do Grupo". <br> - O sistema deve pedir confirmação antes que o usuário saia do grupo. <br> - Após a confirmação, o usuário é removido da lista de membros e não tem mais acesso às informações do grupo. <br> - Se o proprietário sair, a propriedade deve ser transferida para outro membro antes da saída, ou o sistema deve exigir que ele exclua o grupo. |
| US15  | Como usuário, quero receber notificações por e-mail antes do início agendado de uma rota turística.                                   | - Um e-mail automático deve ser enviado para o endereço de e-mail cadastrado do usuário. <br> - A notificação deve ser enviada um tempo pré-definido antes do início da rota (ex: 24 horas antes). <br> - O e-mail deve conter o nome da rota, a data/hora de início e um link para visualizar a rota na plataforma. <br> - O usuário deve ter a opção de desabilitar essas notificações em suas configurações de perfil.   |
| US16  | Como usuário, quero adicionar um grupo de viajantes a uma rota turística, para que possamos realizar a experiência juntos de forma coordenada.                                    | - Ao criar ou editar uma rota, o criador da rota deve poder associá-la a um de seus grupos de viajantes. <br> - Uma vez associada, a rota deve ficar visível para todos os membros do grupo. <br> - Todos os membros do grupo devem receber as notificações relacionadas a essa rota (como o lembrete de início). <br> - O criador da rota pode desassociar o grupo da rota a qualquer momento.|
| US17  | Como usuário, quero visualizar minha localização em tempo real.                                                           | - Ao abrir o mapa no aplicativo, o sistema deve solicitar permissão para acessar a localização do dispositivo. <br> - Com a permissão concedida, o mapa deve exibir um marcador claro (ex: um ponto azul) na posição atual do usuário. <br> - O marcador deve se mover e atualizar sua posição no mapa conforme o usuário se desloca. <br> - Se a permissão for negada, o sistema deve exibir uma mensagem informando que a funcionalidade de localização está desativada.   |
| US18  | Como usuário, quero salvar rotas turísticas em PDF, para consultá-las posteriormente, mesmo sem conexão com a internet.                                                    | - Na página de detalhes da rota, deve haver um botão visível de "Exportar para PDF" ou "Baixar". <br> - Ao clicar no botão, um arquivo PDF deve ser gerado e o download iniciado no dispositivo do usuário. <br> - O PDF deve conter: o nome da rota, a lista ordenada de pontos turísticos com seus endereços, e um mapa simplificado do trajeto. <br> - O layout do PDF deve ser legível e bem formatado para impressão ou visualização em tela.   |
| US19  | Como usuário, quero compartilhar rotas turísticas por e-mail, a fim de enviar sugestões de passeios para amigos ou grupos de viagem.                                          | - A página de detalhes da rota deve incluir uma opção de "Compartilhar". <br> - Ao escolher "Compartilhar por E-mail", o aplicativo de e-mail padrão do dispositivo deve ser aberto. <br> - O campo "Assunto" do e-mail deve ser preenchido com o nome da rota (ex: "Sugestão de Rota: [Nome da Rota]"). <br> - O corpo do e-mail deve conter um texto padrão e um link público para visualizar a rota na plataforma.   |
| US20  | Como usuário, quero utilizar um conversor de moedas com seleção de moeda de origem e destino, para não ser pego de surpresa com conversões após os gastos.      | - O sistema deve ter uma ferramenta de "Conversor de Moedas" acessível. <br> - A ferramenta deve ter dois menus para selecionar a moeda de origem e a moeda de destino de uma lista de moedas globais. <br> - Deve haver um campo de texto para o usuário inserir o valor a ser convertido. <br> - O valor convertido deve ser exibido automaticamente assim que o valor de origem é inserido.   |

## Épicos do Projeto 

### Épico: Gerenciamento de Rotas Turísticas

| Feature                  | História de Usuário                                                                                                                                     | Tasks                                                                                     |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| CRUD de Rotas            | Como usuário, quero criar rotas turísticas e agendar seu horário de início, para otimizar meu planejamento de visitas.                                            | - Criar formulário de cadastro<br>- Validar entradas |
| CRUD de Rotas            | Como usuário, quero atualizar rotas turtísitcas para poder alterar informações sobre essa rota ou modificar os pontos turísticos.                                                     | - Criar interface de edição                    |
| CRUD de Rotas            | Como usuário, quero consultar rotas turísticas, filtrar por distância para ver apenas as que estão ao meu alcance, e visualizar a rota selecionada em um mapa com todas as suas informações.                                  | - Criar listagem de rotas<br>- Mostrar detalhes de cada rota                            |
| CRUD de Rotas            |Como usuário, quero excluir rotas turísticas que eu não achar mais adequadas.                                                                      | - Implementar botão de exclusão<br>- Criar lógica de confirmação                         |
| Avaliação de Rota        | Como usuário, quero avaliar uma rota turística feita por mim para que outros usuários tenham esse feedback.                                                                   | - Criar componente de estrelas<br>- Armazenar avaliação no backend                       |

---

### Épico: Gerenciamento de Pontos Turísticos

| Feature                  | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CRUD de Pontos Turísticos| Como administrador, quero cadastrar novos pontos turísticos, para ampliar o portfólio de destinos.                              | - Criar formulário de cadastro<br>- Validar e salvar informações       |
| CRUD de Pontos Turísticos| Como administrador, quero atualizar um ponto turístico para modificar suas informações.                                    | - Criar tela de edição<br>- Atualizar no banco de dados                |
| CRUD de Pontos Turísticos| Como usuário, quero consultar os pontos turísticos para saber mais informações para possivelmente adicioná-lo em alguma rota turística.             |
| CRUD de Pontos Turísticos| Como administrador, quero excluir pontos turísticos que não achar mais adequados.                |

---

### Épico: Filtragem e Localização

| Feature              | História de Usuário                                                                                      | Tasks                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Localização Atual    |  Como usuário, quero visualizar minha localização em tempo real.                                                     | - Solicitar permissão do navegador<br>- Usar API de geolocalização     |

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

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do backlog | Leonardo Sauma | Gabriel Soares e Gustavo Gontijo|
    |26/05/2025| 2.0 | Atualização do Backlog | Mylena Mendonça | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|
    |26/05/2025| 2.1 | Atualização do Backlog | Leonardo Sauma | Rodrigo Amaral, Leonardo Sauma e Gabriel Soares|