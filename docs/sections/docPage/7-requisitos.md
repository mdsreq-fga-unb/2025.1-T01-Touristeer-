## Requisitos Funcionais
Os requisitos funcionais detalham as funcionalidades essenciais do sistema, alinhadas aos objetivos do Touristeer. Confira a lista inicial:

**RF01** - Cadastrar rotas turísticas: Permitir o registro de rotas turísticas com até 5 pontos turísticos. <br>
**RF02** - Atualizar rotas turísticas: Permitir a atualização dos pontos turísticos de uma rota. <br>
**RF03** - Consultar rotas turísticas: Permitir a consulta às rotas turísticas cadastradas, visualizando os pontos turísticos inseridos. <br>
**RF04** - Exibir rotas turísticas no mapa: Permitir a visualização da rota turística no mapa. <br>
**RF05** - Excluir rotas turísticas: Permitir a exclusão de rotas turísticas do sistema. <br>
**RF06** - Cadastrar pontos turísticos: Permitir o registro de pontos turísticos. <br>
**RF07** - Atualizar pontos turísticos: Permitir a atualização das informações de um ponto turístico. <br>
**RF08** - Consultar pontos turísticos: Permitir a consulta aos pontos turísticos cadastrados. <br>
**RF09** - Excluir pontos turísticos: Permitir a exclusão de pontos turísticos. <br>
**RF10** - Agendar início de rota turística: Permitir agendar o início de uma rota turística informando data e hora. <br>
**RF11** - Avaliar rota turística: Permitir a avaliação de rotas turísticas, classificando de 0 a 5 estrelas. <br>
**RF12** - Cadastrar grupos de viajantes: Permitir a criação de grupos de usuários que estão viajando juntos. <br>
**RF13** - Atualizar grupos de viajantes: Permitir a atualização de informações de grupos de usuários que estão viajando juntos. <br>
**RF14** - Excluir grupos de viajantes: Permitir a exclusão de grupos de viajantes. <br>
**RF15** - Convidar para grupos de viajantes: Permitir o envio de convite para grupos de viajantes. <br>
**RF16** - Sair de grupos de viajantes: Permitir a saída de grupos de viajantes. <br>
**RF17** - Enviar notificações de início de rota turística: Enviar notificações automáticas por e-mail ao faltar 15 minutos para o início agendado da rota turística. <br>
**RF18** - Adicionar grupo de viajante à rotas turísticas: Permitir adicionar um grupo de viajante em uma rota turística. <br>
**RF19** - Obter localização atual: Acessar a geolocalização via navegador. <br>
**RF20** - Filtrar rotas turísticas: Permitir a filtragem de rotas turísticas por distância. <br>
**RF21** - Salvar rotas turísticas em PDF: Permitir a exportação de rotas turísticas em PDF. <br>
**RF22** - Compartilhar rotas turísticas por e-mail: Permitir o compartilhamento de rotas turísticas por e-mail. <br>
**RF23** - Mudar idioma: Permitir a mudança de idioma durante a execução da aplicação. <br>
**RF24** - Conversor de moedas: Exibir um conversor de moedas funcional, informando a moeda origem e destino. <br>


## Requisitos Não Funcionais

| **U**sabilidade | **R**obustez | **P**erformance | **S**egurança | **+** |
| - | - | - | - | - |
| **RNF01** - A interface deve permitir que os usuários encontrem suas rotas turísticas em até três cliques, sem necessidade de tutorial.| **RNFXX05 - O sistema deve exibir uma mensagem de erro e registrar o erro em log para análise posterior sempre que ocorrer uma exceção não tratada. | **RNF06** -  Todas as chamadas à API de geolocalização devem retornar a posição do usuário em até 2 segundo sob conexão 4G. | **RNF08** - Toda comunicação cliente-servidor deve ocorrer via HTTPS/TLS 1.2+, qualquer requisição sem TLS deve ser rejeitada. | **RNF09** - O aplicativo web deve ser compatível com a versão 90+ do Chrome, 88+ do Mozilla Firefox, 90+ do Microsoft Edge e 14+ do Safari.|
|**RNF02** - A aplicação deve suportar dois idiomas, sendo eles português e inglês, garantindo que todas as mensagens, botões, menus e conteúdos sejam traduzidos adequadamente, sem erros de contexto ou gramática.| | **RNFX07** - O carregamento inicial do mapa deve ocorrer em até 4 segundos após a abertura da tela.  |||
|**RNF03** - O sistema deve apresentar responsividade plena, adaptando automaticamente sua interface gráfica a diferentes tamanhos e resoluções de tela (como dispositivos móveis, tablets e desktops), de modo a garantir uma experiência de uso consistente, intuitiva e acessível em todos os dispositivos suportados. || | ||
|**RNF04** - Pelo menos 80% dos elementos da interface devem permanecer visíveis e utilizáveis em resoluções mínimas de 360x640 px (dispositivos móveis), 768x1024 px (tablets) e 1366x768 px (desktops). | | |  ||



# Backlog do Projeto Touristeer

## Épico: Gerenciamento de Rotas Turísticas

