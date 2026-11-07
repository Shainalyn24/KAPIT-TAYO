(function () {
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var mods = [
    { id: 'start', name: 'Start', desc: '' },
    { id: 'places', name: 'Where it happens', desc: 'Street, online, school and work' },
    { id: 'numbers', name: 'The numbers', desc: 'Reports, police data and surveys' },
    { id: 'law', name: 'The law', desc: 'Penalties and who must act' },
    { id: 'help', name: 'What to do', desc: 'Three steps' },
    { id: 'hotlines', name: 'Get help', desc: 'Hotlines and a report script' },
    { id: 'quiz', name: 'Quiz', desc: 'Six questions' },
    { id: 'sources', name: 'Sources', desc: '' }
  ];
  var learn = ['places', 'numbers', 'law', 'help', 'hotlines', 'quiz'];
  var seen = { start: true };
  var nav = document.getElementById('nav'), todo = document.getElementById('todo'), fab = document.getElementById('fab');

  mods.forEach(function (m, i) {
    var b = el('button', null, '<span class="n">' + (i === 0 ? '★' : i === 7 ? 'R' : i) + '</span><span>' + m.name + '</span>');
    b.type = 'button'; b.setAttribute('data-id', m.id);
    b.addEventListener('click', function () { go(m.id); });
    nav.appendChild(b);
    if (i >= 1 && i <= 6) {
      var t = el('button', null, '<b>' + i + '. ' + m.name + '</b><span>' + m.desc + '</span>'); t.type = 'button';
      t.addEventListener('click', function () { go(m.id); });
      todo.appendChild(t);
    }
  });

  function go(id) {
    mods.forEach(function (m) { document.getElementById('m-' + m.id).hidden = m.id !== id; });
    seen[id] = true;
    nav.querySelectorAll('button').forEach(function (b) {
      var bid = b.getAttribute('data-id');
      if (bid === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      b.classList.toggle('seen', (!!seen[bid] && bid !== 'start') || (bid === 'start' && id !== 'start'));
    });
    var n = 0; learn.forEach(function (k) { if (seen[k]) n++; });
    document.getElementById('prog-t').textContent = n + ' of ' + learn.length + ' modules opened';
    document.getElementById('prog-b').style.width = (n / learn.length * 100) + '%';
    fab.hidden = id === 'hotlines';
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go')); }); });

  /* bar rows: [label, value, text shown] ; bar length = value / max */
  function rows(id, data, max, hot) {
    var host = document.getElementById(id);
    data.forEach(function (d) {
      var shown = d[2] || d[1] + '%';
      var w = Math.min(100, d[1] / max * 100);
      host.appendChild(el('div', 'row' + (hot ? ' hot' : ''),
        '<div class="row-top"><span>' + d[0] + '</span><b>' + shown + '</b></div>' +
        '<div class="track" role="img" aria-label="' + shown + '"><i style="--w:' + w + '%"></i></div>'));
    });
  }

  /* PCW: reports of Safe Spaces Act violations (GMA News Online, 31 March 2026) */
  rows('rows-pcw', [['2021', 155, '155'], ['2022', 283, '283'], ['2023', 456, '456'], ['2024', 515, '515'], ['2025', 612, '612']], 650, false);

  /* PNP helpline complaints from women and children (Manila Bulletin, 6 March 2024) */
  rows('rows-online', [
    ['Cyberlibel (harmful online posts), at least', 20, '20%'],
    ['Sextortion (blackmail)', 19, '19%'],
    ['Online data hacking', 12, '12%'],
    ['Online crimes against children', 8, '8%']
  ], 100, true);

  /* Workplace violence or harassment (Lloyd's Register Foundation and Gallup, World Risk Poll 2021) */
  rows('rows-work', [['Women employees', 22], ['Men employees', 18]], 100, false);

  /* SWS Safe Cities survey, Quezon City, February 2016 */
  rows('rows-street', [
    ['Young women (18 to 24) harassed at least once <sup><a href="#r6">6</a></sup>', 88],
    ['Women harassed at least once in their lives (3 in 5) <sup><a href="#r7">7</a></sup>', 60],
    ['Harasser was a stranger <sup><a href="#r8">8</a></sup>', 70],
    ['Happened in the daytime, 6 am to 6 pm <sup><a href="#r8">8</a></sup>', 70],
    ['Did nothing afterwards <sup><a href="#r6">6</a></sup>', 50],
    ['Faced the worst kinds, like groping or flashing <sup><a href="#r8">8</a></sup>', 34]
  ], 100, false);

  /* stepper */
  var steps = [
    { h: 'Save proof', p: 'Take screenshots. Note the date, time and place.' },
    { h: 'Report it', p: 'Online: the PNP Anti-Cybercrime Group.<sup><a href="#r5">5</a><a href="#r13">13</a></sup> In public: the staff of the place, the police or your local hotline.<sup><a href="#r2">2</a><a href="#r3">3</a></sup> The Get help module has the numbers.' },
    { h: 'Believe them', p: 'Never blame a victim for what they wore. In the 2016 survey, more women than men did.<sup><a href="#r9">9</a></sup>' }
  ];
  var si = 0, st = document.getElementById('stepper');
  function drawStep() {
    var s = steps[si];
    st.innerHTML = '<div class="dots">' + steps.map(function (_, i) { return '<i class="' + (i <= si ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="stepbox"><span class="num">' + (si + 1) + '</span><div><h3>' + s.h + '</h3><p>' + s.p + '</p></div></div>' +
      '<div class="btns"><button type="button" class="btn ghost" id="sp"' + (si === 0 ? ' disabled' : '') + '>Back</button><button type="button" class="btn" id="sn"' + (si === steps.length - 1 ? ' disabled' : '') + '>Next step</button></div>';
    document.getElementById('sp').addEventListener('click', function () { si--; drawStep(); });
    document.getElementById('sn').addEventListener('click', function () { si++; drawStep(); });
  }
  drawStep();

  /* ---------- Get help: hotline data (numbers checked November 2026, see Sources r21 to r27) ---------- */
  var HOT = {
    e911: { name: '911 National Emergency Hotline', who: 'Police, rescue and other emergency help.',
      note: 'Use it when someone is in danger. Physical abuse or danger goes to the police. Other cases can go to the barangay VAW desk. Reports are handled in strict confidence.',
      refs: '<sup><a href="#r21">21</a></sup>', nums: [{ t: '911', copy: '911', tel: '911' }] },
    aleng: { name: 'PNP Aleng Pulis hotline', who: 'Women and Children Protection Center of the Philippine National Police.',
      note: 'For harassment, abuse and violence against women and children. The mobile number is listed as a text hotline.',
      refs: '<sup><a href="#r22">22</a><a href="#r27">27</a></sup>',
      nums: [{ t: '0919-777-7377', label: 'Text or call', copy: '0919-777-7377', tel: '09197777377' }, { t: '(02) 8532-6690', label: 'Women and Children Protection Center office', copy: '(02) 8532-6690', tel: '0285326690' }] },
    acg: { name: 'PNP Anti-Cybercrime Group', who: 'Online harassment, blackmail and sharing of private photos.',
      note: 'Report through its website. Its AlengPulis with the CyberSquad helpline for women and children runs through social media.',
      refs: '<sup><a href="#r26">26</a><a href="#r25">25</a></sup>', nums: [], link: { href: 'https://acg.pnp.gov.ph', text: 'acg.pnp.gov.ph' } },
    nbi: { name: 'NBI Cybercrime Division', who: 'Online crimes such as blackmail and sharing private photos without consent.',
      note: 'The hotline inquiries line of the National Bureau of Investigation.',
      refs: '<sup><a href="#r25">25</a><a href="#r22">22</a></sup>', nums: [{ t: '(02) 8523-8231 to 38', copy: '(02) 8523-8231', tel: '0285238231' }] },
    ncmh: { name: 'NCMH Crisis Hotline', who: 'Someone to talk to when you feel overwhelmed. Open 24/7, no holidays.', badge: '24/7',
      note: 'The National Center for Mental Health. 1553 is a toll-free landline number.',
      refs: '<sup><a href="#r23">23</a></sup>',
      nums: [{ t: '1553', label: 'Landline', copy: '1553', tel: '1553' }, { t: '0919-057-1553', copy: '0919-057-1553', tel: '09190571553' }, { t: '0917-899-8727', copy: '0917-899-8727', tel: '09178998727' }] },
    t1343: { name: '1343 Actionline', who: 'Suspected human trafficking only.', badge: '24/7',
      note: 'Also reachable by email at 1343actionline@cfo.gov.ph.',
      refs: '<sup><a href="#r24">24</a></sup>',
      nums: [{ t: '1343', copy: '1343', tel: '1343' }, { t: '(02) 1343', label: 'Outside Metro Manila', copy: '(02) 1343', tel: '021343' }] },
    local: { name: 'Your barangay and local government', who: 'Barangay VAW desk and your city or town hall hotline.',
      note: 'The Safe Spaces Act requires local governments to run an anti-sexual harassment hotline, and bars, malls and cinemas must post the hotline number. The number differs by place, so ask your barangay or check the sign in the establishment.',
      refs: '<sup><a href="#r3">3</a><a href="#r2">2</a></sup>', nums: [] },
    school: { name: 'School or workplace committee', who: 'Committee on Decorum and Investigation (CODI) or HR.',
      note: 'Employers and schools must act on reports. Ask your guidance office, HR or school head how to file.',
      refs: '<sup><a href="#r5">5</a><a href="#r4">4</a></sup>', nums: [] }
  };
  var SIT = [
    { id: 'danger', label: 'I am in danger now', ids: ['e911', 'aleng'], tip: 'Move to a safe, busy place if you can, then call 911.' },
    { id: 'public', label: 'Harassed in public', ids: ['aleng', 'e911', 'local'], tip: 'Note the place, time and vehicle plate if you can. Staff of the place must help you report.' },
    { id: 'online', label: 'Harassed online', ids: ['acg', 'nbi', 'aleng'], tip: 'Take screenshots before you block or delete anything.' },
    { id: 'photos', label: 'Threatened with my photos', ids: ['acg', 'nbi', 'e911'], tip: 'Keep every message as proof, then report it. Sextortion is one of the most common complaints to the police helpline.' },
    { id: 'work', label: 'At school or work', ids: ['school', 'aleng', 'local'], tip: 'Write down dates, places and who saw it. Employers and school heads can be held responsible if they ignore a report.' },
    { id: 'talk', label: 'I need someone to talk to', ids: ['ncmh', 'local'], tip: 'You can call even if you are not sure what you need. The crisis hotline is open day and night.' },
    { id: 'traffick', label: 'I suspect trafficking', ids: ['t1343', 'e911'], tip: 'Use 911 if someone is in immediate danger.' }
  ];

  function numHtml(n) {
    return '<div class="c-num"><div><b>' + n.t + '</b>' + (n.label ? '<div class="note">' + n.label + '</div>' : '') + '</div>' +
      '<div class="c-btns"><button type="button" class="btn small ghost copy-btn" data-copy="' + n.copy + '">Copy</button><a class="btn small" href="tel:' + n.tel + '">Call</a></div></div>';
  }
  function cardHtml(h) {
    return '<article class="contact"><div class="c-top"><h4>' + h.name + '</h4>' + (h.badge ? '<span class="year">' + h.badge + '</span>' : '') + '</div>' +
      '<p class="c-for">' + h.who + '</p>' + h.nums.map(numHtml).join('') +
      (h.link ? '<p><a href="' + h.link.href + '" target="_blank" rel="noopener">' + h.link.text + '</a></p>' : '') +
      '<p class="note">' + h.note + h.refs + '</p></article>';
  }

  var picker = document.getElementById('picker'), results = document.getElementById('results'), tip = document.getElementById('tip');
  function showSit(i) {
    var s = SIT[i];
    picker.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    tip.textContent = s.tip;
    results.innerHTML = s.ids.map(function (k) { return cardHtml(HOT[k]); }).join('');
  }
  SIT.forEach(function (s, i) {
    var b = el('button', 'pick', s.label); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { showSit(i); });
    picker.appendChild(b);
  });
  showSit(0);

  /* directory with search */
  var dir = document.getElementById('dir'), q = document.getElementById('dir-q');
  var order = ['e911', 'aleng', 'acg', 'nbi', 'ncmh', 't1343', 'local', 'school'];
  function drawDir() {
    var term = q.value.trim().toLowerCase();
    var list = order.filter(function (k) {
      var h = HOT[k];
      var text = (h.name + ' ' + h.who + ' ' + h.note + ' ' + h.nums.map(function (n) { return n.t; }).join(' ')).toLowerCase().replace(/<[^>]+>/g, '');
      return !term || term.split(/\s+/).every(function (w) { return text.indexOf(w) > -1; });
    });
    dir.innerHTML = list.length ? list.map(function (k) {
      var h = HOT[k];
      return '<div class="dir-row"><div><b>' + h.name + '</b>' + (h.badge ? ' <span class="year">' + h.badge + '</span>' : '') + '<p class="c-for">' + h.who + '</p></div>' +
        '<p class="note" style="font-size:0.92rem">' + h.note + h.refs + '</p>' +
        '<div>' + h.nums.map(numHtml).join('') + (h.link ? '<p><a href="' + h.link.href + '" target="_blank" rel="noopener">' + h.link.text + '</a></p>' : '') + '</div></div>';
    }).join('') : '<p class="dir-empty">No contact matches that search. Try a shorter word, like "online" or "911".</p>';
  }
  q.addEventListener('input', drawDir);
  drawDir();

  /* copy buttons (delegated, works for generated buttons) */
  function copyText(txt, done) {
    function fallback() {
      var ta = el('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done(ok);
    }
    try { navigator.clipboard.writeText(txt).then(function () { done(true); }, fallback); } catch (e) { fallback(); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.copy-btn');
    if (!b) return;
    var txt = b.id === 'b-copy' ? document.getElementById('b-out').textContent : b.getAttribute('data-copy');
    var label = b.getAttribute('data-label') || b.textContent;
    b.setAttribute('data-label', label);
    copyText(txt, function (ok) {
      b.textContent = ok ? 'Copied' : 'Copy not allowed here';
      setTimeout(function () { b.textContent = label; }, 1800);
    });
  });

  /* report script builder (nothing is stored or sent) */
  var TYPE = { public: 'harassment in a public place or vehicle', online: 'online harassment', school: 'harassment at school', work: 'harassment at work' };
  var bType = document.getElementById('b-type'), bDate = document.getElementById('b-date'), bPlace = document.getElementById('b-place'), bWho = document.getElementById('b-who'), bOut = document.getElementById('b-out');
  function build() {
    var d = bDate.value;
    var when = d ? new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' }) : '[add the date]';
    var ev = [];
    [0, 1, 2].forEach(function (i) { var c = document.getElementById('b-ev' + i); if (c.checked) ev.push(c.value); });
    bOut.textContent = [
      'Hello, I want to ask how to report gender-based sexual harassment.',
      'What happened: ' + TYPE[bType.value] + '.',
      'When: ' + when + '.',
      'Where: ' + (bPlace.value.trim() || '[add the place or app]') + '.',
      'Who: ' + (bWho.value.trim() || 'I do not know the person') + '.',
      'Proof I have: ' + (ev.length ? ev.join(', ') : 'none yet') + '.',
      'Please tell me the steps to file a report under the Safe Spaces Act (RA 11313).'
    ].join('\n');
  }
  ['input', 'change'].forEach(function (evt) {
    [bType, bDate, bPlace, bWho, document.getElementById('b-ev0'), document.getElementById('b-ev1'), document.getElementById('b-ev2')].forEach(function (c) { c.addEventListener(evt, build); });
  });
  build();

  /* quiz */
  var qs = [
    { q: 'Which law punishes catcalling in public places?', o: ['The Safe Spaces Act (RA 11313)', 'No law covers it', 'Only the 1995 law'], a: 0, w: 'The Safe Spaces Act punishes catcalling and whistling.', r: '<sup><a href="#r2">2</a></sup>' },
    { q: 'Someone says "it was just a joke". Is it still harassment?', o: ['No, a joke is an excuse', 'Yes, motive does not matter', 'Only online'], a: 1, w: 'The Act covers unwanted sexual remarks or actions whatever the motive.', r: '<sup><a href="#r2">2</a></sup>' },
    { q: 'Who takes complaints about online harassment?', o: ['The PNP Anti-Cybercrime Group', 'Only the barangay', 'No one'], a: 0, w: 'The PNP Anti-Cybercrime Group receives and enforces online complaints.', r: '<sup><a href="#r5">5</a></sup>' },
    { q: 'How did reports of Safe Spaces Act violations to the PCW change from 2021 to 2025?', o: ['They fell', 'They stayed the same', 'They rose from 155 to 612'], a: 2, w: 'Reports rose every year. The PCW says this may mean more victims are speaking up.', r: '<sup><a href="#r17">17</a></sup>' },
    { q: 'In the 2016 Quezon City survey, who was the harasser most often?', o: ['A family member', 'A stranger', 'A teacher'], a: 1, w: '70% of women said the harasser was a stranger.', r: '<sup><a href="#r8">8</a></sup>' },
    { q: 'What happens if a school head ignores a harassment report?', o: ['Nothing', 'They can be held responsible', 'The victim is punished'], a: 1, w: 'Employers and school heads can be held liable if they do not act.', r: '<sup><a href="#r4">4</a></sup>' }
  ];
  var qi = 0, score = 0, qz = document.getElementById('quiz');
  function drawQ() {
    var q = qs[qi];
    qz.innerHTML = '<span class="eyebrow">Question ' + (qi + 1) + ' of ' + qs.length + '</span><h3 style="margin-top:8px">' + q.q + '</h3><div class="opts"></div><p class="why"></p><div class="btns"><button type="button" class="btn" id="qn" hidden></button></div>';
    var opts = qz.querySelector('.opts'), why = qz.querySelector('.why'), nx = document.getElementById('qn');
    q.o.forEach(function (t, i) {
      var b = el('button', 'opt', t); b.type = 'button';
      b.addEventListener('click', function () {
        opts.querySelectorAll('.opt').forEach(function (x, j) { x.disabled = true; if (j === q.a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
        if (i === q.a) score++;
        why.innerHTML = '<b>' + (i === q.a ? 'Correct.' : 'Not quite.') + '</b> ' + q.w + q.r;
        nx.hidden = false; nx.textContent = qi === qs.length - 1 ? 'See my score' : 'Next question'; nx.focus();
      });
      opts.appendChild(b);
    });
    nx.addEventListener('click', function () { qi++; if (qi < qs.length) drawQ(); else endQ(); });
  }
  function endQ() {
    qz.innerHTML = '<span class="eyebrow">Your score</span><div class="score">' + score + ' / ' + qs.length + '</div><p style="margin:8px 0 16px">' + (score >= 5 ? 'You know the basics. Share this with a friend.' : 'Review the modules and try once more.') + '</p><button type="button" class="btn" id="qr">Try again</button>';
    document.getElementById('qr').addEventListener('click', function () { qi = 0; score = 0; drawQ(); });
  }
  drawQ();

  /* reference links jump to the Sources module */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('sup a');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(1);
    go('sources');
    var t = document.getElementById(id);
    if (t) { t.scrollIntoView(); t.style.background = 'var(--wash)'; setTimeout(function () { t.style.background = ''; }, 1800); }
  });

  go('start');
})();
