import {EXTRA_THEMES,EXTRA_LESSONS,EXTRA_META} from './curriculum-extra.js';
import {BASE_TEACHING,fallbackTeaching} from './curriculum-teaching.js';
import {ADVANCED_THEMES,ADVANCED_LESSONS} from './curriculum-advanced.js';

export const LEVELS=[
  {id:'pre-a1',label:'Pré-A1',title:'Survie',range:'0 → premières phrases',description:'Comprendre et se faire comprendre dans les situations les plus simples.'},
  {id:'a1',label:'A1',title:'Bases',range:'phrases simples',description:'Se présenter, demander, acheter, réserver, parler de sa vie quotidienne.'},
  {id:'a2',label:'A2',title:'Voyage autonome',range:'échanges courants',description:'Gérer la plupart des situations simples de voyage et de vie quotidienne.'},
  {id:'b1',label:'B1',title:'Autonomie',range:'anglais utile',description:'Comprendre l’essentiel, raconter, expliquer et travailler dans des situations habituelles.'},
  {id:'b2',label:'B2',title:'Courant',range:'anglais naturel',description:'Comprendre un débit normal, argumenter et suivre des contenus professionnels.'},
  {id:'c1',label:'C1',title:'Avancé',range:'nuance & précision',description:'Comprendre l’implicite, les accents et des contenus rapides et complexes.'},
  {id:'toeic990',label:'990',title:'Précision TOEIC',range:'950 → 990',description:'Éliminer les dernières erreurs de vitesse, pièges et inférences.'}
];

export const THEMES=[
  {id:'survival',title:'Premiers secours linguistiques',icon:'spark',level:'pre-a1',summary:'Hello, please, thank you, pardon, répéter, parler plus lentement.',lessons:['hello','repeat']},
  {id:'identity',title:'Se présenter',icon:'person',level:'pre-a1',summary:'Nom et premières informations personnelles.',lessons:['introduce']},
  {id:'numbers',title:'Nombres, prix & heure',icon:'number',level:'pre-a1',summary:'0–1000, 13/30, prix, téléphone, chambre, quai, heure.',lessons:['numbers']},
  {id:'colors',title:'Couleurs & objets',icon:'palette',level:'pre-a1',summary:'Décrire simplement ce que tu vois et ce que tu cherches.',lessons:['colors']},
  {id:'food',title:'Boire & manger',icon:'cup',level:'pre-a1',summary:'Commander, comprendre une question, demander l’addition.',lessons:['food','restaurant']},
  {id:'hotel',title:'Hôtel',icon:'bed',level:'pre-a1',summary:'Réservation, chambre, petit-déjeuner, Wi-Fi, check-in/out.',lessons:['hotel']},
  {id:'travel',title:'Transport & directions',icon:'plane',level:'a1',summary:'Station, quai, horaires, retards, gauche/droite, taxi.',lessons:['directions','transport']},
  {id:'shopping',title:'Achats',icon:'bag',level:'a1',summary:'Prix, taille, couleur, essayer, payer, reçu.',lessons:['shopping']},
  {id:'smalltalk',title:'Small talk',icon:'bubble',level:'a1',summary:'Météo, loisirs, famille, week-end et conversations sociales.',lessons:['smalltalk']},
  {id:'work',title:'Anglais professionnel',icon:'briefcase',level:'a2',summary:'Téléphone, e-mail, réunions, agenda, délais, clients.',lessons:['phone','email','meetings']},
  {id:'idioms',title:'Idiomes & expressions',icon:'quote',level:'a2',summary:'Expressions naturelles fréquentes, sans traduction mot à mot.',lessons:['idioms-common']},
  {id:'phrasal',title:'Phrasal verbs',icon:'arrows',level:'a2',summary:'Pick up, find out, set up, look forward to… en contexte.',lessons:['phrasal-common']},
  {id:'collocations',title:'Collocations',icon:'link',level:'b1',summary:'Make a decision, meet a deadline, take responsibility…',lessons:['collocations-business']},
  {id:'pronunciation',title:'Comprendre l’anglais naturel',icon:'wave',level:'b1',summary:'Contractions, weak forms, connected speech et accents.',lessons:['connected-speech','numbers-listening']},
  {id:'falsefriends',title:'Faux amis français',icon:'warning',level:'b1',summary:'Actually, eventually, sensible, comprehensive…',lessons:['false-friends']},
  ...EXTRA_THEMES,
  ...ADVANCED_THEMES
];

