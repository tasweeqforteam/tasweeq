import type { Lang } from "./i18n";

export type CaseStudy = {
  slug: "sakan" | "neemo";
  letter: string;
  accentColor: string;
  meta: { type: string; industry: string; scope: string; duration: string };
  brief: string[];
  challenge: string[];
  thinking: { intro: string; points: string[] };
  deliverables: { name: string; detail: string }[];
  outcome: { intro: string; points: string[] };
  designDecision: { title: string; body: string };
  brandBookUrl: string;
  siteUrl: string;
  siteLabel: string;
};

type CaseStudyDict = {
  backLabel: string;
  briefTitle: string;
  challengeTitle: string;
  thinkingTitle: string;
  deliveredTitle: string;
  deliverableCol: string;
  detailCol: string;
  outcomeTitle: string;
  designDecisionLabel: string;
  viewBrandbook: string;
  visitSite: string;
  nextProject: string;
};

export const caseStudyI18n: Record<Lang, CaseStudyDict> = {
  en: {
    backLabel: "Back to Work",
    briefTitle: "The Brief",
    challengeTitle: "The Challenge",
    thinkingTitle: "Our Thinking",
    deliveredTitle: "What We Delivered",
    deliverableCol: "Deliverable",
    detailCol: "What It Included",
    outcomeTitle: "The Outcome",
    designDecisionLabel: "THE DESIGN DECISION THAT MATTERED MOST",
    viewBrandbook: "View Brand Guidelines",
    visitSite: "Visit Website",
    nextProject: "Next Project",
  },
  ar: {
    backLabel: "العودة للأعمال",
    briefTitle: "الملخّص",
    challengeTitle: "التحدّي",
    thinkingTitle: "تفكيرنا",
    deliveredTitle: "ما سلّمناه",
    deliverableCol: "المُخرج",
    detailCol: "ما يتضمّنه",
    outcomeTitle: "النتيجة",
    designDecisionLabel: "القرار التصميمي الأهم",
    viewBrandbook: "عرض دليل العلامة",
    visitSite: "زيارة الموقع",
    nextProject: "المشروع التالي",
  },
};

