export type Lang = "en" | "ar";

export type Dict = {
  nav: { services: string; work: string; process: string; insights: string; contact: string };
  cta: { start: string; growth: string };
  hero: {
    studio: string;
    leftCopy: string;
    details: string;
    tag: string;
    est: string;
    headline: string[];
    start: string;
    baseline: string;
    scroll: string;
    seeWork: string;
    featured: string;
  };
  metrics: {
    label: string;
    heading: string;
    items: { title: string; copy: string }[];
    pillars: string[];
  };
  process: {
    label: string;
    headLines: string[];
    headHighlight: string;
    intro: string;
    steps: { title: string; copy: string }[];
    ticker: string;
  };
  showcase: {
    label: string;
    headLines: string[];
    intro: string;
    projects: { tag: string; title: string; copy: string }[];
    caseStudy: string;
    endLines: string[];
    startProject: string;
  };
  statement: { label: string; text: string };
  intro: { lead: string; prefix: string; rotate: string[]; quick: string; whatsapp: string };
  work: { label: string; drag: string; prev: string; next: string };
  services: { label: string; heading: string; items: string[]; request: string };
  brief: {
    title: string;
    sub: string;
    q1: string;
    q2: string;
    q2ph: string;
    q3: string;
    q3ph: string;
    send: string;
    pick: string;
    note: string;
    or: string;
    msgHello: string;
    msgServices: string;
    msgBrand: string;
    msgNotes: string;
  };
  caseCta: { title: string; body: string };
  footer: {
    headline: string[];
    cta: string;
    connect: string;
    socials: string[];
    capabilities: string;
    services: string[];
    legal: { copyright: string; privacy: string; terms: string };
  };
};

