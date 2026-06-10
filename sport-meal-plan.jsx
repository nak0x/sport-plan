import { useState } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const TABS = [
  ["meals", "🍱 Repas"],
  ["training", "📅 Plan mensuel"],
  ["groceries", "🛒 Courses"],
  ["monthly", "📦 Stock & Batch"],
];

// ─── TRAINING DATA ────────────────────────────────────────────────────────────

const trainingLoad = {
  Lundi:    { label: "Run VO2max 5k + Renfo PDC/Alters", detail: "Anaérobie + force fonctionnelle", intensity: "high", kcal: 3300, focus: "Glucides avant VO2max · Protéines après renfo", meat: false },
  Mardi:    { label: "Run Z1/Z2 5k + Escalade technicité 2–5h", detail: "Endurance douce + travail de doigts long", intensity: "medium-high", kcal: 3500, focus: "Énergie durable · Tendons : collagène + vit C", meat: false },
  Mercredi: { label: "Yoga méditatif + Tempo vélo", detail: "Récupération active matin · Tempo après-midi", intensity: "medium", kcal: 2900, focus: "Anti-inflammatoire · Glucides pour le tempo", meat: false },
  Jeudi:    { label: "Run récup Z2/Z3 + Trail 7–15k", detail: "Volume trail ou long trail unique", intensity: "medium-high", kcal: 3400, focus: "Glucides complexes · Récupération musculaire", meat: true, meatType: "🐟 Volaille" },
  Vendredi: { label: "Nage méditative + Long road bike ou Tempo MTB", detail: "Sem A: endurance 4h+ · Sem B: tempo MTB", intensity: "high", kcal: 3800, focus: "Glycogène max · Oméga-3 récup", meat: false },
  Samedi:   { label: "Escalade volume chill 3–5h + Yoga", detail: "Volume doux + souplesse", intensity: "medium", kcal: 3000, focus: "Énergie longue durée · Tendons · Récup soir", meat: true, meatType: "🥩 Viande rouge" },
  Dimanche: { label: "Long endurance tout sport", detail: "Trail, vélo, alpinisme, montagne…", intensity: "very-high", kcal: 4200, focus: "Charge glycogène max · Ravitaillement terrain", meat: false },
};

const trainingLoadDeload = {
  Lundi:    { label: "Run léger Z1 20–25 min + Renfo léger", detail: "Intensité -60% · Pas de VO2max", intensity: "low", kcal: 2200, focus: "Récupération active · Maintien du mouvement", meat: false },
  Mardi:    { label: "Marche active 45 min + Escalade détendue 1–2h max", detail: "Pas de blocs durs · Jeu technique uniquement", intensity: "low", kcal: 2400, focus: "Tendons au repos relatif · Anti-inflammatoire", meat: false },
  Mercredi: { label: "Yoga méditatif + Vélo sortie tranquille Z1", detail: "Volume -60% · Pas de tempo", intensity: "low", kcal: 2100, focus: "Parasympathique · Décharge SNC", meat: false },
  Jeudi:    { label: "Run Z1 30 min très doux + Marche trail 5k", detail: "Pas de Z3/Z4 cette semaine", intensity: "low", kcal: 2200, focus: "Circulation · Élimination des déchets métaboliques", meat: true, meatType: "🐟 Volaille" },
  Vendredi: { label: "Nage méditative 30 min + Vélo balade Z1 1h", detail: "Semaine de décharge — pas d'intensité", intensity: "low", kcal: 2500, focus: "Récupération tendineuse · Sommeil prioritaire", meat: false },
  Samedi:   { label: "Escalade très douce 1h30 max + Yoga long", detail: "Voies faciles uniquement · Pas de bloc dur", intensity: "low", kcal: 2200, focus: "Plaisir pur · Aucune performance", meat: true, meatType: "🥩 Viande rouge" },
  Dimanche: { label: "Sortie nature libre et courte 1h30 max", detail: "Marche, vélo tranquille, baignade… selon envie", intensity: "low", kcal: 2400, focus: "Ressourcement · Zéro objectif de performance", meat: false },
};

// ─── MONTHLY PLAN ─────────────────────────────────────────────────────────────

