# Red Protocol — portfolio profissional

Portfólio em português brasileiro para apresentar serviços e projetos de desenvolvimento web. O conteúdo inicial é demonstrativo e deve ser revisado antes da publicação. A indexação começa desabilitada (`noindex,follow`) até a personalização.

## Tecnologias

PHP puro, HTML semântico, CSS, JavaScript sem dependências, SVG e WebGL 2 com GLSL ES. Não há banco conectado, compilação, framework ou dependência de execução. O Protocol Lab e o visualizador SQL trabalham somente em arrays locais no navegador.

## Estrutura

- `index.php`: ponto de entrada e composição das seções.
- `config/portfolio.php`: conteúdo, contatos, tecnologias, conexões, serviços, projetos e opções.
- `includes/`: escape HTML, links e moldura da página.
- `sections/`: conteúdo semântico de cada parte.
- `assets/css/`: tokens, layout, componentes, HUD, animações e breakpoints.
- `assets/js/`: navegação, mapas e experiências locais; `webgl/renderer.js` tem shaders e renderização.
- `assets/icons/favicon.svg`: favicon vetorial.

## Execução local

Com PHP 8.1 ou superior instalado, a partir desta pasta:

```sh
php -S 127.0.0.1:8080
```

Abra `http://127.0.0.1:8080`. Para conferir sintaxe PHP: `find . -name '*.php' -print0 | xargs -0 -n1 php -l`. Para checar scripts JS com Node opcional: `find assets/js -name '*.js' -print0 | xargs -0 -n1 node --check`.

## Personalização

Edite `config/portfolio.php`. Troque nome, cargo, biografia, localização e disponibilidade por informações verdadeiras. E-mail e WhatsApp ficam ocultos quando vazios. `github_url` e `linkedin` aceitam endereços `https://`; não publique links não verificados. Foto é opcional: adicione arquivo próprio em `assets/images/` e personalize a seção se desejar.

Edite os arrays `technologies`, `connections`, `services`, `projects`, `steps`, `solutions` e `features`. Cada tecnologia usa `id`, `name`, `category`, `description`, `uses`. Conexões ligam IDs conceituais; não significam dependência obrigatória. Serviços trazem problemas, benefícios e tecnologias associadas. Projetos demonstrativos devem ser substituídos ou claramente atualizados para refletir trabalho real; URLs de demonstração e repositório ficam vazias por padrão.

As cores e tipografia ficam em `assets/css/variables.css`. Os dados de cor dos shaders ficam em `assets/js/webgl/renderer.js`. `indexing` deve continuar `false` enquanto houver conteúdo demonstrativo. Antes da indexação, configure domínio, `canonical`, título, descrição e identidade reais e defina `indexing` como `true`. Enquanto `noindex` estiver ativo, buscadores que respeitam a diretiva não devem indexar a página; `robots.txt` permite rastreamento para que a diretiva possa ser lida.

## Experiências gráficas e demonstrações

O Neural Network Core usa contexto WebGL 2, shaders GLSL próprios, topologia fixa, buffers reutilizados, resolução limitada e animação suspensa fora da tela/aba. Pode ser arrastado com mouse ou toque sem capturar o gesto de rolagem. Os botões externos permitem modo, grupo, pausa e centralização. Sem WebGL, aparece uma composição CSS estática. Se movimento reduzido estiver ativo, a cena inicia pausada. Os shaders ficam embutidos em `assets/js/webgl/renderer.js` para não depender de MIME de arquivos GLSL.

O mapa de tecnologias permite filtrar e selecionar nós, com alternativa textual em lista. Protocol Lab ilustra GET, POST, PUT e DELETE em dados temporários locais. Database Visualizer mostra SELECT, WHERE, GROUP BY/COUNT/SUM e INNER JOIN calculados sobre registros fictícios; SQL é somente legenda educativa e nunca é executado. Mission Control constrói um resumo em memória e só copia após pedido explícito; não há armazenamento ou envio automático.

## Publicação em Nginx / HestiaCP

Copie os arquivos para `/var/www/portfolio-tech6`, configure o document root para essa pasta e PHP-FPM com `index.php` como índice. No HestiaCP, o caminho demonstrativo é `/home/USUARIO/web/DOMINIO/public_html/`. Use HTTPS via Certbot ou a emissão integrada ao painel. O site não depende de `.htaccess`. Restrinja acesso web a `.git`, arquivos ocultos e diretórios `config`, `includes`, `sections` e `work`; mantenha `index.php` como único PHP público, conforme a política do servidor. Sirva `assets/` como estáticos com MIME usual de CSS/JS/SVG. Não altere permissões para 777.

O projeto não requer acesso root. O mantenedor pode guardar personalizações em branch/commit próprio; antes de atualizar, preserve `config/portfolio.php` e arquivos de imagem personalizados, revise mudanças e resolva conflitos em vez de sobrescrever configuração sem cópia segura. Backups devem ficar fora do document root e nunca dentro do repositório público. Proteja `.git` no Nginx mesmo que a hospedagem bloqueie dotfiles por padrão.

## Checklist antes de publicar

- [ ] Nome, cargo, biografia, localização e disponibilidade verdadeiros.
- [ ] Foto opcional licenciada e contatos próprios configurados/testados.
- [ ] GitHub e LinkedIn revisados; tecnologias e serviços correspondem ao que oferece.
- [ ] Projetos demonstrativos substituídos ou identificados honestamente; links comprovados.
- [ ] Revise dados e descrições do Protocol Lab e Database Visualizer.
- [ ] Configure domínio, canonical, título e descrição SEO.
- [ ] Teste HTTPS, contatos, navegação por teclado, mobile e fallback sem WebGL.
- [ ] Teste visualização gráfica, filtros, demonstrações e resumo do configurador.
- [ ] Habilite indexação somente após finalizar personalização.

## Verificação realizada nesta entrega

Veja `work/PROGRESS.md` para a lista de verificações desta execução e limitações do ambiente. Não foi feito deploy nem push remoto.
