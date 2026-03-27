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
  'articles.heading': { en: 'Articles & News', es: 'Artículos y Noticias', pt: 'Artigos e Notícias' },
  'articles.subtitle': { en: 'Stay updated with the latest pickleball stories, insights, and analysis.', es: 'Mantente actualizado con las últimas historias, análisis e información del pickleball.', pt: 'Fique atualizado com as últimas histórias, análises e informações do pickleball.' },
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
  'article.translatingContent': { en: 'Translating article content...', es: 'Traduciendo contenido del artículo...', pt: 'Traduzindo conteúdo do artigo...' },
  'article.translationFailed': { en: 'Translation unavailable', es: 'Traducción no disponible', pt: 'Tradução não disponível' },
  'article.retryTranslation': { en: 'Retry', es: 'Reintentar', pt: 'Tentar novamente' },
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
  'about.title': { en: 'About Dink Authority', es: 'Sobre Dink Authority', pt: 'Sobre Dink Authority' },
  'about.subtitle': { en: 'The premier digital magazine dedicated to the global pickleball community.', es: 'La revista digital líder dedicada a la comunidad global de pickleball.', pt: 'A principal revista digital dedicada à comunidade global de pickleball.' },
  'about.mission': { en: 'Our Mission', es: 'Nuestra Misión', pt: 'Nossa Missão' },
  'about.missionP1': { en: 'Dink Authority Magazine was born from a simple belief: pickleball deserves world-class sports journalism. As the fastest-growing sport in the world, pickleball has evolved from backyard recreation to a professional spectacle — and its media coverage should match.', es: 'Dink Authority Magazine nació de una creencia simple: el pickleball merece periodismo deportivo de clase mundial. Como el deporte de más rápido crecimiento en el mundo, el pickleball ha evolucionado de recreación de patio trasero a espectáculo profesional — y su cobertura mediática debería estar a la altura.', pt: 'Dink Authority Magazine nasceu de uma crença simples: o pickleball merece jornalismo esportivo de classe mundial. Como o esporte de crescimento mais rápido do mundo, o pickleball evoluiu de recreação no quintal para espetáculo profissional — e sua cobertura midiática deveria acompanhar.' },
  'about.missionP2': { en: 'We deliver comprehensive coverage of professional pickleball, from PPA and MLP tournaments to grassroots community events. Our editorial team brings decades of combined sports journalism experience, covering every dink, drive, and erne with the same rigor you\'d expect from any major sports publication.', es: 'Ofrecemos cobertura integral del pickleball profesional, desde torneos PPA y MLP hasta eventos comunitarios de base. Nuestro equipo editorial aporta décadas de experiencia combinada en periodismo deportivo, cubriendo cada dink, drive y erne con el mismo rigor que esperarías de cualquier publicación deportiva importante.', pt: 'Entregamos cobertura abrangente do pickleball profissional, desde torneios PPA e MLP até eventos comunitários de base. Nossa equipe editorial traz décadas de experiência combinada em jornalismo esportivo, cobrindo cada dink, drive e erne com o mesmo rigor que você esperaria de qualquer grande publicação esportiva.' },
  'about.missionP3': { en: 'Whether you are a seasoned professional or just picking up a paddle for the first time, Dink Authority Magazine is your home for everything pickleball.', es: 'Ya seas un profesional experimentado o estés tomando una paleta por primera vez, Dink Authority Magazine es tu hogar para todo lo relacionado con el pickleball.', pt: 'Seja você um profissional experiente ou esteja pegando uma raquete pela primeira vez, Dink Authority Magazine é seu lar para tudo sobre pickleball.' },
  'about.whatDrivesUs': { en: 'What Drives Us', es: 'Lo que nos impulsa', pt: 'O que nos move' },
  'about.precisionCoverage': { en: 'Precision Coverage', es: 'Cobertura precisa', pt: 'Cobertura precisa' },
  'about.precisionCoverageDesc': { en: 'In-depth reporting on every major tournament, player movement, and industry development.', es: 'Reportajes en profundidad sobre cada torneo importante, movimiento de jugadores y desarrollo de la industria.', pt: 'Reportagens aprofundadas sobre cada grande torneio, movimentação de jogadores e desenvolvimento da indústria.' },
  'about.communityFirst': { en: 'Community First', es: 'Comunidad primero', pt: 'Comunidade em primeiro' },
  'about.communityFirstDesc': { en: 'Built by pickleball enthusiasts for pickleball enthusiasts. We are the voice of the community.', es: 'Creado por entusiastas del pickleball para entusiastas del pickleball. Somos la voz de la comunidad.', pt: 'Criado por entusiastas de pickleball para entusiastas de pickleball. Somos a voz da comunidade.' },
  'about.globalReach': { en: 'Global Reach', es: 'Alcance global', pt: 'Alcance global' },
  'about.globalReachDesc': { en: 'Covering pickleball across North America, Latin America, Europe, and beyond.', es: 'Cubriendo el pickleball en Norteamérica, Latinoamérica, Europa y más allá.', pt: 'Cobrindo pickleball na América do Norte, América Latina, Europa e além.' },
  'about.editorialExcellence': { en: 'Editorial Excellence', es: 'Excelencia editorial', pt: 'Excelência editorial' },
  'about.editorialExcellenceDesc': { en: 'Professional journalism standards with passion for the fastest-growing sport in the world.', es: 'Estándares de periodismo profesional con pasión por el deporte de más rápido crecimiento en el mundo.', pt: 'Padrões de jornalismo profissional com paixão pelo esporte de crescimento mais rápido do mundo.' },

  // Contact page
  'contact.title': { en: 'Get In Touch', es: 'Contáctanos', pt: 'Fale Conosco' },
  'contact.subtitle': { en: 'Have a story tip, partnership inquiry, or just want to say hello?', es: '¿Tienes una sugerencia de historia, consulta de alianza o solo quieres saludar?', pt: 'Tem uma sugestão de história, consulta de parceria ou só quer dizer olá?' },
  'contact.emailLabel': { en: 'Email', es: 'Correo electrónico', pt: 'E-mail' },
  'contact.locationLabel': { en: 'Location', es: 'Ubicación', pt: 'Localização' },
  'contact.nameLabel': { en: 'Name', es: 'Nombre', pt: 'Nome' },
  'contact.namePlaceholder': { en: 'Your name', es: 'Tu nombre', pt: 'Seu nome' },
  'contact.emailPlaceholder': { en: 'Your email', es: 'Tu correo electrónico', pt: 'Seu e-mail' },
  'contact.subjectLabel': { en: 'Subject', es: 'Asunto', pt: 'Assunto' },
  'contact.subjectPlaceholder': { en: 'Subject', es: 'Asunto', pt: 'Assunto' },
  'contact.messageLabel': { en: 'Message', es: 'Mensaje', pt: 'Mensagem' },
  'contact.messagePlaceholder': { en: 'Your message...', es: 'Tu mensaje...', pt: 'Sua mensagem...' },
  'contact.send': { en: 'Send Message', es: 'Enviar mensaje', pt: 'Enviar mensagem' },
  'contact.sending': { en: 'Sending...', es: 'Enviando...', pt: 'Enviando...' },
  'contact.successTitle': { en: 'Message Sent!', es: '¡Mensaje enviado!', pt: 'Mensagem enviada!' },
  'contact.successText': { en: 'Thank you for reaching out. We will get back to you soon.', es: 'Gracias por comunicarte. Te responderemos pronto.', pt: 'Obrigado por entrar em contato. Retornaremos em breve.' },
  'contact.sendAnother': { en: 'Send Another Message', es: 'Enviar otro mensaje', pt: 'Enviar outra mensagem' },
  'contact.privacy': { en: 'Your information is stored securely and will only be used to respond to your inquiry.', es: 'Tu información se almacena de forma segura y solo se usará para responder a tu consulta.', pt: 'Suas informações são armazenadas com segurança e serão usadas apenas para responder à sua consulta.' },

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

  // Shop
  'nav.tips': { en: 'Tips', es: 'Tips', pt: 'Dicas' },
  'nav.shop': { en: 'Shop', es: 'Tienda', pt: 'Loja' },
  'tips.title': { en: 'Pro Tips', es: 'Tips Pro', pt: 'Dicas Pro' },
  'tips.subtitle': { en: 'Expert advice from professional players and coaches', es: 'Consejos expertos de jugadoras y entrenadoras profesionales', pt: 'Conselhos de jogadoras e treinadoras profissionais' },
  'tips.readTip': { en: 'Read Tip', es: 'Leer Tip', pt: 'Ler Dica' },
  'tips.by': { en: 'By', es: 'Por', pt: 'Por' },
  'tips.watchMore': { en: 'Watch more on YouTube', es: 'Ver más en YouTube', pt: 'Veja mais no YouTube' },
  'tips.shareTitle': { en: 'Share this tip', es: 'Compartir este tip', pt: 'Compartilhar esta dica' },
  'tips.copyLink': { en: 'Copy Link', es: 'Copiar enlace', pt: 'Copiar link' },
  'tips.copied': { en: 'Copied!', es: '¡Copiado!', pt: 'Copiado!' },
  'tips.gallery': { en: 'Gallery', es: 'Galería', pt: 'Galeria' },
  'tips.relatedTips': { en: 'More Tips', es: 'Más Tips', pt: 'Mais Dicas' },
  'tips.backToTips': { en: 'Back to Tips', es: 'Volver a Tips', pt: 'Voltar às Dicas' },
  'tips.translating': { en: 'Translating...', es: 'Traduciendo...', pt: 'Traduzindo...' },
  'tips.translated': { en: 'Translated', es: 'Traducido', pt: 'Traduzido' },
  'tips.translationFailed': { en: 'Translation unavailable', es: 'Traducción no disponible', pt: 'Tradução não disponível' },
  'tips.viewOriginal': { en: 'View Original', es: 'Ver Original', pt: 'Ver Original' },
  'tips.noTips': { en: 'No tips available yet. Check back soon!', es: 'Aún no hay tips disponibles. ¡Vuelve pronto!', pt: 'Nenhuma dica disponível ainda. Volte em breve!' },
  'tips.latestEdition': { en: 'Latest Edition', es: 'Última Edición', pt: 'Última Edição' },
  'tips.readNow': { en: 'Read Now', es: 'Leer Ahora', pt: 'Ler Agora' },
  'tips.cat.all': { en: 'All Tips', es: 'Todos los Tips', pt: 'Todas as Dicas' },
  'tips.cat.technique': { en: 'Technique', es: 'Técnica', pt: 'Técnica' },
  'tips.cat.strategy': { en: 'Strategy', es: 'Estrategia', pt: 'Estratégia' },
  'tips.cat.fitness': { en: 'Fitness', es: 'Fitness', pt: 'Fitness' },
  'tips.cat.mentalGame': { en: 'Mental Game', es: 'Juego Mental', pt: 'Jogo Mental' },
  'tips.cat.equipment': { en: 'Equipment', es: 'Equipamiento', pt: 'Equipamento' },
  'shop.title': { en: 'Shop', es: 'Tienda', pt: 'Loja' },
  'shop.subtitle': { en: 'Official Dink Authority merchandise and gear', es: 'Merchandise y equipamiento oficial de Dink Authority', pt: 'Produtos e equipamentos oficiais da Dink Authority' },
  'shop.viewProduct': { en: 'View Product', es: 'Ver Producto', pt: 'Ver Produto' },
  'shop.buyNow': { en: 'Buy Now', es: 'Comprar Ahora', pt: 'Comprar Agora' },
  'shop.description': { en: 'Description', es: 'Descripción', pt: 'Descrição' },
  'shop.relatedProducts': { en: 'You May Also Like', es: 'También Te Puede Gustar', pt: 'Você Também Pode Gostar' },

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
