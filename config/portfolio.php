<?php
declare(strict_types=1);

// Personalize este arquivo antes da publicação. Valores de contato vazios são omitidos.
return [
    'name' => 'Seu Nome', 'professional_name' => 'Seu Nome', 'role' => 'Desenvolvedor de software',
    'headline' => 'Conectando tecnologia a novas possibilidades.',
    'description' => 'Desenvolvimento de sites, sistemas e soluções digitais que conectam ideias, informações e necessidades reais.',
    'bio' => 'Sou desenvolvedor em início de carreira e gosto de transformar problemas cotidianos em experiências digitais claras, úteis e bem cuidadas. Estou construindo meu percurso por meio de projetos demonstrativos e aprendizado contínuo.',
    'photo' => '', 'email' => '', 'phone' => '', 'whatsapp' => '', 'github_user' => '', 'github_url' => '', 'linkedin' => '',
    'location' => 'Brasil', 'available' => true,
    'indexing' => false, 'canonical' => '', 'domain' => 'https://tech6.lucasluz.me',
    'technologies' => [
        ['id'=>'html','name'=>'HTML5','category'=>'Frontend','description'=>'Estrutura semântica para páginas acessíveis.','uses'=>'Sites, formulários e conteúdo estruturado.'],
        ['id'=>'css','name'=>'CSS3','category'=>'Frontend','description'=>'Estilos responsivos e sistemas visuais.','uses'=>'Interfaces adaptáveis e componentes.'],
        ['id'=>'js','name'=>'JavaScript','category'=>'Frontend','description'=>'Interações e lógica executadas no navegador.','uses'=>'Interfaces dinâmicas e consumo de APIs.'],
        ['id'=>'php','name'=>'PHP','category'=>'Backend','description'=>'Lógica de aplicação executada no servidor.','uses'=>'Sites dinâmicos e integrações.'],
        ['id'=>'mysql','name'=>'MySQL','category'=>'Dados','description'=>'Banco relacional para dados estruturados.','uses'=>'Cadastros e consultas de sistemas.'],
        ['id'=>'git','name'=>'Git','category'=>'Ferramentas','description'=>'Controle de versões do código.','uses'=>'Histórico e colaboração.'],
        ['id'=>'linux','name'=>'Linux','category'=>'Infraestrutura','description'=>'Ambiente comum de hospedagem web.','uses'=>'Publicação e administração de aplicações.'],
    ],
    'connections' => [['html','css'],['html','js'],['js','php'],['php','mysql'],['git','linux']],
    'services' => [
        ['id'=>'sites','name'=>'Sites e landing pages','icon'=>'◎','description'=>'Presença digital responsiva, com conteúdo organizado para apresentar seu negócio.','solves'=>'Informações dispersas ou uma presença digital que não representa bem o serviço.','benefit'=>'Uma forma clara de explicar sua oferta e facilitar o contato.','technologies'=>['HTML5','CSS3','JavaScript']],
        ['id'=>'systems','name'=>'Sistemas web','icon'=>'⌘','description'=>'Ferramentas web personalizadas para organizar tarefas e informações.','solves'=>'Processos manuais que poderiam ser centralizados.','benefit'=>'Fluxos mais consistentes e dados em um só lugar.','technologies'=>['PHP','MySQL','JavaScript']],
        ['id'=>'care','name'=>'Manutenção e melhorias','icon'=>'↗','description'=>'Ajustes de interface, correções e evolução de projetos existentes.','solves'=>'Páginas desatualizadas ou pequenas necessidades acumuladas.','benefit'=>'Evolução gradual com atenção a acessibilidade e responsividade.','technologies'=>['PHP','CSS3','Git']],
        ['id'=>'data','name'=>'Modelagem de dados','icon'=>'◫','description'=>'Estruturação de informações e consultas para aplicações.','solves'=>'Dados duplicados ou difíceis de consultar.','benefit'=>'Uma base mais organizada para os recursos do sistema.','technologies'=>['MySQL','PHP']],
    ],
    'projects' => [
        ['id'=>'inventory','name'=>'Gestão de estoque','category'=>'Sistema demonstrativo','description'=>'Conceito de aplicação para acompanhar produtos e movimentações.','objective'=>'Demonstrar organização de cadastro, busca e estados de estoque.','problem'=>'O controle em anotações separadas dificulta encontrar informações atualizadas.','features'=>['Cadastro demonstrativo','Pesquisa e filtros','Visão de movimentações'],'technologies'=>['PHP','MySQL','JavaScript'],'github'=>'','demo'=>'','type'=>'Projeto demonstrativo'],
        ['id'=>'dashboard','name'=>'Painel administrativo','category'=>'Interface demonstrativa','description'=>'Exploração de uma interface para organizar indicadores e registros.','objective'=>'Demonstrar hierarquia de informação em um painel responsivo.','problem'=>'Informações úteis podem ficar difíceis de localizar em telas densas.','features'=>['Navegação por seções','Resumo de registros','Layout responsivo'],'technologies'=>['HTML5','CSS3','JavaScript'],'github'=>'','demo'=>'','type'=>'Projeto demonstrativo'],
        ['id'=>'landing','name'=>'Página de serviço','category'=>'Website demonstrativo','description'=>'Estrutura de página comercial para explicar uma oferta e facilitar contato.','objective'=>'Apresentar proposta, benefícios e próximo passo.','problem'=>'Visitantes precisam entender rapidamente o serviço e como perguntar.','features'=>['Conteúdo semântico','Chamadas para ação','Composição adaptável'],'technologies'=>['HTML5','CSS3'],'github'=>'','demo'=>'','type'=>'Projeto demonstrativo'],
    ],
    'steps' => ['Conversa inicial','Entendimento do objetivo','Proposta de escopo','Desenvolvimento','Revisão e entrega'],
    'solutions' => ['Site institucional','Landing page','Sistema web','Integração','Manutenção'],
    'features' => ['Formulários','Área administrativa','Pesquisa e filtros','Relatórios','Integração de dados'],
    'graphics' => ['quality'=>'auto','particles'=>90],
    'seo' => ['title'=>'Red Protocol — Portfólio de desenvolvimento','description'=>'Portfólio profissional de desenvolvimento web e soluções digitais.'],
];
