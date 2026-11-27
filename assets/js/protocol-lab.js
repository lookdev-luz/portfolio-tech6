(() => {
  const buttons = [...document.querySelectorAll('[data-operation]')];
  const run = document.getElementById('run-protocol');
  const status = document.getElementById('protocol-status');
  const output = document.querySelector('#protocol-output code');
  if (!run || !status || !output || !buttons.length) return;

  const descriptions = {
    GET: 'Consultar itens demonstrativos.',
    POST: 'Adicionar um item demonstrativo.',
    PUT: 'Atualizar um item demonstrativo.',
    DELETE: 'Remover um item demonstrativo.'
  };
  let selected = 'GET';
  let items = [{ id: 1, nome: 'Registro de estudo' }];

  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.operation;
    buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    status.textContent = `${selected}: ${descriptions[selected]}`;
  }));

  run.addEventListener('click', () => {
    if (selected === 'POST') items.push({ id: Date.now(), nome: 'Novo registro demonstrativo' });
    if (selected === 'PUT' && items.length) items[0].nome = 'Registro atualizado';
    if (selected === 'DELETE') items = items.slice(1);
    const result = { operacao: selected, status: 'simulação concluída', itens: items };
    output.textContent = JSON.stringify(result, null, 2);
    status.textContent = `${selected}: operação simulada apenas neste navegador.`;
  });
})();
