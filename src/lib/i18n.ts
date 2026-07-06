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
      leftCopy: "We design scalable digital ecosystems for ambitious brands.",
      details: "Details",
      tag: "Next-Generation Marketing Studio",
      est: "EST. 2022 · EG",
      headline: ["BUILD", "BRANDS", "THAT MOVE", "CULTURE."],
      start: "Start",
      baseline: "Branding · Creative Direction · Social Systems · Paid Media · Growth",
      scroll: "Scroll to explore ↓",
    },
    metrics: {
      label: "01 — Performance",
      heading: "Built for measurable growth at scale.",
      items: [
        { title: "Projects Delivered", copy: "Full brand identities and campaign systems." },
        { title: "Platforms Managed", copy: "Meta, TikTok, Snapchat, Google." },
        { title: "Client Retention", copy: "Long-term partnerships, not one-off projects." },
        { title: "Active Optimization", copy: "Continuous iteration across every channel." },
      ],
      pillars: ["Research", "Identity", "Performance", "Scale"],
    },
    process: {
      label: "02 — Process",
      headLines: ["HOW", "WE", "BUILD"],
      headHighlight: "MOMENTUM",
      intro: "A single operating system that takes a brand from raw idea to compounding, measurable growth.",
      steps: [
        { title: "Discovery & Strategy", copy: "We map the market, audience and competitive whitespace to define a sharp, defensible position." },
        { title: "Identity Systems", copy: "We craft flexible visual identities and brand systems engineered to scale across every surface." },
        { title: "Content Direction", copy: "Art direction, content pillars and production systems that keep output consistent and unmistakably on-brand." },
        { title: "Campaign Deployment", copy: "Full-funnel paid media across Meta, TikTok, Snapchat and Google — engineered to convert, not just reach." },
        { title: "Scale Optimization", copy: "Continuous testing, analytics and iteration that compound performance month over month." },
      ],
      ticker: "IDEA → STRATEGY → SYSTEM → SCALE",
    },
    showcase: {
      label: "03 — Selected Work",
      headLines: ["Selected", "Work"],
      intro: "Real brand systems built end-to-end — from strategy to launch.",
      projects: [
        {
          tag: "Hospitality · Hajj & Umrah",
          title: "Sakan",
          copy: "A specialized hotel consultancy that empowers pilgrims to make informed stay decisions based on reality — not advertising or photoshopped visuals. Full brand identity, pattern system, stationery, social media direction, and campaign architecture.",
        },
        {
          tag: "E-commerce · Retail",
          title: "Neemo",
          copy: "A playful, energetic e-commerce brand positioned as the \"happy store.\" Complete identity system including logo, typography (Lama Rounded), five-color palette, social media templates, app design, packaging, stationery, and storefront.",
        },
        {
          tag: "Healthcare · Digital Appointments",
          title: "Mawaeidk",
          copy: "A digital healthcare platform making medical appointment booking simple and stress-free across Qatar. Full brand identity redesign built around the Caregiver archetype — deep teal and lime color system, custom typography, and a calm, human tone of voice.",
        },
      ],
      caseStudy: "View project",
      endLines: ["Your brand", "is next."],
      startProject: "Start a project",
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
      leftCopy: "نصمّم منظومات رقمية قابلة للتوسّع للعلامات الطموحة.",
      details: "التفاصيل",
      tag: "استوديو تسويق من الجيل الجديد",
      est: "تأسّس 2022 · مصر",
      headline: ["نَبني", "علاماتٍ", "تُحرّك", "الثقافة."],
      start: "ابدأ",
      baseline: "الهوية · الإدارة الإبداعية · أنظمة التواصل · الإعلانات · النمو",
      scroll: "مرّر للاستكشاف ↓",
    },
    metrics: {
      label: "01 — الأداء",
      heading: "مبنيٌّ لنموٍّ قابل للقياس على نطاقٍ واسع.",
      items: [
        { title: "مشاريع مُنجَزة", copy: "هويات بصرية وأنظمة حملات متكاملة." },
        { title: "منصّات نديرها", copy: "ميتا، تيك توك، سناب شات، جوجل." },
        { title: "معدّل الاحتفاظ", copy: "شراكات طويلة الأمد، لا مشاريع عابرة." },
        { title: "تحسين مستمر", copy: "تكرار دائم عبر كل القنوات." },
      ],
      pillars: ["بحث", "هوية", "أداء", "توسّع"],
    },
    process: {
      label: "02 — المنهجية",
      headLines: ["كيف", "نَصنع"],
      headHighlight: "الزَّخم",
      intro: "نظام تشغيلٍ واحد ينقل العلامة من الفكرة الخام إلى نموٍّ متراكم وقابل للقياس.",
      steps: [
        { title: "الاكتشاف والاستراتيجية", copy: "ندرس السوق والجمهور والفجوات التنافسية لتحديد موقعٍ واضح ومتين." },
        { title: "أنظمة الهوية", copy: "نصمّم هويات بصرية مرنة وأنظمة علامات مهيّأة للتوسّع عبر كل المنصّات." },
        { title: "الإدارة الإبداعية للمحتوى", copy: "إدارة فنية وركائز محتوى وأنظمة إنتاج تحافظ على اتساق المحتوى وتميّز العلامة." },
        { title: "إطلاق الحملات", copy: "إعلانات متكاملة عبر ميتا وتيك توك وسناب شات وجوجل، مصمّمة لتحقيق التحويل." },
        { title: "تحسين التوسّع", copy: "اختبار وتحليل وتكرار مستمر يضاعف الأداء شهراً بعد شهر." },
      ],
      ticker: "فكرة ← استراتيجية ← نظام ← توسّع",
    },
    showcase: {
      label: "03 — أعمال مختارة",
      headLines: ["أعمالٌ", "مختارة"],
      intro: "أنظمة علامات حقيقية بُنيت من الألف إلى الياء — من الاستراتيجية إلى الإطلاق.",
      projects: [
        {
          tag: "الضيافة · الحج والعمرة",
          title: "سَكَن",
          copy: "استشارات فندقية متخصّصة تُمكّن الحُجّاج والمعتمرين من اتّخاذ قرارات إقامة مبنية على الواقع — لا على الإعلانات أو الصور المعدّلة. هوية بصرية كاملة، نظام أنماط، قرطاسية، إدارة تواصل اجتماعي، وهندسة حملات.",
        },
        {
          tag: "التجارة الإلكترونية · التجزئة",
          title: "نيمو",
          copy: "علامة تجارة إلكترونية مرحة ونابضة بالحياة تحمل شعار «المتجر السعيد». نظام هوية متكامل يشمل الشعار، والطباعة (Lama Rounded)، ولوحة ألوان خماسية، وقوالب تواصل اجتماعي، وتصميم تطبيق، وتغليف، وقرطاسية، وواجهة متجر.",
        },
        {
          tag: "الرعاية الصحية · حجز المواعيد الرقمي",
          title: "مواعيدك",
          copy: "منصّة رعاية صحية رقمية تجعل حجز المواعيد الطبية بسيطًا وخاليًا من التوتّر في قطر. إعادة تصميم هوية كاملة مبنية على أرشيتايب «الراعي» - نظام ألوان تركوازي غامق وأخضر ليموني، طباعة مخصّصة، ونبرة صوت هادئة وإنسانية.",
        },
      ],
      caseStudy: "عرض المشروع",
      endLines: ["علامتك", "هي التالية."],
      startProject: "ابدأ مشروعًا",
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
        "الإعلانات المدفوعة",
        "أنظمة الحملات",
        "عمليات المحتوى",
        "شراكات طويلة الأمد",
        "أطر نموٍّ قابلة للتوسّع",
      ],
      legal: { copyright: "© 2022 TASWEEQ", privacy: "الخصوصية", terms: "الشروط" },
    },
  },
};
