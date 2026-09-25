export const EXTRA_THEMES=[
  {id:'time-basics',title:'Alphabet, heure & dates',icon:'clock',level:'pre-a1',summary:'Épeler, dire l’heure, les jours, les dates et comprendre un numéro.',lessons:['alphabet','spelling','time','days-dates']},
  {id:'family-home',title:'Famille & maison',icon:'home',level:'pre-a1',summary:'Famille proche, pièces, objets essentiels et besoins simples.',lessons:['family-basic','home-basic','bathroom-basic']},
  {id:'emergency',title:'Santé & urgence',icon:'warning',level:'pre-a1',summary:'Demander de l’aide, trouver une pharmacie et expliquer un problème simple.',lessons:['help','pharmacy']},

  {id:'grammar-a1',title:'Construire ses phrases',icon:'link',level:'a1',summary:'Be, have, do, présent simple, questions, articles et there is/are.',lessons:['be-have','present-simple','questions-basic','articles','there-is']},
  {id:'daily-life',title:'Vie quotidienne',icon:'home',level:'a1',summary:'Routine, fréquence, présent continu, famille, météo et loisirs.',lessons:['routine','frequency','present-continuous','weather','hobbies']},
  {id:'travel-a1',title:'Voyager au quotidien',icon:'plane',level:'a1',summary:'Taxi, transports, arrivée, demander de l’aide et comprendre des consignes.',lessons:['taxi','airport-basic','travel-problems-basic']},
  {id:'health-a1',title:'Santé simple',icon:'warning',level:'a1',summary:'Dire ce qui ne va pas et comprendre les mots essentiels chez le médecin.',lessons:['body-health','doctor-basic']},

  {id:'grammar-a2',title:'Raconter & prévoir',icon:'link',level:'a2',summary:'Passé, futur, comparatifs, quantités, modaux et demandes polies.',lessons:['past-simple','future-plans','comparatives','quantities','modals-basic','polite-requests']},
  {id:'social-a2',title:'Conversation réelle',icon:'bubble',level:'a2',summary:'Inviter, accepter/refuser, raconter son week-end, donner son avis et expliquer.',lessons:['invitations','opinions','storytelling-basic']},
  {id:'travel-a2',title:'Voyage autonome',icon:'plane',level:'a2',summary:'Modifier une réservation, gérer un retard, une erreur ou un problème à l’hôtel.',lessons:['reservation-change','delay-problem','hotel-problem']},
  {id:'work-a2',title:'Travail au quotidien',icon:'briefcase',level:'a2',summary:'Planning, disponibilité, consignes, clients et suivi de tâches.',lessons:['schedule-work','instructions-work','customers-basic']}
];