export const LESSONS={
  hello:{title:'Hello!',level:'pre-a1',minutes:6,theme:'survival',goal:'Saluer, remercier et prendre congé.',words:['hello','hi','good morning','please','thank you','sorry','goodbye'],examples:['Hello!','Good morning.','Thank you very much.','Sorry.','Goodbye!']},
  repeat:{title:'Je n’ai pas compris',level:'pre-a1',minutes:6,theme:'survival',goal:'Faire répéter ou ralentir.',words:['I don’t understand','Can you repeat, please?','Could you speak more slowly?','Excuse me'],examples:['I don’t understand.','Can you repeat, please?','Could you speak more slowly?']},
  introduce:{title:'Je me présente',level:'pre-a1',minutes:8,theme:'identity',goal:'Dire son nom, son pays et demander celui de l’autre.',words:['My name is…','What’s your name?','I’m from France','Where are you from?','How old are you?'],examples:['My name is Alex.','I’m from France.','What’s your name?','Where are you from?']},
  numbers:{title:'Nombres essentiels',level:'pre-a1',minutes:10,theme:'numbers',goal:'Comprendre nombres, prix et numéros.',words:['one','two','ten','thirteen','thirty','fifty','hundred','pounds'],examples:['Room thirteen.','Thirty pounds.','It’s thirteen thirty.','Platform twelve.']},
  colors:{title:'Couleurs & objets',level:'pre-a1',minutes:7,theme:'colors',goal:'Identifier une couleur et un objet simple.',words:['red','blue','green','black','white','bag','phone','key'],examples:['It’s a blue bag.','This is my key.','The phone is black.']},
  food:{title:'Je voudrais…',level:'pre-a1',minutes:8,theme:'food',goal:'Demander à boire ou à manger poliment.',words:['water','coffee','tea','bread','I’d like…','Can I have…?'],examples:['I’d like a coffee, please.','Can I have some water?','That’s all, thank you.']},
  restaurant:{title:'Au restaurant',level:'pre-a1',minutes:9,theme:'food',goal:'Commander et demander l’addition.',words:['menu','starter','main course','dessert','bill'],examples:['Could we have the bill, please?','I’d like the chicken.','Can I see the menu?']},
  hotel:{title:'À l’hôtel',level:'pre-a1',minutes:10,theme:'hotel',goal:'Faire un check-in et poser les questions essentielles.',words:['reservation','room','breakfast','Wi-Fi','key','check-in','check-out'],examples:['I have a reservation.','I’d like a room for two nights.','What time is breakfast?','Where is my room?']},
  directions:{title:'Demander son chemin',level:'a1',minutes:9,theme:'travel',goal:'Comprendre gauche, droite et tout droit.',words:['left','right','straight ahead','near','far','station'],examples:['Where is the station?','Turn left.','Go straight ahead.']},
  transport:{title:'Train, bus, avion',level:'a1',minutes:10,theme:'travel',goal:'Comprendre horaires, quai, porte et retard.',words:['platform','gate','delay','departure','arrival','ticket'],examples:['Which platform?','What time does the train leave?','The flight is delayed.']},
  shopping:{title:'Faire un achat',level:'a1',minutes:9,theme:'shopping',goal:'Demander prix, taille et payer.',words:['How much is it?','size','cash','card','receipt','try on'],examples:['How much is it?','Can I try this on?','Can I pay by card?']},
  smalltalk:{title:'Small talk',level:'a1',minutes:10,theme:'smalltalk',goal:'Tenir une conversation légère.',words:['weather','weekend','family','hobby','work'],examples:['How was your weekend?','What do you do?','Nice weather today.']},
  phone:{title:'Au téléphone',level:'a2',minutes:10,theme:'work',goal:'Se présenter, transférer et laisser un message.',words:['speaking','hold on','put you through','leave a message'],examples:['Alex speaking.','Can I leave a message?','I’ll put you through.']},
  email:{title:'E-mails professionnels',level:'a2',minutes:12,theme:'work',goal:'Comprendre et écrire un e-mail simple.',words:['regarding','attached','confirm','available','deadline'],examples:['Please find the document attached.','Could you confirm your availability?']},
  meetings:{title:'Réunions',level:'a2',minutes:12,theme:'work',goal:'Comprendre agenda, action et décision.',words:['agenda','minutes','action item','deadline','decision'],examples:['Let’s move to the next item.','Who will take this action?']},
  'idioms-common':{title:'Idiomes fréquents',level:'a2',minutes:10,theme:'idioms',goal:'Comprendre des expressions courantes en contexte.',words:['a piece of cake','once in a while','on the same page','under the weather'],examples:['The test was a piece of cake.','Let’s make sure we’re on the same page.']},
  'phrasal-common':{title:'Phrasal verbs essentiels',level:'a2',minutes:12,theme:'phrasal',goal:'Comprendre les verbes à particule les plus utiles.',words:['pick up','find out','set up','look for','look forward to'],examples:['I’ll pick you up at eight.','We need to find out what happened.']},
  'collocations-business':{title:'Collocations professionnelles',level:'b1',minutes:12,theme:'collocations',goal:'Parler plus naturellement avec les bonnes associations de mots.',words:['make a decision','meet a deadline','take responsibility','raise a question'],examples:['We need to make a decision today.','Can we meet the deadline?']},
  'connected-speech':{title:'Connected speech',level:'b1',minutes:12,theme:'pronunciation',goal:'Reconnaître les mots quand ils se lient et se réduisent.',words:['gonna','wanna','could you','did you','have to'],examples:['What are you going to do?','Could you send it today?']},
  'numbers-listening':{title:'13 ou 30 ?',level:'b1',minutes:8,theme:'pronunciation',goal:'Éliminer les confusions de nombres à l’oral.',words:['thirteen','thirty','fourteen','forty','fifteen','fifty'],examples:['Room thirteen.','Thirty dollars.','Gate fourteen.']},
  'false-friends':{title:'Faux amis',level:'b1',minutes:10,theme:'falsefriends',goal:'Éviter les erreurs typiques des francophones.',words:['actually','eventually','sensible','library','attend'],examples:['Actually, I disagree.','She attended the meeting.']},
  ...EXTRA_LESSONS,
  ...ADVANCED_LESSONS
};

