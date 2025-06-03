## Requisitos Funcionais
Os requisitos funcionais detalham as funcionalidades essenciais do sistema, alinhadas aos objetivos do Touristeer. Confira a lista inicial:

**RF01** - Cadastrar rotas turísticas: Permitir a criação e agendamento do horário de início de rotas turísticas.  <br>
**RF02** - Atualizar rotas turísticas: Permitir a atualização dos pontos turísticos de uma rota. <br>
**RF03** - Consultar rotas turísticas: Permitir a consulta às rotas turísticas cadastradas, visualizando os pontos turísticos inseridos e permitindo a fitragem. <br>
**RF04** - Exibir rotas turísticas no mapa: Permitir a visualização da rota turística no mapa. <br>
**RF05** - Excluir rotas turísticas: Permitir a exclusão de rotas turísticas do sistema. <br>
**RF06** - Cadastrar pontos turísticos: Permitir o registro de pontos turísticos. <br>
**RF07** - Atualizar pontos turísticos: Permitir a atualização das informações de um ponto turístico. <br>
**RF08** - Consultar pontos turísticos: Permitir a consulta aos pontos turísticos cadastrados. <br>
**RF09** - Excluir pontos turísticos: Permitir a exclusão de pontos turísticos. <br>
**RF10** - Avaliar rota turística: Permitir a avaliação de rotas turísticas, classificando de 0 a 5 estrelas. <br>
**RF11** - Cadastrar grupos de viajantes: Permitir a criação de grupos de usuários que estão viajando juntos. <br>
**RF12** - Atualizar grupos de viajantes: Permitir a atualização de informações de grupos de usuários que estão viajando juntos. <br>
**RF13** - Excluir grupos de viajantes: Permitir a exclusão de grupos de viajantes. <br>
**RF14** - Convidar para grupos de viajantes: Permitir o envio de convite para grupos de viajantes. <br>
**RF15** - Sair de grupos de viajantes: Permitir a saída de grupos de viajantes. <br>
**RF16** - Enviar notificações de início de rota turística: Enviar notificação por e-mail antes do horário agendado da rota turística. <br>
**RF17** - Adicionar grupo de viajante à rotas turísticas: Permitir adicionar um grupo de viajante em uma rota turística. <br>
**RF18** - Rastrear geolocalização: Permitir o usuário a fornecer sua localização atual. <br>
**RF19** - Salvar rotas turísticas em PDF: Permitir a exportação de rotas turísticas em PDF. <br>
**RF20** - Compartilhar rotas turísticas por e-mail: Permitir o compartilhamento de rotas turísticas por e-mail. <br>
**RF21** - Conversor de moedas: Exibir um conversor de moedas funcional, informando a moeda origem e destino. <br>


## Requisitos Não Funcionais

| **U**sabilidade | **R**obustez | **P**erformance | **S**egurança | **+** |
| - | - | - | - | - |
| **RNF01** - A interface deve permitir que os usuários encontrem suas rotas turísticas em até três cliques, sem necessidade de tutorial.| **RNF05** - O sistema deve captar qualquer tipo de exceção (erros de I/O, conexões, validações, etc.), exibir ao usuário uma mensagem de erro e registrá-lo em log com data e hora, tipo/exceção lançada, mensagem de erro e contexto da operação para análise posterior sempre que ocorrer uma exceção não tratada. | **RNF06** -  Todas as chamadas à API de geolocalização devem retornar a posição do usuário em até 5 segundos sob conexão 4G. | **RNF08** - Toda comunicação cliente-servidor deve ocorrer via HTTPS/TLS 1.2+, qualquer requisição sem TLS deve ser rejeitada. | **RNF09** - O aplicativo web deve ser compatível com a versão 90+ do Chrome, 88+ do Mozilla Firefox, 90+ do Microsoft Edge e 14+ do Safari.|
|**RNF02** - A aplicação deve suportar dois idiomas, sendo eles português e inglês, garantindo que todas as mensagens, botões, menus e conteúdos sejam traduzidos adequadamente, sem erros de contexto ou gramática.| | **RNF07** - O carregamento inicial do mapa deve ocorrer em até 10 segundos após a abertura da tela.  |||
|**RNF03** - O sistema deve apresentar responsividade em resoluções mínimas de 360x640 px (dispositivos móveis), 768x1024 px (tablets) e 1366x768 px (desktops), com pelo menos 80% dos elementos da interface (botões, ícones, textos, componentes, etc.) permanecendo visíveis e utilizáveis nas resoluções acima. || | ||
| **RNF04** - Mudar idioma: Permitir a mudança de idioma durante a execução da aplicação.|||||

## Regras de Negócio
**RN01** - As rotas turísticas devem ter no máximo 5 pontos turísticos. <br>
**RN02** - Obter localização atual ao iniciar a aplicação. <br>
**RN03** - Disparar notificação automática por e-mail 15 minutos antes do início agendado de uma rota turística. <br>

??? abstract "Histórico de Versão"
    | Data | Versão | Descrição | Autor | Revisores|
    |-|-|-|-|-
    |20/05/2025| 1.0 | Criação do documento de requisitos | Leonardo Sauma | Gabriel Soares e Gustavo Gontijo|
    
    