export const EXTRA_LESSONS={
  alphabet:{title:'Alphabet anglais',level:'pre-a1',minutes:8,theme:'time-basics',goal:'Reconnaître et prononcer les lettres utiles.',words:['A','E','G','I','J','R','W'],examples:['A, B, C.','My name starts with J.']},
  spelling:{title:'Épeler un nom',level:'pre-a1',minutes:8,theme:'time-basics',goal:'Épeler un nom, une adresse ou un code.',words:['spell','letter','double','at','dot'],examples:['How do you spell that?','It’s J-O-N-E-S.']},
  time:{title:'Dire l’heure',level:'pre-a1',minutes:9,theme:'time-basics',goal:'Comprendre et dire une heure simple.',words:['o’clock','half past','quarter past','morning','evening'],examples:['It’s eight o’clock.','The train leaves at half past nine.']},
  'days-dates':{title:'Jours & dates',level:'pre-a1',minutes:9,theme:'time-basics',goal:'Comprendre un jour, une date et aujourd’hui/demain.',words:['Monday','today','tomorrow','first','twenty-fifth'],examples:['Today is Monday.','My booking is for the twenty-fifth.']},
  'family-basic':{title:'Ma famille',level:'pre-a1',minutes:8,theme:'family-home',goal:'Nommer les membres proches de la famille.',words:['mother','father','partner','son','daughter','child'],examples:['This is my daughter.','I have two children.']},
  'home-basic':{title:'À la maison',level:'pre-a1',minutes:8,theme:'family-home',goal:'Nommer les pièces et objets essentiels.',words:['room','kitchen','bedroom','door','window','light'],examples:['The kitchen is here.','Please close the door.']},
  'bathroom-basic':{title:'Toilettes & salle de bain',level:'pre-a1',minutes:6,theme:'family-home',goal:'Demander les toilettes et comprendre les mots essentiels.',words:['toilet','bathroom','shower','towel','soap'],examples:['Where is the bathroom?','I need a towel, please.']},
  help:{title:'Demander de l’aide',level:'pre-a1',minutes:7,theme:'emergency',goal:'Dire que tu as besoin d’aide ou que tu es perdu.',words:['help','lost','problem','police','phone'],examples:['I need help.','I’m lost.']},
  pharmacy:{title:'À la pharmacie',level:'pre-a1',minutes:8,theme:'emergency',goal:'Trouver une pharmacie et exprimer un besoin très simple.',words:['pharmacy','medicine','pain','headache','sick'],examples:['Where is the nearest pharmacy?','I have a headache.']},

  'be-have':{title:'Be & have',level:'a1',minutes:10,theme:'grammar-a1',goal:'Former des phrases simples avec be et have.',words:['am','is','are','have','has'],examples:['I am tired.','She has a reservation.']},
  'present-simple':{title:'Présent simple',level:'a1',minutes:11,theme:'grammar-a1',goal:'Parler d’habitudes et de faits simples.',words:['work','live','like','start','finish'],examples:['I work in Paris.','She starts at nine.']},
  'questions-basic':{title:'Poser une question',level:'a1',minutes:10,theme:'grammar-a1',goal:'Former des questions simples avec do/be et les mots interrogatifs.',words:['what','where','when','why','do','does'],examples:['Where do you live?','What time does it start?']},
  articles:{title:'A, an, the',level:'a1',minutes:9,theme:'grammar-a1',goal:'Utiliser les articles essentiels sans traduire mot à mot.',words:['a','an','the','some'],examples:['I need a taxi.','Where is the station?']},
  'there-is':{title:'There is / there are',level:'a1',minutes:9,theme:'grammar-a1',goal:'Dire ce qu’il y a dans un lieu.',words:['there is','there are','any','some'],examples:['There is a café nearby.','There are two rooms upstairs.']},
  routine:{title:'Ma routine',level:'a1',minutes:10,theme:'daily-life',goal:'Décrire une journée simple.',words:['wake up','start work','have lunch','finish','go home'],examples:['I start work at eight.','I have lunch at noon.']},
  frequency:{title:'Often, sometimes, never',level:'a1',minutes:9,theme:'daily-life',goal:'Dire à quelle fréquence quelque chose arrive.',words:['always','usually','often','sometimes','never'],examples:['I often take the train.','She never drinks coffee.']},
  'present-continuous':{title:'Ce qui se passe maintenant',level:'a1',minutes:10,theme:'daily-life',goal:'Utiliser be + -ing pour une action en cours.',words:['working','waiting','leaving','coming'],examples:['I’m waiting for the bus.','They’re having lunch.']},
  weather:{title:'Parler de la météo',level:'a1',minutes:8,theme:'daily-life',goal:'Comprendre et décrire la météo simplement.',words:['sunny','rainy','cold','warm','windy'],examples:['It’s raining today.','It’s quite cold outside.']},
  hobbies:{title:'Loisirs & préférences',level:'a1',minutes:9,theme:'daily-life',goal:'Parler de ce qu’on aime faire.',words:['like','love','enjoy','play','watch'],examples:['I like reading.','We enjoy walking.']},
  taxi:{title:'Prendre un taxi',level:'a1',minutes:8,theme:'travel-a1',goal:'Donner une destination et comprendre un prix simple.',words:['address','airport','station','how long','how much'],examples:['Could you take me to this address?','How long will it take?']},
  'airport-basic':{title:'À l’aéroport',level:'a1',minutes:10,theme:'travel-a1',goal:'Comprendre gate, boarding, passport et bagage.',words:['passport','boarding pass','gate','luggage','security'],examples:['Where is gate twelve?','Here is my passport.']},
  'travel-problems-basic':{title:'Petit problème en voyage',level:'a1',minutes:9,theme:'travel-a1',goal:'Signaler un objet perdu ou une réservation introuvable.',words:['lost','missing','wrong','booking','ticket'],examples:['I can’t find my ticket.','My booking is not here.']},
  'body-health':{title:'Corps & symptômes',level:'a1',minutes:9,theme:'health-a1',goal:'Nommer quelques parties du corps et symptômes simples.',words:['head','stomach','back','pain','fever'],examples:['My back hurts.','I have a fever.']},
  'doctor-basic':{title:'Chez le médecin',level:'a1',minutes:10,theme:'health-a1',goal:'Expliquer simplement depuis quand et où tu as mal.',words:['hurt','since','today','yesterday','allergy'],examples:['It started yesterday.','I’m allergic to penicillin.']},

  'past-simple':{title:'Parler du passé',level:'a2',minutes:12,theme:'grammar-a2',goal:'Raconter une action terminée.',words:['went','had','saw','bought','stayed'],examples:['I went to London last week.','We stayed for two nights.']},
  'future-plans':{title:'Parler du futur',level:'a2',minutes:11,theme:'grammar-a2',goal:'Exprimer un plan ou une intention.',words:['going to','will','tomorrow','next week'],examples:['I’m going to visit Oxford.','I’ll call you tomorrow.']},
  comparatives:{title:'Comparer',level:'a2',minutes:10,theme:'grammar-a2',goal:'Comparer deux choses simplement.',words:['bigger','smaller','better','cheaper','more expensive'],examples:['This room is bigger.','The train is cheaper than the taxi.']},
  quantities:{title:'Quantités',level:'a2',minutes:10,theme:'grammar-a2',goal:'Parler de quantités avec much, many, some et any.',words:['much','many','some','any','enough'],examples:['How much time do we have?','Do you have any water?']},
  'modals-basic':{title:'Can, should, must',level:'a2',minutes:11,theme:'grammar-a2',goal:'Exprimer capacité, conseil et obligation.',words:['can','could','should','must','have to'],examples:['You should call the hotel.','I have to leave now.']},
  'polite-requests':{title:'Demandes polies',level:'a2',minutes:10,theme:'grammar-a2',goal:'Demander quelque chose naturellement et poliment.',words:['could you','would you mind','may I','please'],examples:['Could you help me, please?','May I have the bill?']},
  invitations:{title:'Inviter & répondre',level:'a2',minutes:10,theme:'social-a2',goal:'Proposer une activité, accepter ou refuser poliment.',words:['would you like','sounds good','maybe another time','free'],examples:['Would you like to have dinner?','Sorry, maybe another time.']},
  opinions:{title:'Donner son avis',level:'a2',minutes:10,theme:'social-a2',goal:'Exprimer un avis simple et nuancé.',words:['I think','I agree','I’m not sure','in my opinion'],examples:['I think it’s a good idea.','I’m not sure about that.']},
  'storytelling-basic':{title:'Raconter un week-end',level:'a2',minutes:11,theme:'social-a2',goal:'Relier quelques événements dans l’ordre.',words:['first','then','after that','finally'],examples:['First, we visited the museum.','Then we had lunch.']},
  'reservation-change':{title:'Modifier une réservation',level:'a2',minutes:11,theme:'travel-a2',goal:'Changer une date, une chambre ou un horaire.',words:['change','cancel','extend','available','another night'],examples:['I’d like to change my reservation.','Is another room available?']},
  'delay-problem':{title:'Retard & correspondance',level:'a2',minutes:11,theme:'travel-a2',goal:'Comprendre un retard et demander une solution.',words:['delayed','connection','miss','next train','refund'],examples:['I’m going to miss my connection.','When is the next train?']},
  'hotel-problem':{title:'Problème à l’hôtel',level:'a2',minutes:11,theme:'travel-a2',goal:'Signaler un problème dans la chambre et demander une solution.',words:['not working','noisy','air conditioning','change room'],examples:['The air conditioning isn’t working.','Could I change rooms?']},
  'schedule-work':{title:'Agenda & disponibilité',level:'a2',minutes:10,theme:'work-a2',goal:'Fixer ou déplacer un rendez-vous simple.',words:['available','appointment','reschedule','morning','afternoon'],examples:['Are you available on Tuesday?','Can we reschedule the meeting?']},
  'instructions-work':{title:'Comprendre une consigne',level:'a2',minutes:11,theme:'work-a2',goal:'Suivre une consigne professionnelle simple.',words:['send','check','complete','before','by Friday'],examples:['Please send the file by Friday.','Check the figures before the meeting.']},
  'customers-basic':{title:'Parler à un client',level:'a2',minutes:11,theme:'work-a2',goal:'Accueillir, clarifier un besoin et proposer une aide simple.',words:['How can I help?','order','problem','solution','confirm'],examples:['How can I help you today?','Let me confirm your order.']}
};