Object.assign(LESSONS,{
  alphabet:{title:'Alphabet & lettres',level:'pre-a1',minutes:7,theme:'identity',goal:'Reconnaître les lettres et commencer à épeler.',words:['letter','alphabet','A','B','C','spell'],examples:['How do you spell that?','My first name starts with A.']},
  spelling:{title:'Épeler son nom',level:'pre-a1',minutes:8,theme:'identity',goal:'Épeler un nom, un prénom ou une adresse e-mail.',words:['spell','first name','last name','double','at','dot'],examples:['How do you spell your last name?','It’s M-A-R-T-I-N.']},
  contact:{title:'Téléphone & e-mail',level:'pre-a1',minutes:8,theme:'identity',goal:'Donner et comprendre des coordonnées simples.',words:['phone number','email address','address','at','dot'],examples:['What’s your phone number?','My email address is alex@example.com.']},
  'time-basic':{title:'Dire l’heure',level:'pre-a1',minutes:9,theme:'numbers',goal:'Comprendre et donner une heure simple.',words:["o'clock",'half past','quarter past','morning','evening'],examples:["It’s three o’clock.","It’s half past seven."]},
  'days-dates':{title:'Jours & dates',level:'pre-a1',minutes:9,theme:'numbers',goal:'Comprendre les jours, mois et dates utiles.',words:['Monday','Tuesday','January','today','tomorrow'],examples:['Today is Monday.','My booking is for 12 May.']},
  'family-basic':{title:'Famille & personnes',level:'pre-a1',minutes:8,theme:'everyday',goal:'Parler très simplement de sa famille.',words:['family','mother','father','child','partner'],examples:['This is my family.','I have two children.']},
  'basic-verbs':{title:'Verbes indispensables',level:'pre-a1',minutes:9,theme:'everyday',goal:'Utiliser quelques verbes essentiels pour exprimer un besoin.',words:['want','need','like','go','come'],examples:['I need help.','I want some water.']},
  emergency:{title:'Demander de l’aide',level:'pre-a1',minutes:9,theme:'everyday',goal:'Réagir à un problème simple ou une urgence.',words:['help','doctor','police','pharmacy','lost'],examples:['I need help.','Where is the nearest pharmacy?']},

  'be-have':{title:'Be & have',level:'a1',minutes:10,theme:'grammar-a1',goal:'Construire les phrases les plus fréquentes avec être et avoir.',words:['be','have','am','is','are'],examples:['I am tired.','She has a car.']},
  articles:{title:'A, an, the',level:'a1',minutes:9,theme:'grammar-a1',goal:'Choisir l’article de base devant un nom.',words:['a','an','the','article'],examples:['I need a taxi.','The station is near the hotel.']},
  'there-is':{title:'There is / there are',level:'a1',minutes:9,theme:'grammar-a1',goal:'Dire ce qu’il y a dans un lieu.',words:['there is','there are','some','any'],examples:['There is a café nearby.','There are two rooms upstairs.']},
  'present-simple':{title:'Présent simple',level:'a1',minutes:11,theme:'grammar-a1',goal:'Parler de ses habitudes et faits réguliers.',words:['work','live','like','play','usually'],examples:['I work in Paris.','She works every day.']},
  'questions-basic':{title:'Poser une question',level:'a1',minutes:11,theme:'grammar-a1',goal:'Construire des questions simples avec do/does et les mots interrogatifs.',words:['do','does','where','when','why'],examples:['Where do you live?','What time does it start?']},
  'daily-routine':{title:'Routine quotidienne',level:'a1',minutes:10,theme:'everyday-a1',goal:'Décrire une journée ordinaire.',words:['wake up','start work','have lunch','finish','go home'],examples:['I start work at nine.','I have lunch at twelve.']},
  home:{title:'Maison & pièces',level:'a1',minutes:9,theme:'everyday-a1',goal:'Décrire simplement son logement.',words:['house','flat','kitchen','bedroom','bathroom'],examples:['The kitchen is downstairs.','There are two bedrooms.']},
  weather:{title:'Météo',level:'a1',minutes:8,theme:'everyday-a1',goal:'Comprendre et faire un commentaire simple sur la météo.',words:['sunny','cloudy','rainy','cold','warm'],examples:['It’s sunny today.','It’s going to rain.']},
  health:{title:'Santé & symptômes simples',level:'a1',minutes:10,theme:'health',goal:'Dire qu’on ne va pas bien et demander de l’aide.',words:['sick','pain','headache','medicine','appointment'],examples:['I have a headache.','I need to see a doctor.']},
  'can-cant':{title:'Can / can’t',level:'a1',minutes:9,theme:'grammar-a1',goal:'Exprimer une capacité, possibilité ou demande simple.',words:['can','can’t','help','use','speak'],examples:['Can you help me?','I can speak a little English.']},
  'frequency':{title:'Always, often, sometimes',level:'a1',minutes:9,theme:'grammar-a1',goal:'Dire à quelle fréquence quelque chose arrive.',words:['always','often','sometimes','rarely','never'],examples:['I often take the train.','She never works on Sunday.']},

  'past-simple':{title:'Parler du passé',level:'a2',minutes:12,theme:'grammar-a2',goal:'Raconter simplement une action terminée.',words:['went','saw','had','did','yesterday'],examples:['I went to London yesterday.','We had dinner at eight.']},
  'future-plans':{title:'Parler du futur',level:'a2',minutes:11,theme:'grammar-a2',goal:'Exprimer un projet ou une décision future.',words:['going to','will','tomorrow','next week'],examples:['I’m going to visit London.','I’ll call you tomorrow.']},
  'present-continuous':{title:'Présent continu',level:'a2',minutes:11,theme:'grammar-a2',goal:'Parler de ce qui se passe maintenant.',words:['am working','is waiting','are leaving','now'],examples:['I’m waiting for the bus.','They are leaving now.']},
  comparatives:{title:'Comparer',level:'a2',minutes:10,theme:'grammar-a2',goal:'Comparer prix, tailles, distances et options.',words:['bigger','smaller','cheaper','better','than'],examples:['This room is bigger.','The train is cheaper than the taxi.']},
  quantities:{title:'Quantités',level:'a2',minutes:10,theme:'grammar-a2',goal:'Parler de quantités avec much, many, some et any.',words:['much','many','some','any','enough'],examples:['How much time do we have?','There are many people here.']},
  'polite-requests':{title:'Demandes polies',level:'a2',minutes:11,theme:'social-a2',goal:'Demander quelque chose naturellement et poliment.',words:['could','would','please','would you mind'],examples:['Could you help me, please?','Would you mind opening the window?']},
  'travel-problems':{title:'Problèmes de voyage',level:'a2',minutes:11,theme:'travel-a2',goal:'Gérer retard, annulation, bagage ou billet.',words:['delayed','cancelled','missed','luggage','refund'],examples:['My flight has been cancelled.','I’ve lost my luggage.']},
  'hotel-problems':{title:'Problèmes à l’hôtel',level:'a2',minutes:11,theme:'travel-a2',goal:'Expliquer un problème et demander une solution.',words:['broken','noisy','dirty','change room','air conditioning'],examples:['The air conditioning isn’t working.','Could I change rooms?']},
  'social-plans':{title:'Proposer & organiser',level:'a2',minutes:10,theme:'social-a2',goal:'Proposer une activité, accepter ou refuser.',words:['free','meet','available','sounds good','maybe'],examples:['Are you free this evening?','That sounds good to me.']},
  'work-basics':{title:'Travail au quotidien',level:'a2',minutes:11,theme:'work',goal:'Parler simplement de tâches, délais et collègues.',words:['task','deadline','colleague','schedule','finish'],examples:['I need to finish this task today.','The deadline is Friday.']}
});

const LESSON_META={
  hello:{meaning:'bonjour / salut',situation:'Tu rencontres quelqu’un le matin et tu veux le saluer.'},
  contact:{meaning:'numéro de téléphone',situation:'À l’accueil, on te demande ton adresse e-mail.'},
  repeat:{meaning:'Je ne comprends pas.',situation:'Tu n’as pas compris ce que quelqu’un vient de dire et tu veux qu’il répète.'},
  introduce:{meaning:'Je m’appelle…',situation:'Quelqu’un te demande d’où tu viens.'},
  numbers:{meaning:'un',situation:'Tu annonces un prix de trente livres.'},
  colors:{meaning:'rouge',situation:'Tu montres ta clé à quelqu’un.'},
  food:{meaning:'eau',situation:'Tu commandes de l’eau dans un café.'},
  restaurant:{meaning:'menu',situation:'Au restaurant, tu veux commander le poulet.'},
  hotel:{meaning:'réservation',situation:'À l’hôtel, tu veux réserver une chambre pour deux nuits.'},
  directions:{meaning:'gauche',situation:'Quelqu’un te demande comment aller à la station.'},
  transport:{meaning:'quai',situation:'À la gare, tu veux connaître l’heure de départ du train.'},
  shopping:{meaning:'Combien ça coûte ?',situation:'Dans un magasin, tu veux essayer un vêtement.'},
  smalltalk:{meaning:'météo',situation:'Tu discutes avec quelqu’un de son travail.'},
  phone:{meaning:'à l’appareil / je vous écoute',situation:'Au téléphone, tu veux laisser un message.'},
  email:{meaning:'au sujet de / concernant',situation:'Dans un e-mail, tu demandes à quelqu’un de confirmer sa disponibilité.'},
  meetings:{meaning:'ordre du jour',situation:'En réunion, tu demandes qui prendra en charge une action.'},
  'idioms-common':{meaning:'très facile',situation:'Tu veux vérifier que tout le monde partage la même compréhension.'},
  'phrasal-common':{meaning:'aller chercher / récupérer',situation:'Tu veux dire que vous devez découvrir ce qui s’est passé.'},
  'collocations-business':{meaning:'prendre une décision',situation:'Tu veux demander si l’équipe peut respecter la date limite.'},
  'connected-speech':{meaning:'forme orale familière de “going to”',situation:'Tu demandes poliment à quelqu’un d’envoyer quelque chose aujourd’hui.'},
  'numbers-listening':{meaning:'treize',situation:'Tu annonces un prix de trente dollars.'},
  'false-friends':{meaning:'en fait / en réalité',situation:'Tu veux dire qu’une personne a assisté à une réunion.'},
  ...EXTRA_META
};

