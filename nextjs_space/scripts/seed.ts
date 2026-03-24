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
    { title: 'The Rise of Pickleball: 2026 Season Preview', issueNumber: 'Issue #15', description: 'Our comprehensive preview of the 2026 professional pickleball season, featuring player rankings, team analysis, and bold predictions for the year ahead.', isCurrent: true, publishDate: new Date('2026-03-01'), coverUrl: null },
    { title: 'The Legends Issue: Greatest Players of All Time', issueNumber: 'Issue #14', description: 'We rank the top 50 pickleball players in history, from the pioneers to the modern superstars reshaping the game.', isCurrent: false, publishDate: new Date('2026-01-15'), coverUrl: null },
    { title: 'Gear Guide 2025: The Ultimate Equipment Review', issueNumber: 'Issue #13', description: 'Our annual deep dive into paddles, shoes, bags, and accessories—everything you need to elevate your game.', isCurrent: false, publishDate: new Date('2025-11-01'), coverUrl: null },
    { title: 'Pickleball Goes Global: The International Expansion', issueNumber: 'Issue #12', description: 'How pickleball is conquering new markets across Latin America, Europe, and Asia with explosive growth.', isCurrent: false, publishDate: new Date('2025-09-01'), coverUrl: null },
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