export const EXTRA_META={
  alphabet:{meaning:'la lettre A',situation:'Tu veux dire que ton nom commence par J.',rule:'Les lettres anglaises ont souvent une prononciation très différente du français.',tip:'Travaille surtout E / I, G / J et R / W : ce sont des sources fréquentes de confusion.'},
  spelling:{meaning:'épeler',situation:'Tu veux demander comment s’écrit un nom.',rule:'Pour épeler, on dit les lettres une par une ; “double” peut remplacer deux lettres identiques.',tip:'Pour une adresse e-mail : @ = at, . = dot.'},
  time:{meaning:'pile / heure exacte',situation:'Tu annonces que le train part à neuf heures trente.',rule:'8:00 = eight o’clock ; 8:30 = half past eight.',tip:'Dans la vie courante, on entend aussi “eight thirty”.'},
  'days-dates':{meaning:'lundi',situation:'Tu veux dire que ta réservation est pour le 25.',rule:'Les jours prennent une majuscule en anglais.',tip:'Pour les dates, apprends les ordinaux : first, second, third, fourth…'},
  'family-basic':{meaning:'mère',situation:'Tu présentes ta fille.',rule:'“Child” = un enfant ; “children” = plusieurs enfants.',tip:'“Partner” est très courant et neutre pour parler de son/sa partenaire.'},
  'home-basic':{meaning:'pièce / chambre selon le contexte',situation:'Tu demandes à quelqu’un de fermer la porte.',rule:'“Room” signifie une pièce ; “bedroom” signifie une chambre.',tip:'Évite de traduire “chambre” systématiquement par room.'},
  'bathroom-basic':{meaning:'toilettes / salle de bain selon le contexte',situation:'Tu demandes une serviette.',rule:'Au Royaume-Uni, “toilet” est courant ; “bathroom” est très compris.',tip:'“Where is the bathroom?” est une formule sûre et polie.'},
  help:{meaning:'aide',situation:'Tu veux dire que tu es perdu.',rule:'“I need help” est court, correct et utile en urgence.',tip:'Apprends cette phrase entière, pas seulement le mot “help”.'},
  pharmacy:{meaning:'pharmacie',situation:'Tu expliques que tu as mal à la tête.',rule:'“I have a headache” = j’ai mal à la tête.',tip:'En anglais britannique, pharmacy et chemist’s peuvent désigner une pharmacie.'},

  'be-have':{meaning:'être / avoir selon le mot',situation:'Tu veux dire qu’une personne a une réservation.',rule:'I am / you are / he-she is ; I-you-we-they have / he-she has.',tip:'Ne traduis pas “j’ai 30 ans” par “I have 30 years” : on dit “I am 30”.'},
  'present-simple':{meaning:'travailler',situation:'Tu dis qu’une personne commence à neuf heures.',rule:'Avec he/she/it, le verbe prend souvent -s au présent simple.',tip:'I work, she works. C’est une erreur française très fréquente.'},
  'questions-basic':{meaning:'quoi / quel',situation:'Tu demandes à quelle heure quelque chose commence.',rule:'Présent simple : Do you…? / Does he…?',tip:'Après does, le verbe revient à la base : “Does she work?”, pas “does she works?”.'},
  articles:{meaning:'un / une',situation:'Tu demandes où se trouve la gare.',rule:'a/an = un élément non identifié ; the = élément précis/connu.',tip:'On dit “a taxi”, mais “the station” si on parle de la gare recherchée.'},
  'there-is':{meaning:'il y a (singulier)',situation:'Tu dis qu’il y a deux chambres à l’étage.',rule:'There is + singulier ; there are + pluriel.',tip:'À l’oral, “there’s” est très fréquent pour “there is”.'},
  routine:{meaning:'se réveiller',situation:'Tu dis que tu déjeunes à midi.',rule:'Les routines utilisent généralement le présent simple.',tip:'Pour une habitude : “I start”, pas “I am starting” sauf si c’est maintenant.'},
  frequency:{meaning:'toujours',situation:'Tu dis qu’une personne ne boit jamais de café.',rule:'Les adverbes de fréquence se placent souvent avant le verbe principal.',tip:'I often go / She never drinks, mais “I am always…” avec be.'},
  'present-continuous':{meaning:'en train de travailler',situation:'Tu dis que des personnes sont en train de déjeuner.',rule:'be + verbe-ing = action en cours maintenant.',tip:'“I’m waiting” = j’attends en ce moment.'},
  weather:{meaning:'ensoleillé',situation:'Tu dis qu’il fait assez froid dehors.',rule:'Pour la météo, on utilise souvent “It’s…”.',tip:'On dit “It’s raining”, pas “The weather rains”.'},
  hobbies:{meaning:'aimer',situation:'Tu dis que vous aimez marcher.',rule:'Après like/enjoy, le -ing est très courant pour une activité.',tip:'“I enjoy walking” sonne plus naturel que “I enjoy to walk”.'},
  taxi:{meaning:'adresse',situation:'Tu demandes combien de temps le trajet prendra.',rule:'“Could you take me to…?” est une demande polie et naturelle.',tip:'Garde l’adresse écrite à montrer si la prononciation est difficile.'},
  'airport-basic':{meaning:'passeport',situation:'Tu donnes ton passeport.',rule:'Gate = porte d’embarquement ; boarding pass = carte d’embarquement.',tip:'Les numéros de gate sont souvent annoncés rapidement : travaille les nombres.'},
  'travel-problems-basic':{meaning:'perdu',situation:'Tu expliques que ta réservation n’apparaît pas.',rule:'“I can’t find…” = je ne trouve pas.',tip:'Pour un problème, commence par une phrase factuelle simple avant d’expliquer.'},
  'body-health':{meaning:'tête',situation:'Tu dis que tu as de la fièvre.',rule:'“My back hurts” mais “I have a headache/fever”.',tip:'Les symptômes n’utilisent pas tous la même structure : apprends-les en blocs.'},
  'doctor-basic':{meaning:'faire mal',situation:'Tu expliques une allergie.',rule:'“It started yesterday” indique le début du symptôme.',tip:'“I’m allergic to…” est une phrase à connaître par cœur.'},

  'past-simple':{meaning:'aller au passé : went',situation:'Tu racontes que vous êtes restés deux nuits.',rule:'Le past simple décrit une action terminée à un moment fini.',tip:'Beaucoup de verbes fréquents sont irréguliers : go→went, have→had, see→saw.'},
  'future-plans':{meaning:'avoir l’intention de',situation:'Tu dis que tu appelleras demain.',rule:'be going to = projet/intention ; will = décision, promesse ou futur neutre.',tip:'Ne cherche pas une règle absolue : apprends surtout les usages fréquents.'},
  comparatives:{meaning:'plus grand',situation:'Tu dis que le train est moins cher que le taxi.',rule:'Adjectifs courts : -er + than ; certains sont irréguliers : good→better.',tip:'“cheaper than”, pas “more cheap than”.'},
  quantities:{meaning:'beaucoup avec indénombrable',situation:'Tu demandes s’il y a de l’eau.',rule:'much + indénombrable ; many + pluriel dénombrable.',tip:'Dans les phrases affirmatives courantes, “a lot of” est souvent plus naturel.'},
  'modals-basic':{meaning:'pouvoir',situation:'Tu dis que tu dois partir maintenant.',rule:'Après can/should/must, verbe sans “to”.',tip:'“have to” prend “to”, contrairement aux modaux purs.'},
  'polite-requests':{meaning:'pourriez-vous',situation:'Tu demandes l’addition poliment.',rule:'Could you…? / May I…? adoucissent une demande.',tip:'Le ton et “please” comptent autant que la grammaire.'},
  invitations:{meaning:'voudriez-vous',situation:'Tu refuses poliment une invitation.',rule:'Would you like to…? est une formule standard pour inviter.',tip:'“Maybe another time” permet de refuser sans être brusque.'},
  opinions:{meaning:'je pense',situation:'Tu exprimes un doute.',rule:'I think… = avis ; I’m not sure… = désaccord ou doute plus doux.',tip:'En anglais professionnel, on atténue souvent le désaccord.'},
  'storytelling-basic':{meaning:'d’abord',situation:'Tu continues ton récit avec l’étape suivante.',rule:'First / then / after that / finally structurent un récit simple.',tip:'Ces connecteurs rendent ton anglais immédiatement plus clair.'},
  'reservation-change':{meaning:'changer',situation:'Tu demandes s’il existe une autre chambre.',rule:'I’d like to + verbe est une façon polie d’annoncer une demande.',tip:'Ajoute toujours la nouvelle date/option souhaitée après la demande.'},
  'delay-problem':{meaning:'retardé',situation:'Tu demandes le prochain train.',rule:'miss a connection = rater une correspondance.',tip:'“When is the next…?” est une structure très utile en voyage.'},
  'hotel-problem':{meaning:'ne fonctionne pas',situation:'Tu demandes à changer de chambre.',rule:'isn’t working est naturel pour un équipement en panne.',tip:'Décris le problème avant de demander une solution.'},
  'schedule-work':{meaning:'disponible',situation:'Tu demandes à déplacer une réunion.',rule:'Are you available…? sert à vérifier une disponibilité.',tip:'Reschedule = déplacer/replanifier, pas simplement annuler.'},
  'instructions-work':{meaning:'envoyer',situation:'Tu demandes de vérifier les chiffres avant une réunion.',rule:'Please + verbe est une consigne polie et concise.',tip:'“by Friday” signifie au plus tard vendredi.'},
  'customers-basic':{meaning:'Comment puis-je vous aider ?',situation:'Tu confirmes une commande.',rule:'Commence par clarifier le besoin avant de proposer la solution.',tip:'“Let me…” est très naturel pour annoncer ce que tu vas faire pour le client.'}
};

export const EXTRA_ORDER=[
  'alphabet','spelling','time','days-dates','family-basic','home-basic','bathroom-basic','help','pharmacy',
  'be-have','present-simple','questions-basic','articles','there-is','routine','frequency','present-continuous','weather','hobbies','taxi','airport-basic','travel-problems-basic','body-health','doctor-basic',
  'past-simple','future-plans','comparatives','quantities','modals-basic','polite-requests','invitations','opinions','storytelling-basic','reservation-change','delay-problem','hotel-problem','schedule-work','instructions-work','customers-basic'
];