const months = [
  {
    month: "Mois 1", label: "Installation",
    goal: "Établir les habitudes, calibrer les charges réelles, observer les signaux du corps",
    weeks: [
      { n: 1, type: "charge", vol: "70%", desc: "Démarrage progressif — toutes les séances à 70% des fourchettes hautes. Objectif: ressentir le plan sans forcer." },
      { n: 2, type: "charge", vol: "80%", desc: "Augmentation légère. Commencez à noter la qualité du sommeil et la FC au réveil chaque matin." },
      { n: 3, type: "charge", vol: "90%", desc: "Première semaine proche du volume cible. Fourchettes basses des sessions longues." },
      { n: 4, type: "deload", vol: "45%", desc: "Décharge obligatoire. Semaine de décharge vraie — toutes les sessions à 45% du volume normal. Le corps surcompense ici." },
    ],
    rdv: [
      { type: "bilan", label: "Bilan sanguin initial", detail: "Ferritine, testostérone libre, T3/T4, vitamine D, magnésium érythrocytaire, NFS, CRP. Référence de base pour toute la suite.", week: 1 },
      { type: "kine", label: "Bilan postural kiné/ostéo", detail: "Bilan complet des déséquilibres existants avant de charger. Détecter les compensations actuelles (épaules escalade, hanches vélo).", week: 1 },
    ],
  },
  {
    month: "Mois 2", label: "Construction",
    goal: "Augmenter progressivement jusqu'aux fourchettes cibles, maintenir la qualité de récupération",
    weeks: [
      { n: 1, type: "charge", vol: "90%", desc: "Reprise post-décharge. Le corps est frais — profitez-en pour travailler la qualité technique plutôt que le volume." },
      { n: 2, type: "charge", vol: "95%", desc: "Approche du volume cible. Fourchettes médianes sur toutes les sessions." },
      { n: 3, type: "charge", vol: "100%", desc: "Première semaine plein volume. Soyez attentif aux signaux: motivation, qualité du sommeil, douleurs tendinueuses." },
      { n: 4, type: "deload", vol: "45%", desc: "Décharge. Si la semaine 3 a été lourde, cette décharge est critique — ne la sabotez pas en ajoutant des activités." },
    ],
    rdv: [
      { type: "kine", label: "Séance kiné préventive", detail: "Suivi des déséquilibres identifiés au mois 1. Travail ciblé sur les zones de tension accumulée.", week: 3 },
    ],
  },
  {
    month: "Mois 3", label: "Consolidation",
    goal: "Plein volume stabilisé, affinage du ressenti, premier bilan intermédiaire",
    weeks: [
      { n: 1, type: "charge", vol: "100%", desc: "Volume normal. Commencez à identifier vos séances préférées et celles qui drainent le plus." },
      { n: 2, type: "charge", vol: "100%", desc: "Volume normal. Testez les fourchettes hautes sur UNE session de votre choix cette semaine seulement." },
      { n: 3, type: "charge", vol: "100%", desc: "Volume normal. Troisième semaine consécutive à plein volume — surveillez la FC matinale." },
      { n: 4, type: "deload", vol: "45%", desc: "Décharge + bilan. Semaine idéale pour le contrôle sanguin et la séance kiné — corps au repos, marqueurs plus fiables." },
    ],
    rdv: [
      { type: "bilan", label: "Bilan sanguin 3 mois", detail: "Mêmes marqueurs que M1. Comparez: ferritine en baisse = sous-nutrition. Testostérone en baisse = surcharge. Vitamine D = ajuster supplémentation.", week: 4 },
      { type: "kine", label: "Séance kiné préventive", detail: "Bilan des 3 premiers mois. Correction des compensations installées. Focus tendons si escalade intensive.", week: 4 },
    ],
  },
  {
    month: "Mois 4", label: "Affirmation",
    goal: "Le plan devient naturel — travail sur les détails, les performances, les objectifs spécifiques",
    weeks: [
      { n: 1, type: "charge", vol: "100%", desc: "Volume normal. C'est ici que vous commencez à avoir de vraies données sur votre corps et ses réponses." },
      { n: 2, type: "charge", vol: "100%", desc: "Volume normal. Possibilité d'explorer les fourchettes hautes sur 2 sessions si les signaux sont bons." },
      { n: 3, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 4, type: "deload", vol: "45%", desc: "Décharge. À ce stade vous devriez anticiper la décharge avec plaisir plutôt qu'avec frustration — bon signe." },
    ],
    rdv: [
      { type: "medecin", label: "Médecin du sport", detail: "Consultation complète: ECG effort si pas fait, analyse posturale, discussion du plan sur durée. Point sur les articulations à surveiller (poulies, rotulien, Achille).", week: 2 },
      { type: "kine", label: "Séance kiné préventive", detail: "Focus escalade: poulies et coiffe. Focus vélo: IT band et psoas. Protocole eccentriques si début de tendinopathie.", week: 4 },
    ],
  },
  {
    month: "Mois 5", label: "Maturité",
    goal: "Plan stabilisé long terme — ajustements fins selon les données accumulées",
    weeks: [
      { n: 1, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 2, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 3, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 4, type: "deload", vol: "45%", desc: "Décharge + bilan sanguin 6 mois approche." },
    ],
    rdv: [
      { type: "kine", label: "Séance kiné préventive", detail: "Routine mensuelle installée. Bilan des 5 mois.", week: 4 },
    ],
  },
  {
    month: "Mois 6", label: "Bilan 6 mois",
    goal: "Évaluation complète du cycle — décision: continuer, ajuster, ou changer d'objectif",
    weeks: [
      { n: 1, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 2, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 3, type: "charge", vol: "100%", desc: "Volume normal." },
      { n: 4, type: "deload", vol: "45%", desc: "Grande décharge 6 mois. Idéalement 10 jours si possible — voyager, changer de contexte, récupérer profondément." },
    ],
    rdv: [
      { type: "bilan", label: "Bilan sanguin complet 6 mois", detail: "Panel complet + ajout: cortisol matinal, IGF-1, bilan lipidique. C'est le bilan de référence pour valider ou réviser le plan.", week: 4 },
      { type: "kine", label: "Bilan kiné 6 mois", detail: "Réévaluation posturale complète. Comparaison avec le bilan initial. Identifier ce qui s'est amélioré et ce qui s'est dégradé.", week: 4 },
      { type: "medecin", label: "Consultation médecin du sport 6 mois", detail: "Revue complète. Discussion des données sanguines. Décision éclairée sur la suite: maintien, augmentation, réorientation.", week: 4 },
    ],
  },
];

