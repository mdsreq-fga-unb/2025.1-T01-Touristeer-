# Backlog do Produto
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
Com base nisso, definimos o MVP do produto, abrangendo todos os itens com prioridade "Must have" e "Should have".

| ID    | Descrição                                                                         | Prioridade  | MVP |
|-------|-----------------------------------------------------------------------------------|-------------|-----|
| US01  | Cadastrar rotas turísticas                                                        | Must have   |  X  |
| US02  | Atualizar rotas turísticas                                                        | Must have   |  X  |
| US03  | Consultar rotas turísticas                                                        | Must have   |  X  |
| US04  | Exibir rotas turísticas no mapa                                                   | Must have   |  X  |
| US05  | Excluir rotas turísticas                                                          | Should have |     |
| US06  | Cadastrar pontos turísticos                                                       | Should have |     |
| US07  | Atualizar pontos turísticos                                                       | Should have |     |
| US08  | Consultar pontos turísticos                                                       | Should have |     |
| US09  | Excluir pontos turísticos                                                         | Should have |     |
| US10  | Agendar início de rota turística                                                  | Must have   |  X  |
| US11  | Avaliar rota turística                                                            | Could have  |     |
| US12  | Cadastrar grupos de viajantes                                                     | Should have |     |
| US13  | Atualizar grupos de viajantes                                                     | Should have |     |
| US14  | Excluir grupos de viajantes                                                       | Should have |     |
| US15  | Convidar para grupos de viajantes                                                 | Should have |     |
| US16  | Sair de grupos de viajantes                                                       | Should have |     |
| US17  | Enviar notificações de início de rota turística                                   | Must have   |  X  |
| US18  | Adicionar grupo de viajante à rotas turísticas                                    | Should have |     |
| US19  | Obter localização atual                                                           | Must have   |  X  |
| US20  | Filtrar rotas turísticas por distância                                            | Should have |     |
| US21  | Salvar rotas turísticas em PDF                                                    | Must have   |  X  |
| US22  | Compartilhar rotas turísticas por e-mail                                          | Could have  |     |
| US23  | Mudar idioma durante a execução da aplicação                                      | Should have |     |
| US24  | Exibir um conversor de moedas funcional, informando a moeda origem e destino      | Won't have  |     |
