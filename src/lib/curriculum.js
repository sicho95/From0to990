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
  {id:'identity',title:'Se présenter',icon:'person',level:'pre-a1',summary:'Nom, âge, pays, épeler, téléphone, adresse.',lessons:['introduce','numbers']},
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
  {id:'falsefriends',title:'Faux amis français',icon:'warning',level:'b1',summary:'Actually, eventually, sensible, comprehensive…',lessons:['false-friends']}
];

export const LESSONS={
  hello:{title:'Hello!',level:'pre-a1',minutes:6,theme:'survival',goal:'Saluer, remercier et prendre congé.',words:['hello','hi','good morning','please','thank you','sorry','goodbye'],examples:['Hello!','Good morning.','Thank you very much.','Sorry.','Goodbye!']},
  repeat:{title:'Je n’ai pas compris',level:'pre-a1',minutes:6,theme:'survival',goal:'Faire répéter ou ralentir.',words:['I don’t understand','Can you repeat, please?','Could you speak more slowly?','Excuse me'],examples:['I don’t understand.','Can you repeat, please?','Could you speak more slowly?']},
  introduce:{title:'Je me présente',level:'pre-a1',minutes:8,theme:'identity',goal:'Dire son nom, son pays et demander celui de l’autre.',words:['My name is…','What’s your name?','I’m from France','Where are you from?','How old are you?'],examples:['My name is Damien.','I’m from France.','What’s your name?','Where are you from?']},
  numbers:{title:'Nombres essentiels',level:'pre-a1',minutes:10,theme:'numbers',goal:'Comprendre nombres, prix et numéros.',words:['one','two','ten','thirteen','thirty','fifty','hundred','pounds'],examples:['Room thirteen.','Thirty pounds.','It’s thirteen thirty.','Platform twelve.']},
  colors:{title:'Couleurs & objets',level:'pre-a1',minutes:7,theme:'colors',goal:'Identifier une couleur et un objet simple.',words:['red','blue','green','black','white','bag','phone','key'],examples:['It’s a blue bag.','This is my key.','The phone is black.']},
  food:{title:'Je voudrais…',level:'pre-a1',minutes:8,theme:'food',goal:'Demander à boire ou à manger poliment.',words:['water','coffee','tea','bread','I’d like…','Can I have…?'],examples:['I’d like a coffee, please.','Can I have some water?','That’s all, thank you.']},
  restaurant:{title:'Au restaurant',level:'pre-a1',minutes:9,theme:'food',goal:'Commander et demander l’addition.',words:['menu','starter','main course','dessert','bill'],examples:['Could we have the bill, please?','I’d like the chicken.','Can I see the menu?']},
  hotel:{title:'À l’hôtel',level:'pre-a1',minutes:10,theme:'hotel',goal:'Faire un check-in et poser les questions essentielles.',words:['reservation','room','breakfast','Wi-Fi','key','check-in','check-out'],examples:['I have a reservation.','I’d like a room for two nights.','What time is breakfast?','Where is my room?']},
  directions:{title:'Demander son chemin',level:'a1',minutes:9,theme:'travel',goal:'Comprendre gauche, droite et tout droit.',words:['left','right','straight ahead','near','far','station'],examples:['Where is the station?','Turn left.','Go straight ahead.']},
  transport:{title:'Train, bus, avion',level:'a1',minutes:10,theme:'travel',goal:'Comprendre horaires, quai, porte et retard.',words:['platform','gate','delay','departure','arrival','ticket'],examples:['Which platform?','What time does the train leave?','The flight is delayed.']},
  shopping:{title:'Faire un achat',level:'a1',minutes:9,theme:'shopping',goal:'Demander prix, taille et payer.',words:['How much is it?','size','cash','card','receipt','try on'],examples:['How much is it?','Can I try this on?','Can I pay by card?']},
  smalltalk:{title:'Small talk',level:'a1',minutes:10,theme:'smalltalk',goal:'Tenir une conversation légère.',words:['weather','weekend','family','hobby','work'],examples:['How was your weekend?','What do you do?','Nice weather today.']},
  phone:{title:'Au téléphone',level:'a2',minutes:10,theme:'work',goal:'Se présenter, transférer et laisser un message.',words:['speaking','hold on','put you through','leave a message'],examples:['Damien speaking.','Can I leave a message?','I’ll put you through.']},
  email:{title:'E-mails professionnels',level:'a2',minutes:12,theme:'work',goal:'Comprendre et écrire un e-mail simple.',words:['regarding','attached','confirm','available','deadline'],examples:['Please find the document attached.','Could you confirm your availability?']},
  meetings:{title:'Réunions',level:'a2',minutes:12,theme:'work',goal:'Comprendre agenda, action et décision.',words:['agenda','minutes','action item','deadline','decision'],examples:['Let’s move to the next item.','Who will take this action?']},
  'idioms-common':{title:'Idiomes fréquents',level:'a2',minutes:10,theme:'idioms',goal:'Comprendre des expressions courantes en contexte.',words:['a piece of cake','once in a while','on the same page','under the weather'],examples:['The test was a piece of cake.','Let’s make sure we’re on the same page.']},
  'phrasal-common':{title:'Phrasal verbs essentiels',level:'a2',minutes:12,theme:'phrasal',goal:'Comprendre les verbes à particule les plus utiles.',words:['pick up','find out','set up','look for','look forward to'],examples:['I’ll pick you up at eight.','We need to find out what happened.']},
  'collocations-business':{title:'Collocations professionnelles',level:'b1',minutes:12,theme:'collocations',goal:'Parler plus naturellement avec les bonnes associations de mots.',words:['make a decision','meet a deadline','take responsibility','raise a question'],examples:['We need to make a decision today.','Can we meet the deadline?']},
  'connected-speech':{title:'Connected speech',level:'b1',minutes:12,theme:'pronunciation',goal:'Reconnaître les mots quand ils se lient et se réduisent.',words:['gonna','wanna','could you','did you','have to'],examples:['What are you going to do?','Could you send it today?']},
  'numbers-listening':{title:'13 ou 30 ?',level:'b1',minutes:8,theme:'pronunciation',goal:'Éliminer les confusions de nombres à l’oral.',words:['thirteen','thirty','fourteen','forty','fifteen','fifty'],examples:['Room thirteen.','Thirty dollars.','Gate fourteen.']},
  'false-friends':{title:'Faux amis',level:'b1',minutes:10,theme:'falsefriends',goal:'Éviter les erreurs typiques des francophones.',words:['actually','eventually','sensible','library','attend'],examples:['Actually, I disagree.','She attended the meeting.']}
};