| Feature                  | História de Usuário                                                                                                                                     | Tasks                                                                                     |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| CRUD de Rotas            | Como usuário, quero cadastrar uma nova rota turística com até 5 pontos turísticos para planejar meu passeio.                                            | - Criar formulário de cadastro<br>- Implementar limite de 5 pontos<br>- Validar entradas |
| CRUD de Rotas            | Como usuário, quero atualizar os pontos turísticos de uma rota para manter o plano atualizado.                                                          | - Criar interface de edição<br>- Criar endpoint PUT para atualização                     |
| CRUD de Rotas            | Como usuário, quero consultar rotas cadastradas e ver seus pontos turísticos para decidir qual seguir.                                                  | - Criar listagem de rotas<br>- Mostrar detalhes de cada rota                            |
| CRUD de Rotas            | Como usuário, quero excluir rotas para remover planos que não me interessam mais.                                                                       | - Implementar botão de exclusão<br>- Criar lógica de confirmação                         |
| Visualização no Mapa     | Como usuário, quero ver a rota turística no mapa para entender o trajeto visualmente.                                                                   | - Integrar API de mapa<br>- Plotar pontos no mapa<br>- Garantir carregamento em até 4s   |
| Agendamento de Rota      | Como usuário, quero agendar o início de uma rota informando data e hora.                                                                                | - Criar formulário de agendamento<br>- Salvar data/hora no backend                       |
| Avaliação de Rota        | Como usuário, quero avaliar uma rota de 0 a 5 estrelas para ajudar outros viajantes.                                                                     | - Criar componente de estrelas<br>- Armazenar avaliação no backend                       |

---

## Épico: Gerenciamento de Pontos Turísticos

| Feature                  | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CRUD de Pontos Turísticos| Como usuário, quero cadastrar pontos turísticos para incluí-los nas rotas.                              | - Criar formulário de cadastro<br>- Validar e salvar informações       |
| CRUD de Pontos Turísticos| Como usuário, quero atualizar as informações de um ponto turístico.                                     | - Criar tela de edição<br>- Atualizar no banco de dados                |
| CRUD de Pontos Turísticos| Como usuário, quero consultar pontos turísticos cadastrados.                                            | - Criar listagem com filtros<br>- Exibir dados relevantes              |
| CRUD de Pontos Turísticos| Como usuário, quero excluir pontos turísticos que não sejam mais relevantes.                            | - Criar botão de deleção<br>- Remover do banco de dados                |

---

## Épico: Grupos de Viajantes

| Feature              | História de Usuário                                                                                   | Tasks                                                                         |
|----------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Gestão de Grupos     | Como usuário, quero criar um grupo de viagem para organizar passeios com amigos.                      | - Criar formulário de criação<br>- Salvar grupo no banco                     |
| Gestão de Grupos     | Como usuário, quero atualizar dados do grupo.                                                         | - Criar tela de edição<br>- Atualizar backend                                |
| Gestão de Grupos     | Como usuário, quero excluir um grupo de viagem.                                                       | - Criar ação de exclusão<br>- Confirmar e remover grupo                      |
| Convites             | Como usuário, quero convidar pessoas para meu grupo de viagem.                                        | - Criar envio de convite por e-mail ou link<br>- Validar aceite              |
| Saída de Grupo       | Como usuário, quero sair de um grupo que não participo mais.                                          | - Implementar opção \"Sair do grupo\"<br>- Remover usuário do grupo          |
| Grupo em Rota        | Como usuário, quero adicionar meu grupo a uma rota para compartilhar a experiência.                   | - Vincular grupo à rota<br>- Exibir relação na interface                     |

---

## Épico: Notificações

| Feature                | História de Usuário                                                                                         | Tasks                                                                         |
|------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Lembrete de Rota       | Como usuário, quero receber uma notificação quando estiver perto do horário de início da rota.              | - Agendar trigger para 15 minutos antes<br>- Enviar e-mail automático        |

---

## Épico: Personalização e Acessibilidade

| Feature            | História de Usuário                                                                                     | Tasks                                                                   |
|--------------------|----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Idioma             | Como usuário, quero mudar o idioma da aplicação para facilitar a navegação.                             | - Criar seleção de idioma<br>- Traduzir interface (PT e EN)            |
| Conversor de Moedas| Como usuário, quero converter moedas para facilitar o planejamento financeiro.                          | - Criar interface do conversor<br>- Usar API de cotação de moedas      |

---

## Épico: Compartilhamento e Exportação

| Feature                 | História de Usuário                                                                                         | Tasks                                                                 |
|-------------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Exportar PDF            | Como usuário, quero exportar a rota em PDF para consultar offline.                                          | - Gerar PDF com dados da rota<br>- Adicionar botão de download        |
| Compartilhar por E-mail | Como usuário, quero compartilhar rotas com amigos por e-mail.                                               | - Criar formulário de envio<br>- Integrar com serviço de e-mail       |

---

## Épico: Filtragem e Localização

| Feature              | História de Usuário                                                                                      | Tasks                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Filtrar Rotas        | Como usuário, quero filtrar rotas por distância.                                                         | - Criar campo de filtro por distância<br>- Aplicar lógica de filtro    |
| Localização Atual    | Como usuário, quero ver minha localização no mapa.                                                       | - Solicitar permissão do navegador<br>- Usar API de geolocalização     |

---



??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do documento de requisitos | Leonardo Sauma | Gabriel Soares e Gustavo Gontijo|
    |26/05/2025| 2.0 | Criação do Backlog | Mylena Mendonça | Rodrigo Amaral e Leonardo Sauma|
    