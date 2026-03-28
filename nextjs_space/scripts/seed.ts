import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ARTICLES = [
  {
    title: 'Ben Johns Clinches Historic Triple Crown at 2026 PPA Championship',
    slug: 'ben-johns-triple-crown-2026-ppa',
    excerpt: 'Ben Johns made history this weekend by winning singles, doubles, and mixed doubles titles at the 2026 PPA Championship, solidifying his status as the greatest player of his generation.',
    content: `<p>In what many are calling the greatest individual performance in professional pickleball history, Ben Johns swept all three divisions at the 2026 PPA Championship held in Dallas, Texas.</p><p>The 27-year-old phenom dominated the singles bracket without dropping a single game, defeated the top-seeded doubles team with partner Collin Johns, and capped off the weekend with a thrilling mixed doubles victory alongside Anna Leigh Waters.</p><p>"This has been a dream of mine since I started competing professionally," Johns said in his post-match interview. "The level of competition keeps getting higher every year, and to achieve this milestone means everything."</p><p>Johns's singles performance was particularly impressive, as he dismantled former world number one Tyson McGuffin in straight sets during the final. His court coverage, precise dinking, and devastating erne shots left opponents scrambling throughout the tournament.</p><p>The triple crown achievement has only been accomplished twice before in PPA history, and Johns is the first player to do it since the tour expanded to 32-player draws in 2025.</p>`,
    imageUrl: '/images/article-1.jpg',
    category: 'pro-players',
    status: 'published',
    isFeatured: false,
    isHeroStory: true,
    authorName: 'Marcus Rivera',
  },
  {
    title: 'MLP 2026 Season Preview: New Teams, New Rules, and Higher Stakes',
    slug: 'mlp-2026-season-preview',
    excerpt: 'Major League Pickleball expands to 16 teams for the 2026 season with new ownership groups, revised scoring formats, and a record $10 million prize pool.',
    content: `<p>Major League Pickleball is gearing up for its most ambitious season yet, with the league expanding from 12 to 16 teams and introducing a record-breaking $10 million prize pool for the 2026 campaign.</p><p>Among the new ownership groups are several high-profile investors from the worlds of tech and entertainment, bringing fresh energy and resources to the rapidly growing sport. The expansion teams include franchises in Austin, Nashville, Portland, and Charlotte.</p><p>"We're witnessing the professionalization of pickleball in real time," said MLP Commissioner Mark Ein. "The demand from cities wanting teams and players wanting to compete has never been higher."</p><p>The 2026 season will also feature revised scoring rules designed to create more exciting television content, including a new tiebreaker format and mandatory timeouts for coaching opportunities.</p><p>Player drafts have already generated significant buzz, with top picks commanding salaries that would have been unthinkable just three years ago. The league minimum salary has been raised to $75,000, reflecting the sport's growing financial ecosystem.</p>`,
    imageUrl: '/images/article-2.jpg',
    category: 'news',
    status: 'published',
    isFeatured: true,
    isHeroStory: false,
    authorName: 'Sarah Chen',
  },
  {
    title: 'The Best Pickleball Paddles of 2026: Expert Gear Review',
    slug: 'best-pickleball-paddles-2026',
    excerpt: 'Our comprehensive review of the top pickleball paddles hitting the market in 2026, from power-focused designs to control-oriented options for every skill level.',
    content: `<p>The pickleball paddle market continues to evolve at a remarkable pace, with manufacturers pushing the boundaries of materials science and design engineering. Our team spent three months testing over 40 paddles to bring you the definitive guide for 2026.</p><p><strong>Best Overall: JOOLA Hyperion CFS 16mm Pro</strong></p><p>The latest iteration of JOOLA's flagship paddle delivers an exceptional blend of power and control. The Carbon Friction Surface technology provides incredible spin potential, while the 16mm core thickness offers a larger sweet spot than its predecessor.</p><p><strong>Best for Power: Selkirk Vanguard Power Air 2.0</strong></p><p>If you're looking to add serious heat to your drives and overheads, the Vanguard Power Air 2.0 is the paddle to beat. Its extended handle and optimized weight distribution generate impressive swing speed.</p><p><strong>Best for Control: Engage Pursuit MX 6.0</strong></p><p>Dinkers and strategic players will love the Pursuit MX 6.0. Its responsive polymer core and textured face provide unmatched feel and precision at the kitchen line.</p><p><strong>Best Budget: Head Radical Tour CO</strong></p><p>Proving that quality doesn't have to break the bank, the Radical Tour CO delivers performance that rivals paddles costing twice its price.</p>`,
    imageUrl: '/images/article-3.jpg',
    category: 'gear',
    status: 'published',
    isFeatured: true,
    isHeroStory: false,
    authorName: 'Jake Thompson',
  },
  {
    title: 'How Pickleball Is Transforming Community Recreation Across America',
    slug: 'pickleball-transforming-community-recreation',
    excerpt: 'From converted tennis courts to purpose-built facilities, cities across the country are investing millions in pickleball infrastructure to meet surging demand.',
    content: `<p>The pickleball boom isn't just a sports trend — it's reshaping how communities think about recreation and public spaces. Across the United States, cities and towns are investing heavily in pickleball infrastructure, driven by unprecedented demand from players of all ages.</p><p>According to the latest data from the Sports & Fitness Industry Association, pickleball participation grew by 35% in 2025, reaching an estimated 48 million players nationwide. This explosive growth has put pressure on municipal recreation departments to provide adequate facilities.</p><p>"We've had to completely rethink our facility planning," says Maria Gonzalez, Parks Director for Mesa, Arizona. "Three years ago, we had eight pickleball courts. Today we have 52, and there's still a waiting list during peak hours."</p><p>The trend extends beyond public parks. Dedicated pickleball facilities — often called "pickleplex" venues — are popping up in suburban areas, offering dozens of courts alongside pro shops, lessons, and social spaces.</p><p>The economic impact is significant too. A recent study found that a well-managed pickleball facility can generate $1.2 million in annual revenue while serving as a community hub that brings together diverse age groups.</p>`,
    imageUrl: '/images/article-4.jpg',
    category: 'enthusiasts',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Elena Martinez',
  },
  {
    title: 'Anna Leigh Waters and Catherine Parenteau Announce New Doubles Partnership',
    slug: 'waters-parenteau-doubles-partnership',
    excerpt: 'In a surprising move that shakes up the women\'s doubles landscape, Anna Leigh Waters and Catherine Parenteau are teaming up for the 2026 PPA tour.',
    content: `<p>In one of the most significant partnership announcements in professional pickleball, Anna Leigh Waters and Catherine Parenteau have confirmed they will team up for the 2026 PPA tour women's doubles circuit.</p><p>The partnership brings together two of the sport's most talented and charismatic players, combining Waters' aggressive net play with Parenteau's exceptional court coverage and strategic acumen.</p><p>"Catherine and I have always had great chemistry on the court," Waters said during a joint press conference. "We believe this partnership can dominate the doubles circuit and push each other to new heights."</p><p>The announcement comes after both players experienced changes in their previous partnerships. Waters previously played with her mother, Leigh Waters, while Parenteau's partnership with Jessie Irvine had been one of the most successful pairings in recent years.</p><p>Analysts expect the Waters-Parenteau duo to immediately become the team to beat, with their complementary skills and competitive fire making them formidable opponents for any pair on tour.</p>`,
    imageUrl: '/images/article-5.jpg',
    category: 'pro-players',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Marcus Rivera',
  },
  {
    title: 'Mastering the Third Shot Drop: A Complete Guide for Intermediate Players',
    slug: 'mastering-third-shot-drop-guide',
    excerpt: 'The third shot drop is often called the most important shot in pickleball. This comprehensive guide breaks down technique, timing, and practice drills.',
    content: `<p>If there's one shot that separates recreational players from competitive ones, it's the third shot drop. This deceptively simple-looking shot requires precision, touch, and an understanding of court geometry that takes dedicated practice to develop.</p><p><strong>Why the Third Shot Drop Matters</strong></p><p>After the serve and return, the serving team faces a critical moment. The receiving team is already at the non-volley zone (kitchen line), while the serving team is back at the baseline. The third shot drop is the great equalizer — a soft, arcing shot that lands in the opponent's kitchen, allowing the serving team to advance to the net.</p><p><strong>Key Technique Points:</strong></p><p>1. <em>Open paddle face</em> - Keep your paddle face slightly open to create the necessary loft</p><p>2. <em>Soft grip pressure</em> - Hold the paddle at about 3-4 on a 1-10 scale</p><p>3. <em>Push, don't swing</em> - Think of pushing the ball rather than swinging at it</p><p>4. <em>Follow through upward</em> - Your follow-through should go up, not forward</p><p><strong>Practice Drill: The Bucket Challenge</strong></p><p>Place a bucket in your opponent's kitchen. From the baseline, try to land 10 balls in or near the bucket. Track your percentage and aim to improve weekly. This simple drill builds the muscle memory needed for tournament play.</p>`,
    imageUrl: '/images/article-6.jpg',
    category: 'enthusiasts',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Coach Dave Williams',
  },
  {
    title: 'Inside the $50M Pickleplex: The Future of Pickleball Facilities',
    slug: 'inside-50m-pickleplex-future-facilities',
    excerpt: 'We got an exclusive tour of the new state-of-the-art pickleball mega-facility in Scottsdale, featuring 40 courts, a performance center, and broadcast studio.',
    content: `<p>Scottsdale, Arizona has always been a pickleball hotspot, but the city's newest addition takes the sport to an entirely new level. The Dink Palace — a $50 million, 150,000 square-foot facility — represents the most ambitious pickleball venue ever built in North America.</p><p>Dink Authority Magazine received an exclusive tour of the facility weeks before its grand opening, and what we found exceeded all expectations.</p><p><strong>The Courts</strong></p><p>The facility features 40 courts spread across indoor and outdoor spaces. The championship arena can seat 3,000 spectators and includes broadcast-quality lighting and camera positions for live streaming.</p><p><strong>Performance Center</strong></p><p>A dedicated sports science wing includes video analysis rooms, fitness training areas, recovery pools, and consultation spaces for sports psychologists — amenities you'd expect at a professional training facility in any major sport.</p><p><strong>Community Spaces</strong></p><p>Beyond the courts, the Dink Palace includes a full-service restaurant, pro shop, event spaces, and social lounges designed to make the facility a gathering place for the local pickleball community.</p>`,
    imageUrl: '/images/article-7.jpg',
    category: 'magazine',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Sarah Chen',
  },
  {
    title: 'Pickleball Goes Global: The Sport\'s Explosive Growth in Latin America',
    slug: 'pickleball-explosive-growth-latin-america',
    excerpt: 'From Mexico City to Buenos Aires, pickleball is experiencing rapid growth across Latin America, creating new opportunities for players and the industry.',
    content: `<p>While pickleball's growth in the United States has been well documented, the sport's expansion into Latin America represents perhaps its most exciting frontier. From beachside courts in Cancún to converted paddle tennis facilities in Buenos Aires, pickleball is capturing the imagination of sports enthusiasts across the region.</p><p><strong>Mexico Leads the Way</strong></p><p>Mexico has emerged as Latin America's pickleball leader, with an estimated 500,000 players and growing. Major resort destinations like Cancún, Los Cabos, and Puerto Vallarta have embraced the sport, recognizing its appeal to both tourists and locals.</p><p><strong>The Brazil Boom</strong></p><p>Brazil's large paddle tennis (padel) community has provided a natural pipeline for pickleball adoption. Players familiar with racket sports on enclosed courts have found the transition to pickleball intuitive and exciting.</p><p><strong>Colombia and Argentina</strong></p><p>Both countries have seen organized pickleball leagues form in their major cities, with Colombia hosting its first international tournament in Bogotá last year. Argentina's Buenos Aires has become a hub for South American pickleball, with purpose-built facilities opening throughout the city.</p><p>The International Federation of Pickleball projects that Latin American participation will reach 5 million players by the end of 2027, making the region a key market for equipment manufacturers and tour organizers.</p>`,
    imageUrl: '/images/event-2.jpg',
    category: 'latam',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Elena Martinez',
  },
  {
    title: '2026 US Open Pickleball Championships: Everything You Need to Know',
    slug: '2026-us-open-pickleball-championships-preview',
    excerpt: 'The world\'s largest pickleball event returns to Naples, Florida with expanded divisions, a bigger venue, and record prize money.',
    content: `<p>The US Open Pickleball Championships returns to its spiritual home in Naples, Florida this April, and the 2026 edition promises to be the biggest and most competitive yet.</p><p>Over 3,000 players from 30 countries are expected to compete across amateur and professional divisions, making it the largest participation event in pickleball history.</p><p><strong>What's New for 2026</strong></p><p>The tournament has expanded its venue footprint to include 60 championship courts, up from 48 last year. A new center court with seating for 5,000 spectators will host the professional finals weekend.</p><p>Prize money for the professional divisions has reached $500,000, with the singles champions each taking home $50,000.</p><p><strong>Key Players to Watch</strong></p><p>All eyes will be on defending champions and emerging challengers. The singles brackets are wide open, with several young players poised to make deep runs.</p>`,
    imageUrl: '/images/event-1.jpg',
    category: 'events',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Jake Thompson',
  },
  {
    title: 'The Science of Spin: How Modern Paddle Technology Is Changing the Game',
    slug: 'science-of-spin-paddle-technology',
    excerpt: 'From carbon fiber surfaces to thermoformed edges, we explore how paddle innovation is pushing the boundaries of what\'s possible in pickleball.',
    content: `<p>The pickleball paddle has undergone a remarkable evolution since the sport's humble beginnings with wooden paddles in the 1960s. Today's high-performance paddles are engineering marvels, incorporating aerospace materials and computational design to maximize player performance.</p><p><strong>The Carbon Fiber Revolution</strong></p><p>Carbon fiber face materials have become the industry standard for competitive paddles. The key advantage isn't just durability — it's the ability to create textured surfaces that generate unprecedented amounts of spin.</p><p><strong>Thermoformed Construction</strong></p><p>One of the biggest innovations in recent years is thermoformed paddle construction, where the entire paddle is heated and compressed in a mold. This creates a seamless edge that increases the sweet spot and provides more consistent response across the paddle face.</p><p><strong>Core Materials</strong></p><p>Polypropylene honeycomb cores remain dominant, but manufacturers are experimenting with different cell sizes and densities to fine-tune the feel and power characteristics of their paddles.</p>`,
    imageUrl: '/images/article-8.jpg',
    category: 'gear',
    status: 'published',
    isFeatured: false,
    isHeroStory: false,
    authorName: 'Jake Thompson',
  },
];

