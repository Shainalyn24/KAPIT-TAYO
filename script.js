(function () {
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var mods = [
    { id: 'start', name: 'Start', desc: '' },
    { id: 'places', name: 'Where it happens', desc: 'Street, online, school and work' },
    { id: 'numbers', name: 'The numbers', desc: 'Reports, police data and surveys' },
    { id: 'law', name: 'Protection Laws', desc: 'Penalties and who must act' },
    { id: 'help', name: 'What to do', desc: 'Three steps' },
    { id: 'hotline', name: 'Get help', desc: 'Hotlines and a call script' },
    { id: 'quiz', name: 'Quiz', desc: 'Six questions' },
    { id: 'sources', name: 'Sources', desc: '' }
  ];
  var seen = { start: true };
  var nav = document.getElementById('nav'), todo = document.getElementById('todo');

  mods.forEach(function (m, i) {
    var b = el('button', null, '<span class="n">' + (i === 0 ? '★' : m.id === 'sources' ? 'R' : i) + '</span><span>' + m.name + '</span>');
    b.type = 'button'; b.setAttribute('data-id', m.id);
    b.addEventListener('click', function () { go(m.id); });
    nav.appendChild(b);
    if (m.id !== 'start' && m.id !== 'sources') {
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
    var n = 0; ['places', 'numbers', 'law', 'help', 'hotline', 'quiz'].forEach(function (k) { if (seen[k]) n++; });
    document.getElementById('prog-t').textContent = n + ' of 6 topics explored';
    document.getElementById('prog-b').style.width = (n / 6 * 100) + '%';
    var fb = document.getElementById('fab'); if (fb) fb.hidden = id === 'hotline';
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-go]'); if (b) go(b.getAttribute('data-go')); });

  /* bar rows: [label, value, text shown, optional highlight] ; bar length = value / max */
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
  rows('rows-pcw', [
    ['2021', 155, '155'],
    ['2022', 283, '283'],
    ['2023', 456, '456'],
    ['2024', 515, '515'],
    ['2025', 612, '612']
  ], 650, false);

  /* PNP helpline complaints from women and children (Manila Bulletin, 6 March 2024) */
  rows('rows-online', [
    ['Cyberlibel (harmful online posts), at least', 20, '20%'],
    ['Sextortion (blackmail)', 19, '19%'],
    ['Online data hacking', 12, '12%'],
    ['Online crimes against children', 8, '8%']
  ], 100, true);

  /* Workplace violence or harassment (Lloyd's Register Foundation and Gallup, World Risk Poll 2021) */
  rows('rows-work', [
    ['Women employees', 22],
    ['Men employees', 18]
  ], 100, false);

  /* SWS Safe Cities survey, Quezon City, February 2016 */
  rows('rows-street', [
    ['Young women (18 to 24) harassed at least once <sup><a href="#r6">6</a></sup>', 88],
    ['Women harassed at least once in their lives (3 in 5) <sup><a href="#r7">7</a></sup>', 60],
    ['Harasser was a stranger <sup><a href="#r8">8</a></sup>', 70],
    ['Happened in the daytime, 6 am to 6 pm <sup><a href="#r8">8</a></sup>', 70],
    ['Did nothing afterwards <sup><a href="#r6">6</a></sup>', 50],
    ['Faced the worst kinds, like groping or flashing <sup><a href="#r8">8</a></sup>', 34]
  ], 100, false);

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
    qz.innerHTML = '<span class="eyebrow">Your score</span><div class="score">' + score + ' / ' + qs.length + '</div><p style="margin:8px 0 16px">' + (score >= 5 ? 'You know the basics. Share this with a friend.' : 'Review the topics and try once more.') + '</p><button type="button" class="btn" id="qr">Try again</button>';
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

  /* private note-taker: kept in this tab only (sessionStorage), with an in-memory fallback */
  var notes = [];
  try { notes = JSON.parse(sessionStorage.getItem('kt-notes') || '[]'); } catch (e) { notes = []; }
  function persist() { try { sessionStorage.setItem('kt-notes', JSON.stringify(notes)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtWhen(v) { if (!v) return 'Time not set'; var d = new Date(v); return isNaN(d) ? v : d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }); }
  function noteText(n) { return 'When: ' + fmtWhen(n.when) + '\nWhere or platform: ' + (n.where || '-') + '\nWho: ' + (n.who || '-') + '\nWhat happened: ' + (n.what || '-'); }
  function copyText(t, msg) {
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast(msg); }, function () { toast('Copy was blocked. Select the text instead.'); });
    else toast('Copy is not supported here.');
  }
  var nl = document.getElementById('note-list');
  function drawNotes() {
    nl.innerHTML = '';
    notes.forEach(function (n, i) {
      var d = el('div', 'note-item', '<b>' + esc(fmtWhen(n.when)) + '</b>' +
        (n.where ? '<p><span>Where:</span> ' + esc(n.where) + '</p>' : '') +
        (n.who ? '<p><span>Who:</span> ' + esc(n.who) + '</p>' : '') +
        (n.what ? '<p><span>What happened:</span> ' + esc(n.what) + '</p>' : ''));
      var x = el('button', 'linkbtn', 'Delete'); x.type = 'button';
      x.addEventListener('click', function () { notes.splice(i, 1); persist(); drawNotes(); });
      var cp = el('button', 'linkbtn', 'Copy'); cp.type = 'button';
      cp.addEventListener('click', function () { copyText(noteText(n), 'Note copied'); });
      d.appendChild(cp); d.appendChild(x); nl.appendChild(d);
    });
  }
  document.getElementById('nf').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = { when: document.getElementById('n-when').value, where: document.getElementById('n-where').value.trim(), who: document.getElementById('n-who').value.trim(), what: document.getElementById('n-what').value.trim() };
    if (!n.where && !n.who && !n.what) { toast('Add at least one detail first'); return; }
    notes.unshift(n); persist(); drawNotes(); this.reset(); toast('Note saved in this tab');
  });
  var clr = document.getElementById('n-clear'), clrT;
  function resetClr() { clr.removeAttribute('data-sure'); clr.textContent = 'Clear local logs'; }
  clr.addEventListener('click', function () {
    if (!notes.length) { toast('Nothing to clear'); return; }
    if (clr.getAttribute('data-sure')) { notes = []; persist(); drawNotes(); resetClr(); toast('Local logs cleared'); return; }
    clr.setAttribute('data-sure', '1'); clr.textContent = 'Tap again to confirm';
    clearTimeout(clrT); clrT = setTimeout(resetClr, 3000);
  });

  function toast(t) {
    var d = document.getElementById('toast');
    if (!d) { d = el('div', 'toast'); d.id = 'toast'; d.setAttribute('role', 'status'); document.body.appendChild(d); }
    d.textContent = t; d.classList.add('show'); clearTimeout(d._t); d._t = setTimeout(function () { d.classList.remove('show'); }, 1800);
  }

  /* get help: contacts [name, what it is for, numbers [label, tel, note], source, badge, where to go if no number] */
  var C = {
    e911: ['911 National Emergency Hotline', 'Police, rescue and other emergency help. Use it when someone is in danger.', [['911', '911']], 22],
    aleng: ['Aleng Pulis (PNP)', 'Helpline of the PNP Women and Children Protection Center. Call or text.', [['0919 777 7377', '09197777377'], ['0966 725 5961', '09667255961']], 22],
    pnp: ['PNP hotline', 'General police help and reports.', [['177', '177']], 23],
    wcpc: ['PNP Women and Children Protection Center', 'Takes complaints about violence and harassment against women and children.', [['(02) 8532-6690', '0285326690']], 23, '24/7'],
    nbi: ['NBI Violence Against Women and Children Desk', 'Investigation help, including online abuse and threats to share photos.', [['(02) 8525-6028', '0285256028']], 24],
    dswd: ['DSWD', 'Counseling and crisis help for women and children.', [['0918 912 2813', '09189122813', 'Text hotline'], ['(02) 8931-8101 to 07', '0289318101', 'Trunk line']], 24],
    ncmh: ['National Center for Mental Health', 'Crisis line when you need someone to talk to.', [['(02) 8989-8727', '028989-8727'.replace('-', '')], ['0917 899 8727', '09178998727']], 24],
    pao: ['Public Attorney\u2019s Office (PAO)', 'Free legal help for those who qualify. Ask for local 106 or 107.', [['(02) 8929-9436', '0289299436']], 23],
    dole: ['DOLE hotline', 'For harassment at work. Outside Metro Manila, dial (02) 1349.', [['1349', '1349']], 25],
    a1343: ['1343 Actionline', 'Suspected human trafficking only.', [['1343', '1343'], ['(02) 1343', '021343', 'Outside Metro Manila']], 26],
    vaw: ['Barangay VAW Desk', 'A first stop for reports and help.', [], 22, '', 'Go in person to your barangay hall.'],
    codi: ['School or workplace CODI', 'The committee that takes harassment complaints inside schools and offices.', [], 5, '', 'Ask your HR office or school administration.']
  };
  var S = [
    ['I am in danger now', ['e911', 'aleng', 'pnp'], 'Use 911 if someone is in immediate danger.'],
    ['Harassed in public', ['aleng', 'wcpc', 'pnp', 'vaw'], 'Get somewhere safe and populated first. Note the time, the place and any plate numbers.'],
    ['Harassed online', ['aleng', 'nbi', 'wcpc', 'pnp'], 'Take screenshots before you block or report. Keep links and usernames.'],
    ['Threatened with my photos', ['nbi', 'aleng', 'wcpc', 'dswd'], 'Do not delete the messages. Take screenshots and report.'],
    ['At school or work', ['codi', 'dole', 'vaw', 'pao'], 'Write down what happened and when, then report to your school or HR committee.'],
    ['I need someone to talk to', ['ncmh', 'dswd', 'aleng'], 'You do not have to explain everything. \u201CI need someone to talk to\u201D is enough.'],
    ['I suspect trafficking', ['a1343', 'e911', 'aleng'], 'Use 911 if someone is in immediate danger.']
  ];
  function numBlock(n, cls) {
    var d = el('div', cls || 'c-num', '<div><b>' + n[0] + '</b>' + (n[2] ? '<span class="sub">' + n[2] + '</span>' : '') + '</div>');
    var bt = el('div', 'c-btns'), cp = el('button', 'btn small ghost', 'Copy'), call = el('a', 'btn small', 'Call');
    cp.type = 'button'; call.href = 'tel:' + n[1];
    cp.addEventListener('click', function () { copyText(n[0], 'Copied ' + n[0]); });
    bt.appendChild(cp); bt.appendChild(call); d.appendChild(bt); return d;
  }
  function cardFor(k) {
    var c = C[k], d = el('div', 'contact', '<div class="c-top"><h4>' + c[0] + '</h4>' + (c[4] ? '<span class="year">' + c[4] + '</span>' : '') + '</div><p class="c-for">' + c[1] + '<sup><a href="#r' + c[3] + '">' + c[3] + '</a></sup></p>');
    c[2].forEach(function (n) { d.appendChild(numBlock(n)); });
    if (!c[2].length) d.appendChild(el('p', 'note', c[5]));
    return d;
  }
  var pk = document.getElementById('picker'), tip = document.getElementById('tip'), rs = document.getElementById('results');
  tip.textContent = 'Pick what happened above, or search the full list below.';
  S.forEach(function (s, i) {
    var b = el('button', 'pick', s[0]); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      pk.querySelectorAll('.pick').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      tip.textContent = s[2]; rs.innerHTML = ''; s[1].forEach(function (k) { rs.appendChild(cardFor(k)); });
    });
    pk.appendChild(b);
  });
  document.getElementById('copy911').addEventListener('click', function () { copyText('911', 'Copied 911'); });

  var dq = document.getElementById('dir-q'), dir = document.getElementById('dir');
  function drawDir() {
    var q = dq.value.trim().toLowerCase(), qd = q.replace(/\D/g, ''); dir.innerHTML = ''; var any = false;
    Object.keys(C).forEach(function (k) {
      var c = C[k], hay = (c[0] + ' ' + c[1] + ' ' + (c[5] || '')).toLowerCase(), nums = c[2].map(function (n) { return n[0].replace(/\D/g, ''); }).join(' ');
      if (q && hay.indexOf(q) < 0 && !(qd && nums.indexOf(qd) >= 0)) return;
      any = true;
      var r = el('div', 'dir-row', '<div><b>' + c[0] + '</b>' + (c[4] ? ' <span class="year">' + c[4] + '</span>' : '') + '</div><div class="c-for">' + c[1] + '<sup><a href="#r' + c[3] + '">' + c[3] + '</a></sup></div>');
      var col = el('div'); c[2].forEach(function (n) { col.appendChild(numBlock(n)); });
      if (!c[2].length) col.appendChild(el('p', 'note', c[5]));
      r.appendChild(col); dir.appendChild(r);
    });
    if (!any) dir.appendChild(el('p', 'dir-empty', 'No match. Try fewer words, or call 911 if you are in danger.'));
  }
  dq.addEventListener('input', drawDir); drawDir();

  /* script builder: updates as you type */
  var WHAT = { public: 'harassment in a public place or vehicle', online: 'harassment online', photos: 'threats to share my private photos or videos', work: 'harassment at school or work', known: 'harassment by someone I know', unsure: 'something that made me feel unsafe' };
  var sbo = document.getElementById('sb-out');
  function drawScript() {
    var w = document.getElementById('sb-when').value, d = w ? new Date(w + 'T00:00:00') : null, where = document.getElementById('sb-where').value.trim(), who = document.getElementById('sb-who').value.trim();
    var proof = [].map.call(document.querySelectorAll('input[name="proof"]:checked'), function (x) { return x.value; });
    sbo.textContent = 'Hello, I want to ask how to report gender-based sexual harassment.\n' +
      'What happened: ' + WHAT[document.getElementById('sb-what').value] + '.\n' +
      'When: ' + (d && !isNaN(d) ? d.toLocaleDateString('en-PH', { dateStyle: 'long' }) : '[add the date]') + '.\n' +
      'Where: ' + (where || '[add the place or app]') + '.\n' +
      'Who: ' + (who || 'I do not know the person') + '.\n' +
      'Proof I have: ' + (proof.length ? proof.join(', ') : 'none yet') + '.\n' +
      'Please tell me the steps to file a report under the Safe Spaces Act (RA 11313).';
  }
  document.querySelector('#m-hotline .builder').addEventListener('input', drawScript);
  document.querySelector('#m-hotline .builder').addEventListener('change', drawScript);
  document.getElementById('sb-cp').addEventListener('click', function () { copyText(sbo.textContent, 'Script copied'); });
  drawScript();

  drawNotes();
  go('start');
})();