const q=(id,level,prompt,choices,correctIndex,skills,audioText)=>({id:`GEN-${id}`,domain:'general',level,part:null,title:'English',prompt,choices,correctIndex,skills,timeTargetSec:25,explanation:'Révise la phrase en contexte et réessaie-la plus tard.',audioScript:audioText?[{text:audioText,locale:'en-GB',gender:'female'}]:[],transcript:audioText||'',vocabulary:choices.filter(Boolean).slice(0,3)});

export function lessonQuestions(id){
  const L=LESSONS[id]; if(!L)return[];
  if(id==='hello'){
    return [
      q('hello-1','pre-a1','Tu entres dans un café le matin. Quelle réponse est naturelle ?',
        ['Good morning!','Good night!','See you yesterday.','I am coffee.'],0,['general.survival'],'Good morning!'),
      q('hello-2','pre-a1','Quelqu’un te dit « Thank you ». Que peux-tu répondre ?',
        ["You're welcome.",'Goodbye yesterday.','My name thank you.','Morning please.'],0,['general.survival'],"You're welcome."),
      q('hello-3','pre-a1','Tu quittes un hôtel. Quelle phrase convient ?',
        ['Goodbye, have a nice day!','Hello, I arrive yesterday.','Please morning.','Thank you room.'],0,['general.survival'],'Goodbye, have a nice day!'),
      q('hello-4','pre-a1','Tu veux attirer poliment l’attention de quelqu’un. Que dis-tu ?',
        ['Excuse me.','Good night.','You please.','I goodbye.'],0,['general.survival'],'Excuse me.')
    ];
  }
  const base=L.words;
  const items=[];
  items.push(q(`${id}-1`,L.level,`Que signifie « ${base[0]} » ?`,[L.goal,'Une date','Un lieu','Une profession'],0,[`general.${L.theme}`],base[0]));
  if(L.examples[0])items.push(q(`${id}-2`,L.level,'Choisis la phrase anglaise la plus naturelle.',[L.examples[0],'I wanting please this.','Me need that now.','Give me.'],0,[`general.${L.theme}`],L.examples[0]));
  if(base[1])items.push(q(`${id}-3`,L.level,'Écoute et choisis ce que tu entends.',[base[1],base[0],base[2]||'goodbye','maybe'],0,[`general.${L.theme}`],base[1]));
  if(L.examples[1])items.push(q(`${id}-4`,L.level,'Quelle phrase convient le mieux dans cette situation ?',[L.examples[1],'No understand all.','English zero.','Why you say?'],0,[`general.${L.theme}`],L.examples[1]));
  return items;
}

export const PLACEMENT_STAGES=[
  {level:'pre-a1',questions:[
    q('place-pre1','pre-a1','Comment dit-on « merci » ?',['Thank you','Tomorrow','Ticket','Room'],0,['general.survival'],'Thank you'),
    q('place-pre2','pre-a1','Quelle phrase demande le nom ?',["What's your name?",'How much is it?','Where is the station?','What time is it?'],0,['general.identity'],"What's your name?"),
    q('place-pre3','pre-a1','Écoute le nombre.', ['thirteen','thirty','three','fifty'],0,['general.numbers'],'thirteen'),
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

export function nextLessonId(profile,attempts=[],sessions=[]){
  const order=['hello','repeat','introduce','numbers','colors','food','restaurant','hotel','directions','transport','shopping','smalltalk','phone','email','meetings','idioms-common','phrasal-common','collocations-business','connected-speech','numbers-listening','false-friends'];
  const completed=new Set(
    sessions
      .filter(s=>s.type?.startsWith('lesson:') && (s.total||0)>0 && ((s.correct||0)/(s.total||1))>=.75)
      .map(s=>s.type.slice('lesson:'.length))
  );
  return order.find(id=>!completed.has(id))||order.at(-1);
}


export function allGeneralQuestions(){
  const map=new Map();
  for(const stage of PLACEMENT_STAGES) for(const item of stage.questions) map.set(item.id,item);
  for(const id of Object.keys(LESSONS)) for(const item of lessonQuestions(id)) map.set(item.id,item);
  return [...map.values()];
}