// ─── MEALS DATA ───────────────────────────────────────────────────────────────

const meals = {
  Lundi: {
    petit_dej: { name: "Bol matcha-avoine-chia", desc: "80g flocons d'avoine + 300ml lait d'avoine + 1 cc matcha + 1 CS chia + banane + miel", prep: "5 min", kcal: 620, tag: "🇯🇵", tip: "Matcha avant VO2max : caféine sans acidité." },
    pre_seance: { name: "Onigiri riz-umeboshi", desc: "150g riz japonais + umeboshi + nori. Formez une boule.", prep: "5 min", kcal: 280, tag: "🇯🇵", tip: "30 min avant le run — glucides ultra digestes." },
    dejeuner: { name: "Bowl tempeh miso-gingembre + riz + edamame", desc: "200g tempeh + miso + gingembre + soja + 150g riz + 100g edamame + carotte + sésame", prep: "20 min", kcal: 820, tag: "🇯🇵", tip: "Protéines fermentées post-effort. Miso = acides aminés complets." },
    collation: { name: "Labneh + za'atar + pita", desc: "3 CS labneh + za'atar + huile d'olive + 1 pita", prep: "2 min", kcal: 380, tag: "🌍", tip: "Protéines lentes + glucides avant le renfo." },
    diner: { name: "Soupe miso ramen légumes + œuf mollet", desc: "Dashi kombu + miso + ramen + bok choy + 2 œufs mollets (7 min) + nori + sésame", prep: "20 min", kcal: 680, tag: "🇯🇵", tip: "Digeste post double session. Dashi = infusion froide kombu 20 min." },
  },
  Mardi: {
    petit_dej: { name: "Tartines seigle-avocat-za'atar", desc: "3 tranches seigle + avocat + za'atar + huile d'olive + citron + piment", prep: "5 min", kcal: 580, tag: "🌍", tip: "Avant Z1 — lipides stables, pas besoin de sucres rapides." },
    dejeuner: { name: "Dal lentilles corail coco-curcuma + riz + raita", desc: "250g lentilles corail + lait de coco + oignon + ail + curcuma + cumin + garam masala. Raita: yaourt + concombre + menthe.", prep: "25 min", kcal: 780, tag: "🌍", tip: "IG modéré = énergie 3–4h pour l'escalade longue." },
    collation_grimpe: { name: "Mix dattes-gingembre-chocolat noir", desc: "10 dattes + 25g cajou + 25g chocolat 70% + gingembre confit", prep: "5 min", kcal: 480, tag: "⚡", tip: "En poche. Mangez toutes les 90 min sur la paroi." },
    diner: { name: "Gyoza légumes-tofu poêlés + sauce ponzu", desc: "Farce: tofu + chou chinois + gingembre + ail + soja. 16 feuilles gyoza. Sauce ponzu.", prep: "35 min", kcal: 720, tag: "🇯🇵", tip: "Congelez la moitié crus." },
  },
  Mercredi: {
    petit_dej: { name: "Smoothie anti-inflam curcuma-mangue-coco", desc: "200g mangue surgelée + yaourt grec + curcuma + gingembre frais + lait de coco + miel + poivre noir", prep: "3 min", kcal: 520, tag: "🌿", tip: "Poivre noir = absorption curcumine ×20." },
    dejeuner: { name: "Shakshuka poivrons ras-el-hanout", desc: "400g tomates + 2 poivrons + oignon + ail + ras-el-hanout + cumin + paprika fumé + 4 œufs pochés + coriandre + pita", prep: "25 min", kcal: 680, tag: "🌍", tip: "Sauce se congèle parfaitement." },
    collation: { name: "Onigiri riz-sésame-nori", desc: "2 onigiris riz vinaigré + sésame noir + nori", prep: "0 min (fait à l'avance)", kcal: 360, tag: "🇯🇵", tip: "1h avant tempo vélo." },
    diner: { name: "Soba froides sauce tahini-soja + tofu grillé", desc: "150g soba + tofu grillé + concombre + carotte + edamame. Sauce: tahini + soja + citron + ail.", prep: "15 min", kcal: 720, tag: "🇯🇵", tip: "Sarrasin = IG bas, protéines complètes. Idéal soir récup." },
  },
  Jeudi: {
    petit_dej: { name: "Porridge avoine-miso-œuf poché (savory)", desc: "80g avoine + eau + miso + 2 œufs pochés + ciboulette + sésame + huile de sésame", prep: "10 min", kcal: 600, tag: "🇯🇵", tip: "Protéines dès le matin pour le trail de l'après-midi." },
    dejeuner: { name: "Poulet teriyaki + riz + salade wakame", desc: "200g poulet marinade teriyaki (soja + mirin + sucre + ail) + 150g riz + wakame + concombre + vinaigre riz + sésame", prep: "20 min", kcal: 780, tag: "🇯🇵🥩", tip: "Viande blanche semaine. Teriyaki = soja + mirin + sucre, 2 min à la casserole." },
    collation: { name: "Dattes + beurre d'amande + cardamome", desc: "8 dattes + 1 CS beurre d'amande + cardamome moulue", prep: "2 min", kcal: 420, tag: "🌍", tip: "Avant trail. Cardamome = digestif à l'effort." },
    diner: { name: "Soupe pho légumes maison + vermicelles", desc: "Bouillon: badiane + cannelle + oignon brûlé + gingembre 30 min. Vermicelles + shiitaké + bok choy + tofu + germes soja + basilic thaï + citron vert.", prep: "35 min", kcal: 640, tag: "🇻🇳", tip: "Bouillon pendant que vous étirez. Se congèle." },
  },
  Vendredi: {
    petit_dej: { name: "Pancakes sarrasin-banane", desc: "100g farine sarrasin + 1 banane + 2 œufs + lait d'avoine + levure. Sirop d'érable + fruits rouges.", prep: "15 min", kcal: 720, tag: "🥞", tip: "Grosse journée — petit-déj costaud obligatoire." },
    pre_sortie: { name: "Rice cake dattes-beurre de cacahuète", desc: "150g riz vinaigré compressé + 4 dattes + beurre de cacahuète. Film plastique.", prep: "10 min (fait la veille)", kcal: 420, tag: "🚴", tip: "Standard peloton pro. 2 galettes + bananes + eau salée pour la longue." },
    dejeuner: { name: "Bowl saumon laqué miso + riz + avocat + pickles", desc: "200g saumon miso (miso + mirin + soja + sucre, 30 min) + four 200°C 12 min + riz + avocat + radis marinés + sésame", prep: "15 min + marinade", kcal: 880, tag: "🇯🇵", tip: "Oméga-3 post grosse journée. Marinade miso = transformation totale d'un filet simple." },
    diner: { name: "Tacos haricots noirs-halloumi-pico de gallo", desc: "Haricots noirs + cumin + chipotle + ail. Halloumi grillé. Pico: tomates + oignon rouge + coriandre + citron vert + piment. 4 tortillas maïs.", prep: "20 min", kcal: 820, tag: "🌮", tip: "Halloumi = protéines + texture viande sans viande." },
  },
  Samedi: {
    petit_dej: { name: "Tartines œufs mimosa-curry + avocat", desc: "3 tranches pain complet + 3 œufs durs écrasés + mayo + curry + avocat + ciboulette", prep: "10 min", kcal: 680, tag: "🌍", tip: "Avant escalade 3–5h — protéines tendons + glucides endurance." },
    collation_grimpe: { name: "Mochi avoine-sésame (fait vendredi soir)", desc: "100g farine riz gluant + eau + miel + sésame noir. Micro-ondes 3×1 min. Bouchées.", prep: "10 min à l'avance", kcal: 380, tag: "🇯🇵", tip: "Glucides rapides, ne colle pas aux doigts secs." },
    dejeuner: { name: "Tagine agneau-pois chiches-citron confit", desc: "200g agneau + pois chiches + oignon + citron confit + olives + cumin + cannelle + ras-el-hanout. 30 min. Semoule.", prep: "35 min", kcal: 880, tag: "🌍🥩", tip: "Viande rouge semaine. Agneau = viande rouge la moins inflammatoire." },
    diner: { name: "Miso soup + onigiri + tofu froid (hiyayakko)", desc: "Soupe miso légère + tofu soyeux + 2 onigiris umeboshi + sauce soja + gingembre + sésame", prep: "15 min", kcal: 580, tag: "🇯🇵", tip: "Post yoga — digeste. Hiyayakko = zéro cuisson." },
  },
  Dimanche: {
    petit_dej: { name: "Overnight oats matcha-chia-coco (préparé samedi soir)", desc: "100g avoine + lait de coco + chia + matcha + sirop d'érable + mangue", prep: "0 min", kcal: 720, tag: "🇯🇵", tip: "Prêt dans le frigo. Le matin d'une grosse sortie, vous ne voulez pas réfléchir." },
    ravitaillement: { name: "Kit terrain: onigiri + bananes + mix oriental", desc: "3 onigiris sésame + 3 bananes + sachet figues sèches + amandes + chocolat 70% + gingembre confit", prep: "15 min (samedi soir)", kcal: 1000, tag: "🏔️", tip: "60–80g glucides/heure après H+1. Pour 5–7h: tout le kit + eau salée." },
    dejeuner: { name: "Ramen maison bouillon + œuf mariné", desc: "Bouillon soja-mirin-ail-gingembre + nouilles ramen + maïs + nori + œuf mariné (soja+mirin 2h) + tofu rôti ou chashu", prep: "30 min", kcal: 980, tag: "🇯🇵", tip: "Repas post-longue sortie ultime. Glucides + sodium + umami." },
    diner: { name: "Soupe légumes rôtis + pain + fromage", desc: "Légumes rôtis four mixés + bouillon + curry doux. 2 tranches pain + fromage.", prep: "30 min", kcal: 580, tag: "🍵", tip: "Dîner léger intentionnel. La récup est faite par le ramen." },
  },
};

