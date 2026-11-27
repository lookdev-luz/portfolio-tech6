# Portfólio 6 — modelo demonstrativo

Vocação inicial: cibersegurança e redes. Este modelo pode ser adaptado a qualquer área de tecnologia.

## Executar

Na pasta deste portfólio, use `php -S 127.0.0.1:8000 -t .` e abra o endereço local. Requer PHP 8.3 ou 8.4. Os recursos ficam em `assets/`.

## Personalizar

Edite `config/portfolio.php` para alterar nome, área, descrição, biografia, competências, projetos, contatos e SEO. Substitua estudos demonstrativos por trabalhos verificáveis. Deixe contato e rede social vazios quando não houver destino real autorizado. Use `example.com` para e-mails de demonstração. Inclua certificados e currículo apenas quando existirem.

As cores principais ficam em `assets/css/`. Imagens e ícones ficam em `assets/`; atualize as referências ao substituir um arquivo. Configure o domínio e canonical somente depois de obter o domínio definitivo. O modo demonstrativo deve continuar com `noindex`; habilite indexação apenas após preencher conteúdo real e revisar os metadados.

## Publicar

Copie esta pasta para o `public_html` do usuário correspondente, com `index.php` como entrada. No Nginx/HestiaCP, bloqueie acesso direto a `config/`, `includes/`, arquivos ocultos e backups. Ative HTTPS e confira links, CSS, JS, permissões, erros PHP e indexação no domínio final. Não copie dados privados ou credenciais para o diretório público.
