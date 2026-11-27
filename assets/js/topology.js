/* Rede conceitual em SVG: elementos nomeados, uma única linha de animação e interação acessível. */
(() => {
  const svg = document.querySelector('#network-topology');
  const stage = document.querySelector('#topology-stage');
  if (!svg || !stage) return;
  const ns = 'http://www.w3.org/2000/svg';
  const nodes = [
    { id:'internet', name:'Internet', category:'perimeter', detail:'Origem conceitual do tráfego externo.' },
    { id:'firewall', name:'Firewall', category:'perimeter', detail:'Controla a comunicação entre redes.' },
    { id:'gateway', name:'Gateway', category:'infrastructure', detail:'Encaminha conexões para os serviços internos.' },
    { id:'switch', name:'Switch', category:'infrastructure', detail:'Distribui a conexão na rede local.' },
    { id:'web', name:'Servidor web', category:'applications', detail:'Entrega páginas e interfaces.' },
    { id:'api', name:'API', category:'applications', detail:'Organiza a comunicação entre aplicações.' },
    { id:'auth', name:'Autenticação', category:'applications', detail:'Verifica o acesso aos serviços.' },
    { id:'database', name:'Banco de dados', category:'data', detail:'Armazena informações estruturadas.' },
    { id:'backup', name:'Backup', category:'data', detail:'Representa cópias de recuperação.' },
    { id:'monitor', name:'Monitoramento', category:'monitoring', detail:'Acompanha o estado dos componentes.' },
    { id:'events', name:'Eventos', category:'monitoring', detail:'Registra ocorrências relevantes.' },
    { id:'desktop', name:'Estação', category:'devices', detail:'Dispositivo de acesso à rede.' },
    { id:'mobile', name:'Móvel', category:'devices', detail:'Acesso por dispositivo portátil.' }
  ];
  const edges = [
    ['internet','firewall'],['firewall','gateway'],['gateway','switch'],['gateway','web'],
    ['gateway','monitor'],['switch','desktop'],['switch','mobile'],['switch','api'],
    ['web','api'],['api','auth'],['api','database'],['auth','database'],
    ['database','backup'],['monitor','events'],['monitor','web'],['events','database']
  ];
  const categories = {
    perimeter:'PERÍMETRO', infrastructure:'INFRAESTRUTURA', applications:'APLICAÇÕES',
    data:'DADOS', monitoring:'MONITORAMENTO', devices:'DISPOSITIVOS'
  };
  const byId = Object.fromEntries(nodes.map(node => [node.id,node]));
  const desktop = {
    internet:[90,100], firewall:[260,100], gateway:[425,100], switch:[415,245],
    web:[620,90], api:[620,205], auth:[730,290], database:[610,385], backup:[730,440],
    monitor:[225,395], events:[90,415], desktop:[270,255], mobile:[90,270]
  };
  const mobile = {
    internet:[92,58], firewall:[268,58], gateway:[180,168], switch:[92,286],
    web:[268,286], api:[268,396], auth:[268,506], database:[268,616], backup:[268,726],
    monitor:[92,616], events:[92,726], desktop:[92,396], mobile:[92,506]
  };
  const categoryOrder = Object.keys(categories);
  const modeButtons = [...document.querySelectorAll('[data-core-mode]')];
  const area = document.querySelector('#cluster-select');
  const pauseButton = document.querySelector('#core-pause');
  const description = document.querySelector('#core-description');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = 'network', filter = 'all', selected = null, paused = reducedMotion.matches;
  let isMobile = false, viewWidth = 800, viewHeight = 500;
  let panX = 0, panY = 0, dragging = null, animation = 0, lastFrame = 0, progress = 0;
  let scene, packets = [], visible = true;

  function element(tag, attributes = {}, parent) {
    const el = document.createElementNS(ns, tag);
    for (const [key,value] of Object.entries(attributes)) el.setAttribute(key, value);
    if (parent) parent.append(el);
    return el;
  }
  function point(id) {
    if (mode !== 'cluster') {
      if (isMobile) return mobile[id];
      const [x,y]=desktop[id];
      return [400+(x-400)*.9,y];
    }
    const index = categoryOrder.indexOf(byId[id].category);
    const members = nodes.filter(node => node.category === byId[id].category);
    const position = members.findIndex(node => node.id === id);
    if (isMobile) {
      const col = index % 2, row = Math.floor(index / 2);
      return [col ? 268 : 92, 65 + row * 245 + position * 66];
    }
    const col = index % 3, row = Math.floor(index / 3);
    return [145 + col * 255, 90 + row * 245 + position * 67];
  }
  function relevant(node) { return filter === 'all' || node.category === filter; }
  function related(a,b) { return edges.some(([from,to]) => (from===a && to===b) || (from===b && to===a)); }
  function nodeDimmed(node) {
    if (!relevant(node)) return true;
    return !!selected && mode === 'focus' && node.id !== selected && !related(node.id,selected);
  }
  function edgeState(a,b) {
    if (filter !== 'all' && !relevant(byId[a]) && !relevant(byId[b])) return 'is-dimmed';
    if (!selected || a === selected || b === selected) return 'is-highlighted';
    return mode === 'focus' ? 'is-dimmed' : 'is-muted';
  }
  function updateDescription() {
    const base = {
      network:'Estrutura e conexões entre componentes.',
      flow:'Pacotes percorrem as conexões entre componentes.',
      cluster:'Componentes organizados por responsabilidade.',
      focus:'Conexões diretas do componente selecionado.'
    }[mode];
    const node = selected && byId[selected];
    const focus = node ? `${node.name} · ${categories[node.category].toLowerCase()}: ${node.detail}` : base;
    description.textContent = focus + (filter === 'all' ? '' : ` Área: ${categories[filter].toLowerCase()}.`);
  }
  function updateButtons() {
    modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.coreMode === mode)));
    pauseButton.textContent = paused ? 'Retomar' : 'Pausar';
    pauseButton.setAttribute('aria-pressed', String(paused));
  }
  function redraw() {
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${viewWidth} ${viewHeight}`);
    scene = element('g', { transform:`translate(${panX} ${panY})` }, svg);
    if (mode === 'cluster') {
      categoryOrder.forEach((category,index) => {
        const members = nodes.filter(node => node.category === category);
        const points = members.map(node => point(node.id));
        const x = Math.min(...points.map(p => p[0])) - (isMobile ? 78 : 62);
        const y = Math.min(...points.map(p => p[1])) - 47;
        const width = isMobile ? 156 : 125;
        const height = Math.max(...points.map(p => p[1])) - Math.min(...points.map(p => p[1])) + 95;
        const group = element('g', { class:`topology-cluster ${filter !== 'all' && filter !== category ? 'is-dimmed' : ''}`, 'data-category':category }, scene);
        element('rect', { x,y,width,height,rx:17 }, group);
        const label=element('text',{x:x+11,y:y+16},group); label.textContent=categories[category];
      });
    }
    const links = element('g', { class:'topology-links' }, scene);
    const packetLayer = element('g', { class:'topology-packets' }, scene);
    packets = [];
    edges.forEach(([a,b],index) => {
      const [x1,y1]=point(a), [x2,y2]=point(b);
      const state=edgeState(a,b);
      element('line', {x1,y1,x2,y2,class:`topology-link ${state}`},links);
      if (mode === 'flow' && state === 'is-highlighted' && index % 2 === 0) {
        const pulse=element('circle',{cx:x1,cy:y1,r:isMobile?4.4:5.2,class:'topology-packet'},packetLayer);
        packets.push({pulse,x1,y1,x2,y2,offset:index*.17});
      }
    });
    const nodeLayer = element('g',{class:'topology-nodes'},scene);
    nodes.forEach(node => {
      const [x,y]=point(node.id);
      const group=element('g',{
        class:`topology-node ${node.id===selected?'is-selected':''} ${nodeDimmed(node)?'is-dimmed':''}`,
        transform:`translate(${x} ${y})`, tabindex:'0', role:'button',
        'aria-label':`${node.name}. ${categories[node.category]}. ${node.detail}`,
        'aria-pressed':String(node.id===selected), 'data-node':node.id,
        'data-category':node.category
      },nodeLayer);
      element('rect',{x:isMobile?-68:-57,y:-23,width:isMobile?136:114,height:46,rx:9},group);
      element('circle',{cx:isMobile?-53:-43,cy:0,r:5,class:'topology-node-dot'},group);
      const label=element('text',{x:isMobile?-41:-31,y:4},group);label.textContent=node.name;
      const title=element('title',{},group);title.textContent=`${node.name}: ${node.detail}`;
      group.addEventListener('click',event => { event.stopPropagation(); selectNode(node.id); });
      group.addEventListener('keydown',event => {if(event.key==='Enter'||event.key===' '){event.preventDefault();selectNode(node.id);}});
    });
    updateDescription(); updateButtons();
    if (mode === 'flow' && !paused) startAnimation(); else stopAnimation();
  }
  function selectNode(id) {
    selected=id;
    if (filter !== 'all' && byId[id].category !== filter) {
      filter=byId[id].category;
      area.value=filter;
    }
    redraw();
  }
  function updatePackets() {
    const phase = progress;
    packets.forEach(({pulse,x1,y1,x2,y2,offset}) => {
      const t=(phase+offset)%1;
      pulse.setAttribute('cx',(x1+(x2-x1)*t).toFixed(2));
      pulse.setAttribute('cy',(y1+(y2-y1)*t).toFixed(2));
    });
  }
  function tick(time) {
    animation=0;
    if (!visible || document.hidden || paused || mode !== 'flow') return;
    progress=(progress+(lastFrame ? Math.min(time-lastFrame,60) : 16)/2400)%1;
    lastFrame=time;
    updatePackets();
    animation=requestAnimationFrame(tick);
  }
  function startAnimation() { if (!animation && visible && !document.hidden && !paused && mode==='flow') {lastFrame=0;animation=requestAnimationFrame(tick);} }
  function stopAnimation() {if(animation) cancelAnimationFrame(animation);animation=0;lastFrame=0;}
  function resize() {
    const mobileLayout=stage.clientWidth < 550;
    const width=mobileLayout ? 360 : 800, height=mobileLayout ? 790 : 500;
    if (isMobile!==mobileLayout || viewWidth!==width || viewHeight!==height) {
      isMobile=mobileLayout;viewWidth=width;viewHeight=height;panX=0;panY=0;redraw();
    }
  }
  modeButtons.forEach(button => button.addEventListener('click',() => {
    mode=button.dataset.coreMode;
    if(mode==='focus' && (!selected || (filter !== 'all' && byId[selected].category !== filter))) {
      selected=filter === 'all' ? 'firewall' : nodes.find(node => node.category === filter).id;
    }
    redraw();
  }));
  area.addEventListener('change',() => {
    filter=area.value;
    if (selected && filter !== 'all' && byId[selected].category !== filter) {
      selected=mode==='focus' ? nodes.find(node => node.category === filter).id : null;
    }
    redraw();
  });
  pauseButton.addEventListener('click',() => {paused=!paused;updateButtons();if(paused)stopAnimation();else startAnimation();});
  document.querySelector('#core-reset').addEventListener('click',() => {panX=0;panY=0;scene.setAttribute('transform','translate(0 0)');});
  svg.addEventListener('pointerdown',event => {
    if (event.button !== 0 || event.target.closest('.topology-node')) return;
    dragging={id:event.pointerId,x:event.clientX,y:event.clientY,startX:panX,startY:panY};
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove',event => {
    if (!dragging || dragging.id!==event.pointerId) return;
    const scale=viewWidth/svg.getBoundingClientRect().width;
    panX=Math.max(-75,Math.min(75,dragging.startX+(event.clientX-dragging.x)*scale));
    panY=Math.max(-55,Math.min(55,dragging.startY+(event.clientY-dragging.y)*scale));
    scene.setAttribute('transform',`translate(${panX} ${panY})`);
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture']) svg.addEventListener(name,() => {dragging=null;});
  document.addEventListener('visibilitychange',() => document.hidden ? stopAnimation() : startAnimation());
  new IntersectionObserver(entries => {visible=entries[0].isIntersecting;if(visible)startAnimation();else stopAnimation();},{threshold:.05}).observe(stage);
  new ResizeObserver(resize).observe(stage);
  redraw(); resize();
})();