export const translations: Record<Lang, Dict> = {
  en: {
    nav: { services: "Services", work: "Work", process: "Process", insights: "Insights", contact: "Contact" },
    cta: { start: "Start Project", growth: "Start Your Growth System" },
    hero: {
      studio: "001 — Studio",
      leftCopy: "Strategy · Identity · Content · Campaigns · Advertising",
      details: "Details",
      tag: "Marketing & Brand Studio",
      est: "EST. 2022 · Mansoura, EG",
      headline: ["We build brands and marketing campaigns", "for ambitious companies in Egypt & the Gulf"],
      start: "Start",
      baseline: "Branding · Creative Direction · Social Systems · Paid Media · Growth",
      scroll: "Scroll to explore ↓",
      seeWork: "See our work",
      featured: "Featured work",
    },
    metrics: {
      label: "02 — Why TASWEEQ",
      heading: "We build the brand and the marketing to work as one",
      items: [
        { title: "Brands & campaigns", copy: "From building the identity to launching the campaign." },
        { title: "Paid ads", copy: "Meta, TikTok, Snapchat, Google." },
        { title: "Long-term partnerships", copy: "Not one-off projects." },
        { title: "Performance optimization", copy: "We test, analyse and keep improving across every channel." },
      ],
      pillars: ["Research", "Identity", "Performance", "Scale"],
    },
    process: {
      label: "03 — Process",
      headLines: ["HOW", "WE", "BUILD"],
      headHighlight: "MOMENTUM",
      intro: "From idea to identity, then from identity to campaigns and growth.",
      steps: [
        { title: "Discovery & Strategy", copy: "We map the market, audience and competitive whitespace to define a sharp, defensible position." },
        { title: "Identity Systems", copy: "We craft flexible visual identities and brand systems engineered to scale across every surface." },
        { title: "Content Direction", copy: "Art direction, content pillars and production systems that keep output consistent and unmistakably on-brand." },
        { title: "Campaign Deployment", copy: "Full-funnel paid media across Meta, TikTok, Snapchat and Google — engineered to convert, not just reach." },
        { title: "Scale Optimization", copy: "We test, analyse and keep improving performance." },
      ],
      ticker: "IDEA → STRATEGY → SYSTEM → SCALE",
    },
    showcase: {
      label: "01 — Selected Work",
      headLines: ["Selected", "Work"],
      intro: "Brands built from strategy to launch.",
      projects: [
        {
          tag: "Hospitality · Hajj & Umrah",
          title: "Sakan",
          copy: "A specialized hotel consultancy that empowers pilgrims to make informed stay decisions based on reality — not advertising or photoshopped visuals. Full brand identity, pattern system, stationery, social media direction, and campaign architecture.",
        },
        {
          tag: "E-commerce · Retail",
          title: "Neemo",
          copy: "A playful, energetic e-commerce brand positioned as the \"happy store.\" Complete identity system including logo, typography (Lama Rounded), four-color palette, social media templates, app design, packaging, stationery, and storefront.",
        },
        {
          tag: "Healthcare · Digital Appointments",
          title: "Mawaeidk",
          copy: "A digital healthcare platform making medical appointment booking simple and stress-free across Qatar. Full brand identity redesign built around the Caregiver archetype — deep teal and lime color system, custom typography, and a calm, human tone of voice.",
        },
        {
          tag: "Marketing · Creative Services",
          title: "LOOP",
          copy: "A marketing and creative company whose identity had to prove its own promise: be where people see you. A modular logomark built from the name itself, a bilingual wordmark, orange-on-black system, patterns, icons and full brand applications.",
        },
        {
          tag: "Equestrian · Arabian Horses",
          title: "MH Stud",
          copy: "A Qatari stud farm for Arabian horses — where beauty begins. A hand-drawn horse flowing into the MH monogram, a burgundy and navy heritage palette, equestrian icons, horseshoe patterns and applications from stables to saddle pads.",
        },
      ],
      caseStudy: "View project",
      endLines: ["Your brand", "is next"],
      startProject: "Start a project",
    },
    statement: {
      label: "About the studio",
      text: "We're a marketing studio from Mansoura building brands, strategy, content and campaigns as one system",
    },
    intro: {
      lead: "Marketing studio",
      prefix: "for bold",
      rotate: ["branding.", "strategy.", "content.", "campaigns.", "growth."],
      quick: "Tell us what you need — it takes under a minute.",
      whatsapp: "WhatsApp",
    },
    work: { label: "Featured Work", drag: "Drag", prev: "Previous", next: "Next" },
    services: {
      label: "Services",
      heading: "Pick a service — we'll take it from there",
      items: [
        "Brand Identity",
        "Brand Strategy",
        "Social Media Management",
        "Content & Video Production",
        "Paid Ads",
        "Motion Graphics",
      ],
      request: "Request",
    },
    brief: {
      title: "Start your project",
      sub: "Three quick answers, then we continue on WhatsApp.",
      q1: "What do you need?",
      q2: "Brand / company name",
      q2ph: "e.g. Sakan",
      q3: "Anything we should know? (optional)",
      q3ph: "Goal, deadline, budget range…",
      send: "Send on WhatsApp",
      pick: "Pick at least one service",
      note: "WhatsApp opens with your message ready — no sign-up.",
      or: "Or reach us directly",
      msgHello: "Hi TASWEEQ 👋 I'd like to start a project.",
      msgServices: "Services",
      msgBrand: "Brand",
      msgNotes: "Notes",
    },
    caseCta: {
      title: "Like the direction? Let's build your brand",
      body: "Tell us what you need and we'll continue on WhatsApp.",
    },
    footer: {
      headline: ["READY", "TO BUILD", "A BRAND", "THAT SCALES?"],
      cta: "Start Your Growth System",
      connect: "Connect",
      socials: ["Instagram", "LinkedIn", "Facebook", "Schedule Call"],
      capabilities: "Capabilities",
      services: [
        "Brand Identity",
        "Creative Direction",
        "Paid Media",
        "Campaign Systems",
        "Content Operations",
        "Long-Term Partnerships",
        "Scalable Growth Frameworks",
      ],
      legal: { copyright: "© 2022 TASWEEQ", privacy: "Privacy", terms: "Terms" },
    },
  },

  ar: {
    nav: { services: "الخدمات", work: "الأعمال", process: "المنهجية", insights: "رؤى", contact: "تواصل" },
    cta: { start: "ابدأ مشروعك", growth: "ابدأ نظام نموّك" },
    hero: {
      studio: "001 — الاستوديو",
      leftCopy: "استراتيجية · هوية · محتوى · حملات · إعلانات",
      details: "التفاصيل",
      tag: "استوديو تسويق وبناء علامات تجارية",
      est: "تأسّس 2022 · المنصورة، مصر",
      headline: ["نبني علامات تجارية وحملات تسويقية", "للشركات الطموحة في مصر والخليج"],
      start: "ابدأ",
      baseline: "الهوية · الإدارة الإبداعية · أنظمة التواصل · الإعلانات · النمو",
      scroll: "مرّر للاستكشاف ↓",
      seeWork: "شاهد أعمالنا",
      featured: "أعمال مختارة",
    },
    metrics: {
      label: "02 — لماذا تسويق",
      heading: "نبني العلامة والتسويق ليعملا معاً",
      items: [
        { title: "هويات وحملات", copy: "من بناء الهوية إلى إطلاق الحملات." },
        { title: "الإعلانات الممولة", copy: "ميتا، تيك توك، سناب شات، جوجل." },
        { title: "شراكات طويلة الأمد", copy: "لا مشاريع عابرة." },
        { title: "تحسين الأداء", copy: "نختبر ونحلّل ونحسّن باستمرار عبر كل القنوات." },
      ],
      pillars: ["بحث", "هوية", "أداء", "توسّع"],
    },
    process: {
      label: "03 — المنهجية",
      headLines: ["كيف", "نَصنع"],
      headHighlight: "الزَّخم",
      intro: "من الفكرة إلى الهوية، ثم من الهوية إلى الحملات والنمو.",
      steps: [
        { title: "الاكتشاف والاستراتيجية", copy: "ندرس السوق والجمهور والفجوات التنافسية لتحديد موقعٍ واضح ومتين." },
        { title: "أنظمة الهوية", copy: "نصمّم هويات بصرية مرنة وأنظمة علامات مهيّأة للتوسّع عبر كل المنصّات." },
        { title: "الإدارة الإبداعية للمحتوى", copy: "إدارة فنية وركائز محتوى وأنظمة إنتاج تحافظ على اتساق المحتوى وتميّز العلامة." },
        { title: "إطلاق الحملات", copy: "إعلانات متكاملة عبر ميتا وتيك توك وسناب شات وجوجل، مصمّمة لتحقيق التحويل." },
        { title: "تحسين التوسّع", copy: "نختبر ونحلّل ونحسّن الأداء باستمرار." },
      ],
      ticker: "فكرة ← استراتيجية ← نظام ← توسّع",
    },
    showcase: {
      label: "01 — أعمال مختارة",
      headLines: ["أعمالٌ", "مختارة"],
      intro: "هويات وعلامات بُنيت من الاستراتيجية إلى الإطلاق.",
      projects: [
        {
          tag: "الضيافة · الحج والعمرة",
          title: "سَكَن",
          copy: "استشارات فندقية متخصّصة تُمكّن الحُجّاج والمعتمرين من اتّخاذ قرارات إقامة مبنية على الواقع — لا على الإعلانات أو الصور المعدّلة. هوية بصرية كاملة، نظام أنماط، قرطاسية، إدارة تواصل اجتماعي، وهندسة حملات.",
        },
        {
          tag: "التجارة الإلكترونية · التجزئة",
          title: "نيمو",
          copy: "علامة تجارة إلكترونية مرحة ونابضة بالحياة تحمل شعار «المتجر السعيد». نظام هوية متكامل يشمل الشعار، والطباعة (Lama Rounded)، ولوحة ألوان رباعية، وقوالب تواصل اجتماعي، وتصميم تطبيق، وتغليف، وقرطاسية، وواجهة متجر.",
        },
        {
          tag: "الرعاية الصحية · حجز المواعيد الرقمي",
          title: "مواعيدك",
          copy: "منصّة رعاية صحية رقمية تجعل حجز المواعيد الطبية بسيطًا وخاليًا من التوتّر في قطر. إعادة تصميم هوية كاملة مبنية على شخصية «الراعي» - نظام ألوان تركوازي غامق وأخضر ليموني، طباعة مخصّصة، ونبرة صوت هادئة وإنسانية.",
        },
        {
          tag: "التسويق · الخدمات الإبداعية",
          title: "لووب",
          copy: "شركة تسويق وإبداع كان على هويتها أن تُثبت وعدها: خلّك حاضر وين الناس تشوفك. علامة معيارية مبنية من الاسم نفسه، شعار نصي ثنائي اللغة، نظام برتقالي على أسود، أنماط وأيقونات وتطبيقات كاملة.",
        },
        {
          tag: "الفروسية · الخيل العربية",
          title: "إم إتش ستد",
          copy: "مربط قطري للخيل العربية — حيث يبدأ الجمال. حصان مرسوم يدوياً ينساب في المونوجرام MH، لوحة تراثية عنابية وكحلية، أيقونات فروسية، أنماط حدوة الحصان وتطبيقات من الإسطبل إلى مفرش السرج.",
        },
      ],
      caseStudy: "عرض المشروع",
      endLines: ["علامتك", "هي التالية"],
      startProject: "ابدأ مشروعًا",
    },
    statement: {
      label: "عن الاستوديو",
      text: "نحن استوديو تسويق من المنصورة نبني العلامات والاستراتيجيات والمحتوى والحملات كنظام واحد",
    },
    intro: {
      lead: "استوديو تسويق",
      prefix: "يبني",
      rotate: ["الهوية.", "الاستراتيجية.", "المحتوى.", "الحملات.", "النمو."],
      quick: "قل لنا ما تحتاجه — يستغرق أقل من دقيقة.",
      whatsapp: "واتساب",
    },
    work: { label: "أعمال مختارة", drag: "اسحب", prev: "السابق", next: "التالي" },
    services: {
      label: "الخدمات",
      heading: "اختر الخدمة — والباقي علينا",
      items: [
        "الهوية البصرية",
        "استراتيجية العلامة",
        "إدارة السوشيال ميديا",
        "إنتاج المحتوى والفيديو",
        "الإعلانات الممولة",
        "موشن جرافيك",
      ],
      request: "اطلب",
    },
    brief: {
      title: "ابدأ مشروعك",
      sub: "ثلاث إجابات سريعة، ثم نكمل على واتساب.",
      q1: "ما الذي تحتاجه؟",
      q2: "اسم العلامة / الشركة",
      q2ph: "مثال: سكن",
      q3: "أي شيء نحتاج معرفته؟ (اختياري)",
      q3ph: "الهدف، الموعد، الميزانية التقريبية…",
      send: "أرسل على واتساب",
      pick: "اختر خدمة واحدة على الأقل",
      note: "سيفتح واتساب برسالتك جاهزة — بدون تسجيل.",
      or: "أو تواصل معنا مباشرة",
      msgHello: "مرحباً تسويق 👋 أريد أن أبدأ مشروعاً.",
      msgServices: "الخدمات",
      msgBrand: "العلامة",
      msgNotes: "ملاحظات",
    },
    caseCta: {
      title: "أعجبك الاتجاه؟ لنبنِ علامتك",
      body: "قل لنا ما تحتاجه ونكمل معك على واتساب.",
    },
    footer: {
      headline: ["مستعدّ", "لبناء", "علامةٍ", "تتوسّع؟"],
      cta: "ابدأ نظام نموّك",
      connect: "تواصل",
      socials: ["إنستغرام", "لينكدإن", "فيسبوك", "احجز مكالمة"],
      capabilities: "الإمكانات",
      services: [
        "هوية العلامة",
        "الإدارة الإبداعية",
        "الإعلانات الممولة",
        "أنظمة الحملات",
        "عمليات المحتوى",
        "شراكات طويلة الأمد",
        "أطر نموٍّ قابلة للتوسّع",
      ],
      legal: { copyright: "© 2022 TASWEEQ", privacy: "الخصوصية", terms: "الشروط" },
    },
  },
};
