import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CreditCard,
  Menu,
  MessageCircle,
  Send,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { legalTexts } from './legalTexts';

const accountUrl = 'https://barmenschool.site';
const paymentEndpoint = import.meta.env.VITE_PAYMENT_ENDPOINT || '/api/payments/create';
const installmentLinks = {
  start: 'https://portal.simpleloan.ru/_sl/AgBUrVrJ6hdCjec7DMAnQb/',
};

const courses = [
  {
    id: 'start',
    title: 'Барный старт',
    badge: 'Первый формат',
    oldPrice: 49990,
    price: 34990,
    duration: '5 очных мастер классов',
    lessons: 'очные встречи + видеоматериалы',
    description:
      'Знакомство с барной стойкой, классическими коктейлями, гостевым сервисом и рабочим ритмом.',
    details:
      'Формат для тех, кто хочет разобраться в устройстве бара: инвентарь, подготовка рабочей зоны, классика IBA, гостевой сервис и разбор типовых ситуаций.',
    highlights: ['Инвентарь и барная карта', 'Классика IBA', 'Обратная связь от консультанта'],
  },
  {
    id: 'pro',
    title: 'Миксология PRO',
    badge: 'Для роста',
    price: 59990,
    duration: '10 очных мастер классов',
    lessons: 'очные встречи + видеоматериалы + барный набор',
    description:
      'Авторские вкусы, премиальный алкоголь, фудпейринг, себестоимость и подача для сильного портфолио.',
    details:
      'Формат для участников, которым интересна вкусовая логика: кордиалы, инфьюзы, текстуры, карта коктейлей, экономика напитка и презентация идеи.',
    highlights: ['Кордиалы и инфьюзы', 'Карта коктейлей', 'Разбор авторской подачи'],
  },
  {
    id: 'service',
    title: 'Сервис HoReCa',
    badge: 'Зал и бар',
    price: 19900,
    duration: '10 встреч',
    lessons: 'консультационный формат',
    description:
      'Стандарты обслуживания, продажи без давления, винная база и работа с конфликтными ситуациями.',
    details:
      'Консультационный формат для сотрудников зала и бара: коммуникация, апсейл, сервисные стандарты, сложные гости и собеседование.',
    highlights: ['Этикет и апсейл', 'Работа с гостем', 'Резюме и собеседование'],
  },
  {
    id: 'waiter',
    title: 'Официант',
    badge: 'Сервис зала',
    price: 29990,
    duration: '4 очных мастер-класса',
    lessons: 'видеоматериалы',
    description:
      'Гостевой сервис, работа с меню, подача блюд и напитков, коммуникация с гостем и командой.',
    details:
      'Формат для тех, кто хочет уверенно чувствовать себя в зале: встреча гостя, знание меню, рекомендации без давления, работа с заказом, чек-лист смены и спокойное завершение визита.',
    highlights: ['Работа с меню и заказом', 'Коммуникация с гостем', 'Сервисные ситуации'],
  },
];

const reviews = [
  {
    name: 'Александр М.',
    role: 'участник встреч',
    date: '18 июня 2025',
    text: 'Понравилось, что стойку показали без лишней романтики: порядок, подготовка, чистые движения и спокойная голова в темпе.',
  },
  {
    name: 'Никита Р.',
    role: 'участник барного старта',
    date: '29 июля 2025',
    text: 'До этого путался в инвентаре и очередности действий. После встреч стало понятно, как собрать рабочую зону и не суетиться.',
  },
  {
    name: 'Екатерина В.',
    role: 'участница формата PRO',
    date: '12 августа 2025',
    text: 'Очень зашёл разбор вкуса: почему один коктейль выглядит собранным, а другой разваливается, хотя ингредиенты похожие.',
  },
  {
    name: 'Алина Т.',
    role: 'участница встреч по сервису',
    date: '7 сентября 2025',
    text: 'Стало проще говорить с гостем. Не заученные фразы, а нормальная логика: услышать запрос, предложить вариант и не давить.',
  },
  {
    name: 'Роман Г.',
    role: 'участник формата PRO',
    date: '3 октября 2025',
    text: 'Отдельно полезен блок про себестоимость. Я впервые посмотрел на напиток не только как на вкус, но и как на позицию в карте.',
  },
  {
    name: 'Дмитрий К.',
    role: 'бар-менеджер',
    date: '22 ноября 2025',
    text: 'Взял несколько идей для карты и пересобрал подачу напитков так, чтобы команде было проще держать единый стандарт.',
  },
  {
    name: 'Полина Н.',
    role: 'участница формата официанта',
    date: '16 декабря 2025',
    text: 'Больше всего помогла часть про меню и подачу. Теперь понимаю, как уверенно вести стол и не теряться в уточнениях.',
  },
  {
    name: 'Сергей Л.',
    role: 'участник встреч',
    date: '21 января 2026',
    text: 'Формат живой: много конкретики, реальные ситуации из смены, без ощущения, что тебе читают сухой регламент.',
  },
  {
    name: 'Мария С.',
    role: 'участница встреч по сервису',
    date: '14 февраля 2026',
    text: 'Самым полезным оказался разбор разговора с гостем: как предлагать варианты и не звучать навязчиво.',
  },
  {
    name: 'Владислав Е.',
    role: 'участник барного старта',
    date: '5 марта 2026',
    text: 'Понравилось, что ошибки разбирают спокойно. После этого не страшно брать шейкер в руки и пробовать ещё раз.',
  },
  {
    name: 'Илья П.',
    role: 'участник барного старта',
    date: '9 апреля 2026',
    text: 'До встреч бар казался хаосом. Сейчас понимаю логику станции, подготовку и то, как не теряться во время смены.',
  },
  {
    name: 'Ольга Б.',
    role: 'управляющая кафе',
    date: '24 апреля 2026',
    text: 'Брала формат для команды зала. Ребята стали увереннее общаться с гостями и лучше понимать, где бар и сервис пересекаются.',
  },
];

