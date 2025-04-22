## 1.1 Introdução ao Negócio e Contexto

O **“Touristeer”** é uma aplicação web de navegação móvel voltada ao setor de turismo com enfoque em aproximar o viajante da cultura e costumes locais, disponibilizando espaços próximos do usuário que sejam mais diversificados do que as rotas oferecidas por pacotes de viagem com pontos turísticos.

A principal proposta da aplicação é fornecer rotas otimizadas em tempo real com base em informações de localização e avaliação coletadas pelo usuário e com percursos possíveis de se transitar a curtas distâncias, visando liberdade e flexibilidade no planejamento e corte de gastos nas viagens do usuário.

O setor de atuação do Touristeer está no mercado de tecnologia móvel e serviços de mapas de navegação e de agências de viagem.

---

## 1.2 Identificação da Oportunidade ou Problema

Esse projeto surge diante de um contexto em que os viajantes frequentemente se frustram com a rigidez dos serviços de turismo oferecidos, que muitas vezes não atendem às suas vontades, mas acabam sendo as únicas opções disponíveis, diminuindo o aproveitamento das viagens. Essa rigidez foi analisada em profundidade, revelando diversas causas que limitam a flexibilidade e a personalização dos serviços turísticos.

- **Ambiente externo**: normas e regulamentações no setor de turismo restringem a adaptação às preferências individuais, enquanto mercados tradicionais continuam a priorizar pacotes fixos e inflexíveis.
- **Métricas inadequadas**: há uma falta de indicadores que acompanhem a demanda por personalização e controle limitado sobre alterações em roteiros.
- **Materiais utilizados**: o uso de guias turísticos impressos com informações fixas e frequentemente desatualizadas, além de uma integração insuficiente com bases de dados dinâmicas.
- **Métodos e processos de trabalho**: problemas como a centralização dos planejamentos e reservas seguem estruturas padronizadas com pouca margem para alterações.
- **Operadores de turismo**: foco excessivo em pacotes tradicionais e falta de treinamento adequado para adaptar roteiros às preferências dos turistas.
- **Infraestrutura tecnológica**: ainda é insuficiente para oferecer ferramentas que possibilitem personalização em tempo real. A ausência de aplicativos intuitivos e plataformas dinâmicas dificulta o planejamento e a execução de roteiros personalizados.

Esse conjunto de fatores reforça a passividade dos turistas, que frequentemente se veem presos a roteiros pré-estabelecidos e com pouca liberdade para planejar ou explorar suas viagens de acordo com seus próprios interesses. Como resultado, a insatisfação e a frustração tornam-se comuns, prejudicando o aproveitamento pleno das experiências de viagem e evidenciando a necessidade de soluções mais flexíveis e personalizáveis.

---

> A figura, a seguir, apresenta o diagrama de Ishikawa contendo as causas (organizadas pelos 6M’s) e o problema do cliente.

![Diagrama de Ishikawa](../../assets/diagrama.png)

## 1.3 Desafios do Projeto

### Desafio de Integrar Fontes Locais de Turismo

Informações sobre pontos turísticos, eventos e atrações culturais estão dispersas entre sites municipais, blogs, redes sociais e plataformas desatualizadas. A ausência de uma base centralizada e confiável compromete a oferta de dados em tempo real dentro do aplicativo. Essa fragmentação dificulta a entrega de sugestões precisas ao usuário, afetando negativamente sua experiência e a confiança no serviço.

### Dificuldade em Criar Rotas Turísticas Relevantes e Personalizadas

Ao contrário de aplicativos tradicionais de navegação, que priorizam rotas rápidas, o **Touristeer** precisa considerar múltiplos fatores, como interesse turístico dos pontos, avaliações de usuários, acessibilidade e tempo disponível. O desafio está em transformar essas variáveis em rotas otimizadas e culturalmente sensíveis, exigindo um alto grau de inteligência contextual e técnica.

### Competição com Grandes Aplicativos de Navegação

O **Touristeer** será lançado em um cenário dominado por plataformas consolidadas como **Google Maps** e **Waze**, amplamente utilizadas também por turistas. O desafio está em se diferenciar não como mais uma ferramenta de navegação, mas como uma solução voltada exclusivamente para turismo inteligente. Isso exige foco em roteiros curtos, integração com a cultura local e economia de tempo e recursos para o usuário.

---

## 1.4 Segmentação de Clientes

O **Touristeer** é voltado para diferentes perfis de turistas que viajam pelo Brasil, com foco em turismo de lazer, cultural e ecológico. Com base em dados sobre comportamento de viagem, destacam-se três segmentos principais:

### Turistas em Grandes Centros Urbanos

Majoritariamente entre **30 e 55 anos**, são profissionais com ensino superior e pertencentes à classe média urbana. Valorizam experiências culturais, históricas e gastronômicas e usam da tecnologia para consultar avaliações de atrações em tempo real e montar roteiros personalizados e flexíveis, embora as viagens costumem ser bem estruturadas. Destinos como **São Paulo**, **Rio de Janeiro** e **Salvador** são recorrentes neste grupo.

### Turistas de Lazer em Viagens Curtas ou de Fim de Semana

Inclui desde casais jovens e amigos universitários até famílias com filhos pequenos. Embora haja presença de jovens entre **18 e 29 anos**, a maior parte ainda está na faixa de **30 a 55 anos**. Esse público realiza viagens em feriados prolongados ou fins de semana para destinos próximos e acessíveis, como **Ouro Preto (MG)**, **Paraty (RJ)** ou **Chapada dos Veadeiros (GO)**. Buscam praticidade e roteiros otimizados, com foco em trilhas leves, visitas guiadas e passeios bate-volta. Valorizam recursos como listas de atrações por tempo disponível e recomendações para diferentes perfis (famílias, casais, etc.). Possuem ensino médio ou superior e pertencem à classe média.

### Moradores em Busca de Lazer Local

Esse grupo inclui jovens adultos entre **18 e 35 anos** que vivem em grandes centros urbanos e desejam redescobrir sua própria cidade ou explorar bairros vizinhos aos finais de semana. São usuários que buscam eventos gratuitos, feiras culturais, espaços alternativos e novas experiências gastronômicas, com pouco planejamento. Para esse público, o **Touristeer** se posiciona como uma ferramenta espontânea de descoberta, sugerindo atividades conforme localização, clima e horário. Em sua maioria, têm ensino médio ou superior completo e pertencem à classe média ou média-baixa.

### Turistas Seniores

Indivíduos aposentados, com tempo livre e renda acumulada, que realizam de **2 a 3 viagens por ano**. Preferem viagens dinâmicas com muitos serviços incluídos, priorizando conforto, segurança e acessibilidade. Valorizam experiências culturais e históricas.


## Histórico de Versão
| Data | Versão | Descrição | Autor | Revisores|
|-|-|-|-|-|
|07/04/2025| 1.0 | Definição do produto e projeto | Todos os integrantes do grupo |Todos os integrantes da equipe|
|09/04/2025| 1.2 | Reescrita do tópico 1.2 | Rodrigo Amaral |Todos os integrantes da equipe|
|20/04/2025| 1.3 | Reescrita dos tópico 1.1 e 1.2 | Samuel Afonso |Gabriel Soares|
|21/04/2025| 1.4 | Reescrita dos tópico 1.3 e 1.4 | Gabriel Soares |Leonardo Sauma|
|21/04/2025| 1.4 | Alteração no tópico 1.1 | Rodrigo Amaral |Leonardo Sauma|