export const caseStudies: Record<Lang, CaseStudy[]> = {
  en: [
    {
      slug: "sakan",
      letter: "S",
      accentColor: "#3f71e4",
      meta: {
        type: "Brand Identity Design",
        industry: "Hospitality / Religious Travel",
        scope: "Full identity system + social media direction",
        duration: "4-5 weeks",
      },
      brief: [
        "Sakan is a hospitality consulting brand based in Saudi Arabia, focused on helping pilgrims find the right accommodation for Hajj and Umrah. The founders came to us with a clear need: they were entering a competitive market full of generic travel agencies and booking platforms, and they needed a visual identity that would immediately set them apart.",
        "Their positioning was strong - they weren't just booking hotels, they were consulting with pilgrims to match them with the right stay for their specific needs. But they had no visual identity to carry that message.",
      ],
      challenge: [
        "The Hajj and Umrah accommodation space has a specific visual problem: most brands in this market look the same. Gold and green color palettes, generic mosque imagery, ornate Arabic calligraphy - the category has a visual language that makes every brand interchangeable.",
        "Sakan needed to feel different without feeling disrespectful. Modern without losing cultural authenticity. Trustworthy without being boring. That was the creative tension we had to solve.",
      ],
      thinking: {
        intro:
          "We started by studying the competitive landscape - not just Sakan's direct competitors, but the broader visual language of travel and hospitality brands that pilgrims interact with. We identified the white space: a brand that felt clean, modern, and confident, using trust signals from the hospitality industry rather than the religious travel category.",
        points: [
          "We chose a blue-dominant palette to signal reliability and calm - deliberately avoiding the gold/green cliche of the category",
          "We designed an Arabic-first wordmark that feels contemporary but culturally grounded, not a Latin logo with Arabic added as an afterthought",
          "We created a visual system built around the idea of clarity and direction - because Sakan's core promise is removing confusion from the accommodation search",
          'We developed brand messaging in Arabic and English that centers the pilgrim\'s experience: "We choose with you, not for you"',
        ],
      },
      deliverables: [
        { name: "Logo System", detail: "Primary logo, Arabic wordmark, brand mark, responsive variations for different sizes and contexts" },
        { name: "Color & Typography", detail: "Full color palette with primary blues and accent tones, Arabic and English typeface pairing, usage rules" },
        { name: "Brand Guidelines", detail: "Complete usage document - logo spacing, color codes, typography hierarchy, do's and don'ts, tone of voice" },
        { name: "Brand Applications", detail: "Business cards, letterheads, branded bags, luggage tags, notebooks, outdoor signage mockups" },
        { name: "Social Media Direction", detail: "Post templates, story formats, content direction, bilingual content framework for Instagram" },
        { name: "Brand Elements", detail: "Custom visual patterns, iconography, photographic style guide, brand illustrations" },
      ],
      outcome: {
        intro:
          "Sakan launched with a brand identity that looks nothing like its competitors - and that was the point. The identity system gave them a complete visual language that works across every touchpoint, from a social media post to a physical luggage tag handed to a pilgrim at check-in.",
        points: [
          "Complete brand system delivered and approved within the project timeline",
          "The client adopted the guidelines across all touchpoints from day one - zero deviation",
          "The identity positioned Sakan as a premium, modern consultancy in a category dominated by generic agencies",
          "Every application - from social posts to signage - feels like the same brand, which is the entire point of a system",
        ],
      },
      designDecision: {
        title: "Using blue instead of the expected gold/green.",
        body: "It was a deliberate break from category convention that made Sakan instantly recognizable. The client was initially cautious, but once they saw the full system applied, the differentiation spoke for itself.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1s6a3XMJvgHKt9DqJ1OcyAy2R93HA1WYd/view?usp=sharing",
      siteUrl: "https://sakansa.com",
      siteLabel: "sakansa.com",
    },
    {
      slug: "neemo",
      letter: "N",
      accentColor: "#7F59B0",
      meta: {
        type: "Brand Identity + Packaging",
        industry: "E-commerce / Online Retail",
        scope: "Full identity, packaging, social media direction",
        duration: "4-6 weeks",
      },
      brief: [
        'Neemo is an online store - a "happy store" that sells a curated mix of products. The founders wanted a brand that felt fun, vibrant, and instantly memorable. They were launching into a crowded e-commerce market where most competitors are visually forgettable, and they needed an identity that would make people stop scrolling and remember the name.',
      ],
      challenge: [
        "E-commerce brands have a specific identity problem: most of them look interchangeable. Minimal logos, safe color palettes, stock photography. The result is a sea of sameness where the only differentiator becomes price - which is exactly the race Neemo wanted to avoid.",
        "The creative challenge was finding the line between playful and professional. The brand needed to feel exciting and youthful without looking cheap or juvenile. It needed to work on a phone screen (tiny) and on a billboard (massive). And it needed a packaging experience that extended the brand promise into the physical unboxing moment.",
      ],
      thinking: {
        intro: "",
        points: [
          "We defined the brand personality as 'joyful, bold, and surprising' - a store where shopping feels like a reward",
          "We broke from e-commerce convention with a four-color palette (Royal Purple, Dark Pink, Maya Blue, Bright Yellow) that is impossible to confuse with any competitor",
          "We designed the logo symbol to be instantly recognizable at any scale - from a 32px app icon to outdoor signage",
          "We treated packaging as a brand touchpoint, not an afterthought - because the unboxing is the first physical moment a customer has with the brand",
          "We built social media templates that maintain brand consistency while allowing enough variety to keep the feed fresh",
        ],
      },
      deliverables: [
        { name: "Logo System", detail: "Primary logo, signature, brand mark, variations for dark/light backgrounds, responsive sizing" },
        { name: "Color System", detail: "Four-color palette with Pantone references (2587 C, 7424 C, 2985 C, 1235 C), usage ratios, combination rules" },
        { name: "Typography", detail: "Primary and secondary typeface pairing (Lama Rounded), hierarchy system, usage guidelines" },
        { name: "Packaging Design", detail: "Branded mailer bags (purple), product wrapping, shipping bags, branded tape concept" },
        { name: "Social Media Design", detail: "Instagram post templates, story formats, ad creative layouts, promotional banners, billboard mockups" },
        { name: "Brand Applications", detail: "Tote bags, mugs, notebooks, stickers, digital interfaces, website banner direction" },
      ],
      outcome: {
        intro:
          "Neemo launched with an identity that is genuinely unlike anything else in its category. The four-color system breaks every 'safe' e-commerce design rule - and that's why it works. In a feed full of minimal white-background product shots, Neemo's purple and pink and yellow stop the scroll.",
        points: [
          "Complete brand system delivered and approved within the project timeline",
          "The identity is distinctive enough to be recognized from packaging alone - before the customer even opens the product",
          "The visual system gives the brand enough variety to post daily without looking repetitive, while maintaining instant recognition",
          "The packaging design turns every delivery into a brand moment - customers see the brand before they see the product",
        ],
      },
      designDecision: {
        title: "The four-color palette.",
        body: "Most branding guidelines tell you to stick to two colors. We deliberately broke that rule because Neemo's personality demanded it - 'happy' doesn't come from one color, it comes from the energy of many. The key was building strict usage ratios so the variety creates excitement, not chaos.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1hyov3jDWJbzqqfgP1vQ71H0ji8SJwYtc/view?usp=sharing",
      siteUrl: "https://www.neemo-store.com",
      siteLabel: "neemo-store.com",
    },
  ],

  ar: [
    {
      slug: "sakan",
      letter: "S",
      accentColor: "#3f71e4",
      meta: {
        type: "تصميم هوية بصرية",
        industry: "الضيافة / السفر الديني",
        scope: "نظام هوية كامل + إدارة تواصل اجتماعي",
        duration: "4-5 أسابيع",
      },
      brief: [
        "سَكَن هي علامة استشارات ضيافة سعودية، تركّز على مساعدة الحُجّاج والمعتمرين في إيجاد الإقامة المناسبة. جاءنا المؤسّسون باحتياج واضح: كانوا يدخلون سوقًا تنافسيًّا مليئًا بوكالات السفر العامة ومنصّات الحجز، واحتاجوا هوية بصرية تميّزهم فورًا.",
        "موقعهم التنافسي كان قويًّا - لم يكونوا مجرّد وسيط حجز فنادق، بل مستشارين يطابقون الحاج مع الإقامة المناسبة لاحتياجاته. لكن لم تكن لديهم هوية بصرية تحمل هذه الرسالة.",
      ],
      challenge: [
        "سوق إقامة الحج والعمرة يعاني من مشكلة بصرية محدّدة: معظم العلامات تبدو متشابهة. ألوان ذهبية وخضراء، صور مساجد عامة، خطوط عربية مزخرفة - لغة بصرية تجعل كل علامة قابلة للاستبدال.",
        "سَكَن احتاجت أن تبدو مختلفة دون أن تبدو غير محترمة. حديثة دون فقدان الأصالة الثقافية. جديرة بالثقة دون أن تكون مملّة. هذا كان التوتّر الإبداعي الذي كان علينا حلّه.",
      ],
      thinking: {
        intro: "بدأنا بدراسة المشهد التنافسي - ليس منافسي سَكَن المباشرين فقط، بل اللغة البصرية الأوسع لعلامات السفر والضيافة التي يتعامل معها الحُجّاج. حدّدنا المساحة البيضاء: علامة تبدو نظيفة وحديثة وواثقة، تستخدم إشارات الثقة من صناعة الضيافة بدلاً من فئة السفر الديني.",
        points: [
          "اخترنا لوحة ألوان تهيمن عليها الأزرق للدلالة على الموثوقية والهدوء - متجنّبين عمدًا كليشيه الذهبي/الأخضر في الفئة",
          "صمّمنا شعارًا عربيًّا أولاً يبدو معاصرًا لكنّه متجذّر ثقافيًّا، وليس شعارًا لاتينيًّا أُضيفت إليه العربية كفكرة لاحقة",
          "أنشأنا نظامًا بصريًّا مبنيًّا حول فكرة الوضوح والتوجيه - لأن وعد سَكَن الأساسي هو إزالة الحيرة من البحث عن الإقامة",
          'طوّرنا رسائل العلامة بالعربية والإنجليزية تركّز على تجربة الحاج: "نختار معك، لا بدلاً عنك"',
        ],
      },
      deliverables: [
        { name: "نظام الشعار", detail: "شعار رئيسي، شعار عربي، علامة العلامة، تنويعات متجاوبة لأحجام وسياقات مختلفة" },
        { name: "الألوان والطباعة", detail: "لوحة ألوان كاملة بأزرق أساسي وألوان مُكمّلة، خطوط عربية وإنجليزية متناسقة، قواعد الاستخدام" },
        { name: "دليل العلامة", detail: "وثيقة استخدام شاملة - مسافات الشعار، أكواد الألوان، تسلسل الخطوط، الصواب والخطأ، نبرة الصوت" },
        { name: "تطبيقات العلامة", detail: "بطاقات أعمال، أوراق رسمية، حقائب مُعلَّمة، بطاقات أمتعة، دفاتر، نماذج لافتات خارجية" },
        { name: "إدارة التواصل", detail: "قوالب منشورات، تنسيقات قصص، اتجاه المحتوى، إطار محتوى ثنائي اللغة لإنستغرام" },
        { name: "عناصر بصرية", detail: "أنماط بصرية مخصّصة، أيقونات، دليل أسلوب التصوير، رسومات العلامة" },
      ],
      outcome: {
        intro: "انطلقت سَكَن بهوية بصرية لا تشبه منافسيها إطلاقًا - وهذا كان الهدف. أعطاهم النظام لغة بصرية كاملة تعمل عبر كل نقطة تماس، من منشور تواصل اجتماعي إلى بطاقة أمتعة تُسلَّم للحاج عند تسجيل الدخول.",
        points: [
          "تسليم نظام العلامة الكامل واعتماده ضمن الجدول الزمني المحدّد",
          "اعتمد العميل الدليل عبر جميع نقاط التماس من اليوم الأول - بدون أي انحراف",
          "وضعت الهوية سَكَن كاستشارة متميّزة وحديثة في فئة تسيطر عليها الوكالات العامة",
          "كل تطبيق - من المنشورات إلى اللافتات - يبدو كأنه نفس العلامة، وهذا الهدف الكامل من النظام",
        ],
      },
      designDecision: {
        title: "استخدام الأزرق بدلاً من الذهبي/الأخضر المتوقّع.",
        body: "كان كسرًا متعمّدًا لعُرف الفئة جعل سَكَن معروفة فورًا. كان العميل حذرًا في البداية، لكن حين رأى النظام الكامل مُطبّقًا، التميّز تكلّم عن نفسه.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1s6a3XMJvgHKt9DqJ1OcyAy2R93HA1WYd/view?usp=sharing",
      siteUrl: "https://sakansa.com",
      siteLabel: "sakansa.com",
    },
    {
      slug: "neemo",
      letter: "N",
      accentColor: "#7F59B0",
      meta: {
        type: "هوية بصرية + تغليف",
        industry: "التجارة الإلكترونية / التجزئة",
        scope: "هوية كاملة، تغليف، إدارة تواصل اجتماعي",
        duration: "4-6 أسابيع",
      },
      brief: [
        'نيمو هو متجر إلكتروني - "المتجر السعيد" الذي يبيع مزيجًا منتقى من المنتجات. أراد المؤسّسون علامة تبدو ممتعة ونابضة بالحياة ولا تُنسى فورًا. كانوا يُطلقون في سوق تجارة إلكترونية مزدحم حيث معظم المنافسين يُنسَون بصريًّا، واحتاجوا هوية تجعل الناس يتوقّفون عن التمرير ويتذكّرون الاسم.',
      ],
      challenge: [
        "علامات التجارة الإلكترونية تعاني من مشكلة هوية محدّدة: معظمها يبدو قابلاً للاستبدال. شعارات بسيطة، لوحات ألوان آمنة، صور جاهزة. النتيجة بحر من التشابه حيث المميّز الوحيد يصبح السعر - وهذا بالضبط السباق الذي أراد نيمو تجنّبه.",
        "التحدّي الإبداعي كان إيجاد الخط بين المرح والاحترافية. احتاجت العلامة أن تبدو مثيرة وشبابية دون أن تبدو رخيصة. تعمل على شاشة هاتف (صغيرة) وعلى لوحة إعلانية (ضخمة). وتحتاج تجربة تغليف تمدّ وعد العلامة إلى لحظة الفتح الفعلية.",
      ],
      thinking: {
        intro: "",
        points: [
          "حدّدنا شخصية العلامة كـ 'مبهجة، جريئة، ومفاجئة' - متجر حيث التسوّق يبدو كمكافأة",
          "كسرنا عُرف التجارة الإلكترونية بلوحة ألوان رباعية (بنفسجي ملكي، وردي داكن، أزرق مايا، أصفر ساطع) يستحيل الخلط بينها وبين أي منافس",
          "صمّمنا رمز الشعار ليكون معروفًا فوريًّا بأي حجم - من أيقونة تطبيق 32 بكسل إلى لافتات خارجية",
          "تعاملنا مع التغليف كنقطة تماس للعلامة، لا كفكرة لاحقة - لأن الفتح هو أول لحظة فعلية يعيشها العميل مع العلامة",
          "بنينا قوالب تواصل اجتماعي تحافظ على اتساق العلامة مع السماح بتنوّع كافٍ لإبقاء المحتوى مُنعشًا",
        ],
      },
      deliverables: [
        { name: "نظام الشعار", detail: "شعار رئيسي، توقيع، علامة، تنويعات للخلفيات الداكنة/الفاتحة، أحجام متجاوبة" },
        { name: "نظام الألوان", detail: "لوحة رباعية الألوان بمراجع بانتون (2587 C، 7424 C، 2985 C، 1235 C)، نسب استخدام، قواعد دمج" },
        { name: "الطباعة", detail: "خطوط أساسية وثانوية متناسقة (Lama Rounded)، نظام تسلسل، إرشادات استخدام" },
        { name: "تصميم التغليف", detail: "أكياس شحن مُعلَّمة (بنفسجية)، تغليف منتجات، أكياس شحن، مفهوم شريط لاصق مُعلَّم" },
        { name: "تصميم التواصل", detail: "قوالب منشورات إنستغرام، تنسيقات قصص، تصميمات إعلانية، لافتات ترويجية، نماذج لوحات إعلانية" },
        { name: "تطبيقات العلامة", detail: "حقائب، أكواب، دفاتر، ملصقات، واجهات رقمية، اتجاه لافتات الموقع" },
      ],
      outcome: {
        intro: "انطلق نيمو بهوية لا تشبه أي شيء آخر في فئته حقًّا. نظام الألوان الرباعي يكسر كل قاعدة تصميم تجارة إلكترونية 'آمنة' - ولهذا ينجح. في محتوى مليء بصور منتجات بخلفيات بيضاء بسيطة، بنفسجي وردي وأصفر نيمو يوقف التمرير.",
        points: [
          "تسليم نظام العلامة الكامل واعتماده ضمن الجدول الزمني",
          "الهوية مميّزة بما يكفي للتعرّف عليها من التغليف وحده - قبل أن يفتح العميل المنتج",
          "يمنح النظام البصري العلامة تنوّعًا كافيًا للنشر يوميًّا دون أن يبدو متكرّرًا، مع الحفاظ على التعرّف الفوري",
          "تصميم التغليف يحوّل كل عملية توصيل إلى لحظة علامة - يرى العملاء العلامة قبل أن يروا المنتج",
        ],
      },
      designDecision: {
        title: "لوحة الألوان الرباعية.",
        body: "معظم أدلّة العلامات تخبرك بالالتزام بلونين. كسرنا هذه القاعدة عمدًا لأن شخصية نيمو تتطلّبها - 'السعادة' لا تأتي من لون واحد، بل من طاقة الألوان المتعدّدة. المفتاح كان بناء نسب استخدام صارمة حتى يخلق التنوّع حماسًا، لا فوضى.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1hyov3jDWJbzqqfgP1vQ71H0ji8SJwYtc/view?usp=sharing",
      siteUrl: "https://www.neemo-store.com",
      siteLabel: "neemo-store.com",
    },
  ],
};