const EVENTS = [
  {
    name: 'PPA Masters Championship 2026',
    description: 'The premier professional pickleball tournament featuring the world\'s top-ranked players competing for a $500,000 prize pool.',
    location: 'Las Vegas, NV',
    startDate: new Date('2026-04-15'),
    endDate: new Date('2026-04-20'),
    externalUrl: 'https://www.pickleballtournaments.com',
    isActive: true,
  },
  {
    name: 'US Open Pickleball Championships',
    description: 'The world\'s largest pickleball event with 3,000+ players from 30 countries competing in amateur and professional divisions.',
    location: 'Naples, FL',
    startDate: new Date('2026-05-10'),
    endDate: new Date('2026-05-17'),
    externalUrl: 'https://www.usopenpickleball.com',
    isActive: true,
  },
  {
    name: 'MLP Miami Grand Slam',
    description: 'Major League Pickleball\'s flagship team event featuring all 16 franchises in a week-long competition format.',
    location: 'Miami, FL',
    startDate: new Date('2026-06-05'),
    endDate: new Date('2026-06-08'),
    externalUrl: 'https://www.majorleaguepickleball.net',
    isActive: true,
  },
];

const SETTINGS: Record<string, string> = {
  site_name: 'Dink Authority Magazine',
  site_description: 'The Voice of Pickleball',
  contact_email: 'info@dinkauthoritymagazine.com',
  whatsapp_number: '15551234567',
  social_instagram: 'https://instagram.com/dinkauthority',
  social_facebook: 'https://facebook.com/dinkauthority',
  social_twitter: 'https://twitter.com/dinkauthority',
  social_youtube: 'https://youtube.com/@dinkauthority',
  ad_banner_image: '/images/ad-banner.jpg',
  ad_banner_link: '',
};

