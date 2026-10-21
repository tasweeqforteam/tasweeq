import type { Lang } from "./i18n";
import type { ProjectSlug } from "./projects";

export type CaseStudy = {
  slug: ProjectSlug;
  letter: string;
  accentColor: string;
  meta: { type: string; industry: string; scope: string; duration?: string };
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
    deliverableCol: "ما قدّمناه",
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
        title: "Using blue instead of the expected gold/green",
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
        title: "The four-color palette",
        body: "Most branding guidelines tell you to stick to two colors. We deliberately broke that rule because Neemo's personality demanded it - 'happy' doesn't come from one color, it comes from the energy of many. The key was building strict usage ratios so the variety creates excitement, not chaos.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1hyov3jDWJbzqqfgP1vQ71H0ji8SJwYtc/view?usp=sharing",
      siteUrl: "https://www.neemo-store.com",
      siteLabel: "neemo-store.com",
    },
    {
      slug: "mawaeidk",
      letter: "M",
      accentColor: "#004D43",
      meta: {
        type: "Brand Identity Redesign",
        industry: "Healthcare / Digital Health",
        scope: "Full identity system + brand strategy",
        duration: "5-6 weeks",
      },
      brief: [
        "Mawaeidk is a digital healthcare platform built for Qatar and the wider GCC, letting people book medical appointments for themselves and their families in a few taps. The founders came to us with a platform that already worked, but a brand identity that didn't match the experience they were building - it looked corporate and clinical in a category that needed to feel human.",
        "The opportunity was clear: healthcare booking in the region is still dominated by phone calls, walk-ins, and confusing hospital portals. Mawaeidk wanted to be the calm, modern alternative - and needed a brand that made that promise visible before a user ever opened the app.",
      ],
      challenge: [
        "Healthcare brands tend to fall into one of two traps: overly clinical and cold, or overly corporate and sales-driven. Neither builds the kind of trust a healthcare platform actually needs - the trust of someone booking a scan for their child or a checkup for an elderly parent.",
        "Mawaeidk needed an identity that felt human, calm, and reliable without leaning on tired medical cliches - no crosses, no stethoscopes, no sterile blues. It needed to read as a modern tech brand first, and a healthcare brand second, while never losing warmth or clarity in the process.",
      ],
      thinking: {
        intro:
          "We anchored the entire identity in a single archetype: the Caregiver, supported by the Sage. Every decision - color, type, tone - had to answer one question: does this feel like someone who genuinely wants to help you, not sell to you?",
        points: [
          "We rebuilt the logo from the ground up - retiring the old dark teal icon with its Arabic wordmark and orange checkmark accent for a solid, confident teal mark paired with an abstract yellow-green monogram symbol",
          "We chose Deep Teal as the anchor color to signal calm and trust, paired with a Lime/Yellow-Green accent that keeps the system feeling modern and alive rather than clinical",
          "We selected a custom Arabic-and-Latin type system (KO Sans, in Thin, Medium, and Bold) that reads as approachable and contemporary rather than institutional",
          "We wrote tone-of-voice guidelines around plain language - warm, confident, and reassuring, with an explicit rule against medical jargon and fear-based messaging",
          "We designed the visual language around softness - rounded UI, soft gradients, generous white space - so the brand feels like relief, not a hospital corridor",
        ],
      },
      deliverables: [
        { name: "Logo System", detail: "Redesigned primary mark, monogram symbol, Arabic and English lockups, responsive variations" },
        { name: "Color & Typography", detail: "Deep Teal and Lime color system with usage ratios, KO Sans typeface family, Arabic/Latin pairing rules" },
        { name: "Brand Guidelines", detail: "Complete usage document - logo construction, color codes, typography hierarchy, tone of voice, do's and don'ts" },
        { name: "Brand Strategy", detail: "Positioning, brand archetype (Caregiver/Sage), messaging pillars, tagline direction" },
        { name: "Verbal Identity", detail: "Tone of voice guidelines, messaging pillars (Save Time, Book Easily, Stay Organized, Feel Confident), tagline options" },
        { name: "Brand Applications", detail: "App interface direction, social media templates, digital collateral mockups" },
      ],
      outcome: {
        intro:
          "The new identity gives Mawaeidk a clearer, warmer visual and verbal foundation across its digital touchpoints — modern, calm and human in a category that often feels cold and corporate.",
        points: [
          "An identity built around one brand character — the Caregiver — applied across the system",
          "A redesigned logo: a simplified, confident symbol in place of the earlier busy mark, sized for app icons and small digital use",
          "Tone-of-voice guidelines for app copy, notifications and marketing that avoid clinical language",
          "A deep teal and lime color system with KO Sans typography for Arabic and English",
        ],
      },
      designDecision: {
        title: "Choosing warmth over clinical convention",
        body: "Every instinct in healthcare branding pulls toward sterile blues and medical iconography. We went the other way - deep teal and lime, rounded shapes, human language - because Mawaeidk's real competitor isn't another app, it's the anxiety of booking healthcare at all. The brand had to feel like a Caregiver before it felt like software.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1d2ukuLoNKJCnyRC_U5WsveJiDcPfAdz1/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
    },
    {
      slug: "loop",
      letter: "L",
      accentColor: "#DA7B29",
      meta: {
        type: "Brand Identity Design",
        industry: "Marketing / Creative Services",
        scope: "Full identity system + social media direction",
      },
      brief: [
        "LOOP is a marketing and creative company offering integrated solutions in digital marketing, design and advertising. Its whole business is helping other brands get seen — which meant its own identity had to prove the point before a single pitch.",
        "The founders needed a brand that felt confident, modern and bilingual from day one, and a line that sums up what they sell: presence.",
      ],
      challenge: [
        "Marketing agencies are the hardest category to brand. Every agency claims creativity, every agency uses the same bold sans-serif and the same 'we grow brands' promise. A marketing company with a forgettable identity loses the argument before it starts.",
        "LOOP needed a system distinctive enough to be recognised from a single shape, yet flexible enough to carry campaigns, social content and physical spaces without feeling repetitive.",
      ],
      thinking: {
        intro:
          "We built the identity around one idea: be where people see you. Everything in the system is designed to be noticed at a glance and remembered after it.",
        points: [
          "We turned the four letters of the name into a modular logomark — L, O, O, P stacked into a compact square that works as a symbol on its own",
          "We paired the mark with a bilingual wordmark, so لووب and LOOP carry equal weight instead of one translating the other",
          "We chose a confident orange against deep black and warm cream: energetic enough to stop the scroll, grounded enough to feel professional",
          "We broke the logomark into its geometric parts to create a pattern and graphic language that runs across every touchpoint",
          "We wrote the brand line in both languages — 'Be Where People See You' / «خلّك حاضر وين الناس تشوفك» — as the promise every application has to deliver",
        ],
      },
      deliverables: [
        { name: "Logo System", detail: "Logomark, bilingual wordmark, lockups, clear space and minimum sizing rules" },
        { name: "Color & Typography", detail: "Orange, black and cream palette with usage ratios, Arabic and English typefaces" },
        { name: "Graphic Language", detail: "Patterns built from the logomark geometry, custom icon set" },
        { name: "Social Media Direction", detail: "Post and story directions in the brand's visual language" },
        { name: "Brand Applications", detail: "Stationery, business cards, signage, billboard, merchandise, storefront and office mockups" },
        { name: "Brand Guidelines", detail: "Complete usage document covering every element of the system" },
      ],
      outcome: {
        intro:
          "The modular identity works as a standalone mark and extends into patterns, social content, signage and physical applications — from a business card to a storefront.",
        points: [
          "A logomark built from the four letters of the name, designed to work on its own — on a mug, an app icon or a 3D sign",
          "A bilingual system where Arabic and English are designed together, not translated",
          "Patterns and icons drawn from the logomark geometry for social content and print",
          "A brand line in both languages: «خلّك حاضر وين الناس تشوفك» / Be Where People See You",
        ],
      },
      designDecision: {
        title: "Building the symbol from the name itself",
        body: "Instead of adding an abstract icon next to the name, we made the four letters become the icon. It means the brand is always present — even when there's only room for a small square, people still read LOOP.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1IcekhQbs8MGoBDVpiBLxCVXouuCIYb62/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
    },
    {
      slug: "mh-stud",
      letter: "M",
      accentColor: "#841641",
      meta: {
        type: "Brand Identity Design",
        industry: "Equestrian / Arabian Horse Breeding",
        scope: "Full identity system + brand applications",
      },
      brief: [
        "MH Stud is a Qatari stud farm dedicated to breeding Arabian horses. In a world where lineage, heritage and beauty are everything, the stud needed an identity worthy of the horses it raises.",
        "The brand had to speak to owners, breeders and show audiences — people who recognise quality instantly and expect a stud's identity to carry the same prestige as its bloodlines.",
      ],
      challenge: [
        "Equestrian brands often fall into two extremes: generic horse silhouettes that could belong to any stable, or heavy ornamental crests that feel dated. Neither communicates the elegance of the Arabian horse.",
        "MH Stud needed a mark that felt heritage-rich and Arabian at heart, yet refined enough to sit on a business card, a saddle pad and an embroidered polo with the same authority.",
      ],
      thinking: {
        intro:
          "We started from the brand's line — «حيث يبدأ الجمال», where beauty begins — and treated the identity as a portrait of the Arabian horse rather than a logo about horses.",
        points: [
          "We drew a hand-crafted horse head that flows into the MH monogram, crossed by a sword stroke that adds pride and Arabian character",
          "We chose a deep burgundy and royal navy on warm cream — colours of heritage, prestige and calm confidence",
          "We paired TS Zunburk's calligraphic Arabic with a classic serif in English, so both languages feel equally refined",
          "We designed a dedicated equestrian icon set and horseshoe-based patterns to extend the identity beyond the logo",
          "We photographed the brand in its real world — stables, straw, saddles and riders — so every application feels lived-in, not staged",
        ],
      },
      deliverables: [
        { name: "Logo System", detail: "Primary mark, monogram, construction, clear space, minimum size and background rules" },
        { name: "Color & Typography", detail: "Burgundy, navy and cream palette; TS Zunburk Arabic with a serif English pairing" },
        { name: "Brand Icons", detail: "Custom equestrian icon set for signage, digital and print" },
        { name: "Patterns", detail: "Two horseshoe-based pattern systems for textiles and print" },
        { name: "Brand Applications", detail: "Business cards, stable banners, polo shirts, horse blankets, saddle pads and embroidered labels" },
        { name: "Social Media Direction", detail: "Profile and post templates in Arabic" },
      ],
      outcome: {
        intro:
          "The identity combines the horse, the MH monogram and an equestrian visual language across print, textiles, signage and social media.",
        points: [
          "A signature mark that unites the horse, the monogram and a sword stroke in one gesture",
          "A burgundy, navy and cream palette applied across fabric, paper and screen",
          "A bilingual typographic voice with calligraphic character in Arabic",
          "Equestrian icons, horseshoe patterns and applications for stables, shows and social media",
        ],
      },
      designDecision: {
        title: "Letting the horse draw the monogram",
        body: "Rather than placing a horse next to the letters, we let the horse's mane and neck flow into the MH monogram. The result reads as one confident signature — the stud and its horses are the same story.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1w7JUcR5KyCPUe2_xLCKdrLw5BboiV8L6/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
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
          "اخترنا لوحة ألوان تهيمن عليها الأزرق للدلالة على الموثوقية والهدوء - متجنّبين عمدًا القالب الذهبي/الأخضر المكرّر في الفئة",
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
        title: "استخدام الأزرق بدلاً من الذهبي/الأخضر المتوقّع",
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
        title: "لوحة الألوان الرباعية",
        body: "معظم أدلّة العلامات تخبرك بالالتزام بلونين. كسرنا هذه القاعدة عمدًا لأن شخصية نيمو تتطلّبها - 'السعادة' لا تأتي من لون واحد، بل من طاقة الألوان المتعدّدة. المفتاح كان بناء نسب استخدام صارمة حتى يخلق التنوّع حماسًا، لا فوضى.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1hyov3jDWJbzqqfgP1vQ71H0ji8SJwYtc/view?usp=sharing",
      siteUrl: "https://www.neemo-store.com",
      siteLabel: "neemo-store.com",
    },
    {
      slug: "mawaeidk",
      letter: "M",
      accentColor: "#004D43",
      meta: {
        type: "إعادة تصميم الهوية البصرية",
        industry: "الرعاية الصحية / الصحة الرقمية",
        scope: "نظام هوية كامل + استراتيجية العلامة",
        duration: "5-6 أسابيع",
      },
      brief: [
        "مواعيدك هي منصّة رعاية صحية رقمية مبنية لقطر ودول الخليج، تتيح للناس حجز مواعيد طبية لأنفسهم ولعائلاتهم بضغطات قليلة. جاءنا المؤسّسون بمنصّة تعمل بالفعل، لكن هوية بصرية لا تتطابق مع التجربة التي يبنونها - بدت رسمية وسريرية في فئة تحتاج أن تبدو إنسانية.",
        "الفرصة كانت واضحة: حجز الرعاية الصحية في المنطقة ما زال يهيمن عليه الاتّصال الهاتفي والحضور المباشر وبوابات المستشفيات المُربكة. أرادت مواعيدك أن تكون البديل الهادئ والحديث - واحتاجت هوية تُظهر هذا الوعد قبل أن يفتح المستخدم التطبيق حتى.",
      ],
      challenge: [
        "علامات الرعاية الصحية غالبًا ما تقع في أحد فخّين: باردة وسريرية بإفراط، أو رسمية وترويجية بإفراط. لا شيء منهما يبني نوع الثقة التي تحتاجها منصّة رعاية صحية فعليًّا - ثقة شخص يحجز أشعة لطفله أو فحصًا لوالد مسنّ.",
        "احتاجت مواعيدك هوية تبدو إنسانية وهادئة وموثوقة دون الاتّكاء على الرموز الطبية المكرّرة - بلا صلبان، بلا سمّاعات طبية، بلا أزرق معقّم. كان عليها أن تُقرأ كعلامة تقنية حديثة أولاً، وعلامة رعاية صحية ثانيًا، دون أن تفقد الدفء أو الوضوح في هذه العملية.",
      ],
      thinking: {
        intro: "أرسينا الهوية بأكملها على شخصية واحدة: الراعي، مدعومًا بالحكيم. كل قرار - اللون، الخط، النبرة - كان عليه أن يجيب سؤالًا واحدًا: هل يبدو هذا كشخص يريد مساعدتك فعلاً، لا بيعك شيئًا؟",
        points: [
          "أعدنا بناء الشعار من الصفر - متخلّين عن الأيقونة التركوازية الداكنة القديمة وشعارها العربي وإشارة الصح البرتقالية لصالح علامة تركوازية واثقة مقترنة برمز أحادي مجرّد أخضر ليموني",
          "اخترنا التركوازي الغامق كلون أساسي للدلالة على الهدوء والثقة، مقترنًا بلمسة أخضر ليموني تُبقي النظام يبدو حديثًا وحيويًّا لا سريريًّا",
          "اخترنا نظام خطوط عربي ولاتيني مخصّص (KO Sans، بأوزان Thin وMedium وBold) يُقرأ كودود ومعاصر لا كمؤسّساتي",
          "كتبنا إرشادات نبرة الصوت حول لغة بسيطة - دافئة وواثقة ومطمئنة، مع قاعدة صريحة ضدّ المصطلحات الطبية والرسائل القائمة على الخوف",
          "صمّمنا اللغة البصرية حول النعومة - واجهات مستديرة، تدرّجات لونية ناعمة، مساحات بيضاء سخيّة - لتشعر العلامة بالراحة لا بممرّ المستشفى",
        ],
      },
      deliverables: [
        { name: "نظام الشعار", detail: "علامة رئيسية مُعاد تصميمها، رمز أحادي، صياغات عربية وإنجليزية، تنويعات متجاوبة" },
        { name: "الألوان والطباعة", detail: "نظام ألوان تركوازي وأخضر ليموني بنسب استخدام، عائلة خط KO Sans، قواعد تناسق عربي/لاتيني" },
        { name: "دليل العلامة", detail: "وثيقة استخدام شاملة - بناء الشعار، أكواد الألوان، تسلسل الخطوط، نبرة الصوت، الصواب والخطأ" },
        { name: "استراتيجية العلامة", detail: "التموضع، شخصية العلامة (الراعي/الحكيم)، ركائز الرسائل، اتجاه الشعار الترويجي" },
        { name: "الهوية اللفظية", detail: "إرشادات نبرة الصوت، ركائز الرسائل (توفير الوقت، حجز سهل، تنظيم، الشعور بالثقة)، خيارات الشعار الترويجي" },
        { name: "تطبيقات العلامة", detail: "اتجاه واجهة التطبيق، قوالب تواصل اجتماعي، نماذج مواد رقمية" },
      ],
      outcome: {
        intro: "تمنح الهوية الجديدة مواعيدك أساساً بصرياً ولفظياً أوضح وأدفأ عبر كل واجهاتها الرقمية — حديثة وهادئة وإنسانية في فئة تبدو غالباً باردة ورسمية.",
        points: [
          "هوية مبنية حول شخصية واحدة للعلامة — الراعي — ومطبّقة على النظام كله",
          "شعار مُعاد تصميمه: رمز مبسّط وواثق بدلاً من العلامة المزدحمة السابقة، مناسب لأيقونات التطبيقات والاستخدام الرقمي الصغير",
          "إرشادات نبرة صوت لنصوص التطبيق والإشعارات والتسويق تتجنّب اللغة الطبية الجافة",
          "نظام ألوان تركوازي غامق وأخضر ليموني مع خط KO Sans للعربية والإنجليزية",
        ],
      },
      designDecision: {
        title: "اختيار الدفء بدلاً من العُرف السريري",
        body: "كل غريزة في هوية الرعاية الصحية تجذب نحو الأزرق المعقّم والأيقونات الطبية. اتّجهنا للعكس - تركوازي غامق وأخضر ليموني، أشكال مستديرة، لغة إنسانية - لأن منافس مواعيدك الحقيقي ليس تطبيقًا آخر، بل قلق حجز الرعاية الصحية أصلاً. كان على العلامة أن تشعر كراعٍ قبل أن تشعر كبرنامج.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1d2ukuLoNKJCnyRC_U5WsveJiDcPfAdz1/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
    },
    {
      slug: "loop",
      letter: "L",
      accentColor: "#DA7B29",
      meta: {
        type: "تصميم هوية بصرية",
        industry: "التسويق / الخدمات الإبداعية",
        scope: "نظام هوية كامل + اتجاه التواصل الاجتماعي",
      },
      brief: [
        "لووب شركة تسويق وإبداع تقدّم حلولاً متكاملة في التسويق الرقمي والتصميم والإعلان. عملها كله أن تجعل العلامات الأخرى مرئية — ولذلك كان على هويتها أن تُثبت ذلك قبل أي عرض تقديمي.",
        "احتاج المؤسّسون علامة واثقة وحديثة وثنائية اللغة من اليوم الأول، وجملة تلخّص ما يبيعونه فعلاً: الحضور.",
      ],
      challenge: [
        "وكالات التسويق هي أصعب فئة في بناء الهوية. كل وكالة تدّعي الإبداع، وكلها تستخدم نفس الخط العريض ونفس وعد «ننمّي العلامات». وشركة تسويق بهوية تُنسى تخسر النقاش قبل أن يبدأ.",
        "احتاجت لووب نظاماً مميّزاً بما يكفي ليُعرف من شكل واحد، ومرناً بما يكفي ليحمل الحملات والمحتوى والمساحات الفعلية دون أن يبدو متكرّراً.",
      ],
      thinking: {
        intro: "بنينا الهوية حول فكرة واحدة: كن حيث يراك الناس. كل عنصر في النظام مصمّم ليُلاحظ من النظرة الأولى ويُتذكّر بعدها.",
        points: [
          "حوّلنا حروف الاسم الأربعة إلى علامة معيارية — L وO وO وP مرصوصة في مربّع مدمج يعمل كرمز مستقل",
          "صمّمنا شعاراً نصياً ثنائي اللغة، لتحمل «لووب» و«LOOP» نفس الوزن بدلاً من أن تكون إحداهما ترجمة للأخرى",
          "اخترنا برتقالياً واثقاً مع أسود عميق وكريمي دافئ: طاقة توقف التمرير، ورصانة تبدو احترافية",
          "فكّكنا العلامة إلى أجزائها الهندسية لنبني منها أنماطاً ولغة بصرية تمتدّ عبر كل نقاط التماس",
          "كتبنا جملة العلامة باللغتين — «خلّك حاضر وين الناس تشوفك» / Be Where People See You — كوعد يجب أن يحقّقه كل تطبيق",
        ],
      },
      deliverables: [
        { name: "نظام الشعار", detail: "العلامة، الشعار النصي ثنائي اللغة، التركيبات، المسافات الآمنة وقواعد الأحجام" },
        { name: "الألوان والطباعة", detail: "لوحة البرتقالي والأسود والكريمي بنسب استخدام، وخطوط عربية وإنجليزية" },
        { name: "اللغة البصرية", detail: "أنماط مبنية من هندسة العلامة، ومجموعة أيقونات مخصّصة" },
        { name: "اتجاه التواصل الاجتماعي", detail: "اتجاهات للمنشورات والقصص بلغة العلامة البصرية" },
        { name: "تطبيقات العلامة", detail: "قرطاسية، بطاقات أعمال، لافتات، لوحة إعلانية، منتجات، واجهة محل ومكتب" },
        { name: "دليل العلامة", detail: "وثيقة استخدام شاملة تغطي كل عناصر النظام" },
      ],
      outcome: {
        intro: "تعمل الهوية المعيارية كعلامة مستقلة، وتمتدّ إلى الأنماط ومحتوى التواصل الاجتماعي واللافتات والتطبيقات الفعلية — من بطاقة الأعمال إلى واجهة المحل.",
        points: [
          "علامة مبنية من حروف الاسم الأربعة، مصمّمة لتعمل وحدها — على كوب، أيقونة تطبيق أو لافتة ثلاثية الأبعاد",
          "نظام ثنائي اللغة صُمّمت فيه العربية والإنجليزية معاً، لا ترجمةً",
          "أنماط وأيقونات مستمدّة من هندسة العلامة للمحتوى والمطبوعات",
          "جملة علامة باللغتين: «خلّك حاضر وين الناس تشوفك» / Be Where People See You",
        ],
      },
      designDecision: {
        title: "بناء الرمز من الاسم نفسه",
        body: "بدلاً من إضافة أيقونة مجرّدة بجوار الاسم، جعلنا الحروف الأربعة هي الأيقونة. هكذا تبقى العلامة حاضرة دائماً — حتى حين لا يتّسع المكان إلا لمربّع صغير، يقرأ الناس LOOP.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1IcekhQbs8MGoBDVpiBLxCVXouuCIYb62/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
    },
    {
      slug: "mh-stud",
      letter: "M",
      accentColor: "#841641",
      meta: {
        type: "تصميم هوية بصرية",
        industry: "الفروسية / تربية الخيل العربية",
        scope: "نظام هوية كامل + تطبيقات العلامة",
      },
      brief: [
        "إم إتش ستد مربط قطري متخصّص في تربية الخيل العربية. في عالم تعني فيه السلالة والإرث والجمال كل شيء، احتاج المربط هوية تليق بالخيول التي يربّيها.",
        "كان على العلامة أن تخاطب الملّاك والمربّين وجمهور البطولات — أشخاص يميّزون الجودة فوراً، ويتوقّعون أن تحمل هوية المربط نفس هيبة سلالاته.",
      ],
      challenge: [
        "علامات الفروسية تقع غالباً في طرفين: صور ظلّية عامة لخيول يمكن أن تنتمي لأي إسطبل، أو شعارات مزخرفة ثقيلة تبدو قديمة. لا هذا ولا ذاك ينقل أناقة الخيل العربية.",
        "احتاج إم إتش ستد علامة غنية بالإرث وعربية الروح، لكنها راقية بما يكفي لتظهر على بطاقة أعمال ومفرش سرج وقميص مطرّز بنفس الحضور.",
      ],
      thinking: {
        intro: "بدأنا من جملة العلامة — «حيث يبدأ الجمال» — وتعاملنا مع الهوية كبورتريه للخيل العربية، لا كشعار عن الخيول.",
        points: [
          "رسمنا رأس حصان يدوياً ينساب داخل المونوجرام MH، يعبره خط سيف يضيف الفخر والطابع العربي",
          "اخترنا العنابي العميق والكحلي الملكي على كريمي دافئ — ألوان الإرث والهيبة والثقة الهادئة",
          "قرنّا خط TS Zunburk العربي ذا الروح الخطّية بخط سيريف كلاسيكي بالإنجليزية، لتبدو اللغتان بنفس الرقي",
          "صمّمنا مجموعة أيقونات فروسية خاصة وأنماطاً مبنية على حدوة الحصان لتمتدّ الهوية أبعد من الشعار",
          "صوّرنا العلامة في عالمها الحقيقي — الإسطبلات والقش والسروج والفرسان — ليبدو كل تطبيق حقيقياً لا مصطنعاً",
        ],
      },
      deliverables: [
        { name: "نظام الشعار", detail: "العلامة الرئيسية، المونوجرام، البناء، المسافات الآمنة، الحدّ الأدنى للحجم وقواعد الخلفيات" },
        { name: "الألوان والطباعة", detail: "لوحة العنابي والكحلي والكريمي؛ خط TS Zunburk العربي مع خط سيريف إنجليزي" },
        { name: "أيقونات العلامة", detail: "مجموعة أيقونات فروسية مخصّصة للافتات والرقمي والمطبوعات" },
        { name: "الأنماط", detail: "نظاما أنماط مبنيان على حدوة الحصان للأقمشة والمطبوعات" },
        { name: "تطبيقات العلامة", detail: "بطاقات أعمال، لافتات إسطبل، قمصان بولو، أغطية خيل، مفارش سروج وملصقات مطرّزة" },
        { name: "اتجاه التواصل الاجتماعي", detail: "قوالب للملف الشخصي والمنشورات بالعربية" },
      ],
      outcome: {
        intro: "تجمع الهوية بين الحصان ومونوجرام MH ولغة بصرية فروسية عبر المطبوعات والأقمشة واللافتات والتواصل الاجتماعي.",
        points: [
          "علامة توقيع تجمع الحصان والمونوجرام وخط السيف في حركة واحدة",
          "لوحة عنابية وكحلية وكريمية مطبّقة على القماش والورق والشاشة",
          "صوت طباعي ثنائي اللغة بروح خطّية في العربية",
          "أيقونات فروسية وأنماط حدوة الحصان وتطبيقات للإسطبلات والبطولات والتواصل الاجتماعي",
        ],
      },
      designDecision: {
        title: "ترك الحصان يرسم المونوجرام",
        body: "بدلاً من وضع حصان بجوار الحروف، جعلنا عرف الحصان ورقبته ينسابان داخل المونوجرام MH. النتيجة توقيع واحد واثق — المربط وخيوله قصة واحدة.",
      },
      brandBookUrl: "https://drive.google.com/file/d/1w7JUcR5KyCPUe2_xLCKdrLw5BboiV8L6/view?usp=sharing",
      siteUrl: "",
      siteLabel: "",
    },
  ],
};