const weeklyGroceries = [
  { cat: "🥚 Protéines végétales & œufs", items: ["Œufs (18)", "Tofu ferme (2×200g)", "Tofu soyeux (1×300g)", "Tempeh (200g)", "Halloumi (200g)", "Edamame surgelés (300g)"] },
  { cat: "🐟 Viandes (2×/sem uniquement)", items: ["Escalope poulet (200g — jeudi)", "Épaule agneau (200g — samedi)", "Saumon (200g — vendredi)"] },
  { cat: "🌾 Féculents & légumineuses", items: ["Riz japonais grain court (1kg)", "Riz basmati (500g)", "Flocons d'avoine (800g)", "Nouilles ramen (200g)", "Soba sarrasin (200g)", "Vermicelles de riz (200g)", "Farine sarrasin (300g)", "Farine riz gluant (200g)", "Lentilles corail (400g)", "Pois chiches (2×400g)", "Haricots noirs (400g)", "Semoule couscous (300g)", "Feuilles gyoza (1 paquet)", "Tortillas maïs (6)", "Pain seigle (1 paquet)", "Pain complet (1 miche)", "Pita (1 paquet)"] },
  { cat: "🥑 Lipides & oléagineux", items: ["Avocats (4)", "Beurre de cacahuète (400g)", "Beurre d'amande (200g)", "Tahini (200g)", "Huile d'olive", "Huile de sésame", "Noix de cajou (100g)", "Amandes (100g)", "Chocolat 70% (200g)", "Lait de coco (3 boîtes)"] },
  { cat: "🥦 Légumes frais & surgelés", items: ["Bok choy ou épinards (400g)", "Chou chinois (½)", "Concombre (3)", "Carotte (500g)", "Poivron rouge (3)", "Tomates (500g)", "Tomates concassées (2×400g)", "Courgette (2)", "Shiitaké (200g)", "Radis (1 botte)", "Oignon rouge (2)", "Oignon jaune (filet)", "Ail (2 têtes)", "Gingembre frais (gros morceau)", "Patates douces (1kg)"] },
  { cat: "🍌 Fruits", items: ["Bananes (10)", "Mangue surgelée (400g)", "Fruits rouges surgelés (400g)", "Citrons jaunes (4)", "Citrons verts (4)", "Dattes (400g)", "Figues sèches (150g)"] },
  { cat: "🧪 Épicerie japonaise", items: ["Miso (1 pot)", "Sauce soja", "Mirin", "Vinaigre de riz", "Sésame noir et blanc", "Nori (1 paquet)", "Wakame sèche", "Kombu (dashi)", "Graines de chia (200g)", "Matcha (petit pot)", "Umeboshi (petit pot)"] },
  { cat: "🌶 Épicerie orientale & mexicaine", items: ["Za'atar", "Ras-el-hanout", "Cumin", "Garam masala", "Cardamome", "Paprika fumé", "Chipotle en poudre", "Piment de Cayenne", "Cannelle", "Curcuma", "Coriandre fraîche/surgelée", "Basilic thaï", "Citron confit (pot)", "Miel (400g)", "Sirop d'érable"] },
  { cat: "🧀 Laitiers & divers", items: ["Yaourt grec (2×200g)", "Labneh ou yaourt à égoutter", "Parmesan (100g)", "Fromage (1 part)", "Lait d'avoine (2L)"] },
];