async function main() {
  console.log('Seeding database...');

  // Upsert admin user
  const hashedPassword = await bcrypt.hash('DinkAuth2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dinkauthority.com' },
    update: {},
    create: {
      email: 'admin@dinkauthority.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created/verified');

  // Upsert articles
  for (const art of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: { imageUrl: art.imageUrl },
      create: {
        ...art,
        authorId: admin.id,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`${ARTICLES.length} articles seeded`);

  // Upsert events
  for (const ev of EVENTS) {
    const existing = await prisma.event.findFirst({ where: { name: ev.name } });
    if (!existing) {
      await prisma.event.create({ data: ev });
    }
  }
  console.log(`${EVENTS.length} events seeded`);

  // Upsert settings
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log('Site settings seeded');

  // Seed tournament results
  const RESULTS = [
    { tournamentName: '2026 PPA Championship', division: "Men's Singles", winner: 'Ben Johns', runnerUp: 'Tyson McGuffin', score: '11-5, 11-7', location: 'Dallas, TX', date: new Date('2026-03-15') },
    { tournamentName: '2026 PPA Championship', division: "Women's Singles", winner: 'Anna Leigh Waters', runnerUp: 'Catherine Parenteau', score: '11-8, 11-6', location: 'Dallas, TX', date: new Date('2026-03-15') },
    { tournamentName: '2026 PPA Championship', division: "Mixed Doubles", winner: 'Johns / Waters', runnerUp: 'McGuffin / Parenteau', score: '11-9, 9-11, 11-7', location: 'Dallas, TX', date: new Date('2026-03-14') },
    { tournamentName: 'MLP Austin Showdown', division: "Men's Doubles", winner: 'Johns / Johnson', runnerUp: 'Newman / Devilliers', score: '11-4, 11-8', location: 'Austin, TX', date: new Date('2026-03-08') },
    { tournamentName: 'APP Suncoast Open', division: "Women's Doubles", winner: 'Irvine / Todd', runnerUp: 'Jardim / Kovalova', score: '11-7, 8-11, 11-5', location: 'Sarasota, FL', date: new Date('2026-03-01') },
    { tournamentName: 'APP Suncoast Open', division: "Men's Singles", winner: 'Federico Staksrud', runnerUp: 'JW Johnson', score: '11-9, 11-8', location: 'Sarasota, FL', date: new Date('2026-03-01') },
  ];

  for (const result of RESULTS) {
    const existing = await prisma.tournamentResult.findFirst({
      where: { tournamentName: result.tournamentName, division: result.division },
    });
    if (!existing) {
      await prisma.tournamentResult.create({ data: result });
    }
  }
  console.log(`${RESULTS.length} tournament results seeded`);

  // Seed magazine editions
  const EDITIONS = [
    { title: 'The Rise of Pickleball: 2026 Season Preview', slug: 'the-rise-of-pickleball-2026-season-preview', issueNumber: 'Issue #15', description: 'Our comprehensive preview of the 2026 professional pickleball season, featuring player rankings, team analysis, and bold predictions for the year ahead.', isCurrent: true, publishDate: new Date('2026-03-01'), coverUrl: null },
    { title: 'The Legends Issue: Greatest Players of All Time', slug: 'the-legends-issue-greatest-players-of-all-time', issueNumber: 'Issue #14', description: 'We rank the top 50 pickleball players in history, from the pioneers to the modern superstars reshaping the game.', isCurrent: false, publishDate: new Date('2026-01-15'), coverUrl: null },
    { title: 'Gear Guide 2025: The Ultimate Equipment Review', slug: 'gear-guide-2025-the-ultimate-equipment-review', issueNumber: 'Issue #13', description: 'Our annual deep dive into paddles, shoes, bags, and accessories—everything you need to elevate your game.', isCurrent: false, publishDate: new Date('2025-11-01'), coverUrl: null },
    { title: 'Pickleball Goes Global: The International Expansion', slug: 'pickleball-goes-global-the-international-expansion', issueNumber: 'Issue #12', description: 'How pickleball is conquering new markets across Latin America, Europe, and Asia with explosive growth.', isCurrent: false, publishDate: new Date('2025-09-01'), coverUrl: null },
  ];

  for (const edition of EDITIONS) {
    const existing = await prisma.magazineEdition.findFirst({
      where: { title: edition.title },
    });
    if (!existing) {
      await prisma.magazineEdition.create({ data: edition });
    }
  }
  console.log(`${EDITIONS.length} magazine editions seeded`);

  // Seed demo products
  const PRODUCTS = [
    {
      name: 'Dink Authority Hoodie',
      slug: 'dink-authority-hoodie',
      category: 'apparel',
      price: 59.99,
      shortDescription: 'Premium heavyweight hoodie with embroidered Dink Authority logo. Stay warm on and off the court.',
      fullDescription: 'Our signature Dink Authority Hoodie is crafted from premium 400gsm heavyweight French terry cotton. Features an embroidered Dink Authority logo on the chest, kangaroo pocket, and ribbed cuffs. Perfect for cool mornings at the court or casual wear. Available in multiple sizes.\n\n• 100% premium cotton French terry\n• 400gsm heavyweight fabric\n• Embroidered logo\n• Kangaroo pocket\n• Ribbed cuffs and hem\n• Unisex fit',
      images: ['/images/products/hoodie.png'],
      buttonLabel: 'Buy Now',
      isActive: true,
      isFeatured: true,
      inventoryStatus: 'in_stock',
    },
    {
      name: 'Dink Authority Cap',
      slug: 'dink-authority-cap',
      category: 'accessories',
      price: 29.99,
      shortDescription: 'Classic structured cap with embroidered Dink Authority logo. Adjustable strap for a perfect fit.',
      fullDescription: 'Rep Dink Authority on the court with our classic structured cap. Features a premium embroidered logo on the front panel, pre-curved brim, and adjustable metal buckle strap for a perfect fit. Breathable cotton twill construction keeps you cool during play.\n\n• 100% cotton twill\n• Structured six-panel design\n• Embroidered front logo\n• Pre-curved brim\n• Adjustable metal buckle strap\n• One size fits most',
      images: ['/images/products/cap.png'],
      buttonLabel: 'Buy Now',
      isActive: true,
      isFeatured: false,
      inventoryStatus: 'in_stock',
    },
    {
      name: 'Dink Authority T-Shirt',
      slug: 'dink-authority-tshirt',
      category: 'apparel',
      price: 34.99,
      shortDescription: 'Soft, breathable performance tee with Dink Authority print. Perfect for play or everyday wear.',
      fullDescription: 'The Dink Authority T-Shirt blends style with performance. Made from a premium cotton-polyester blend for softness and moisture-wicking properties. Features a bold Dink Authority graphic print on the chest. Great for the court or casual wear.\n\n• 60% cotton, 40% polyester blend\n• Moisture-wicking fabric\n• Screen-printed graphic\n• Crew neck\n• Side-seamed construction\n• Unisex sizing',
      images: ['/images/products/tshirt.png'],
      buttonLabel: 'Buy Now',
      isActive: true,
      isFeatured: true,
      inventoryStatus: 'in_stock',
    },
    {
      name: 'Dink Authority Tumbler',
      slug: 'dink-authority-tumbler',
      category: 'drinkware',
      price: 24.99,
      shortDescription: 'Double-wall insulated stainless steel tumbler. Keeps drinks cold for 24h or hot for 12h.',
      fullDescription: 'Stay hydrated courtside with the Dink Authority Tumbler. This premium double-wall vacuum insulated stainless steel tumbler keeps your drinks ice-cold for 24 hours or piping hot for 12 hours. Features a laser-engraved Dink Authority logo and a splash-proof sliding lid.\n\n• 20oz capacity\n• Double-wall vacuum insulation\n• 18/8 stainless steel\n• Laser-engraved logo\n• Splash-proof sliding lid\n• BPA-free\n• Fits standard cup holders',
      images: ['/images/products/tumbler.png'],
      buttonLabel: 'Buy Now',
      isActive: true,
      isFeatured: false,
      inventoryStatus: 'in_stock',
    },
    {
      name: 'Dink Authority Mug',
      slug: 'dink-authority-mug',
      category: 'drinkware',
      price: 19.99,
      shortDescription: 'Classic ceramic mug with Dink Authority logo. Start your mornings right before hitting the court.',
      fullDescription: 'The perfect mug for every pickleball enthusiast. This classic ceramic mug features a high-quality printed Dink Authority logo that won\'t fade. Microwave and dishwasher safe. Makes a great gift for your pickleball-loving friends.\n\n• 11oz classic ceramic mug\n• High-quality print\n• Microwave safe\n• Dishwasher safe\n• Comfortable C-handle\n• Makes a great gift',
      images: ['/images/products/mug.png'],
      buttonLabel: 'Buy Now',
      isActive: true,
      isFeatured: false,
      inventoryStatus: 'in_stock',
    },
  ];

  for (const prod of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`${PRODUCTS.length} demo products seeded`);

  // ── Tip Authors ──
  const TIP_AUTHORS = [
    {
      name: 'Domenika Turkovic',
      slug: 'domenika-turkovic',
      photoUrl: 'https://www.croatiaweek.com/wp-content/uploads/2025/06/810de4eb-bdc2-42da-a880-2eb6fcd5b1c0.jpeg?x20603',
      bio: 'Croatian pickleball champion and IPTPA-certified coach specializing in dink strategy and soft game mastery.',
    },
    {
      name: 'Lorena Duknic',
      slug: 'lorena-duknic',
      photoUrl: 'https://pickleballcroatia.com/wp-content/uploads/2024/11/Snapinsta.app_462465709_1556043648325268_813180944037166130_n_1080.jpg',
      bio: 'Professional pickleball player from Croatia, doubles specialist, and ambassador for pickleball growth in LATAM and Europe.',
    },
    {
      name: 'Dalia Garza',
      slug: 'dalia-garza',
      photoUrl: 'https://teachme.to/_next/image?url=https%3A%2F%2Fmedia.teachme.to%2Fhttps%3A%2F%2Fngzrkxhrgwvawcdlsfnb.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fmedia%2Fusers%2F1743998629998_cropped_avatar.jpg%3Ftr%3Dw-720%252Cq-80&w=3840&q=75',
      bio: 'Certified pickleball instructor based in Mexico, focusing on footwork fundamentals and fitness conditioning for competitive players.',
    },
    {
      name: 'Dink Authority Team',
      slug: 'dink-authority-team',
      photoUrl: 'https://img.freepik.com/premium-vector/pickleball-sport-academy-logo-with-team-design_867408-212.jpg?semt=ais_hybrid&w=740&q=80',
      bio: 'The editorial team behind Dink Authority Magazine — curating the best tips, drills, and insights from the world of professional pickleball.',
    },
  ];

  for (const author of TIP_AUTHORS) {
    await prisma.tipAuthor.upsert({
      where: { slug: author.slug },
      update: {},
      create: author,
    });
  }
  console.log(`${TIP_AUTHORS.length} tip authors seeded`);

  // ── Tips ──
  const tipAuthors = await prisma.tipAuthor.findMany();
  const getAuthorId = (slug: string) => tipAuthors.find((a: any) => a.slug === slug)?.id ?? null;

  const TIPS = [
    {
      title: 'Mastering the Kitchen Dink: The Foundation of Smart Pickleball',
      slug: 'mastering-kitchen-dink-foundation',
      excerpt: 'Learn why the dink shot is the most important weapon in your pickleball arsenal and how to execute it with precision every time.',
      featuredImage: 'https://i.ytimg.com/vi/R5bFJthuIBI/maxresdefault.jpg',
      authorId: getAuthorId('domenika-turkovic'),
      publishDate: new Date('2026-03-20'),
      category: 'technique',
      content: `<p>The dink is not just a shot — it's a philosophy. In competitive pickleball, the player who controls the kitchen line controls the game. Whether you're a 3.5 player looking to break through or a 5.0 tournament competitor, your dink game is the foundation everything else is built upon.</p><h2>Why the Dink Matters</h2><p>At the highest levels, rallies are won and lost at the non-volley zone. The ability to place soft, precise shots just over the net forces your opponents into uncomfortable positions, creating openings for put-away volleys and erne opportunities.</p><p>Think of the dink as a chess move — each shot should have purpose and intention. You're not just keeping the ball in play; you're manipulating your opponent's positioning, balance, and timing.</p><h2>The Perfect Dink Technique</h2><p>Start with a continental grip, keeping your wrist firm but relaxed. The power comes from your shoulder, not your wrist. Bend your knees to get low — the lower your center of gravity, the more control you'll have over the ball's trajectory.</p><p>Contact the ball in front of your body, using a gentle lifting motion. The paddle face should be slightly open (tilted upward) at the moment of contact. Follow through toward your target, keeping the motion smooth and controlled.</p><h2>Common Mistakes to Avoid</h2><p>The biggest mistake recreational players make is using too much wrist. This leads to inconsistency and unforced errors. Another common error is standing too upright — you need to be in an athletic stance with knees bent and weight on the balls of your feet.</p><p>Practice dinking cross-court before attempting straight-ahead dinks. Cross-court dinks give you more margin for error because the net is lower in the middle and the distance is longer.</p>`,
      galleryImages: JSON.stringify([
        'https://i.ytimg.com/vi/-tCvbHktXMc/sddefault.jpg',
        'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Best_Shot_Series/PIC-10.10.23-R-Selkirk-Luxx-Air-Control-10.jpg&nw=780',
        'https://i.ytimg.com/vi/63yN_-BWc3Q/sddefault.jpg',
        'https://i.ytimg.com/vi/R5bFJthuIBI/maxresdefault.jpg',
        'https://thumbs.dreamstime.com/b/aerial-view-pickleball-games-suburban-court-players-drone-footage-racket-sports-370842799.jpg',
      ]),
      youtubeUrl: 'https://www.youtube.com/watch?v=R5bFJthuIBI',
      videoCtaText: 'Watch the full dinking masterclass',
      videoCtaLink: 'https://www.youtube.com/watch?v=R5bFJthuIBI',
      status: 'published',
      language: 'en',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      metaTitle: 'Master the Kitchen Dink Shot | Pro Pickleball Tips',
      metaDescription: 'Expert guide to mastering the dink shot in pickleball. Learn proper technique, common mistakes, and drills from pro players.',
    },
    {
      title: 'Doubles Strategy: How to Dominate the Net with Your Partner',
      slug: 'doubles-strategy-dominate-net',
      excerpt: 'Discover the key positioning strategies and communication techniques that separate winning doubles teams from the rest.',
      featuredImage: 'https://www.rockstaracademy.com/lib/images/news/A%20Guide%20for%20Pickleball%20Doubles.jpg',
      authorId: getAuthorId('lorena-duknic'),
      publishDate: new Date('2026-03-15'),
      category: 'strategy',
      content: `<p>Doubles pickleball is a team sport, and the best teams aren't always made up of the best individual players. What sets championship doubles teams apart is their ability to move as a unit, communicate effectively, and execute a shared game plan.</p><h2>The Stacking Advantage</h2><p>Stacking is one of the most effective strategies in doubles pickleball. By keeping your stronger forehand player in the middle of the court, you maximize your team's offensive potential. When done correctly, stacking can neutralize your opponents' strongest shots and create confusion about who covers which area of the court.</p><p>To execute a basic stack, both players start on the same side of the court. After the serve or return, the non-hitting player slides to their preferred position. Communication is key — use verbal cues like "switch" or "stay" to coordinate movements.</p><h2>The Third Shot Drop vs. Drive Decision</h2><p>One of the most debated topics in doubles strategy is when to drop and when to drive. The answer depends on several factors: your position on the court, your opponents' positioning, the quality of the return, and your team's strengths.</p><p>As a general rule, if the return is deep and your opponents are at the kitchen line, a drop shot is usually the safer play. If the return is short or your opponents are caught in transition, a well-placed drive can be devastating.</p><h2>Communication Systems</h2><p>Develop a simple communication system with your partner. Call "mine" or "yours" on every ball in the middle. Use hand signals behind your back on serve to coordinate poaching. And always, always talk between points about what's working and what needs adjustment.</p>`,
      galleryImages: JSON.stringify([
        'https://us-west-2.graphassets.com/cm09r96wy0qax07ln5vscfbra/cm4hi84nq6w5p07n4oi4dlz4j',
        'https://thumbs.dreamstime.com/b/aerial-view-pickleball-games-suburban-court-players-drone-footage-racket-sports-370842799.jpg',
        'https://i.ytimg.com/vi/jBSdLwGJzec/maxresdefault.jpg',
        'https://www.rockstaracademy.com/lib/images/news/A%20Guide%20for%20Pickleball%20Doubles.jpg',
        'https://i.ytimg.com/vi/-tCvbHktXMc/sddefault.jpg',
      ]),
      youtubeUrl: 'https://www.youtube.com/watch?v=jBSdLwGJzec',
      videoCtaText: 'Full doubles strategy breakdown',
      videoCtaLink: 'https://www.youtube.com/watch?v=jBSdLwGJzec',
      status: 'published',
      language: 'en',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      metaTitle: 'Doubles Strategy Guide for Pickleball | Dink Authority',
      metaDescription: 'Learn winning doubles pickleball strategies including stacking, third shot decisions, and partner communication from pro players.',
    },
    {
      title: 'The Ultimate Serve Technique: Power, Spin, and Placement',
      slug: 'ultimate-serve-technique-power-spin',
      excerpt: 'Break down the mechanics of a devastating serve that combines power, spin, and strategic placement to start every point with an advantage.',
      featuredImage: 'https://i.ytimg.com/vi/n1i9r64JjL0/maxresdefault.jpg',
      authorId: getAuthorId('dalia-garza'),
      publishDate: new Date('2026-03-10'),
      category: 'technique',
      content: `<p>The serve is the only shot in pickleball where you have complete control over the ball. Yet many players treat it as an afterthought, content with simply getting the ball over the net and into play. A well-crafted serve can give you an immediate tactical advantage.</p><h2>The Three Types of Serves</h2><p><strong>The Power Serve:</strong> Hit with a full arm swing and follow-through, the power serve aims to push your opponent deep behind the baseline. The key is to contact the ball at the lowest legal point (below the waist) and drive upward through the ball with maximum paddle speed.</p><p><strong>The Spin Serve:</strong> While the rules have evolved regarding pre-spin serves, you can still generate significant topspin and sidespin through your paddle motion at contact. A topspin serve bounces higher and kicks forward, while a sidespin serve curves laterally, pulling your opponent off-court.</p><p><strong>The Soft Serve:</strong> Don't underestimate the soft, deep serve. Changing pace keeps your opponents guessing and disrupts their return rhythm. A well-placed soft serve to the backhand can be just as effective as a power serve.</p><h2>Placement Over Power</h2><p>The most effective servers don't always hit the hardest. They hit to specific targets: deep to the backhand, short to the forehand, wide to pull opponents off-court, or right at the body to jam the return.</p><p>Practice serving to specific zones on the court. Set up targets (cones, towels, or water bottles) and aim for them during your warm-up. Consistent placement under pressure is what separates good servers from great ones.</p>`,
      galleryImages: JSON.stringify([
        'https://media.istockphoto.com/id/1685938138/photo/pickleball-paddle-and-yellow-ball-close-up-woman-playing-pickleball-game-hitting-pickleball.jpg?s=612x612&w=0&k=20&c=PDar2xSNNRJpV84HqpuWq0jNfJJg4v__XwD5Pmk5BQ4=',
        'https://i.ytimg.com/vi/n1i9r64JjL0/maxresdefault.jpg',
        'https://i.ytimg.com/vi/-tCvbHktXMc/sddefault.jpg',
        'https://img.tennis-warehouse.com/watermark/rsg.php?path=/content_images/Best_Shot_Series/PIC-10.10.23-R-Selkirk-Luxx-Air-Control-10.jpg&nw=780',
        'https://us-west-2.graphassets.com/cm09r96wy0qax07ln5vscfbra/cm4hi84nq6w5p07n4oi4dlz4j',
      ]),
      youtubeUrl: 'https://www.youtube.com/watch?v=n1i9r64JjL0',
      videoCtaText: 'Watch the complete serve tutorial',
      videoCtaLink: 'https://www.youtube.com/watch?v=n1i9r64JjL0',
      status: 'published',
      language: 'en',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      metaTitle: 'Ultimate Pickleball Serve Guide | Power, Spin & Placement',
      metaDescription: 'Master your pickleball serve with this guide covering power, spin, and placement techniques used by professional players.',
    },
    {
      title: 'Footwork Fundamentals: Move Like a Pro on the Court',
      slug: 'footwork-fundamentals-move-like-pro',
      excerpt: 'Your feet are the secret weapon most players neglect. Learn the footwork patterns that will transform your movement and court coverage.',
      featuredImage: 'https://i.ytimg.com/vi/jBSdLwGJzec/maxresdefault.jpg',
      authorId: getAuthorId('dink-authority-team'),
      publishDate: new Date('2026-03-05'),
      category: 'fitness',
      content: `<p>Ask any professional pickleball player what the most underrated skill in the game is, and most will say footwork. You can have the best hands in the world, but if you can't get into position efficiently, you'll never reach your full potential.</p><h2>The Split Step</h2><p>The split step is the foundation of all good movement in pickleball. Just before your opponent contacts the ball, perform a small hop or split with your feet shoulder-width apart. This loads your muscles like springs, ready to explode in any direction.</p><p>Timing is everything with the split step. Too early and you'll be flat-footed when the ball arrives. Too late and you won't have time to react. Practice by watching your opponent's paddle, not the ball — the paddle tells you where the ball is going before it gets there.</p><h2>Lateral Movement</h2><p>Most movement in pickleball is lateral (side-to-side). Use shuffle steps to move along the kitchen line, keeping your feet wide and your center of gravity low. Never cross your feet — this puts you off-balance and makes it difficult to change direction quickly.</p><p>For longer distances, use a crossover step to cover ground quickly, then finish with shuffle steps to stabilize before hitting the ball.</p><h2>The Transition Zone</h2><p>The area between the baseline and the kitchen line is called the transition zone, and it's where most points are lost. The key to navigating this zone is to move forward in controlled bursts, split-stepping after each shot to maintain balance and readiness.</p><p>Never run through the transition zone in a straight line. Move forward at an angle, always staying balanced and ready to handle whatever your opponent throws at you.</p>`,
      galleryImages: JSON.stringify([
        'https://i.ytimg.com/vi/63yN_-BWc3Q/sddefault.jpg',
        'https://lh3.googleusercontent.com/Vk7DsLYFEOkXS9EgDCu_w4BSPS9MTmxNy2I81PZDbRZyo2sGP4pIpaWgpWG0rmW62KMWJYs7KPc__4ZEuHVklFStEF4lfNg3SZH_zd6eC5Cn0kFgJ4GedqKKUnxN1kD9JFRaNnw4tMhFkWexBTOdKDVmS5jyq0EIRKmWsYXSv8lx4B9-e-jpTX_-sTtXJw',
        'https://thumbs.dreamstime.com/b/aerial-view-pickleball-games-suburban-court-players-drone-footage-racket-sports-370842799.jpg',
        'https://i.ytimg.com/vi/jBSdLwGJzec/maxresdefault.jpg',
        'https://media.istockphoto.com/id/1685938138/photo/pickleball-paddle-and-yellow-ball-close-up-woman-playing-pickleball-game-hitting-pickleball.jpg?s=612x612&w=0&k=20&c=PDar2xSNNRJpV84HqpuWq0jNfJJg4v__XwD5Pmk5BQ4=',
      ]),
      youtubeUrl: 'https://www.youtube.com/watch?v=jBSdLwGJzec',
      videoCtaText: 'Complete footwork training program',
      videoCtaLink: 'https://www.youtube.com/watch?v=jBSdLwGJzec',
      status: 'published',
      language: 'en',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      metaTitle: 'Pickleball Footwork Fundamentals | Move Like a Pro',
      metaDescription: 'Transform your court movement with these essential footwork drills and techniques used by professional pickleball players.',
    },
  ];

  for (const tip of TIPS) {
    const { authorId, ...tipData } = tip;
    const createData: any = { ...tipData };
    if (authorId) createData.author = { connect: { id: authorId } };
    await prisma.tip.upsert({
      where: { slug: tip.slug },
      update: {
        banner2Image: tip.banner2Image ?? null,
        banner2Link: tip.banner2Link ?? null,
        banner3Image: tip.banner3Image ?? null,
        banner3Link: tip.banner3Link ?? null,
      },
      create: createData,
    });
  }
  console.log(`${TIPS.length} demo tips seeded`);

  // ── Juniors ──
  const JUNIORS = [
    {
      name: 'Rex Thais',
      title: 'The Rising Star of Junior Pickleball',
      slug: 'rex-thais-rising-star',
      excerpt: 'At just 15 years old, Rex Thais is dominating the junior circuit and turning heads in the pro ranks. Here is his story.',
      country: 'United States',
      age: 15,
      featuredImage: '/images/juniors/rex_thais.jpg',
      content: `<p>Rex Thais is not your average teenager. While most 15-year-olds spend their weekends gaming or scrolling social media, Rex is on the pickleball court grinding out victories against players twice his age.</p><p>Born and raised in Austin, Texas, Rex discovered pickleball at the age of 9 when his father introduced him to the sport at a local community center. Within months, he was beating adults in recreational play, and by 11, he entered his first sanctioned tournament.</p><p>"I fell in love with the strategy," Rex says. "It's not just about hitting the ball hard. You have to think three shots ahead, like chess but on a court."</p><p>His coach, former pro player Mark Sullivan, recognized Rex's talent immediately. "Rex has something you can't teach — court IQ. He reads the game better than players with 20 years more experience."</p><p>In 2025, Rex won the National Junior Championship in the U-17 division, becoming the youngest player to claim the title in the tournament's history. His aggressive yet calculated style has drawn comparisons to Ben Johns.</p><p>Off the court, Rex maintains a 3.8 GPA and dreams of attending Stanford University, where he hopes to continue developing both his academic and athletic career. "Pickleball has taught me discipline," he reflects. "What you put in is what you get out."</p>`,
      galleryImages: JSON.stringify([
        '/images/juniors/gallery/gallery_action_1.jpg',
        '/images/juniors/gallery/gallery_training_1.jpg',
        '/images/juniors/gallery/gallery_celebration_1.jpg',
        '/images/juniors/gallery/gallery_court_1.jpg',
        '/images/juniors/gallery/gallery_action_2.jpg',
      ]),
      instagramVideoUrl: 'https://www.instagram.com/reel/C1234example/',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      status: 'published',
      language: 'en',
      publishDate: new Date('2026-03-15'),
      metaTitle: 'Rex Thais — The Rising Star of Junior Pickleball | Dink Authority',
      metaDescription: 'Meet Rex Thais, the 15-year-old phenom dominating junior pickleball and turning heads in the pro ranks.',
    },
    {
      name: 'Sofia Martinez',
      title: 'Breaking Barriers on the Pickleball Court',
      slug: 'sofia-martinez-breaking-barriers',
      excerpt: 'Sofia Martinez, 13, from Miami is proving that age is just a number in competitive pickleball, inspiring a new generation of Latina athletes.',
      country: 'United States',
      age: 13,
      featuredImage: '/images/juniors/sofia_martinez.jpg',
      content: `<p>When Sofia Martinez steps onto the pickleball court, opponents quickly learn that underestimating her is a costly mistake. At 13, Sofia has already amassed an impressive collection of tournament wins and is considered one of the brightest prospects in junior pickleball.</p><p>Growing up in Miami's vibrant sports culture, Sofia was exposed to tennis, padel, and eventually pickleball. "My abuela played pickleball at the park," Sofia laughs. "She challenged me one day, and I got hooked."</p><p>What started as family fun quickly evolved into serious competition. Sofia's explosive athleticism, combined with a soft touch at the kitchen line, makes her a nightmare for opponents in any age bracket.</p><p>Her mother, Carmen Martinez, has been her biggest supporter. "We drive two hours each way for training three times a week. But seeing Sofia's dedication makes every mile worth it."</p><p>Sofia recently earned a sponsorship from Joola and has been invited to participate in exhibition matches alongside professional players. "I want to show other Latina girls that you can excel in any sport if you put your heart into it," she says with determination.</p><p>With the 2026 junior season underway, Sofia has her sights set on the world rankings. Watch this space.</p>`,
      galleryImages: JSON.stringify([
        '/images/juniors/gallery/gallery_celebration_2.jpg',
        '/images/juniors/gallery/gallery_training_2.jpg',
        '/images/juniors/gallery/gallery_action_1.jpg',
        '/images/juniors/gallery/gallery_court_2.jpg',
        '/images/juniors/gallery/gallery_celebration_1.jpg',
      ]),
      instagramVideoUrl: 'https://www.instagram.com/reel/C5678example/',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      status: 'published',
      language: 'en',
      publishDate: new Date('2026-03-10'),
      metaTitle: 'Sofia Martinez — Breaking Barriers in Junior Pickleball',
      metaDescription: 'Meet Sofia Martinez, the 13-year-old from Miami inspiring Latina athletes and dominating the junior pickleball circuit.',
    },
    {
      name: 'Kai Tanaka',
      title: 'From Tokyo to the Top of Junior Pickleball',
      slug: 'kai-tanaka-tokyo-to-top',
      excerpt: 'Kai Tanaka moved from Japan to California at age 10 and discovered pickleball. Now at 16, he is one of the top-ranked junior players in the country.',
      country: 'Japan / United States',
      age: 16,
      featuredImage: '/images/juniors/kai_tanaka.jpg',
      content: `<p>Kai Tanaka's journey to pickleball stardom is as unique as his playing style. Born in Tokyo, Kai moved to San Diego with his family when he was 10. Struggling to fit in at his new school, he found his community on the pickleball courts.</p><p>"In Japan, I played table tennis competitively," Kai explains. "When I tried pickleball, the hand-eye coordination transferred perfectly. The dinking game felt natural."</p><p>Kai's table tennis background gives him an unusual advantage: his wrist work and spin game are considered among the best in the junior division. His signature move — a cross-court dink with wicked topspin — has become almost impossible to counter.</p><p>Coach Lisa Chen, who trains Kai at the San Diego Pickleball Academy, sees limitless potential. "Kai's discipline is extraordinary. He arrives first, leaves last, and never complains. That Japanese work ethic combined with his natural talent is a powerful combination."</p><p>In 2025, Kai represented the United States at the International Junior Pickleball Championship in Cancún, where he won gold in singles and silver in doubles. The experience cemented his goal: to become the first Japanese-American player to reach the PPA Tour top 10.</p><p>"I want to be a bridge between pickleball in Asia and America," Kai says. "This sport can unite people across cultures."</p>`,
      galleryImages: JSON.stringify([
        '/images/juniors/gallery/gallery_court_1.jpg',
        '/images/juniors/gallery/gallery_action_2.jpg',
        '/images/juniors/gallery/gallery_training_1.jpg',
        '/images/juniors/gallery/gallery_celebration_2.jpg',
        '/images/juniors/gallery/gallery_court_2.jpg',
      ]),
      instagramVideoUrl: 'https://www.instagram.com/reel/C9012example/',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      status: 'published',
      language: 'en',
      publishDate: new Date('2026-03-05'),
      metaTitle: 'Kai Tanaka — From Tokyo to the Top of Junior Pickleball',
      metaDescription: 'Discover how Kai Tanaka went from table tennis in Tokyo to becoming one of America\'s top junior pickleball players.',
    },
    {
      name: 'Emma Richardson',
      title: 'The Fierce Competitor Redefining Junior Doubles',
      slug: 'emma-richardson-fierce-competitor',
      excerpt: 'Emma Richardson, 14, from Colorado has become the most feared doubles partner in junior pickleball with her intense net play and strategic brilliance.',
      country: 'United States',
      age: 14,
      featuredImage: '/images/juniors/emma_richardson.jpg',
      content: `<p>If there is one word that defines Emma Richardson's pickleball game, it is "intensity." The 14-year-old from Boulder, Colorado, plays every point like it is match point, and that relentless fire has made her the most sought-after doubles partner in junior pickleball.</p><p>"I hate losing more than I love winning," Emma admits with a laugh. "My family says I got that from my mom, who was a collegiate volleyball player."</p><p>Emma's volleyball lineage shows in her game. Her reflexes at the kitchen line are lightning fast, and her overhead smashes carry the authority of someone much older. But it is her doubles IQ that truly sets her apart.</p><p>"Emma sees the court differently," says her partner, 15-year-old Lily Chen. "She knows where to put the ball before the opponents even finish their swing. Playing with her is like having a cheat code."</p><p>Together, Emma and Lily have won three consecutive National Junior Doubles titles, and their partnership has become the gold standard in youth pickleball. Their success has even attracted the attention of senior pro teams looking for the next generation of mixed doubles stars.</p><p>When she is not competing, Emma runs a free pickleball clinic for underprivileged kids in her community. "Everyone deserves to play," she says simply. "Pickleball changed my life. I want it to change theirs too."</p>`,
      galleryImages: JSON.stringify([
        '/images/juniors/gallery/gallery_training_2.jpg',
        '/images/juniors/gallery/gallery_celebration_1.jpg',
        '/images/juniors/gallery/gallery_court_1.jpg',
        '/images/juniors/gallery/gallery_action_1.jpg',
        '/images/juniors/gallery/gallery_training_1.jpg',
      ]),
      instagramVideoUrl: 'https://www.instagram.com/reel/C3456example/',
      banner2Image: 'https://cdn.abacus.ai/images/c2a107da-2d07-45a5-b6aa-9bf2f5681291.png',
      banner2Link: 'https://www.selkirk.com/',
      banner3Image: 'https://cdn.abacus.ai/images/46f64161-a8ac-4d72-a82f-b41d47920971.png',
      banner3Link: 'https://www.ppatour.com/',
      status: 'published',
      language: 'en',
      publishDate: new Date('2026-02-28'),
      metaTitle: 'Emma Richardson — The Fierce Competitor Redefining Junior Doubles',
      metaDescription: 'Meet Emma Richardson, the 14-year-old doubles phenom from Colorado redefining junior pickleball with intensity and heart.',
    },
  ];

  for (const junior of JUNIORS) {
    await prisma.junior.upsert({
      where: { slug: junior.slug },
      update: {
        banner2Image: junior.banner2Image ?? null,
        banner2Link: junior.banner2Link ?? null,
        banner3Image: junior.banner3Image ?? null,
        banner3Link: junior.banner3Link ?? null,
      },
      create: junior,
    });
  }
  console.log(`${JUNIORS.length} demo juniors seeded`);

  console.log('Seeding complete!');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