export const LESSON_GUIDES={
  contact:{intro:'Donner ses coordonnées demande surtout de maîtriser les chiffres, l’alphabet et quelques mots fixes.',rule:'What’s your phone number? / My email address is… sont les structures de base.',tip:'Pour un e-mail, prononce @ comme “at” et le point comme “dot”.',pronunciation:'Dicte lentement les chiffres ou lettres et fais une petite pause entre les groupes.',examples:['What’s your phone number?','My email address is alex@example.com.']},
  hello:{intro:'On commence par les formules qui permettent d’entrer et de sortir d’une interaction sans stress.',rule:'Good morning s’utilise le matin ; hello/hi sont plus généraux ; goodbye/bye servent à prendre congé.',tip:'Dans le doute, “Hello”, “Please” et “Thank you” te rendent déjà compréhensible et poli.',examples:['Good morning!','Thank you very much.','Goodbye, have a nice day!']},
  repeat:{intro:'Quand tu ne comprends pas, le plus utile est de savoir faire ralentir ou répéter ton interlocuteur.',rule:'En anglais naturel, on dit “I don’t understand” et “Can you repeat, please?”.',tip:'Mémorise “Could you speak more slowly?” comme phrase de secours complète.',examples:['I don’t understand.','Can you repeat, please?']},
  introduce:{intro:'Se présenter repose sur quelques structures fixes que tu réutiliseras partout.',rule:'Utilise “My name is… / I’m…” pour te présenter et “Where are you from?” pour demander l’origine.',tip:'Pour l’âge, l’anglais dit “I’m 30”, pas “I have 30 years”.',examples:['My name is Alex.','I’m from France.']},
  numbers:{intro:'Les nombres servent immédiatement pour les prix, chambres, horaires, téléphones et transports.',rule:'Attention aux paires thirteen/thirty, fourteen/forty, fifteen/fifty : l’accent tonique change.',tip:'Pour les dizaines, écoute fortement la première syllabe : THIR-ty, FOR-ty, FIF-ty.',examples:['Room thirteen.','Thirty pounds.']},
  colors:{intro:'Les couleurs et objets usuels permettent de désigner ce que tu cherches.',rule:'L’adjectif vient avant le nom : a blue bag, a black phone.',tip:'En anglais, l’adjectif ne s’accorde pas : blue reste blue.',examples:['It’s a blue bag.','The phone is black.']},
  food:{intro:'Pour commander, quelques tournures polies suffisent à être naturel dès le début.',rule:'“I’d like…” est une manière polie et très fréquente de demander quelque chose.',tip:'Évite “I want” au restaurant quand tu veux être poli ; préfère “I’d like”.',examples:['I’d like a coffee, please.','Can I have some water?']},
  restaurant:{intro:'Au restaurant, tu dois savoir lire le menu, commander et demander l’addition.',rule:'Au Royaume-Uni on demande souvent “the bill”; aux États-Unis “the check” est courant.',tip:'Ajoute “please” à la fin d’une demande : simple, naturel et sûr.',examples:['Could we have the bill, please?','I’d like the chicken.']},
  hotel:{intro:'À l’hôtel, quelques phrases couvrent le check-in, les horaires et les demandes essentielles.',rule:'“I have a reservation” est la formulation standard au check-in.',tip:'Pour demander une information : “What time is…?” ou “Where is…?” sont deux modèles clés.',examples:['I have a reservation.','What time is breakfast?']},
  alphabet:{intro:'Reconnaître les lettres te permet d’épeler un nom, un code ou une adresse.',rule:'Le nom anglais des lettres doit être appris à l’oral, car plusieurs sons diffèrent fortement du français.',tip:'Travaille surtout A/E/I, G/J et R, souvent confondus par les francophones.',examples:['A, B, C.','How do you spell that?']},
  spelling:{intro:'Épeler est indispensable au téléphone, à l’hôtel et pour les réservations.',rule:'“How do you spell…?” signifie “Comment ça s’épelle ?”.',tip:'Tu peux dire “double L” pour deux lettres identiques consécutives.',examples:['How do you spell your last name?','It’s M-A-R-T-I-N.']},
  contact:{intro:'Téléphone, e-mail et adresse sont des informations de base dans beaucoup de situations.',rule:'Dans une adresse e-mail, @ se prononce “at” et le point “dot”.',tip:'Découpe les longs numéros en petits groupes pour mieux les comprendre et les répéter.',examples:['What’s your phone number?','It’s alex at example dot com.']},
  'time-basic':{intro:'Savoir donner l’heure te sert pour tous les rendez-vous et transports.',rule:'3:00 = three o’clock ; 7:30 = half past seven. Le système 24 h existe surtout dans les horaires écrits.',tip:'Pour commencer, maîtrise o’clock, half past et les heures numériques.',examples:['It’s three o’clock.','It’s half past seven.']},
  'days-dates':{intro:'Les jours et dates reviennent dans les réservations, rendez-vous et horaires.',rule:'En anglais, on utilise on avec un jour/date : on Monday, on 12 May.',tip:'Fais particulièrement attention à la prononciation des nombres ordinaux dans les dates.',examples:['Today is Monday.','My booking is for 12 May.']},
  'family-basic':{intro:'Parler de sa famille est un des premiers sujets de conversation.',rule:'Utilise “I have…” pour dire que tu as des enfants, frères, sœurs, etc.',tip:'Child = un enfant ; children = des enfants.',examples:['This is my family.','I have two children.']},
  'basic-verbs':{intro:'Want, need, like, go et come permettent déjà d’exprimer énormément de choses.',rule:'Après I/you/we/they au présent simple, le verbe reste à sa forme de base.',tip:'Need est souvent plus fort que want : “I need help” exprime un vrai besoin.',examples:['I need help.','I want some water.']},
  emergency:{intro:'En cas de problème, la priorité est d’être compris vite avec une phrase courte et claire.',rule:'“I need help” et “I’ve lost…” sont des structures de secours très utiles.',tip:'Apprends par cœur doctor, police, pharmacy et help.',examples:['I need help.','Where is the nearest pharmacy?']},

  directions:{intro:'Demander et comprendre un itinéraire repose sur quelques mots spatiaux.',rule:'Turn left/right = tourne à gauche/droite ; go straight ahead = va tout droit.',tip:'Répète la direction entendue à ton interlocuteur pour vérifier.',examples:['Where is the station?','Turn left.']},
  transport:{intro:'Dans les transports, tu dois comprendre départ, arrivée, quai, porte et retard.',rule:'Platform concerne surtout le train ; gate concerne l’avion.',tip:'Écoute toujours les nombres associés aux mots platform/gate.',examples:['Which platform?','The flight is delayed.']},
  shopping:{intro:'Prix, taille, couleur et paiement couvrent la majorité des échanges en magasin.',rule:'“How much is it?” demande le prix ; “Can I try this on?” demande à essayer un vêtement.',tip:'“By card” = par carte ; “cash” = espèces.',examples:['How much is it?','Can I pay by card?']},
  smalltalk:{intro:'Le small talk sert à créer un contact simple avant d’aller au sujet principal.',rule:'Les questions sur le week-end, la météo et le travail sont très fréquentes.',tip:'Une réponse courte + une question en retour rend la conversation naturelle.',examples:['How was your weekend?','What do you do?']},
  'be-have':{intro:'Be et have sont deux piliers de l’anglais : identité, état, possession et description.',rule:'I am / you are / he-she is. Avec have : I have, she has.',tip:'Ne traduis pas mot à mot “j’ai 30 ans” : en anglais on dit “I’m 30”.',examples:['I am tired.','She has a car.']},
  articles:{intro:'A/an introduisent une chose non spécifique ; the désigne quelque chose d’identifié.',rule:'A devant un son consonne, an devant un son voyelle ; the quand l’interlocuteur sait de quoi on parle.',tip:'Écoute le son, pas seulement la lettre : an hour, a university.',examples:['I need a taxi.','The station is near the hotel.']},
  'there-is':{intro:'There is / there are servent à dire ce qui existe ou se trouve quelque part.',rule:'There is + singulier ; there are + pluriel.',tip:'Avec une question ou une négation, any est très fréquent : “Are there any…?”',examples:['There is a café nearby.','There are two rooms upstairs.']},
  'present-simple':{intro:'Le présent simple décrit habitudes, routines et faits réguliers.',rule:'Avec he/she/it, le verbe prend généralement -s : she works.',tip:'Les adverbes often/usually/never accompagnent souvent ce temps.',examples:['I work in Paris.','She works every day.']},
  'questions-basic':{intro:'Les questions anglaises ont un ordre fixe qu’il faut automatiser.',rule:'Avec un verbe ordinaire au présent : mot interrogatif + do/does + sujet + verbe.',tip:'Après does, le verbe perd son -s : “Where does she work?”',examples:['Where do you live?','What time does it start?']},
  'daily-routine':{intro:'Décrire sa journée entraîne le présent simple et le vocabulaire du temps.',rule:'Utilise le présent simple pour une routine habituelle.',tip:'Associe chaque action à une heure pour mémoriser en contexte.',examples:['I start work at nine.','I have lunch at twelve.']},
  home:{intro:'Le vocabulaire du logement sert pour les visites, locations et conversations quotidiennes.',rule:'Room désigne une pièce ou une chambre selon le contexte ; bedroom = chambre à coucher.',tip:'“Upstairs/downstairs” sont très utiles pour se repérer dans un bâtiment.',examples:['The kitchen is downstairs.','There are two bedrooms.']},
  weather:{intro:'La météo est du vocabulaire utile et un sujet classique de small talk.',rule:'On utilise “It’s…” : It’s sunny, It’s cold.',tip:'Pour une prévision simple : “It’s going to rain.”',examples:['It’s sunny today.','It’s going to rain.']},
  health:{intro:'Pour la santé, il faut pouvoir décrire un symptôme et demander un professionnel.',rule:'“I have a headache” mais “I am sick”. Certaines expressions utilisent have, d’autres be.',tip:'Pour une douleur localisée, “It hurts here” est une phrase de secours pratique.',examples:['I have a headache.','I need to see a doctor.']},
  'can-cant':{intro:'Can exprime la capacité, la possibilité ou une demande simple.',rule:'Après can/can’t, le verbe reste toujours à la base : can speak, can help.',tip:'“Can you…?” est courant ; “Could you…?” sera plus poli au niveau A2.',examples:['Can you help me?','I can speak a little English.']},
  frequency:{intro:'Les adverbes de fréquence permettent de nuancer une habitude.',rule:'Always/often/sometimes/never se placent généralement avant le verbe principal, mais après be.',tip:'I often work late, mais I am often tired.',examples:['I often take the train.','She never works on Sunday.']},

  phone:{intro:'Au téléphone, il faut savoir se présenter, patienter et laisser un message.',rule:'“Alex speaking” = Alex à l’appareil ; “hold on” = ne quittez pas.',tip:'Au téléphone, parle en phrases courtes et confirme les noms/nombres.',examples:['Alex speaking.','Can I leave a message?']},
  email:{intro:'Les e-mails professionnels reposent sur un petit nombre de formules récurrentes.',rule:'Regarding = concernant ; attached = en pièce jointe ; confirm = confirmer.',tip:'Préfère une demande polie : “Could you confirm…?”',examples:['Please find the document attached.','Could you confirm your availability?']},
  meetings:{intro:'Les réunions utilisent un vocabulaire très répétitif : agenda, action, décision, délai.',rule:'“Action item” désigne une action à réaliser après la réunion.',tip:'Repère toujours qui fait quoi et pour quand : personne + action + deadline.',examples:['Let’s move to the next item.','Who will take this action?']},
  'idioms-common':{intro:'Les idiomes ne se comprennent pas toujours mot à mot : il faut apprendre leur sens global.',rule:'“A piece of cake” = très facile ; “on the same page” = avoir la même compréhension.',tip:'N’essaie pas de traduire chaque mot d’un idiome.',examples:['The test was a piece of cake.','We’re on the same page.']},
  'phrasal-common':{intro:'Les phrasal verbs combinent verbe + particule et changent souvent de sens.',rule:'Pick up peut signifier aller chercher/récupérer ; find out = découvrir/apprendre une information.',tip:'Apprends-les avec une phrase complète, jamais comme deux mots isolés.',examples:['I’ll pick you up at eight.','We need to find out what happened.']},
  'past-simple':{intro:'Le past simple raconte une action terminée dans le passé.',rule:'Les verbes réguliers prennent -ed ; les irréguliers changent : go → went, see → saw.',tip:'Yesterday, last week, in 2025 sont des indices fréquents du past simple.',examples:['I went to London yesterday.','We had dinner at eight.']},
  'future-plans':{intro:'Going to exprime souvent un projet prévu ; will une décision, promesse ou prédiction.',rule:'be + going to + verbe ; will + verbe à la base.',tip:'Pour un plan déjà décidé, “I’m going to…” est très naturel.',examples:['I’m going to visit London.','I’ll call you tomorrow.']},
  'present-continuous':{intro:'Le présent continu décrit ce qui est en cours maintenant ou autour de maintenant.',rule:'be + verbe-ing : I am waiting, they are leaving.',tip:'Le mot now est un indice fréquent, mais pas obligatoire.',examples:['I’m waiting for the bus.','They are leaving now.']},
  comparatives:{intro:'Les comparatifs permettent de choisir entre deux options.',rule:'Adjectifs courts : cheaper, bigger ; adjectifs longs : more comfortable.',tip:'Than introduit le deuxième élément comparé : cheaper than the taxi.',examples:['This room is bigger.','The train is cheaper than the taxi.']},
  quantities:{intro:'Much, many, some et any permettent de parler précisément de quantité.',rule:'Much avec indénombrable ; many avec dénombrable pluriel.',tip:'Dans les phrases affirmatives courantes, “a lot of” est souvent plus naturel que much.',examples:['How much time do we have?','There are many people here.']},
  'polite-requests':{intro:'À partir de A2, il faut rendre ses demandes plus naturelles et moins directes.',rule:'Could you…? est plus poli que Can you…? ; Would you mind…? est encore plus doux.',tip:'Ajoute please sans surcharger : “Could you help me, please?”',examples:['Could you help me, please?','Would you mind opening the window?']},
  'travel-problems':{intro:'Voyager implique parfois de gérer annulation, retard ou bagage perdu.',rule:'Has been cancelled/delayed décrit un événement déjà affecté par un changement.',tip:'Commence par nommer le problème clairement, puis demande l’option suivante ou un remboursement.',examples:['My flight has been cancelled.','I’ve lost my luggage.']},
  'hotel-problems':{intro:'Expliquer calmement un problème d’hôtel demande surtout adjectif + demande de solution.',rule:'Isn’t working = ne fonctionne pas ; could I…? = demande polie.',tip:'Décris le problème précisément avant de demander une autre chambre.',examples:['The air conditioning isn’t working.','Could I change rooms?']},
  'social-plans':{intro:'Pour organiser une sortie, il faut proposer, vérifier la disponibilité et réagir.',rule:'Are you free…? / Are you available…? servent à vérifier la disponibilité.',tip:'“That sounds good” accepte naturellement une proposition.',examples:['Are you free this evening?','That sounds good to me.']},
  'work-basics':{intro:'Le travail quotidien utilise vite les notions de tâche, planning et délai.',rule:'Deadline = date limite ; schedule = planning/calendrier.',tip:'Associe chaque tâche à une personne et une échéance pour comprendre les échanges pro.',examples:['I need to finish this task today.','The deadline is Friday.']},
  'collocations-business':{intro:'Les anglophones associent naturellement certains mots entre eux. Les apprendre ensemble rend ton anglais plus fluide.',rule:'On dit “make a decision”, “meet a deadline”, “take responsibility” : ces associations sont fixes ou très fréquentes.',tip:'Mémorise la paire complète plutôt qu’un mot isolé : deadline → meet a deadline.',examples:['We need to make a decision today.','Can we meet the deadline?']},
  'connected-speech':{intro:'À débit naturel, les mots se lient, se réduisent et certains sons deviennent très faibles.',rule:'La grammaire ne change pas, mais la réalisation sonore change : “going to” peut sonner comme “gonna” dans un registre familier.',tip:'Écoute d’abord la phrase entière, puis repère les mots porteurs de sens plutôt que chaque syllabe.',examples:['What are you going to do?','Could you send it today?']},
  'numbers-listening':{intro:'Les nombres sont faciles à confondre à l’oral, surtout 13/30, 14/40 et 15/50.',rule:'Les nombres en -teen portent souvent un accent sur la fin ; les dizaines en -ty accentuent davantage la première syllabe.',tip:'Associe toujours le nombre au contexte : prix, heure, chambre, porte ou quantité.',examples:['Room thirteen.','Thirty dollars.','Gate fourteen.']},
  'false-friends':{intro:'Certains mots ressemblent au français mais n’ont pas le même sens. Ils provoquent des erreurs très fréquentes.',rule:'Actually = en fait ; eventually = finalement ; sensible = raisonnable/sensé ; library = bibliothèque.',tip:'Quand un mot ressemble trop au français, vérifie son sens avant de le traduire automatiquement.',examples:['Actually, I disagree.','She attended the meeting.']}
};


