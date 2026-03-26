export type Locale = 'en' | 'es' | 'pt';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

const translations = {
  // Header / Nav
  'nav.news': { en: 'News', es: 'Noticias', pt: 'Notícias' },
  'nav.proPlayers': { en: 'Pro Players', es: 'Jugadores Pro', pt: 'Jogadores Pro' },
  'nav.enthusiasts': { en: 'Enthusiasts', es: 'Entusiastas', pt: 'Entusiastas' },
  'nav.results': { en: 'Results', es: 'Resultados', pt: 'Resultados' },
  'nav.events': { en: 'Events', es: 'Eventos', pt: 'Eventos' },
  'nav.gear': { en: 'Gear', es: 'Equipamiento', pt: 'Equipamentos' },
  'nav.magazine': { en: 'Magazine', es: 'Revista', pt: 'Revista' },
  'nav.latam': { en: 'LATAM', es: 'LATAM', pt: 'LATAM' },
  'nav.contact': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
  'nav.newsletter': { en: 'Newsletter', es: 'Boletín', pt: 'Boletim' },

  // Search
  'search.placeholder': { en: 'Search articles, players, events...', es: 'Buscar artículos, jugadores, eventos...', pt: 'Buscar artigos, jogadores, eventos...' },
  'search.button': { en: 'Search', es: 'Buscar', pt: 'Buscar' },

  // Hero
  'hero.readFullStory': { en: 'Read Full Story', es: 'Leer historia completa', pt: 'Ler história completa' },

  // Latest News
  'latestNews.title': { en: 'LATEST NEWS', es: 'ÚLTIMAS NOTICIAS', pt: 'ÚLTIMAS NOTÍCIAS' },
  'latestNews.subtitle': { en: 'Breaking stories from the world of professional pickleball', es: 'Historias de última hora del mundo del pickleball profesional', pt: 'Notícias de última hora do mundo do pickleball profissional' },
  'latestNews.viewAll': { en: 'View All News', es: 'Ver todas las noticias', pt: 'Ver todas as notícias' },

  // Featured Articles
  'featured.title': { en: 'FEATURED ARTICLES', es: 'ARTÍCULOS DESTACADOS', pt: 'ARTIGOS DESTACADOS' },
  'featured.subtitle': { en: 'Handpicked stories and in-depth coverage', es: 'Historias seleccionadas y cobertura en profundidad', pt: 'Histórias selecionadas e cobertura aprofundada' },
  'featured.badge': { en: 'Featured', es: 'Destacado', pt: 'Destaque' },
  'featured.readMore': { en: 'Read More', es: 'Leer más', pt: 'Ler mais' },

  // Upcoming Events
  'events.title': { en: 'UPCOMING EVENTS', es: 'PRÓXIMOS EVENTOS', pt: 'PRÓXIMOS EVENTOS' },
  'events.subtitle': { en: 'Don\'t miss the biggest tournaments and competitions', es: 'No te pierdas los torneos y competencias más importantes', pt: 'Não perca os maiores torneios e competições' },
  'events.learnMore': { en: 'Learn More', es: 'Saber más', pt: 'Saiba mais' },

  // Newsletter
  'newsletter.title': { en: 'STAY IN THE GAME', es: 'MANTENTE EN EL JUEGO', pt: 'FIQUE NO JOGO' },
  'newsletter.subtitle': { en: 'Get the latest pickleball news, pro insights, and exclusive content delivered to your inbox.', es: 'Recibe las últimas noticias de pickleball, análisis profesionales y contenido exclusivo en tu correo.', pt: 'Receba as últimas notícias de pickleball, insights profissionais e conteúdo exclusivo no seu e-mail.' },
  'newsletter.placeholder': { en: 'Enter your email address', es: 'Ingresa tu correo electrónico', pt: 'Digite seu e-mail' },
  'newsletter.subscribe': { en: 'Subscribe', es: 'Suscribirse', pt: 'Inscrever-se' },
  'newsletter.subscribing': { en: 'Subscribing...', es: 'Suscribiendo...', pt: 'Inscrevendo...' },
  'newsletter.privacy': { en: 'We respect your privacy. Unsubscribe anytime.', es: 'Respetamos tu privacidad. Cancela cuando quieras.', pt: 'Respeitamos sua privacidade. Cancele quando quiser.' },
  'newsletter.success': { en: 'Thanks for subscribing!', es: '¡Gracias por suscribirte!', pt: 'Obrigado por se inscrever!' },
  'newsletter.error': { en: 'Something went wrong.', es: 'Algo salió mal.', pt: 'Algo deu errado.' },
  'newsletter.networkError': { en: 'Network error. Please try again.', es: 'Error de red. Inténtalo de nuevo.', pt: 'Erro de rede. Tente novamente.' },

  // Subscribe Form (inline article + footer)
  'subscribe.dontMiss': { en: 'Don\'t miss out', es: 'No te lo pierdas', pt: 'Não perca' },
  'subscribe.lovePickleball': { en: 'LOVE PICKLEBALL?', es: '¿TE GUSTA EL PICKLEBALL?', pt: 'AMA PICKLEBALL?' },
  'subscribe.cta': { en: 'Get Dink Authority Magazine updates, new editions, pro stories and event alerts.', es: 'Recibe actualizaciones de Dink Authority Magazine, nuevas ediciones, historias pro y alertas de eventos.', pt: 'Receba atualizações da Dink Authority Magazine, novas edições, histórias profissionais e alertas de eventos.' },
  'subscribe.emailPlaceholder': { en: 'Your email address *', es: 'Tu correo electrónico *', pt: 'Seu e-mail *' },
  'subscribe.emailPlaceholderShort': { en: 'Email address *', es: 'Correo electrónico *', pt: 'E-mail *' },
  'subscribe.phonePlaceholder': { en: 'Phone number (optional)', es: 'Teléfono (opcional)', pt: 'Telefone (opcional)' },
  'subscribe.phonePlaceholderShort': { en: 'Phone (optional)', es: 'Teléfono (opcional)', pt: 'Telefone (opcional)' },
  'subscribe.button': { en: 'Subscribe', es: 'Suscribirse', pt: 'Inscrever-se' },
  'subscribe.submitting': { en: 'Subscribing...', es: 'Suscribiendo...', pt: 'Inscrevendo...' },
  'subscribe.privacy': { en: 'We respect your privacy. Unsubscribe anytime.', es: 'Respetamos tu privacidad. Cancela cuando quieras.', pt: 'Respeitamos sua privacidade. Cancele quando quiser.' },
  'subscribe.stayConnected': { en: 'Stay Connected', es: 'Mantente conectado', pt: 'Fique conectado' },
  'subscribe.stayConnectedCta': { en: 'Get updates, new editions & event alerts.', es: 'Recibe actualizaciones, nuevas ediciones y alertas de eventos.', pt: 'Receba atualizações, novas edições e alertas de eventos.' },

  // Footer
  'footer.description': { en: 'The premier digital magazine for the global pickleball community. Covering pro players, tournaments, gear, and everything pickleball.', es: 'La revista digital líder para la comunidad global de pickleball. Cubrimos jugadores profesionales, torneos, equipamiento y todo sobre pickleball.', pt: 'A principal revista digital para a comunidade global de pickleball. Cobrindo jogadores profissionais, torneios, equipamentos e tudo sobre pickleball.' },
  'footer.navigation': { en: 'Navigation', es: 'Navegación', pt: 'Navegação' },
  'footer.connect': { en: 'Connect', es: 'Conectar', pt: 'Conectar' },
  'footer.rights': { en: 'All rights reserved.', es: 'Todos los derechos reservados.', pt: 'Todos os direitos reservados.' },

  // Articles page
  'articles.title': { en: 'ARTICLES', es: 'ARTÍCULOS', pt: 'ARTIGOS' },
  'articles.subtitle': { en: 'The latest stories, analysis and insights from the world of pickleball', es: 'Las últimas historias, análisis y perspectivas del mundo del pickleball', pt: 'As últimas histórias, análises e insights do mundo do pickleball' },
  'articles.allCategories': { en: 'All', es: 'Todos', pt: 'Todos' },
  'articles.noResults': { en: 'No articles found.', es: 'No se encontraron artículos.', pt: 'Nenhum artigo encontrado.' },
  'articles.readMore': { en: 'Read More', es: 'Leer más', pt: 'Ler mais' },
  'articles.previous': { en: 'Previous', es: 'Anterior', pt: 'Anterior' },
  'articles.next': { en: 'Next', es: 'Siguiente', pt: 'Próximo' },

  // Article detail
  'article.home': { en: 'Home', es: 'Inicio', pt: 'Início' },
  'article.articles': { en: 'Articles', es: 'Artículos', pt: 'Artigos' },
  'article.share': { en: 'Share', es: 'Compartir', pt: 'Compartilhar' },
  'article.copyLink': { en: 'Copy Link', es: 'Copiar enlace', pt: 'Copiar link' },
  'article.copied': { en: 'Copied!', es: '¡Copiado!', pt: 'Copiado!' },
  'article.related': { en: 'YOU MAY ALSO LIKE', es: 'TAMBIÉN TE PUEDE GUSTAR', pt: 'VOCÊ TAMBÉM PODE GOSTAR' },
  'article.translating': { en: 'Translating...', es: 'Traduciendo...', pt: 'Traduzindo...' },
  'article.translationFailed': { en: 'Translation unavailable', es: 'Traducción no disponible', pt: 'Tradução não disponível' },
  'article.viewOriginal': { en: 'View Original', es: 'Ver original', pt: 'Ver original' },
  'article.translated': { en: 'Translated', es: 'Traducido', pt: 'Traduzido' },

  // Categories
  'category.news': { en: 'News', es: 'Noticias', pt: 'Notícias' },
  'category.pro-players': { en: 'Pro Players', es: 'Jugadores Pro', pt: 'Jogadores Pro' },
  'category.enthusiasts': { en: 'Enthusiasts', es: 'Entusiastas', pt: 'Entusiastas' },
  'category.results': { en: 'Results', es: 'Resultados', pt: 'Resultados' },
  'category.events': { en: 'Events', es: 'Eventos', pt: 'Eventos' },
  'category.gear': { en: 'Gear', es: 'Equipamiento', pt: 'Equipamentos' },
  'category.magazine': { en: 'Magazine', es: 'Revista', pt: 'Revista' },
  'category.latam': { en: 'LATAM', es: 'LATAM', pt: 'LATAM' },
  'category.tips': { en: 'Tips', es: 'Consejos', pt: 'Dicas' },
  'category.places': { en: 'Places', es: 'Lugares', pt: 'Lugares' },
  'category.editorial': { en: 'Editorial', es: 'Editorial', pt: 'Editorial' },

  // About page
  'about.title': { en: 'ABOUT US', es: 'SOBRE NOSOTROS', pt: 'SOBRE NÓS' },
  'about.subtitle': { en: 'Dink Authority Magazine is the premier digital publication dedicated to the global pickleball community.', es: 'Dink Authority Magazine es la publicación digital líder dedicada a la comunidad global de pickleball.', pt: 'Dink Authority Magazine é a principal publicação digital dedicada à comunidade global de pickleball.' },
  'about.vision': { en: 'Our Vision', es: 'Nuestra Visión', pt: 'Nossa Visão' },
  'about.visionText': { en: 'To be the most trusted and comprehensive source of pickleball news, insights, and community for players at every level around the world.', es: 'Ser la fuente más confiable e integral de noticias, análisis y comunidad de pickleball para jugadores de todos los niveles en todo el mundo.', pt: 'Ser a fonte mais confiável e abrangente de notícias, insights e comunidade de pickleball para jogadores de todos os níveis ao redor do mundo.' },
  'about.mission': { en: 'Our Mission', es: 'Nuestra Misión', pt: 'Nossa Missão' },
  'about.missionText': { en: 'We bring the stories, strategies, and spirit of pickleball to enthusiasts and professionals alike—covering everything from grassroots growth to professional competition.', es: 'Llevamos las historias, estrategias y espíritu del pickleball a entusiastas y profesionales por igual—cubriendo todo, desde el crecimiento local hasta la competencia profesional.', pt: 'Trazemos as histórias, estratégias e espírito do pickleball para entusiastas e profissionais—cobrindo desde o crescimento local até a competição profissional.' },
  'about.values': { en: 'Our Values', es: 'Nuestros Valores', pt: 'Nossos Valores' },
  'about.valuesText': { en: 'Community, integrity, and passion for the sport. We believe in inclusive coverage that celebrates the diverse and growing world of pickleball.', es: 'Comunidad, integridad y pasión por el deporte. Creemos en una cobertura inclusiva que celebra el diverso y creciente mundo del pickleball.', pt: 'Comunidade, integridade e paixão pelo esporte. Acreditamos em uma cobertura inclusiva que celebra o diverso e crescente mundo do pickleball.' },
  'about.join': { en: 'Join Our Community', es: 'Únete a nuestra comunidad', pt: 'Junte-se à nossa comunidade' },

  // Contact page
  'contact.title': { en: 'CONTACT US', es: 'CONTÁCTANOS', pt: 'FALE CONOSCO' },
  'contact.subtitle': { en: 'Have a question, story tip, or partnership inquiry? We\'d love to hear from you.', es: '¿Tienes alguna pregunta, sugerencia de historia o consulta de alianza? Nos encantaría escucharte.', pt: 'Tem alguma pergunta, sugestão de história ou consulta de parceria? Adoraríamos ouvir de você.' },
  'contact.name': { en: 'Your Name', es: 'Tu nombre', pt: 'Seu nome' },
  'contact.email': { en: 'Your Email', es: 'Tu correo electrónico', pt: 'Seu e-mail' },
  'contact.message': { en: 'Your Message', es: 'Tu mensaje', pt: 'Sua mensagem' },
  'contact.send': { en: 'Send Message', es: 'Enviar mensaje', pt: 'Enviar mensagem' },
  'contact.sending': { en: 'Sending...', es: 'Enviando...', pt: 'Enviando...' },
  'contact.success': { en: 'Message sent successfully! We\'ll get back to you soon.', es: '¡Mensaje enviado con éxito! Te responderemos pronto.', pt: 'Mensagem enviada com sucesso! Retornaremos em breve.' },
  'contact.info': { en: 'Contact Information', es: 'Información de contacto', pt: 'Informações de contato' },

  // Recent Results
  'results.title': { en: 'RECENT RESULTS', es: 'RESULTADOS RECIENTES', pt: 'RESULTADOS RECENTES' },
  'results.subtitle': { en: 'Latest scores and tournament outcomes', es: 'Últimos puntajes y resultados de torneos', pt: 'Últimas pontuações e resultados de torneios' },

  // Magazine Section
  'magazine.title': { en: 'MAGAZINE', es: 'REVISTA', pt: 'REVISTA' },
  'magazine.subtitle': { en: 'Digital editions and special features', es: 'Ediciones digitales y artículos especiales', pt: 'Edições digitais e matérias especiais' },
  'magazine.readEdition': { en: 'Read Edition', es: 'Leer edición', pt: 'Ler edição' },
  'magazine.current': { en: 'Current Edition', es: 'Edición actual', pt: 'Edição atual' },

  // Cookie banner
  'cookie.message': { en: 'We use cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.', es: 'Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de cookies.', pt: 'Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com o uso de cookies.' },
  'cookie.accept': { en: 'Accept', es: 'Aceptar', pt: 'Aceitar' },

  // Common
  'common.by': { en: 'By', es: 'Por', pt: 'Por' },
  'common.readTime': { en: 'min read', es: 'min de lectura', pt: 'min de leitura' },
  'common.ad': { en: 'Sponsored', es: 'Patrocinado', pt: 'Patrocinado' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en ?? key;
}

export default translations;