const imageUrls = {
  coupe: '/images/coupe.jpg',
  oldFashioned: '/images/old-fashioned.jpg',
  bar: '/images/bar.jpg',
};

const navItems = [
  ['Главная', '/'],
  ['Мастер-классы', '/courses'],
  ['О клубе', '/club'],
  ['Отзывы', '/reviews'],
  ['Контакты', '/contacts'],
];

const siteUrl = 'https://gold-pour.ru';
const defaultSeo = {
  title: 'Gold Pour — мастер-классы по барному делу',
  description:
    'Gold Pour — очные мастер-классы по барному делу, миксологии, бариста-направлению и сервису. Запись, оплата картой и рассрочка онлайн.',
};
const seoByPage = {
  home: defaultSeo,
  courses: {
    title: 'Мастер-классы Gold Pour — бар, миксология и сервис',
    description:
      'Выберите формат Gold Pour: барный старт, миксология PRO, сервис HoReCa или официант. Очные встречи, видеоматериалы, онлайн-оплата и рассрочка.',
  },
  club: {
    title: 'О клубе Gold Pour — барная практика и HoReCa',
    description:
      'Gold Pour объединяет практические форматы для бара, кофе и сервиса: разбор стойки, вкуса, подачи и работы с гостями.',
  },
  reviews: {
    title: 'Отзывы участников Gold Pour',
    description:
      'Отзывы участников о форматах Gold Pour: барная стойка, миксология, сервис, работа с меню и гостями.',
  },
  contacts: {
    title: 'Контакты Gold Pour',
    description:
      'Контакты Gold Pour: ИП Голева Диана Александровна, ИНН 590850694160, ОГРНИП 324595800127571.',
  },
  question: {
    title: 'Задать вопрос Gold Pour',
    description:
      'Задайте вопрос по формату, расписанию, оплате или корпоративной встрече Gold Pour.',
  },
  checkout: {
    title: 'Запись и оплата Gold Pour',
    description:
      'Запишитесь на формат Gold Pour, оплатите картой через Т-Банк или оформите рассрочку для Барного старта.',
  },
  terms: {
    title: 'Публичная оферта Gold Pour',
    description: 'Публичная оферта ИП Голева Диана Александровна для услуг Gold Pour.',
  },
  privacy: {
    title: 'Политика конфиденциальности Gold Pour',
    description: 'Политика конфиденциальности и обработки персональных данных Gold Pour.',
  },
  consent: {
    title: 'Согласие на обработку персональных данных Gold Pour',
    description: 'Согласие на обработку персональных данных для форм Gold Pour.',
  },
  consentSpread: {
    title: 'Согласие на распространение персональных данных Gold Pour',
    description: 'Согласие на распространение персональных данных для отзывов Gold Pour.',
  },
  consentMailing: {
    title: 'Согласие на рассылки Gold Pour',
    description: 'Согласие на получение информационных и рекламных сообщений Gold Pour.',
  },
  paymentSuccess: {
    title: 'Оплата прошла — Gold Pour',
    description: 'Страница успешной оплаты Gold Pour.',
  },
  paymentFail: {
    title: 'Оплата не прошла — Gold Pour',
    description: 'Страница неуспешной оплаты Gold Pour.',
  },
  paymentPending: {
    title: 'Платёж обрабатывается — Gold Pour',
    description: 'Страница обработки платежа Gold Pour.',
  },
};

