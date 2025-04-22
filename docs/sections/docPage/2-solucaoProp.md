# Solução Proposta

## 2.1 Objetivos do Produto
O objetivo do aplicativo “Touristeer” é ajudar você a encontrar atrações perto de onde está e criar rotas e roteiros sob medida para explorar cada ponto no seu próprio ritmo. A proposta é permitir que os viajantes explorem pontos turísticos com autonomia, acesso rápido à informação e praticidade, sem as restrições impostas por horários e roteiros fixos. Com isso, busca-se melhorar a experiência de viagem, promovendo o turismo mais livre, eficiente e informativo.

## 2.2 Características da Solução
A solução contará com os seguintes recursos principais:
- **Geolocalização** para detectar a posição do usuário e sugerir atrações próximas, gerando informações como melhores rotas e horário de funcionamento;
- **Busca e filtros avançados** por tipo de atração, distância, horário, avaliação;
- **Sistema de visualização de avaliações e comentários**;
- **Curadoria de pontos turísticos** com informações detalhadas (descrição, preço, acessibilidade, imagens, contexto cultural, etc.);
- **Interface simples e eficiente** para facilitar a navegação mesmo em ambientes com baixa conectividade.

## 2.3 Tecnologias a Serem Utilizadas
- **Frontend**: React, HTML, CSS, JavaScript.  
  React será usado pela sua modularidade e eficiência em interfaces dinâmicas. HTML, CSS e JS garantem uma base sólida para uma aplicação responsiva e moderna.
  
- **Backend**: Node.js com Express.  
  O backend será desenvolvido com Node.js e o framework Express. O Node.js permite usar JavaScript no servidor com alta performance, enquanto o Express facilita a criação de rotas e APIs de forma simples, leve e eficiente, além de ser direto e familiar à equipe.

- **Geolocalização e Mapas**: APIs do Google Maps.  
  O Google Maps garante dados completos e precisos.

- **Autenticação**: Firebase Auth.  
  Firebase oferece integração rápida com vários métodos de login.

- **Armazenamento de Imagens**: Firebase Storage.  
  Firebase é simples e direto para integrar.

- **Hospedagem do Front-end e Back-end**: Vercel e Heroku.  
  A hospedagem do frontend será feita na Vercel pela sua integração nativa com projetos em React, facilidade de deploy e suporte a CI/CD. Já o backend será hospedado no Heroku, escolhido pela simplicidade na configuração de servidores Node.js e pela agilidade no gerenciamento do ambiente durante o desenvolvimento.

- **Controle de Versão**: Git e GitHub.  
  O Git será utilizado para controle de versões do código, permitindo acompanhar o histórico de alterações e facilitar o trabalho em equipe. O GitHub será usado como plataforma de hospedagem dos repositórios, facilitando a colaboração, revisão de código e gerenciamento do projeto.

## 2.4 Pesquisa de Mercado e Análise Competitiva
Atualmente, existem soluções como TripAdvisor, Google Maps, Moovit Travel e Visit A City, que fornecem informações turísticas, avaliações e até roteiros. No entanto, esses aplicativos geralmente:

### Limitações das soluções atuais
- **Falta de personalização**: As recomendações não se adaptam ao histórico ou interesses específicos de cada usuário.
- **Abordagem genérica**: São voltados a um público amplo, sem foco nas necessidades reais dos turistas.
- **Experiência limitada**: Os roteiros são fixos e pouco adaptáveis, com foco excessivo em avaliações.
- **Exploração pouco incentivada**: Não estimula o turista a descobrir lugares espontaneamente ou fora do roteiro comum.

Nesse cenário, o Touristeer se destaca por oferecer:

### Diferenciais:
- **Turismo personalizado e autônomo**: O usuário escolhe o que visitar, de forma flexível e no seu próprio ritmo.
- **Sugestões inteligentes**: Recomendação de pontos turísticos com base em interesses e comportamentos anteriores.
- **Conteúdo local e contextualizado**: Curadoria feita com foco em atrações relevantes, culturais e menos óbvias.
- **Interface pensada para turistas**: Design intuitivo e funcional, ideal para facilitar a navegação durante a viagem.

## 2.5 Análise de Viabilidade Técnica, Financeira e de Mercado
A proposta é tecnicamente viável com as tecnologias atuais. Bibliotecas e APIs como Google Maps e Firebase facilitam a integração de funcionalidades como geolocalização, mapas, rotas e autenticação.