Object.assign(LESSON_META,{
  alphabet:{meaning:'lettre',situation:'Quelqu’un te demande comment épeler un mot.'},
  spelling:{meaning:'épeler',situation:'On te demande d’épeler ton nom de famille.'},
  contact:{meaning:'numéro de téléphone',situation:'Quelqu’un te demande ton adresse e-mail.'},
  'time-basic':{meaning:'heure pile',situation:'Quelqu’un te demande l’heure et il est 7 h 30.'},
  'days-dates':{meaning:'lundi',situation:'Tu veux dire que ta réservation est pour le 12 mai.'},
  'family-basic':{meaning:'famille',situation:'Tu montres une photo et veux dire que tu as deux enfants.'},
  'basic-verbs':{meaning:'vouloir',situation:'Tu as besoin d’aide immédiatement.'},
  emergency:{meaning:'aide',situation:'Tu cherches la pharmacie la plus proche.'},
  'be-have':{meaning:'être',situation:'Tu veux dire que cette femme possède une voiture.'},
  articles:{meaning:'un / une',situation:'Tu veux dire que la station est près de l’hôtel déjà identifié.'},
  'there-is':{meaning:'il y a (singulier)',situation:'Tu veux dire qu’il y a deux chambres à l’étage.'},
  'present-simple':{meaning:'travailler',situation:'Tu veux dire qu’elle travaille tous les jours.'},
  'questions-basic':{meaning:'auxiliaire de question au présent',situation:'Tu veux demander à quelle heure quelque chose commence.'},
  'daily-routine':{meaning:'se réveiller',situation:'Tu veux dire que tu déjeunes à midi.'},
  home:{meaning:'maison',situation:'Tu veux dire qu’il y a deux chambres.'},
  weather:{meaning:'ensoleillé',situation:'Tu veux dire qu’il va pleuvoir.'},
  health:{meaning:'malade',situation:'Tu as mal à la tête et veux l’expliquer.'},
  'can-cant':{meaning:'pouvoir',situation:'Tu veux dire que tu parles un peu anglais.'},
  frequency:{meaning:'toujours',situation:'Tu veux dire qu’elle ne travaille jamais le dimanche.'},
  'past-simple':{meaning:'suis allé / est allé',situation:'Tu racontes que vous avez dîné à huit heures.'},
  'future-plans':{meaning:'avoir l’intention de',situation:'Tu promets d’appeler demain.'},
  'present-continuous':{meaning:'suis en train de travailler',situation:'Tu veux dire qu’ils partent maintenant.'},
  comparatives:{meaning:'plus grand',situation:'Tu compares le train et le taxi et le train coûte moins cher.'},
  quantities:{meaning:'beaucoup de (indénombrable)',situation:'Tu demandes combien de temps il reste.'},
  'polite-requests':{meaning:'pourrais / pourriez',situation:'Tu demandes poliment à quelqu’un de t’aider.'},
  'travel-problems':{meaning:'retardé',situation:'Ton vol a été annulé et tu dois l’expliquer.'},
  'hotel-problems':{meaning:'cassé / en panne',situation:'La climatisation ne fonctionne pas et tu veux changer de chambre.'},
  'social-plans':{meaning:'libre / disponible',situation:'Tu acceptes une proposition en disant que ça te convient.'},
  'work-basics':{meaning:'tâche',situation:'Tu veux dire que la date limite est vendredi.'}
});