const monthlyExtras = [
  { cat: "📦 Stocks de fond (mensuel)", items: ["Riz japonais 3kg (épicerie asiatique)", "Flocons d'avoine 3kg", "Lentilles corail 1kg", "Pois chiches 4 boîtes", "Haricots noirs 4 boîtes", "Beurre de cacahuète 1kg", "Huile d'olive 3L", "Huile de sésame 500ml", "Sauce soja grande bouteille", "Mirin 500ml", "Vinaigre de riz 500ml", "Dattes 1kg", "Chocolat noir 70% 400g", "Miel 1kg", "Chia 500g", "Tahini 400g", "Lait de coco 6 boîtes", "Kombu séché (dure 6 mois)"] },
  { cat: "❄️ Congélateur", items: ["Bananes mûres épluchées → smoothies/pancakes", "Mangue en dés", "Gingembre râpé en glaçons", "Gyoza maison crus", "Soupe dal ou pho en portions 500ml", "Sauce shakshuka", "Portions saumon (achat grande surface, congeler)"] },
  { cat: "🍱 Batch cooking dimanche (1h)", items: ["Riz japonais 1kg cuit → frigo 4 jours", "Œufs marinés ×6 → soja + mirin + eau", "Dashi kombu 2L → infusion froide 30 min", "Pickles rapides radis/concombre", "Mix trail dattes-noix-gingembre", "Onigiri ×8 → frigo ou congélo", "Rice cakes vélo si sortie vendredi/dimanche"] },
  { cat: "🏪 Où acheter (Grenoble)", items: ["Épicerie asiatique → riz, miso, mirin, nori, gyoza, tofu, soba, wakame — 30–40% moins cher", "Épicerie orientale → za'atar, ras-el-hanout, citrons confits, dattes vrac, tahini", "Grande surface → légumes, avoine, lentilles, yaourts, œufs, viande", "Bio (si budget) → tempeh, halloumi, lait de coco qualité"] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const intensityColor = { low: "#4caf50", medium: "#26a69a", "medium-high": "#2196f3", high: "#ff9800", "very-high": "#e91e63" };
const intensityLabel = { low: "Décharge", medium: "Modéré", "medium-high": "Modéré+", high: "Élevé", "very-high": "Max" };
const rdvColor = { bilan: "#7c4dff", kine: "#00bcd4", medecin: "#e91e63" };
const rdvIcon = { bilan: "🩸", kine: "🤲", medecin: "🩺" };
const tagLabel = { "🇯🇵": "JP", "🌍": "Oriental", "🌮": "Mex", "🇻🇳": "Viet", "🌿": "Anti-inflam", "⚡": "Sport", "🚴": "Vélo", "🏔️": "Terrain", "🥞": "Maison", "🍵": "Léger", "🥩": "Viande" };

const mealOrder = [
  ["petit_dej", "Petit-déjeuner"],
  ["pre_seance", "Pré-séance"],
  ["pre_sortie", "Pré-sortie"],
  ["dejeuner", "Déjeuner"],
  ["collation", "Collation"],
  ["collation_grimpe", "Collation escalade"],
  ["ravitaillement", "🏔️ Ravitaillement"],
  ["diner", "Dîner"],
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("meals");
  const [activeDay, setActiveDay] = useState("Lundi");
  const [activeMonth, setActiveMonth] = useState(0);
  const [deloadMode, setDeloadMode] = useState(false);

  const training = deloadMode ? trainingLoadDeload[activeDay] : trainingLoad[activeDay];
  const dayMeals = meals[activeDay];
  const totalKcal = Object.values(dayMeals).reduce((s, m) => s + (m.kcal || 0), 0);
  const month = months[activeMonth];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0d0f14", minHeight: "100vh", color: "#e0e0e0" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0d0f14, #151a24)", padding: "20px 16px 0", borderBottom: "1px solid #1e2535" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#4db6ac", marginBottom: 4 }}>Plan intégré · Sport + Nutrition + Médical</div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#fff" }}>Training & Meal Plan</h1>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#546e7a" }}>Périodisation 3:1 · 2× viande/sem · Fusion JP/FR/Oriental/Mex · Suivi médical intégré</p>
          <div style={{ display: "flex" }}>
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={{
                flex: 1, padding: "9px 4px", border: "none", background: "none", cursor: "pointer",
                fontSize: 11, fontWeight: activeTab === k ? 700 : 400,
                color: activeTab === k ? "#4db6ac" : "#546e7a",
                borderBottom: activeTab === k ? "2px solid #4db6ac" : "2px solid transparent",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "14px 14px 40px" }}>

        {/* ── MEALS TAB ── */}
        {activeTab === "meals" && (
          <>
            {/* Deload toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, background: "#151a24", borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontSize: 12, color: "#9e9e9e" }}>Mode semaine :</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[false, true].map(d => (
                  <button key={String(d)} onClick={() => setDeloadMode(d)} style={{
                    padding: "5px 14px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                    background: deloadMode === d ? (d ? "#4caf50" : "#ff9800") : "#1e2535",
                    color: deloadMode === d ? "white" : "#666",
                  }}>{d ? "🔋 Décharge (sem 4)" : "⚡ Charge (sem 1–3)"}</button>
                ))}
              </div>
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", gap: 5, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
              {DAYS.map(day => (
                <button key={day} onClick={() => setActiveDay(day)} style={{
                  padding: "7px 12px", borderRadius: 18, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  fontSize: 11, fontWeight: activeDay === day ? 700 : 400,
                  background: activeDay === day ? intensityColor[training.intensity] : "#151a24",
                  color: activeDay === day ? "white" : "#777",
                  boxShadow: activeDay === day ? `0 2px 8px ${intensityColor[training.intensity]}55` : "none",
                }}>{day}</button>
              ))}
            </div>

            {/* Training banner */}
            <div style={{ background: "#151a24", borderRadius: 12, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${intensityColor[training.intensity]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Séances</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{training.label}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{training.detail}</div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 10 }}>
                  <span style={{ background: intensityColor[training.intensity], color: "#fff", padding: "2px 9px", borderRadius: 8, fontSize: 10, fontWeight: 700, display: "block", marginBottom: 3 }}>{intensityLabel[training.intensity]}</span>
                  <span style={{ fontSize: 13, color: "#ff9800", fontWeight: 700 }}>~{training.kcal.toLocaleString()} kcal</span>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#4db6ac", background: "#0d0f14", borderRadius: 6, padding: "5px 10px" }}>
                🎯 {training.focus}
                {training.meat && !deloadMode && <span style={{ color: "#ff9800", marginLeft: 8 }}>· {training.meatType}</span>}
              </div>
            </div>

            {/* Meals */}
            {mealOrder.map(([key, label]) => {
              const meal = dayMeals[key];
              if (!meal) return null;
              const adjustedKcal = deloadMode ? Math.round(meal.kcal * 0.75) : meal.kcal;
              return (
                <div key={key} style={{ background: "#151a24", borderRadius: 10, padding: "13px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: "#555" }}>{label}</span>
                        <span style={{ background: "#0d0f14", border: "1px solid #1e2535", borderRadius: 6, padding: "1px 6px", fontSize: 9, color: "#888" }}>{meal.tag} {tagLabel[meal.tag]}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.3 }}>{meal.name}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                      <div style={{ fontSize: 14, color: "#ff9800", fontWeight: 700 }}>{adjustedKcal}</div>
                      <div style={{ fontSize: 9, color: "#555" }}>kcal</div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>⏱ {meal.prep}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#7a8a9a", lineHeight: 1.6, marginBottom: meal.tip ? 8 : 0 }}>{meal.desc}</div>
                  {meal.tip && (
                    <div style={{ background: "#0d0f14", borderLeft: "2px solid #4db6ac", borderRadius: "0 6px 6px 0", padding: "6px 10px", fontSize: 11, color: "#4db6ac" }}>💡 {meal.tip}</div>
                  )}
                </div>
              );
            })}

            {/* Total */}
            <div style={{ background: `${intensityColor[training.intensity]}18`, border: `1px solid ${intensityColor[training.intensity]}33`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Total estimé</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{deloadMode ? Math.round(totalKcal * 0.75).toLocaleString() : totalKcal.toLocaleString()} kcal</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
                Objectif : ~{training.kcal.toLocaleString()} kcal
                <span style={{ marginLeft: 8, color: "#4caf50" }}>
                  {deloadMode ? "· Semaine de décharge — portions réduites" : ""}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── TRAINING PLAN TAB ── */}
        {activeTab === "training" && (
          <>
            {/* Month selector */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
              {months.map((m, i) => (
                <button key={i} onClick={() => setActiveMonth(i)} style={{
                  padding: "6px 12px", borderRadius: 16, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  fontSize: 11, fontWeight: activeMonth === i ? 700 : 400,
                  background: activeMonth === i ? "#4db6ac" : "#151a24",
                  color: activeMonth === i ? "#0d0f14" : "#666",
                }}>{m.month}</button>
              ))}
            </div>

            {/* Month header */}
            <div style={{ background: "#151a24", borderRadius: 12, padding: "14px", marginBottom: 12, borderTop: "2px solid #4db6ac" }}>
              <div style={{ fontSize: 11, color: "#4db6ac", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{month.month} — {month.label}</div>
              <div style={{ fontSize: 13, color: "#9e9e9e", lineHeight: 1.6 }}>{month.goal}</div>
            </div>

            {/* Weeks */}
            {month.weeks.map(week => (
              <div key={week.n} style={{
                background: "#151a24", borderRadius: 10, padding: "13px 14px", marginBottom: 8,
                borderLeft: `3px solid ${week.type === "deload" ? "#4caf50" : "#ff9800"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Semaine {week.n}</span>
                    <span style={{
                      background: week.type === "deload" ? "#4caf5022" : "#ff980022",
                      color: week.type === "deload" ? "#4caf50" : "#ff9800",
                      border: `1px solid ${week.type === "deload" ? "#4caf5044" : "#ff980044"}`,
                      borderRadius: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700
                    }}>{week.type === "deload" ? "🔋 DÉCHARGE" : "⚡ CHARGE"}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: week.type === "deload" ? "#4caf50" : "#ff9800" }}>{week.vol}</div>
                </div>
                <div style={{ fontSize: 12, color: "#7a8a9a", lineHeight: 1.6 }}>{week.desc}</div>

                {/* Volume breakdown for deload */}
                {week.type === "deload" && (
                  <div style={{ marginTop: 8, background: "#0d0f14", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#4caf50", fontWeight: 700, marginBottom: 5 }}>Volumes décharge (45% du normal) :</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {[
                        "Run: 20–25 min Z1 seulement",
                        "Escalade: 1–2h max, voies faciles",
                        "Vélo: balade Z1 1h",
                        "Trail: marche active 5k",
                        "Dimanche: sortie libre 1h30 max",
                      ].map(item => (
                        <span key={item} style={{ background: "#4caf5015", border: "1px solid #4caf5030", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#81c784" }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* RDV médico-sportifs */}
            {month.rdv.length > 0 && (
              <>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#546e7a", margin: "16px 0 8px" }}>Rendez-vous prévention</div>
                {month.rdv.map((rdv, i) => (
                  <div key={i} style={{
                    background: "#151a24", borderRadius: 10, padding: "12px 14px", marginBottom: 8,
                    borderLeft: `3px solid ${rdvColor[rdv.type]}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{rdvIcon[rdv.type]}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{rdv.label}</div>
                          <div style={{ fontSize: 10, color: rdvColor[rdv.type], marginTop: 1 }}>Semaine {rdv.week} du mois</div>
                        </div>
                      </div>
                      <span style={{
                        background: `${rdvColor[rdv.type]}22`, color: rdvColor[rdv.type],
                        border: `1px solid ${rdvColor[rdv.type]}44`,
                        borderRadius: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap"
                      }}>
                        {rdv.type === "bilan" ? "Bilan sanguin" : rdv.type === "kine" ? "Kiné/Ostéo" : "Médecin sport"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7a8a9a", lineHeight: 1.6 }}>{rdv.detail}</div>
                  </div>
                ))}
              </>
            )}

            {/* Signaux d'alerte */}
            <div style={{ background: "#1a0f14", border: "1px solid #e91e6333", borderRadius: 10, padding: "13px 14px", marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#e91e63", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>⚠️ Signaux d'arrêt automatique</div>
              {[
                ["FC repos +8 bpm / matin pendant 2 jours consécutifs", "Réduire d'un jour, passer en mode décharge anticipée"],
                ["Motivation à l'entraînement < 4/10 pendant 3 jours", "Décharge immédiate, ne pas forcer"],
                ["Douleur tendineuse persistante > 48h", "Stop escalade ou run selon localisation, consulter kiné"],
                ["Qualité du sommeil dégradée > 1 semaine", "Bilan: alimentation, stress, volume — réduire le volume 30%"],
                ["Libido en baisse notable > 2 semaines", "Bilan sanguin immédiat (testostérone, cortisol)"],
              ].map(([signal, action]) => (
                <div key={signal} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1e1014" }}>
                  <div style={{ fontSize: 12, color: "#ef9a9a", marginBottom: 2 }}>🚨 {signal}</div>
                  <div style={{ fontSize: 11, color: "#546e7a" }}>→ {action}</div>
                </div>
              ))}
            </div>

            {/* Recovery stack */}
            <div style={{ background: "#0f1a14", border: "1px solid #4caf5033", borderRadius: 10, padding: "13px 14px", marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#4caf50", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🔄 Stack récupération quotidien</div>
              {[
                ["Immersion froide", "30s → 5 min · Matin ou post-effort · Active nerf vague, réduit inflammation"],
                ["Auto-massage", "Soir quasi-quotidien · Rouleau + balle · Focus zones de charge du jour"],
                ["Méditation/Visualisation", "10–20 min · Régulation cortisol · Qualité du sommeil"],
                ["Yoga/Nage méditatifs", "Ne jamais transformer ces séances en effort · Ce sont des décharges SNC"],
                ["Sommeil", "8h minimum non négociable · C'est ici que se fait toute la récupération"],
              ].map(([name, detail]) => (
                <div key={name} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
                  <span style={{ fontSize: 11, color: "#4caf50", fontWeight: 700, whiteSpace: "nowrap", minWidth: 140 }}>{name}</span>
                  <span style={{ fontSize: 11, color: "#546e7a", lineHeight: 1.5 }}>{detail}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── GROCERIES TAB ── */}
        {activeTab === "groceries" && (
          <>
            <div style={{ background: "#151a24", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#7986cb", borderLeft: "3px solid #7986cb" }}>
              🛒 Courses pour <strong>une semaine</strong>. Budget ~65–85€. Achetez miso/soja/riz en épicerie asiatique (30–40% moins cher).
            </div>
            {weeklyGroceries.map(s => (
              <div key={s.cat} style={{ background: "#151a24", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 8 }}>{s.cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {s.items.map(item => (
                    <span key={item} style={{ background: "#0d0f14", border: "1px solid #1e2535", borderRadius: 14, padding: "3px 10px", fontSize: 11, color: "#bbb" }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── MONTHLY STOCK TAB ── */}
        {activeTab === "monthly" && (
          <>
            <div style={{ background: "#151a24", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#a5d6a7", borderLeft: "3px solid #4caf50" }}>
              📦 Stock mensuel + organisation. Investissement initial ~60€, renouvellement partiel. Batch dimanche = 45 min de cuisine économisées chaque matin.
            </div>
            {monthlyExtras.map(s => (
              <div key={s.cat} style={{ background: "#151a24", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 8 }}>{s.cat}</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ fontSize: 12, color: "#7a8a9a", marginBottom: 5, lineHeight: 1.55 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Suppléments */}
            <div style={{ background: "#0f1420", border: "1px solid #7c4dff44", borderRadius: 10, padding: "13px 14px", marginTop: 4 }}>
              <div style={{ fontSize: 11, color: "#7c4dff", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>💊 Suppléments recommandés</div>
              {[
                ["Magnésium bisglycinate", "300–400mg/soir · Récupération musculaire + qualité du sommeil · Forme bisglycinate = meilleure absorption"],
                ["Vitamine D3 + K2", "2000–4000 UI/jour · Surtout octobre–avril à Grenoble · K2 pour la fixation osseuse"],
                ["Collagène hydrolysé + Vit C", "10g + 500mg vitamine C, 30–60 min avant les sessions escalade · Synthèse tendineuse"],
                ["Oméga-3 (si pas de saumon 2×/sem)", "2g EPA+DHA/jour · Anti-inflammatoire systémique"],
                ["Sel de mer (électrolytes DIY)", "Dans l'eau de boisson sur les longues sorties · Évite les crampes et pertes de sodium"],
              ].map(([name, detail]) => (
                <div key={name} style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#b39ddb", fontWeight: 600 }}>{name}</span>
                  <div style={{ fontSize: 11, color: "#546e7a", lineHeight: 1.5, marginTop: 1 }}>{detail}</div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