### Viabilidade Técnica:
De acordo com a disponibilidade dos membros da equipe, o ideal é implementar reuniões rápidas e interativas para estabelecer as funções e necessidades básicas. O projeto será construído de forma iterativa, gerando incrementos durante o desenvolvimento. O desenvolvimento contará com uma carga de trabalho bem dividida e de pouca sobrecarga semanal, além de garantir boa adaptabilidade e evitar problemas críticos futuros.

### Viabilidade Financeira:
O objetivo é desenvolver um projeto baseado em tecnologias e APIs gratuitas e open source, o que reduz as chances de se tornar necessário um fundo monetário. As principais possibilidades de custo estão relacionadas à:
- Infraestrutura em nuvem (Firebase/AWS/Heroku);
- APIs de mapas (Google Maps tem cota gratuita, mas pode ter custo variável).

### Viabilidade no Mercado:
A proposta do aplicativo surge em um momento onde o setor de turismo ainda busca soluções digitais mais dinâmicas e personalizáveis em relação à experiência do usuário. Nenhuma das plataformas populares atuais entrega uma experiência totalmente voltada para o turismo autônomo com foco local e adaptável. Nesse contexto, a proposta tende a se destacar, garantindo uma boa viabilidade nesse quesito.

## 2.6 Benefícios e Impactos da Plataforma Turística para Usuários e Negócios Locais
A implementação da plataforma poderá trazer benefícios significativos tanto para os turistas quanto para os negócios locais. Ao oferecer uma plataforma adaptada, o sistema permitirá que viajantes descubram pontos turísticos, atrações culturais, estabelecimentos e rotas com base em seus interesses, localização e tempo disponível. A experiência do usuário será enriquecida por funcionalidades como contextualizações sobre cada ponto turístico, horários de funcionamento e recomendação de tempo por parada.

Além de melhorar a jornada dos visitantes, a aplicação também terá um forte impacto no fortalecimento do turismo local, promovendo negócios da região e incentivando a visita a locais menos explorados. Com isso, o cliente amplia sua relevância no setor turístico, atrai novos públicos, gera valor para parceiros e se posiciona como referência em inovação e hospitalidade.

### Benefícios Esperados:
- **Guia Turístico Personalizado**: Roteiros Eficientes e Adaptados ao Usuário  
  A aplicação atua como um guia turístico ajustado, oferecendo aos visitantes sugestões de trajeto otimizadas de acordo com o tempo disponível, horários de funcionamento dos pontos turísticos e proximidade geográfica. Isso evita deslocamentos desnecessários, reduz a frustração com locais fechados ou fora de rota e torna a experiência de passeio mais fluida, completa e eficiente.

- **Democratização e Inclusão no Turismo**: Personalização e Acessibilidade para Todos  
  A plataforma facilita o acesso ao turismo, podendo ser utilizada de qualquer lugar com internet e gerando, conforme as preferências do usuário e sua localização, uma rota turística simples e sem burocracia. Assim, a solução incentiva a exploração espontânea e autônoma, ampliando as possibilidades de descoberta e valorizando a experiência de todos os perfis de viajantes.

- **Valorização do Patrimônio Local**: Descoberta e Promoção de Atrações Menos Conhecidas  
  A aplicação se destaca por não se limitar aos pontos turísticos mais conhecidos, mas utilizar a localização do usuário para sugerir atrações próximas, frequentemente ignoradas pelos roteiros convencionais. Isso permite ao visitante descobrir espaços históricos, culturais e simbólicos da cidade que normalmente passariam despercebidos, promovendo uma conexão mais autêntica com o território. Ao dar visibilidade a esses locais, a plataforma contribui para a valorização da história local, preservação do patrimônio e distribuição mais equilibrada do fluxo turístico, gerando impacto positivo tanto na memória coletiva quanto na economia de comunidades que vivem fora dos grandes eixos turísticos.

  
## Histórico de Versão
| Data | Versão | Descrição | Autor | Revisores|
|-|-|-|-|-|
|21/04/2025| 1.0 | Criação do documento | Todos os integrantes do grupo |Todos os integrantes do grupo|
|21/04/2025| 1.1 | Reescrita dos tópicos 2.1 e 2.2 | Gustavo Gontijo | Gabriel Soares |
|21/04/2025| 1.2 | Reescrita dos tópicos 2.3 e 2.4 | Leonardo Sauma | Rodrigo Amaral |
|21/04/2025| 1.3 | Reescrita dos tópicos 2.5 e 2.6 | Mylena Trindade | Gabriel Soares |