export function lessonTeaching(id){
  const L=LESSONS[id];if(!L)return null;
  const meta={...(LESSON_META[id]||{}),...(L.pedagogy||{})};
  return {...fallbackTeaching(L,meta),...(BASE_TEACHING[id]||{}),...(LESSON_GUIDES[id]||{})};
}

const speechProfile=(id,level)=>{
  const n=[...String(id)].reduce((a,c)=>a+c.charCodeAt(0),0);
  const advanced=['b1','b2','c1'].includes(level);
  return {locale:advanced&&n%4===0?'en-US':'en-GB',gender:n%2?'male':'female'};
};
const q=(id,level,prompt,choices,correctIndex,skills,audioText,audioMode='feedback',pedagogy={})=>{
  const voice=speechProfile(id,level);
  return {id:`GEN-${id}`,domain:'general',level,part:null,title:'English',prompt,choices,correctIndex,skills,timeTargetSec:25,explanation:pedagogy.explanation||'',tip:pedagogy.tip||'',choiceExplanations:pedagogy.choiceExplanations||[],extraExample:pedagogy.extraExample||'',pronunciation:pedagogy.pronunciation||'',audioMode,audioScript:audioText?[{text:audioText,...voice}]:[],transcript:audioText||'',vocabulary:choices.filter(Boolean).slice(0,3)};
};