function ensureMeta(selector, createElement) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = createElement();
    document.head.appendChild(element);
  }

  return element;
}

function setMeta(selector, content, createElement) {
  const element = ensureMeta(selector, createElement);
  element.setAttribute('content', content);
}

function updatePageSeo(route, activeCourse) {
  const courseSeo =
    route.page === 'course' && activeCourse
      ? {
          title: `${activeCourse.title} — Gold Pour`,
          description: `${activeCourse.description} Стоимость: ${formatPrice(activeCourse.price)}.`,
        }
      : null;
  const seo = courseSeo || seoByPage[route.page] || defaultSeo;
  const canonicalPath = route.path || '/';
  const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '/' : canonicalPath}`;

  document.title = seo.title;
  setMeta('meta[name="description"]', seo.description, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    return meta;
  });
  setMeta('meta[name="robots"]', 'index, follow', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    return meta;
  });
  ensureMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  }).setAttribute('href', canonicalUrl);
  setMeta('meta[property="og:title"]', seo.title, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:title');
    return meta;
  });
  setMeta('meta[property="og:description"]', seo.description, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:description');
    return meta;
  });
  setMeta('meta[property="og:url"]', canonicalUrl, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:url');
    return meta;
  });
  setMeta('meta[name="twitter:title"]', seo.title, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'twitter:title');
    return meta;
  });
  setMeta('meta[name="twitter:description"]', seo.description, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'twitter:description');
    return meta;
  });
}

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

function PriceView({ course }) {
  return (
    <span className="price-view">
      {course.oldPrice && <s>{formatPrice(course.oldPrice)}</s>}
      <strong>{formatPrice(course.price)}</strong>
    </span>
  );
}

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const courseMatch = path.match(/^\/courses\/([^/]+)$/);

  if (courseMatch) {
    return { page: 'course', courseId: courseMatch[1], path };
  }

  const pageByPath = {
    '/': 'home',
    '/courses': 'courses',
    '/club': 'club',
    '/reviews': 'reviews',
    '/contacts': 'contacts',
    '/question': 'question',
    '/checkout': 'checkout',
    '/terms': 'terms',
    '/privacy': 'privacy',
    '/consent': 'consent',
    '/consent-spread': 'consentSpread',
    '/consent-mailing': 'consentMailing',
    '/payment/success': 'paymentSuccess',
    '/payment/fail': 'paymentFail',
    '/payment/pending': 'paymentPending',
  };

  return { page: pageByPath[path] || 'home', path };
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    promo: '',
    offerAccepted: false,
    privacyAccepted: false,
    personalDataAccepted: false,
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || courses[0],
    [selectedCourseId],
  );

  const activeCourse = useMemo(
    () => courses.find((course) => course.id === route.courseId) || courses[0],
    [route.courseId],
  );

  const discount = form.promo.trim().toUpperCase() === 'GOLD10' ? 0.1 : 0;
  const total = Math.round(selectedCourse.price * (1 - discount));

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route.path]);

  useEffect(() => {
    updatePageSeo(route, activeCourse);
  }, [route, activeCourse]);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(getRoute());
    setMenuOpen(false);
  };

  const chooseCourse = (id) => {
    setSelectedCourseId(id);
    setStatus({ type: 'idle', message: '' });
    navigate('/checkout');
  };

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitPayment = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.offerAccepted ||
      !form.privacyAccepted ||
      !form.personalDataAccepted
    ) {
      setStatus({
        type: 'error',
        message: 'Заполните имя, телефон, email и отметьте согласия с документами.',
      });
      return;
    }

    const order = {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      amount: total,
      currency: 'RUB',
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
      },
      promo: form.promo,
      paymentMethod,
      returnUrl: window.location.href,
    };

    setStatus({ type: 'loading', message: 'Создаём счёт на оплату...' });

    try {
      const response = await fetch(paymentEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'payment endpoint failed');
      }

      const redirectUrl =
        payload.confirmation_url || payload.payment_url || payload.redirectUrl || payload.url;

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      setStatus({
        type: 'success',
        message: 'Счёт создан. Проверьте ответ сервера: ссылка оплаты не была передана.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось создать платёж. Проверьте серверный адрес и ключи Т-Банка.',
      });
    }
  };

  return (
    <div className="app">
      <Header
        activePath={route.path}
        menuOpen={menuOpen}
        navigate={navigate}
        setMenuOpen={setMenuOpen}
      />

      <main>
        {route.page === 'home' && <HomePage navigate={navigate} chooseCourse={chooseCourse} />}
        {route.page === 'courses' && <CoursesPage navigate={navigate} chooseCourse={chooseCourse} />}
        {route.page === 'course' && (
          <CourseDetail course={activeCourse} navigate={navigate} chooseCourse={chooseCourse} />
        )}
        {route.page === 'club' && <ClubPage navigate={navigate} />}
        {route.page === 'reviews' && <ReviewsPage />}
        {route.page === 'contacts' && <ContactsPage navigate={navigate} />}
        {route.page === 'question' && <QuestionPage navigate={navigate} />}
        {route.page === 'checkout' && (
          <CheckoutPage
            discount={discount}
            form={form}
            navigate={navigate}
            paymentMethod={paymentMethod}
            selectedCourse={selectedCourse}
            selectedCourseId={selectedCourseId}
            setPaymentMethod={setPaymentMethod}
            setSelectedCourseId={setSelectedCourseId}
            status={status}
            submitPayment={submitPayment}
            total={total}
            updateForm={updateForm}
          />
        )}
        {route.page === 'terms' && <LegalPage type="terms" navigate={navigate} />}
        {route.page === 'privacy' && <LegalPage type="privacy" navigate={navigate} />}
        {route.page === 'consent' && <LegalPage type="consent" navigate={navigate} />}
        {route.page === 'consentSpread' && <LegalPage type="consentSpread" navigate={navigate} />}
        {route.page === 'consentMailing' && <LegalPage type="consentMailing" navigate={navigate} />}
        {route.page === 'paymentSuccess' && (
          <PaymentResultPage
            navigate={navigate}
            type="success"
            title="Оплата прошла"
            text="Спасибо. Платёж принят, мы свяжемся с вами и отправим детали участия."
          />
        )}
        {route.page === 'paymentFail' && (
          <PaymentResultPage
            navigate={navigate}
            type="error"
            title="Оплата не прошла"
            text="Платёж был отменён или отклонён. Можно вернуться к форме и попробовать ещё раз."
          />
        )}
        {route.page === 'paymentPending' && (
          <PaymentResultPage
            navigate={navigate}
            type="pending"
            title="Платёж обрабатывается"
            text="Банк ещё уточняет статус операции. Если деньги списались, не создавайте повторную оплату сразу."
          />
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

function Header({ activePath, menuOpen, navigate, setMenuOpen }) {
  const isActive = (path) => activePath === path || (path !== '/' && activePath.startsWith(path));

  return (
    <header className="site-header">
      <button className="brand brand-button" type="button" onClick={() => navigate('/')}>
        <span className="brand-mark">GP</span>
        <span>
          Gold Pour
          <small>барный клуб</small>
        </span>
      </button>

      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
        {navItems.map(([label, path]) => (
          <button
            className={isActive(path) ? 'is-active' : ''}
            key={path}
            type="button"
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
        <button className="mobile-question" type="button" onClick={() => navigate('/question')}>
          Задать вопрос
        </button>
      </nav>

      <div className="header-actions">
        <button className="header-cta" type="button" onClick={() => navigate('/checkout')}>
          Записаться
        </button>
        <button className="question-cta" type="button" onClick={() => navigate('/question')}>
          Задать вопрос
        </button>
        <a className="ghost-link" href={accountUrl}>
          Личный кабинет
        </a>
        <button
          className="icon-button"
          type="button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function HomePage({ navigate, chooseCourse }) {
  return (
    <>
      <section className="hero">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-frame reveal-up">
            <img src={imageUrls.coupe} alt="Коктейль в бокале coupe" />
            <div className="corner-card">
              <span>Запись открыта</span>
              <strong>Живой разбор барной стойки с первой встречи</strong>
              <button type="button" onClick={() => navigate('/courses')}>
                Форматы <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="hero-copy reveal-right">
            <span className="eyebrow">Москва / HoReCa / миксология</span>
            <h1>Мастер-классы по барному делу с характером премиального бара</h1>
            <p>
              Разбираем коктейли, темп смены, продажу вкуса и уверенное поведение в ресторанной
              индустрии.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => navigate('/checkout')}>
                Забронировать место
              </button>
              <button className="secondary-button" type="button" onClick={() => navigate('/club')}>
                Как устроены встречи
              </button>
            </div>
          </div>

        </div>
      </section>

      <section className="about-strip">
        <div>
          <span className="eyebrow">about us</span>
          <h2>Барное пространство, где идеи сразу разбирают за стойкой</h2>
        </div>
        <p>
          Формат собран вокруг живых встреч: короткий разбор, демонстрация, работа за станцией,
          обратная связь и финальная гостевая смена. После участия помогаем с резюме и ориентирами для первых смен.
        </p>
      </section>

      <section className="feature-collage">
        <div className="image-panel">
          <img src={imageUrls.oldFashioned} alt="Old Fashioned на барной стойке" />
        </div>
        <div className="champagne-card reveal-up">
          <span className="eyebrow dark">вкус, темп и сервис</span>
          <h2>Приглашённые гости из действующих баров</h2>
          <p>
            Содержание обновляется под реальные требования заведений: от mise en place до
            коммуникации с гостем и контроля себестоимости.
          </p>
        </div>
      </section>
    </>
  );
}

function CoursesPage({ navigate, chooseCourse }) {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="мастер-классы"
        title="Наши мастер-классы"
        text="Выберите направление и формат встречи. Каждая карточка вынесена на отдельную страницу с подробностями."
      />

      <div className="course-list">
        {courses.map((course, index) => (
          <article className={`course-wide reveal-up delay-${index}`} key={course.id}>
            <div className="course-wide-body">
              <span className="course-badge">{course.badge}</span>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-price-box">
                <span>Длительность: <strong>{course.duration}</strong></span>
                <span>Формат: <strong>{course.lessons}</strong></span>
                <span>
                  Стоимость: <PriceView course={course} />
                </span>
              </div>
              <div className="course-actions">
                <button className="secondary-button" type="button" onClick={() => navigate(`/courses/${course.id}`)}>
                  Подробнее
                </button>
                <button className="primary-button" type="button" onClick={() => chooseCourse(course.id)}>
                  Записаться на мастер-класс
                </button>
              </div>
            </div>
            <div className="course-wide-image">
              <img
                src={index === 1 ? imageUrls.oldFashioned : imageUrls.bar}
                alt={`Барный формат: ${course.title}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CourseDetail({ course, navigate, chooseCourse }) {
  return (
    <section className="page-shell">
      <button className="back-button" type="button" onClick={() => navigate('/courses')}>
        <ArrowLeft size={18} /> Все мастер-классы
      </button>

      <div className="detail-layout">
        <div>
          <span className="eyebrow">{course.badge}</span>
          <h1>{course.title}</h1>
          <p>{course.details}</p>
          <ul className="detail-list">
            {course.highlights.map((item) => (
              <li key={item}>
                <Check size={18} /> {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => chooseCourse(course.id)}>
              Записаться и оплатить
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('/question')}>
              Задать вопрос
            </button>
          </div>
        </div>

        <aside className="order-summary detail-summary">
          <span className="eyebrow dark">карточка формата</span>
          <h3>{course.title}</h3>
          <dl>
            <div>
              <dt>Длительность</dt>
              <dd>{course.duration}</dd>
            </div>
            <div>
              <dt>Формат</dt>
              <dd>{course.lessons}</dd>
            </div>
            <div>
              <dt>Стоимость</dt>
              <dd>
                <PriceView course={course} />
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function ClubPage({ navigate }) {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="клуб"
        title="О клубе"
        text="Gold Pour — барное пространство про стойку, сервис, вкус и рабочую культуру ресторанной индустрии. Мы собираем людей, которым важно не просто повторить рецепт, а понять логику бара, поведение гостя и ритм живой смены."
      />
      <div className="feature-collage inner-collage">
        <div className="image-panel">
          <img src={imageUrls.bar} alt="Барный зал для встреч" />
        </div>
        <div className="champagne-card">
          <span className="eyebrow dark">живой формат</span>
          <h2>Большая часть встречи проходит за стойкой</h2>
          <p>
            Внутри: mise en place, темп, сервис, разбор типовых ошибок, гостевая смена и помощь с
            резюме. Мы показываем, как бар живёт изнутри: от подготовки станции до разговора с
            гостем.
          </p>
          <button className="dark-button" type="button" onClick={() => navigate('/courses')}>
            Смотреть форматы
          </button>
        </div>
      </div>

      <section className="club-story">
        <div className="club-story-copy">
          <span className="eyebrow">что мы делаем</span>
          <h2>Помогаем увидеть бар как систему, а не набор случайных действий</h2>
          <p>
            В Gold Pour разбирают не только коктейли. Мы говорим о том, как подготовить рабочее
            место, держать чистый темп, читать запрос гостя, работать с меню, сохранять сервис в
            загруженный вечер и понимать, почему команда действует именно так.
          </p>
          <p>
            Форматы подходят тем, кто только присматривается к барной сфере, уже выходит в первые
            смены, работает в зале или хочет собрать более уверенную подачу для своего заведения.
            Встречи проходят в спокойной атмосфере: без давления, но с вниманием к деталям.
          </p>
        </div>
        <div className="club-story-panel">
          <h3>Внутри клуба</h3>
          <ul>
            <li>разбор реальных ситуаций за стойкой и в зале</li>
            <li>работа с классикой, авторскими вкусами и подачей</li>
            <li>гостевой сервис, речь, рекомендации и сложные диалоги</li>
            <li>подготовка станции, чек-листы и порядок действий</li>
            <li>обратная связь по технике, темпу и уверенности</li>
          </ul>
        </div>
      </section>

      <div className="club-grid">
        <article>
          <span>01</span>
          <h3>Камерные группы</h3>
          <p>
            Мы не собираем поток ради количества. Небольшой состав позволяет спокойно разобрать
            вопросы каждого участника и уделить внимание деталям за стойкой.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Реальные барные сценарии</h3>
          <p>
            Разбираем подготовку рабочей зоны, коммуникацию с гостем, ритм вечера, подачу напитков,
            работу с меню и ситуации, которые встречаются в заведениях каждый день.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Фокус на сервисе</h3>
          <p>
            Бар и зал работают вместе, поэтому мы говорим не только о напитках, но и о гостевом
            опыте: встреча, рекомендация, внимание к деталям и аккуратное завершение визита.
          </p>
        </article>
        <article>
          <span>04</span>
          <h3>Полезная обратная связь</h3>
          <p>
            После встречи участник понимает, какие действия уже выглядят уверенно, а что стоит
            подтянуть перед первой или следующей сменой.
          </p>
        </article>
      </div>

      <section className="club-principles">
        <div>
          <span className="eyebrow">подход</span>
          <h2>Уважение к профессии и гостю</h2>
        </div>
        <div className="principle-list">
          <article>
            <strong>Сначала логика</strong>
            <p>
              Мы объясняем, зачем выполняется действие: почему важен порядок, как рождается вкус,
              где сервис помогает продаже и почему чистая станция экономит силы.
            </p>
          </article>
          <article>
            <strong>Потом уверенность</strong>
            <p>
              Участник пробует, задаёт вопросы, получает корректировку и уходит с понятным
              маршрутом: что закрепить, что повторить и на что смотреть в смене.
            </p>
          </article>
          <article>
            <strong>Всегда про реальность</strong>
            <p>
              Мы не строим идеальную картинку ради красивых слов. В центре — бар, зал, гости,
              команда, вечерний темп и решения, которые работают в заведении.
            </p>
          </article>
        </div>
      </section>
    </section>
  );
}

function ReviewsPage() {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="отзывы"
        title="Отзывы участников"
        text="Короткие истории о том, как встречи помогают увереннее смотреть на барную стойку."
      />
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="stars" aria-label="5 из 5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={15} fill="currentColor" />
              ))}
            </div>
            <p>{review.text}</p>
            <strong>{review.name}</strong>
            <span>{review.role}</span>
            <small>{review.date}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuestionPage({ navigate }) {
  const [questionForm, setQuestionForm] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'course',
    message: '',
    consent: true,
  });
  const [questionStatus, setQuestionStatus] = useState('');

  const updateQuestion = (event) => {
    const { name, value, type, checked } = event.target;
    setQuestionForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitQuestion = (event) => {
    event.preventDefault();

    if (!questionForm.name || !questionForm.phone || !questionForm.message || !questionForm.consent) {
      setQuestionStatus('Заполните имя, телефон, вопрос и подтвердите согласие.');
      return;
    }

    const requestId = `Q-${Date.now().toString().slice(-6)}`;
    window.localStorage.setItem(
      'goldPourLastQuestion',
      JSON.stringify({ ...questionForm, requestId }),
    );
    setQuestionStatus(`Вопрос ${requestId} сохранён. Менеджер свяжется с вами после подключения CRM.`);
    setQuestionForm((current) => ({ ...current, message: '' }));
  };

  return (
    <section className="page-shell compact-page">
      <PageHero
        eyebrow="вопрос"
        title="Задать вопрос"
        text="Уточните формат, расписание, оплату или корпоративную встречу. Форма готова для подключения к CRM или серверной обработке заявок."
      />

      <div className="question-layout">
        <form className="checkout-form question-form" onSubmit={submitQuestion}>
          <div className="form-grid">
            <label>
              Имя
              <input name="name" value={questionForm.name} onChange={updateQuestion} placeholder="Анна" />
            </label>
            <label>
              Телефон
              <input
                name="phone"
                value={questionForm.phone}
                onChange={updateQuestion}
                placeholder="Ваш телефон"
              />
            </label>
          </div>

          <label>
            Электронная почта
            <input
              name="email"
              value={questionForm.email}
              onChange={updateQuestion}
              placeholder="Ваш email"
              type="email"
            />
          </label>

          <label>
            Тема
            <div className="select-wrap">
              <select name="topic" value={questionForm.topic} onChange={updateQuestion}>
                <option value="course">Выбор формата</option>
                <option value="payment">Оплата</option>
                <option value="corporate">Корпоративная встреча</option>
                <option value="other">Другое</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </label>

          <label>
            Вопрос
            <textarea
              name="message"
              value={questionForm.message}
              onChange={updateQuestion}
              placeholder="Расскажите, что хотите уточнить"
              rows="6"
            />
          </label>

          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              checked={questionForm.consent}
              onChange={updateQuestion}
            />
            <span>
              Согласен с{' '}
              <button className="text-link" type="button" onClick={() => navigate('/privacy')}>
                политикой конфиденциальности
              </button>{' '}
              и{' '}
              <button className="text-link" type="button" onClick={() => navigate('/consent')}>
                обработкой персональных данных
              </button>
            </span>
          </label>

          <button className="primary-button full" type="submit">
            <Send size={18} /> Отправить вопрос
          </button>

          {questionStatus && <p className="status success">{questionStatus}</p>}
        </form>

        <aside className="order-summary question-summary">
          <span className="eyebrow dark">поддержка</span>
          <h3>Ответим по делу</h3>
          <p>
            Обычно менеджер уточняет цель участия, уровень опыта, удобный график и помогает выбрать
            формат без лишней продажи.
          </p>
          <dl>
            <div>
              <dt>Официальный сайт</dt>
              <dd>gold-pour.ru</dd>
            </div>
            <div>
              <dt>Почта уведомлений</dt>
              <dd>noreply@barmenschool.site</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function ContactsPage({ navigate }) {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="контакты"
        title="Контакты"
        text="Запишитесь на мастер-класс, задайте вопрос по формату или обсудите корпоративную встречу для команды."
      />
      <div className="contacts contacts-page">
        <div>
          <h2>ИП Голева Диана Александровна</h2>
          <p>Официальный сайт проекта: gold-pour.ru. Доступ к платформе для формата «бармен-профессионал» предоставляется через barmenschool.site.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/checkout')}>
            Записаться
          </button>
        </div>
        <div className="contact-card">
          <span>ИНН 590850694160</span>
          <span>ОГРНИП 324595800127571</span>
          <a href="https://barmenschool.site" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Платформа
          </a>
        </div>
      </div>
    </section>
  );
}

function CheckoutPage({
  discount,
  form,
  navigate,
  paymentMethod,
  selectedCourse,
  selectedCourseId,
  setPaymentMethod,
  setSelectedCourseId,
  status,
  submitPayment,
  total,
  updateForm,
}) {
  return (
    <section className="payment-section page-shell compact-page">
      <PageHero
        eyebrow="оплата"
        title="Запись и оплата"
        text="Форма подготовлена к оплате через интернет-эквайринг Т-Банка: после отправки заявки откроется защищённая платёжная страница банка."
      />

      <div className="payment-layout">
        <form className="checkout-form" onSubmit={submitPayment}>
          <label>
            Формат
            <div className="select-wrap">
              <select
                value={selectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
              >
                {courses.map((course) => (
                  <option value={course.id} key={course.id}>
                    {course.title} - {formatPrice(course.price)}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} />
            </div>
          </label>

          <div className="form-grid">
            <label>
              Имя
              <input name="name" value={form.name} onChange={updateForm} placeholder="Анна" />
            </label>
            <label>
              Телефон
              <input
                name="phone"
                value={form.phone}
                onChange={updateForm}
                placeholder="Ваш телефон"
              />
            </label>
          </div>

          <label>
            Электронная почта для чека
            <input
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="Ваш email"
              type="email"
            />
          </label>

          <label>
            Промокод
            <input name="promo" value={form.promo} onChange={updateForm} placeholder="GOLD10" />
          </label>

          <div className="payment-methods" role="radiogroup" aria-label="Способ оплаты">
            {[
              ['card', CreditCard, 'Карта'],
              ['sbp', ShieldCheck, 'СБП'],
              ['tpay', BriefcaseBusiness, 'T-Pay'],
            ].map(([id, Icon, label]) => (
              <button
                className={paymentMethod === id ? 'is-active' : ''}
                type="button"
                key={id}
                onClick={() => setPaymentMethod(id)}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <div className="legal-consents">
            <label className="consent">
              <input
                type="checkbox"
                name="offerAccepted"
                checked={form.offerAccepted}
                onChange={updateForm}
              />
              <span>
                Я принимаю условия{' '}
                <button className="text-link" type="button" onClick={() => navigate('/terms')}>
                  договора-оферты
                </button>
              </span>
            </label>
            <label className="consent">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={form.privacyAccepted}
                onChange={updateForm}
              />
              <span>
                Согласен с{' '}
                <button className="text-link" type="button" onClick={() => navigate('/privacy')}>
                  политикой конфиденциальности
                </button>{' '}
                и обработкой персональных данных
              </span>
            </label>
            <label className="consent">
              <input
                type="checkbox"
                name="personalDataAccepted"
                checked={form.personalDataAccepted}
                onChange={updateForm}
              />
              <span>
                Подтверждаю ознакомление с{' '}
                <button className="text-link" type="button" onClick={() => navigate('/consent')}>
                  согласием на обработку персональных данных
                </button>
                ,{' '}
                <button className="text-link" type="button" onClick={() => navigate('/consent-spread')}>
                  согласием на распространение персональных данных
                </button>{' '}
                и{' '}
                <button className="text-link" type="button" onClick={() => navigate('/consent-mailing')}>
                  согласием на рекламные рассылки
                </button>
              </span>
            </label>
          </div>

          <button className="primary-button full" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Создаём счёт...' : 'Оплатить формат'}
          </button>

          {installmentLinks[selectedCourse.id] && (
            <a
              className="installment-button full"
              href={installmentLinks[selectedCourse.id]}
              target="_blank"
              rel="noreferrer"
            >
              Оплатить в рассрочку
            </a>
          )}

          {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
        </form>

        <aside className="order-summary">
          <span className="eyebrow dark">ваш заказ</span>
          <h3>{selectedCourse.title}</h3>
          <p>{selectedCourse.description}</p>
          <dl>
            <div>
              <dt>Стоимость</dt>
              <dd>
                <PriceView course={selectedCourse} />
              </dd>
            </div>
            <div>
              <dt>Скидка</dt>
              <dd>{discount ? '-10%' : '0%'}</dd>
            </div>
            <div>
              <dt>К оплате</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <div className="secure-note">
            <ShieldCheck size={18} />
            <span>
              Платёжные данные должны обрабатываться на стороне платёжного провайдера, не в браузере
              сайта.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PaymentResultPage({ navigate, type, title, text }) {
  const Icon = type === 'success' ? Check : type === 'error' ? X : ShieldCheck;

  return (
    <section className="page-shell compact-page payment-result-page">
      <div className={`payment-result ${type}`}>
        <span className="result-icon">
          <Icon size={30} />
        </span>
        <span className="eyebrow">статус оплаты</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="result-actions">
          <button className="primary-button" type="button" onClick={() => navigate('/checkout')}>
            Вернуться к оплате
          </button>
          <button className="secondary-button" type="button" onClick={() => navigate('/contacts')}>
            Контакты
          </button>
        </div>
      </div>
    </section>
  );
}

function LegalPage({ type, navigate }) {
  const text = legalTexts[type] || legalTexts.terms;
  const lines = text.split('\n');
  const title = lines.find((line) => line.startsWith('# '))?.replace('# ', '') || 'Документ';
  const intro = lines.find((line) => line && !line.startsWith('#')) || '';

  return (
    <section className="page-shell legal-page">
      <button className="back-button" type="button" onClick={() => navigate('/checkout')}>
        <ArrowLeft size={18} /> Вернуться к оплате
      </button>
      <PageHero eyebrow="документ" title={title} text={intro} />
      <article className="legal-document">
        {lines.slice(1).map((line, index) => {
          const key = `legal-line-${index}`;

          if (!line.trim()) {
            return <div className="legal-gap" key={key} />;
          }

          if (line.startsWith('### ')) {
            return <h3 key={key}>{line.replace('### ', '')}</h3>;
          }

          if (line.startsWith('## ')) {
            return <h2 key={key}>{line.replace('## ', '')}</h2>;
          }

          if (line.startsWith('- ')) {
            return <p className="legal-list-line" key={key}>{line}</p>;
          }

          return <p key={key}>{line}</p>;
        })}
      </article>
    </section>
  );
}
function PageHero({ eyebrow, title, text }) {
  return (
    <div className="page-hero reveal-up">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div>
        <strong>Gold Pour</strong>
        <span>Мастер-классы по барному делу и сервису в Москве</span>
      </div>
      <div className="footer-links">
        <button type="button" onClick={() => navigate('/terms')}>
          Публичная оферта
        </button>
        <button type="button" onClick={() => navigate('/privacy')}>
          Политика конфиденциальности
        </button>
        <button type="button" onClick={() => navigate('/contacts')}>
          Контакты
        </button>
      </div>
    </footer>
  );
}

export default App;
