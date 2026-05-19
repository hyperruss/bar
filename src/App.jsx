import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  Menu,
  MessageCircle,
  Newspaper,
  Send,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from 'lucide-react';

const accountUrl = 'https://app.barmenschool.site/login';
const paymentEndpoint = import.meta.env.VITE_PAYMENT_ENDPOINT || '';

const courses = [
  {
    id: 'start',
    title: 'Барный старт',
    badge: 'Первый формат',
    price: 24900,
    duration: '14 встреч',
    lessons: 'информационные материалы',
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
    price: 39900,
    duration: '21 день',
    lessons: 'живые сессии',
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
];

const experts = [
  ['Илья Морозов', 'шеф-бармен', '12 лет за стойкой, запускал барные карты для ресторанов Москвы.'],
  ['Анна Лебедева', 'миксолог', 'Специализация: вкусовые пары, кордиалы, инфьюзы и авторские подачи.'],
  ['Марк Соловьёв', 'HoReCa тренер', 'Отвечает за сервис, продажи и подготовку к первым собеседованиям.'],
];

const reviews = [
  {
    name: 'Александр М.',
    role: 'участник встреч',
    text: 'За две недели разобрался в базовой логике стойки, стал увереннее говорить с гостями и понимать рабочий ритм бара.',
  },
  {
    name: 'Екатерина В.',
    role: 'бар-менеджер',
    text: 'Понравилось, что говорят не только о рецептах, а о логике вкуса, себестоимости и разговоре с гостем.',
  },
  {
    name: 'Дмитрий К.',
    role: 'шеф-бармен',
    text: 'PRO-формат помог пересобрать карту и увереннее презентовать авторские коктейли владельцу проекта.',
  },
];

const posts = [
  {
    slug: 'interview-restaurant',
    title: 'Собеседование в ресторан: как произвести впечатление',
    excerpt:
      'Подготовка, внешний вид, речь, вопросы работодателю и мини-скрипты для уверенной встречи.',
    category: 'Карьера',
    date: '13.11.2025',
    readTime: '6 минут',
    intro:
      'Собеседование в ресторанной индустрии редко похоже на формальную офисную встречу. Работодатель смотрит не только на опыт, но и на аккуратность, живость, темп речи и способность держать контакт.',
    sections: [
      [
        'Подготовьте короткую историю о себе',
        'Соберите ответ на одну минуту: какой у вас опыт, почему интересен бар или сервис, чему уже учились и какой график вам подходит. Чем конкретнее ответ, тем увереннее вы звучите.',
      ],
      [
        'Покажите понимание заведения',
        'Перед встречей посмотрите меню, атмосферу, средний чек и отзывы. Хороший вопрос о барной карте или сервисе сразу показывает, что вы пришли не случайно.',
      ],
      [
        'Спросите о вводе в команду и стандартах',
        'Уточните, сколько длится ввод, кто сопровождает новичков, как оценивают первую смену и какие ожидания есть у команды.',
      ],
    ],
  },
  {
    slug: 'bartender-roadmap',
    title: 'Как начать за барной стойкой: дорожная карта',
    excerpt: 'Первые шаги в барной индустрии: база, живые встречи, резюме и первые смены.',
    category: 'Карьера',
    date: '13.11.2025',
    readTime: '7 минут',
    intro:
      'Путь за барную стойку начинается не с эффектных трюков, а с дисциплины рабочей зоны, классики, скорости и спокойной коммуникации с гостем.',
    sections: [
      [
        'Освойте базу до авторских напитков',
        'Сначала инвентарь, лёд, стекло, баланс кислого и сладкого, классические коктейли. Авторские рецепты становятся понятнее, когда есть фундамент.',
      ],
      [
        'Разбирайте рабочий темп',
        'Важно не просто знать рецепты, а понимать последовательность: подготовка, сборка, порядок на станции и параллельная коммуникация с гостем.',
      ],
      [
        'Выбирайте место с обратной связью',
        'Узнайте, кто помогает новичкам на первых сменах, какие задачи дают в начале и как команда оценивает аккуратность работы.',
      ],
    ],
  },
  {
    slug: 'latte-art-start',
    title: 'Латте-арт с нуля: техники для начинающего бариста',
    excerpt: 'От текстуры молока до первых рисунков, стабильной пены и чистой подачи.',
    category: 'Бариста',
    date: '13.11.2025',
    readTime: '5 минут',
    intro:
      'Латте-арт начинается с текстуры молока. Красивый рисунок невозможен без стабильной эмульсии, правильного угла питчера и чистого эспрессо.',
    sections: [
      [
        'Следите за температурой',
        'Перегретое молоко теряет сладость и пластичность. Учитесь останавливать нагрев до момента, когда питчер становится горячим, но ещё комфортно контролируемым.',
      ],
      [
        'Тренируйте базовую розетту',
        'Не гонитесь за сложными фигурами. Стабильное сердце и розетта быстрее дадут понимание потока, высоты и скорости вливания.',
      ],
      [
        'Разбирайте ошибки сразу',
        'Пузыри, жидкая пена, провал рисунка или слишком бледная чашка говорят о конкретных ошибках техники. Исправляйте один параметр за раз.',
      ],
    ],
  },
  {
    slug: 'classic-cocktails-top',
    title: 'Топ-10 классических коктейлей, которые должен знать бармен',
    excerpt: 'От Negroni до Old Fashioned: ключевые рецепты, техники и логика баланса.',
    category: 'Коктейли',
    date: '13.11.2025',
    readTime: '8 минут',
    intro:
      'Классика даёт бармену общий язык индустрии. Через неё проще понять баланс, крепость, разбавление, аромат и то, почему гости возвращаются к знакомым вкусам.',
    sections: [
      [
        'Начните с Old Fashioned, Daiquiri и Negroni',
        'Эта тройка показывает три разные логики: крепкий напиток в стакане для смешивания, кислый напиток в шейкере и горько-сладкий аперитив. Они помогают увидеть точность в работе с балансом.',
      ],
      [
        'Запоминайте не только граммовки',
        'Важно понимать, какую роль играет каждый ингредиент. Тогда вы сможете адаптировать напиток под бренд алкоголя, лёд и запрос гостя.',
      ],
      [
        'Повторяйте подачу',
        'Одинаковый вкус без одинаковой подачи не воспринимается аккуратно. Стекло, гарнир, температура и чистота края бокала имеют значение.',
      ],
    ],
  },
  {
    slug: 'tips-service-habits',
    title: 'Как увеличить чаевые: сервисные привычки официантов',
    excerpt: 'Коммуникация, темп, забота о госте и детали, которые повышают лояльность.',
    category: 'Сервис',
    date: '13.11.2025',
    readTime: '6 минут',
    intro:
      'Чаевые растут не от навязчивости, а от ощущения, что гостя заметили. Хороший сервис точен, спокоен и предугадывает маленькие неудобства.',
    sections: [
      [
        'Держите ритм стола',
        'Своевременная вода, чистые приборы и короткие проверки важнее длинных разговоров. Гость должен чувствовать внимание, но не давление.',
      ],
      [
        'Предлагайте конкретно',
        'Фраза “могу посоветовать” слабее, чем два точных варианта под настроение гостя. Конкретика экономит время и повышает доверие.',
      ],
      [
        'Завершайте визит аккуратно',
        'Последний контакт влияет на память о заведении. Проверьте чек, поблагодарите и оставьте ощущение лёгкости.',
      ],
    ],
  },
  {
    slug: 'espresso-beginner-mistakes',
    title: '5 ошибок начинающего бармена при работе с эспрессо',
    excerpt: 'Помол, пролив, трамбовка, чистота станции и вкус напитка без случайностей.',
    category: 'Эспрессо',
    date: '13.11.2025',
    readTime: '5 минут',
    intro:
      'Эспрессо не про магию, а про повторяемость. Маленькая ошибка в помоле, дозировке или чистоте быстро превращается в горечь, кислотность или водянистый вкус.',
    sections: [
      [
        'Не игнорируйте помол',
        'Если пролив слишком быстрый или слишком медленный, первым делом проверяйте помол и дозу. Это базовая настройка вкуса.',
      ],
      [
        'Следите за чистотой группы',
        'Старые масла и остатки кофе портят даже хорошее зерно. Чистая станция заметна во вкусе и скорости работы.',
      ],
      [
        'Фиксируйте удачный рецепт',
        'Записывайте дозу, выход, время и вкус. Так вы быстрее поймёте, что именно изменилось после корректировки.',
      ],
    ],
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
  ['Консультанты', '/experts'],
  ['Отзывы', '/reviews'],
  ['Блог', '/blog'],
  ['Контакты', '/contacts'],
];

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const courseMatch = path.match(/^\/courses\/([^/]+)$/);
  const postMatch = path.match(/^\/blog\/([^/]+)$/);

  if (courseMatch) {
    return { page: 'course', courseId: courseMatch[1], path };
  }

  if (postMatch) {
    return { page: 'post', postSlug: postMatch[1], path };
  }

  const pageByPath = {
    '/': 'home',
    '/courses': 'courses',
    '/club': 'club',
    '/experts': 'experts',
    '/reviews': 'reviews',
    '/blog': 'blog',
    '/contacts': 'contacts',
    '/question': 'question',
    '/checkout': 'checkout',
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
    consent: true,
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || courses[0],
    [selectedCourseId],
  );

  const activeCourse = useMemo(
    () => courses.find((course) => course.id === route.courseId) || courses[0],
    [route.courseId],
  );

  const activePost = useMemo(
    () => posts.find((post) => post.slug === route.postSlug) || posts[0],
    [route.postSlug],
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

    if (!form.name || !form.phone || !form.email || !form.consent) {
      setStatus({
        type: 'error',
        message: 'Заполните имя, телефон, email и подтвердите согласие с условиями.',
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
      paymentMethod,
      returnUrl: window.location.href,
    };

    setStatus({ type: 'loading', message: 'Создаём счёт на оплату...' });

    if (paymentEndpoint) {
      try {
        const response = await fetch(paymentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        if (!response.ok) {
          throw new Error('payment endpoint failed');
        }

        const payload = await response.json();
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
          message: 'Не удалось создать платёж. Проверьте серверный адрес и ключи провайдера.',
        });
      }
      return;
    }

    const demoOrder = `GP-${Date.now().toString().slice(-6)}`;
    window.localStorage.setItem('goldPourLastOrder', JSON.stringify({ ...order, demoOrder }));
    setStatus({
      type: 'success',
      message: `Демо-счёт ${demoOrder} создан. Для реальной оплаты подключите VITE_PAYMENT_ENDPOINT.`,
    });
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
        {route.page === 'experts' && <ExpertsPage />}
        {route.page === 'reviews' && <ReviewsPage />}
        {route.page === 'blog' && <BlogPage navigate={navigate} />}
        {route.page === 'post' && <BlogArticle post={activePost} navigate={navigate} />}
        {route.page === 'contacts' && <ContactsPage navigate={navigate} />}
        {route.page === 'question' && <QuestionPage />}
        {route.page === 'checkout' && (
          <CheckoutPage
            discount={discount}
            form={form}
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
          <span className="eyebrow dark">craft, speed and service</span>
          <h2>Консультанты из действующих баров</h2>
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
                <span>Стоимость: <strong>{formatPrice(course.price)}</strong></span>
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
            <button className="secondary-button" type="button" onClick={() => navigate('/experts')}>
              Посмотреть консультантов
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
              <dd>{formatPrice(course.price)}</dd>
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
        eyebrow="club"
        title="О клубе"
        text="Gold Pour работает как барное пространство: небольшие группы, живые станции, консультанты из индустрии и понятный разговор о первых сменах."
      />
      <div className="feature-collage inner-collage">
        <div className="image-panel">
          <img src={imageUrls.bar} alt="Барный зал для встреч" />
        </div>
        <div className="champagne-card">
          <span className="eyebrow dark">practice first</span>
          <h2>80% встречи проходит за стойкой</h2>
          <p>
            Внутри: mise en place, скорость, сервис, разбор ошибок, финальная смена и помощь с
            резюме. Это не лекция про бар, а тренировка будущей работы.
          </p>
          <button className="dark-button" type="button" onClick={() => navigate('/courses')}>
            Смотреть форматы
          </button>
        </div>
      </div>
    </section>
  );
}

function ExpertsPage() {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="experts"
        title="Консультанты"
        text="Консультанты не оторваны от рынка: они работают в барах, запускают меню и знают, что ждут работодатели."
      />
      <div className="course-grid">
        {experts.map(([name, role, text]) => (
          <article className="course-card expert-card" key={name}>
            <UserRound size={28} />
            <h3>{name}</h3>
            <span>{role}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewsPage() {
  return (
    <section className="page-shell">
      <PageHero
        eyebrow="reviews"
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
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogPage({ navigate }) {
  return (
    <section className="page-shell blog-page-shell">
      <PageHero
        eyebrow="blog"
        title="Блог"
        text="Полезные статьи и новости из мира барного искусства, сервиса и карьерного роста в HoReCa."
      />
      <div className="blog-grid">
        {posts.map((post, index) => (
          <article
            className={`blog-card reveal-up delay-${index % 3}`}
            key={post.title}
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <span className="blog-category">{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="blog-meta">
              <span>
                <UserRound size={16} /> Gold Pour
              </span>
              <span>
                <CalendarDays size={16} /> {post.date}
              </span>
            </div>
            <button
              className="blog-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/blog/${post.slug}`);
              }}
            >
              <Newspaper size={17} />
              Читать
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogArticle({ post, navigate }) {
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <section className="page-shell article-shell">
      <button className="back-button" type="button" onClick={() => navigate('/blog')}>
        <ArrowLeft size={18} /> Все статьи
      </button>

      <article className="article-layout">
        <header className="article-hero reveal-up">
          <span className="blog-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.intro}</p>
          <div className="blog-meta article-meta">
            <span>
              <UserRound size={16} /> Gold Pour
            </span>
            <span>
              <CalendarDays size={16} /> {post.date}
            </span>
            <span>
              <Newspaper size={16} /> {post.readTime}
            </span>
          </div>
        </header>

        <div className="article-body">
          {post.sections.map(([heading, text]) => (
            <section className="article-section" key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}

        </div>
      </article>

      <aside className="related-posts">
        <div className="section-heading">
          <span className="eyebrow">читайте также</span>
          <h2>Похожие статьи</h2>
        </div>
        <div className="blog-grid related-grid">
          {relatedPosts.map((related) => (
            <article
              className="blog-card compact-blog-card"
              key={related.slug}
              onClick={() => navigate(`/blog/${related.slug}`)}
            >
              <span className="blog-category">{related.category}</span>
              <h2>{related.title}</h2>
              <p>{related.excerpt}</p>
              <button
                className="blog-button"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/blog/${related.slug}`);
                }}
              >
                Читать
              </button>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

function QuestionPage() {
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
                placeholder="+7 999 000-00-00"
              />
            </label>
          </div>

          <label>
            Электронная почта
            <input
              name="email"
              value={questionForm.email}
              onChange={updateQuestion}
              placeholder="mail@example.com"
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
            Согласен на обработку персональных данных
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
              <dt>Телефон</dt>
              <dd>+7 999 000-00-00</dd>
            </div>
            <div>
              <dt>Электронная почта</dt>
              <dd>hello@goldpour.ru</dd>
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
          <h2>Москва, барная лаборатория Gold Pour</h2>
          <p>Ежедневно с 10:00 до 21:00. Адрес и реквизиты можно заменить на ваши реальные данные.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/checkout')}>
            Записаться
          </button>
        </div>
        <div className="contact-card">
          <a href="tel:+79990000000">+7 999 000-00-00</a>
          <a href="mailto:hello@goldpour.ru">hello@goldpour.ru</a>
          <a href="https://t.me/" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Telegram
          </a>
        </div>
      </div>
    </section>
  );
}

function CheckoutPage({
  discount,
  form,
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
        text="Интерфейс готов под интеграцию с YooKassa, CloudPayments, Robokassa или вашим сервером."
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
                placeholder="+7 999 000-00-00"
              />
            </label>
          </div>

          <label>
            Электронная почта для чека
            <input
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="mail@example.com"
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
              ['invoice', BriefcaseBusiness, 'Счёт'],
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

          <label className="consent">
            <input type="checkbox" name="consent" checked={form.consent} onChange={updateForm} />
            Принимаю оферту и согласие на обработку персональных данных
          </label>

          <button className="primary-button full" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Создаём счёт...' : 'Оплатить формат'}
          </button>

          {status.message && <p className={`status ${status.type}`}>{status.message}</p>}
        </form>

        <aside className="order-summary">
          <span className="eyebrow dark">ваш заказ</span>
          <h3>{selectedCourse.title}</h3>
          <p>{selectedCourse.description}</p>
          <dl>
            <div>
              <dt>Стоимость</dt>
              <dd>{formatPrice(selectedCourse.price)}</dd>
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
        <button type="button" onClick={() => navigate('/checkout')}>
          Публичная оферта
        </button>
        <button type="button" onClick={() => navigate('/checkout')}>
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