function enrichLessonQuestion(item,lessonId,kind,{answerText,meaning}={}){
  const L=LESSONS[lessonId],g=lessonTeaching(lessonId)||{};
  item.lessonId=lessonId;
  item.rule=g.rule||'Observe la structure de la phrase et son contexte.';
  item.tip=g.tip||'Mémorise la formulation complète plutôt qu’un mot isolé.';
  item.extraExample=(g.examples||[])[2]||(g.examples||[])[1]||L?.examples?.[1]||L?.examples?.[0]||'';
  item.pronunciation=g.pronunciation||'';
  if(kind==='meaning'){
    item.explanation=`« ${L.words[0]} » signifie ici « ${meaning} ». ${item.rule}`;
    item.choiceExplanations=[
      `Oui : c’est bien le sens de « ${L.words[0]} » dans cette leçon.`,
      'Non : la formulation demandée ne désigne pas une date ou une heure.',
      'Non : ce mot ou cette expression ne désigne pas un lieu ici.',
      'Non : ce n’est pas le nom d’une profession.'
    ];
  }else if(kind==='natural'){
    item.explanation=`« ${answerText} » est une phrase correcte et naturelle. ${item.rule}`;
    item.choiceExplanations=[
      'Oui : la structure et l’ordre des mots sont corrects.',
      'Non : “I wanting…” n’est pas une construction correcte ; il faudrait un auxiliaire ou un verbe conjugué adapté.',
      'Non : “me” est un pronom complément ; comme sujet on emploie “I”.',
      'Non : cette formulation est trop incomplète et ne correspond pas à la phrase attendue.'
    ];
  }else if(kind==='listening'){
    item.explanation=`L’audio disait « ${answerText} ». Le but est de reconnaître la forme sonore exacte avant de chercher le sens.`;
    item.choiceExplanations=item.choices.map((c,i)=>i===item.correctIndex?`Oui : c’est exactement « ${c} » qui est prononcé.`:`Non : l’audio ne prononce pas « ${c} ».`);
  }else if(kind==='context'){
    item.explanation=`Dans le contexte décrit, « ${answerText} » est la formulation naturelle. ${item.rule}`;
    item.choiceExplanations=[
      'Oui : cette phrase correspond à la situation et sa grammaire est correcte.',
      'Non : il manque un sujet et/ou un auxiliaire ; ce n’est pas une phrase anglaise naturelle.',
      'Non : cette suite de mots ne forme pas une expression idiomatique anglaise.',
      'Non : l’ordre des mots d’une question anglaise est incorrect ici.'
    ];
  }
  return item;
}


function deterministicOffset(id,size){
  if(!size)return 0;
  return [...String(id)].reduce((n,c)=>n+c.charCodeAt(0),0)%size;
}
function sentenceDistractors(id,exclude=[],count=3){
  const L=LESSONS[id],excluded=new Set(exclude.filter(Boolean)),pool=[];
  for(const [otherId,other] of Object.entries(LESSONS)){
    if(otherId===id||other.level!==L.level||other.theme===L.theme)continue;
    for(const sentence of other.examples||[]){
      if(!sentence||excluded.has(sentence)||pool.some(x=>x.text===sentence))continue;
      pool.push({text:sentence,reason:`« ${sentence} » est une phrase correcte, mais elle sert plutôt à ${other.goal.toLowerCase()}`});
    }
  }
  if(pool.length<count){
    for(const [otherId,other] of Object.entries(LESSONS)){
      if(otherId===id)continue;
      for(const sentence of other.examples||[]){
        if(!sentence||excluded.has(sentence)||pool.some(x=>x.text===sentence))continue;
        pool.push({text:sentence,reason:`« ${sentence} » exprime une autre idée : ${other.goal.toLowerCase()}`});
      }
    }
  }
  const off=deterministicOffset(id,pool.length);
  return [...pool.slice(off),...pool.slice(0,off)].slice(0,count);
}
function meaningDistractors(id,correct,count=3){
  const L=LESSONS[id],pool=[];
  for(const [otherId,other] of Object.entries(LESSONS)){
    if(otherId===id||other.level!==L.level)continue;
    const meta={...(LESSON_META[otherId]||{}),...(other.pedagogy||{})};
    if(!meta.meaning||meta.meaning===correct||pool.some(x=>x.text===meta.meaning))continue;
    pool.push({text:meta.meaning,reason:`« ${meta.meaning} » correspond plutôt à « ${other.words?.[0]||other.title} ».`});
  }
  const fallback=[
    {text:'Une date ou une heure',reason:'Ce n’est pas une expression de date ou d’heure.'},
    {text:'Un lieu précis',reason:'Ce mot ne désigne pas un lieu dans cette leçon.'},
    {text:'Une profession',reason:'Ce mot ne désigne pas une profession.'}
  ];
  for(const x of fallback)if(x.text!==correct&&!pool.some(y=>y.text===x.text))pool.push(x);
  const off=deterministicOffset(id,pool.length);
  return [...pool.slice(off),...pool.slice(0,off)].slice(0,count);
}

