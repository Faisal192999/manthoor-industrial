const root = document.documentElement;
const header = document.querySelector('[data-header]');
const progress = document.querySelector('.reading-progress span');
const savedTheme = localStorage.getItem('manthoor-theme');
if (savedTheme) root.dataset.theme = savedTheme;

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('manthoor-theme', next);
});

const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false'); mobileMenu.classList.remove('open'); document.body.classList.remove('menu-open');
}));

function onScroll() {
  header?.classList.toggle('scrolled', scrollY > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const orbitMessage = document.querySelector('[data-orbit-message]');
document.querySelectorAll('[data-orbit]').forEach(node => {
  const show = () => { orbitMessage.textContent = node.dataset.orbit; };
  node.addEventListener('mouseenter', show); node.addEventListener('focus', show);
});

const sectors = {
  health: { n:'01 / 04', sector:'قطاع الصحة', title:'تدفّق أفضل للمريض، وقرار أسرع للفريق.', problem:'ازدحام غير متوقّع وانتظار طويل.', tool:'التنبؤ + المحاكاة + الجدولة.', impact:'توزيع أفضل للأسِرّة والكوادر.' },
  logistics: { n:'02 / 04', sector:'قطاع اللوجستيات', title:'الشحنة المناسبة، عبر المسار الأنسب، في الوقت الصحيح.', problem:'طلب متغيّر ومسارات مكلفة.', tool:'التنبؤ + التوجيه الأمثل.', impact:'تكلفة أقل وتسليم أكثر موثوقية.' },
  industry: { n:'03 / 04', sector:'قطاع الصناعة', title:'إنتاج مستقر يرى العطل قبل وقوعه.', problem:'توقفات مفاجئة وعيوب متكررة.', tool:'رؤية حاسوبية + صيانة تنبؤية.', impact:'جودة أعلى واستفادة أفضل من الأصول.' },
  cities: { n:'04 / 04', sector:'قطاع المدن', title:'مدينة تفهم الحركة وتستجيب لها.', problem:'ازدحام واستهلاك غير متوازن.', tool:'البيانات الحية + التحسين الشبكي.', impact:'تنقّل أفضل وموارد أكثر استدامة.' }
};
document.querySelectorAll('[data-sector]').forEach(button => button.addEventListener('click', () => {
  const d = sectors[button.dataset.sector];
  document.querySelectorAll('[data-sector]').forEach(b => b.setAttribute('aria-selected', String(b === button)));
  ['number','sector','title','problem','tool','impact'].forEach(key => {
    const el = document.querySelector(`[data-lab-${key}]`); if (el) el.textContent = d[key === 'number' ? 'n' : key];
  });
}));

const cycleData = [
  ['UNDERSTAND','ابدأ بالنظام، لا بالخوارزمية.','حدّد الهدف، أصحاب المصلحة، تدفق العملية، القيود ومقياس النجاح. السؤال الجيد يسبق البيانات الجيدة.'],
  ['PREPARE','حوّل الواقع إلى بيانات موثوقة.','اجمع البيانات من مصادرها، افهم معناها، عالج النقص والانحياز، وابنِ متغيرات تصف النظام فعلًا.'],
  ['PREDICT','استكشف ما يُحتمل أن يحدث.','استخدم الإحصاء وتعلم الآلة لتقدير الطلب أو التأخير أو العطل، وقيّم النموذج بمقياس يخدم القرار.'],
  ['OPTIMIZE','اختر الإجراء الأفضل ضمن القيود.','ادمج التنبؤ مع نموذج تحسين يوازن التكلفة والجودة والوقت والسعة ليقترح قرارًا قابلًا للتطبيق.'],
  ['IMPACT','اختبر، طبّق، ثم قِس الأثر.','حاكي القرار قبل إطلاقه، راقب المؤشرات بعد التنفيذ، وتعلّم من النتائج لتبدأ دورة تحسين جديدة.']
];
document.querySelectorAll('[data-cycle-step]').forEach(button => button.addEventListener('click', () => {
  const i = Number(button.dataset.cycleStep), d = cycleData[i];
  document.querySelectorAll('[data-cycle-step]').forEach(b => b.setAttribute('aria-selected', String(b === button)));
  document.querySelector('[data-cycle-label]').textContent = d[0];
  document.querySelector('[data-cycle-title]').textContent = d[1];
  document.querySelector('[data-cycle-text]').textContent = d[2];
  document.querySelector('[data-cycle-count]').textContent = `${String(i + 1).padStart(2,'0')} / 05`;
  document.querySelector('.cycle-meter i').style.width = `${(i + 1) * 20}%`;
}));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === button));
  document.querySelectorAll('[data-category]').forEach(card => {
    const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
    card.hidden = !show;
  });
}));