export function lessonQuestions(id){
  const L=LESSONS[id]; if(!L)return[];
  const meta={...(LESSON_META[id]||{}),...(L.pedagogy||{})},teach=lessonTeaching(id)||fallbackTeaching(L,meta);
  const base=L.words||[],items=[],tip=teach.tip||'Mémorise la formulation complète plutôt qu’un mot isolé.';
  const extraExample=(teach.examples||[])[2]||(teach.examples||[])[1]||L.examples?.[2]||L.examples?.[1]||'';
  const pronunciation=teach.pronunciation||'';

  if(meta.meaning&&base[0]){
    const ds=meaningDistractors(id,meta.meaning,3);
    items.push(q(`${id}-1`,L.level,`Que signifie « ${base[0]} » ?`,[meta.meaning,...ds.map(x=>x.text)],0,[`general.${L.theme}`],base[0],'feedback',{
      explanation:`« ${base[0]} » signifie ici « ${meta.meaning} ». ${teach.rule}`,
      tip,extraExample,pronunciation,
      choiceExplanations:[`Oui : « ${base[0]} » signifie bien « ${meta.meaning} » ici.`,...ds.map(x=>x.reason)]
    }));
  }

  if(L.examples?.[0]){
    const answer=L.examples[0],ds=sentenceDistractors(id,[answer,L.examples?.[1]],3);
    items.push(q(`${id}-2`,L.level,`Quelle phrase permet de ${L.goal.charAt(0).toLowerCase()+L.goal.slice(1)}`,[answer,...ds.map(x=>x.text)],0,[`general.${L.theme}`],answer,'feedback',{
      explanation:`« ${answer} » correspond à l’objectif de la leçon. ${teach.rule}`,
      tip,extraExample,pronunciation,
      choiceExplanations:[`Oui : cette phrase permet bien de ${L.goal.toLowerCase()}`,...ds.map(x=>x.reason)]
    }));
  }

  if(base[1]){
    const listeningChoices=[base[1],base[0],base[2]||base.at(-1)||'please',base[3]||'thank you'];
    const unique=[...new Set(listeningChoices)];
    while(unique.length<4)unique.push(`option ${unique.length+1}`);
    items.push(q(`${id}-3`,L.level,'Écoute puis choisis exactement ce que tu entends.',unique.slice(0,4),0,[`general.${L.theme}`],base[1],'prompt',{
      explanation:`L’audio disait « ${base[1]} ». ${pronunciation}`,
      tip,extraExample,pronunciation,
      choiceExplanations:unique.slice(0,4).map((c,i)=>i===0?`Oui : c’est exactement « ${c} » qui est prononcé.`:`Non : l’audio ne prononce pas « ${c} ».`)
    }));
  }

  if(L.examples?.[1]){
    const answer=L.examples[1],scenario=meta.situation||`Tu veux ${L.goal.toLowerCase()}`;
    const ds=sentenceDistractors(id,[answer,L.examples?.[0]],3);
    items.push(q(`${id}-4`,L.level,`${scenario} Que peux-tu dire ?`,[answer,...ds.map(x=>x.text)],0,[`general.${L.theme}`],answer,'feedback',{
      explanation:`Dans cette situation, « ${answer} » est la réponse adaptée. ${teach.rule}`,
      tip,extraExample,pronunciation,
      choiceExplanations:[`Oui : cette phrase répond directement à la situation décrite.`,...ds.map(x=>x.reason)]
    }));
  }
  return items;
}

export const PLACEMENT_STAGES=[
  {level:'pre-a1',questions:[
    q('place-pre1','pre-a1','Comment dit-on « merci » ?',['Thank you','Tomorrow','Ticket','Room'],0,['general.survival'],'Thank you'),
    q('place-pre2','pre-a1','Quelle phrase demande le nom ?',["What's your name?",'How much is it?','Where is the station?','What time is it?'],0,['general.identity'],"What's your name?"),
    q('place-pre3','pre-a1','Écoute le nombre.', ['thirteen','thirty','three','fifty'],0,['general.numbers'],'thirteen','prompt'),
    q('place-pre4','pre-a1','À l’hôtel, quelle phrase est correcte ?',['I have a reservation.','I am reservation.','Reservation me.','Have room I.'],0,['general.hotel'],'I have a reservation.')
  ]},
  {level:'a1',questions:[
    q('place-a11','a1','Choose the correct sentence.',['She works in London.','She work in London.','She working London.','She is work London.'],0,['general.grammar']),
    q('place-a12','a1','What is the best reply to “Where are you from?”',['I’m from France.','I’m thirty years.','At eight o’clock.','Two coffees.'],0,['general.identity']),
    q('place-a13','a1','Which sentence asks for directions?',['How do I get to the station?','How old is the station?','How many station?','When station is?'],0,['general.travel'])
  ]},
  {level:'a2',questions:[
    q('place-a21','a2','Choose the correct past form.',['I went there yesterday.','I go there yesterday.','I have go yesterday.','I going yesterday.'],0,['general.grammar']),
    q('place-a22','a2','Best polite request?',['Could you send me the details, please?','Send details now.','You send me details.','Details give me.'],0,['general.politeness']),
    q('place-a23','a2','“The flight has been delayed” means…',['It will leave later than planned.','It has been cancelled forever.','It arrived early.','It has no passengers.'],0,['general.travel'])
  ]},
  {level:'b1',questions:[
    q('place-b11','b1','“We need to meet the deadline” means…',['We must finish on time.','We should schedule a meeting.','We need a new client.','We must change the price.'],0,['general.collocations']),
    q('place-b12','b1','Best paraphrase of “I’ll look into it”',['I’ll investigate it.','I’ll look at a picture.','I’ll ignore it.','I’ll postpone it.'],0,['general.paraphrase']),
    q('place-b13','b1','“I’ve been working here for three years” describes…',['An activity continuing until now.','A finished event yesterday.','A future plan.','A repeated command.'],0,['general.grammar'])
  ]},
  {level:'b2',questions:[
    q('place-b21','b2','“The proposal fell through” most likely means…',['It failed or was cancelled.','It became cheaper.','It was printed.','It was approved immediately.'],0,['general.idioms']),
    q('place-b22','b2','Best meaning of “I’m not entirely convinced”',['I still have doubts.','I fully agree.','I did not hear you.','I am angry.'],0,['general.nuance']),
    q('place-b23','b2','Choose the most natural sentence.',['Had I known earlier, I would have called you.','If I knew earlier, I would call yesterday.','Had I knew, I called.','If known earlier, I call.'],0,['general.grammar'])
  ]},
  {level:'c1',questions:[
    q('place-c11','c1','“The figures are broadly in line with expectations” means…',['They are generally close to what was predicted.','They are completely wrong.','They were not measured.','They exceed every target.'],0,['general.nuance']),
    q('place-c12','c1','Best paraphrase of “The issue is unlikely to be resolved overnight.”',['A quick solution should not be expected.','The problem only happens at night.','The issue has already disappeared.','The solution is obvious.'],0,['general.paraphrase'])
  ]}
];

export function visibleLessonIds(){
  const themeOrder=[
    'survival','identity','time-basics','numbers','colors','family-home','food','hotel','emergency',
    'grammar-a1','daily-life','travel','travel-a1','shopping','smalltalk','health-a1',
    'grammar-a2','social-a2','travel-a2','work','work-a2','idioms','phrasal',
    'collocations','pronunciation','falsefriends',
    'grammar-b1','communication-b1','work-b1','listening-b1',
    'grammar-b2','discourse-b2','professional-b2','listening-b2',
    'grammar-c1','discourse-c1','professional-c1','listening-c1','lexis-c1'
  ];
  const rank=new Map(themeOrder.map((id,i)=>[id,i])),seen=new Set(),out=[];
  const sorted=[...THEMES].sort((a,b)=>(rank.get(a.id)??999)-(rank.get(b.id)??999));
  for(const theme of sorted)for(const id of theme.lessons||[]){
    if(LESSONS[id]&&!seen.has(id)){seen.add(id);out.push(id)}
  }
  return out;
}

export function nextLessonId(profile,attempts=[],sessions=[]){
  const order=visibleLessonIds();
  const completed=new Set(sessions.filter(s=>s.type?.startsWith('lesson:')&&(s.total||0)>0&&((s.correct||0)/(s.total||1))>=.75).map(s=>s.type.slice('lesson:'.length)));
  return order.find(id=>!completed.has(id))||order.at(-1);
}

export function allGeneralQuestions(){
  const map=new Map();
  for(const stage of PLACEMENT_STAGES) for(const item of stage.questions) map.set(item.id,item);
  for(const id of visibleLessonIds()) for(const item of lessonQuestions(id)) map.set(item.id,item);
  return [...map.values()];
}
