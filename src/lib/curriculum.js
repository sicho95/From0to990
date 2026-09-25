export const LEVELS=[
{id:'pre-a1',label:'Pré-A1',title:'Survie',range:'premiers mots',description:'Comprendre et se faire comprendre dans les situations les plus simples.'},
{id:'a1',label:'A1',title:'Bases',range:'phrases simples',description:'Se présenter, demander, acheter, réserver et parler de son quotidien.'},
{id:'a2',label:'A2',title:'Voyage autonome',range:'échanges courants',description:'Gérer les situations habituelles de voyage, de service et de travail simple.'},
{id:'b1',label:'B1',title:'Autonomie',range:'anglais utile',description:'Comprendre l’essentiel, raconter, expliquer et travailler dans des situations habituelles.'},
{id:'b2',label:'B2',title:'Courant',range:'anglais naturel',description:'Comprendre un débit normal, argumenter et suivre des contenus professionnels.'},
{id:'c1',label:'C1',title:'Avancé',range:'nuance & précision',description:'Comprendre l’implicite, les accents et des contenus rapides et complexes.'},
{id:'toeic990',label:'990',title:'Précision TOEIC',range:'950 → 990',description:'Éliminer les dernières erreurs de vitesse, pièges et inférences.'}
];

export const THEMES=[
{id:'survival',title:'Premiers secours linguistiques',level:'pre-a1',summary:'Saluer, remercier, s’excuser, faire répéter.',lessons:['hello','repeat']},
{id:'identity',title:'Se présenter',level:'pre-a1',summary:'Nom, âge, pays, épeler et informations personnelles.',lessons:['introduce','numbers']},
{id:'numbers',title:'Nombres, prix & heure',level:'pre-a1',summary:'0–1000, 13/30, prix, téléphone, chambre et quai.',lessons:['numbers']},
{id:'colors',title:'Couleurs & objets',level:'pre-a1',summary:'Décrire simplement ce que tu vois ou cherches.',lessons:['colors']},
{id:'food',title:'Boire & manger',level:'pre-a1',summary:'Commander poliment et demander l’addition.',lessons:['food','restaurant']},
{id:'hotel',title:'Hôtel',level:'pre-a1',summary:'Réservation, chambre, petit-déjeuner et check-in.',lessons:['hotel']},
{id:'travel',title:'Transport & directions',level:'a1',summary:'Station, quai, horaires, retards, gauche et droite.',lessons:['directions','transport']},
{id:'shopping',title:'Achats',level:'a1',summary:'Prix, taille, couleur, essayer, payer et reçu.',lessons:['shopping']},
{id:'smalltalk',title:'Small talk',level:'a1',summary:'Météo, loisirs, famille, week-end et conversations sociales.',lessons:['smalltalk']},
{id:'work',title:'Anglais professionnel',level:'a2',summary:'Téléphone, e-mail, réunions, agenda, délais et clients.',lessons:['phone','email','meetings']},
{id:'idioms',title:'Idiomes & expressions',level:'a2',summary:'Expressions naturelles fréquentes sans traduction mot à mot.',lessons:['idioms-common']},
{id:'phrasal',title:'Phrasal verbs',level:'a2',summary:'Pick up, find out, set up, look forward to… en contexte.',lessons:['phrasal-common']},
{id:'collocations',title:'Collocations',level:'b1',summary:'Make a decision, meet a deadline, take responsibility…',lessons:['collocations-business']},
{id:'pronunciation',title:'Comprendre l’anglais naturel',level:'b1',summary:'Contractions, weak forms, connected speech et accents.',lessons:['connected-speech','numbers-listening']},
{id:'falsefriends',title:'Faux amis français',level:'b1',summary:'Actually, eventually, sensible, library, attend…',lessons:['false-friends']}
];

const L=(title,level,minutes,theme,goal,words,examples)=>({title,level,minutes,theme,goal,words,examples});
export const LESSONS={
hello:L('Hello!','pre-a1',6,'survival','Saluer, remercier et prendre congé.',['hello','good morning','please','thank you','sorry','goodbye'],['Hello!','Good morning.','Thank you very much.','Goodbye!']),
repeat:L('Je n’ai pas compris','pre-a1',6,'survival','Faire répéter ou ralentir.',['I don’t understand','Can you repeat, please?','Could you speak more slowly?','Excuse me'],['I don’t understand.','Can you repeat, please?','Could you speak more slowly?']),
introduce:L('Je me présente','pre-a1',8,'identity','Dire son nom, son pays et demander celui de l’autre.',['My name is…','What’s your name?','I’m from France','Where are you from?','How old are you?'],['My name is Damien.','I’m from France.','What’s your name?','Where are you from?']),
numbers:L('Nombres essentiels','pre-a1',10,'numbers','Comprendre nombres, prix, heure et numéros.',['one','ten','thirteen','thirty','fifty','hundred','pounds'],['Room thirteen.','Thirty pounds.','It’s thirteen thirty.','Platform twelve.']),
colors:L('Couleurs & objets','pre-a1',7,'colors','Identifier une couleur et un objet simple.',['red','blue','green','black','white','bag','phone','key'],['It’s a blue bag.','This is my key.','The phone is black.']),
food:L('Je voudrais…','pre-a1',8,'food','Demander à boire ou à manger poliment.',['water','coffee','tea','bread','I’d like…','Can I have…?'],['I’d like a coffee, please.','Can I have some water?','That’s all, thank you.']),
restaurant:L('Au restaurant','pre-a1',9,'food','Commander et demander l’addition.',['menu','starter','main course','dessert','bill'],['Could we have the bill, please?','I’d like the chicken.','Can I see the menu?']),
hotel:L('À l’hôtel','pre-a1',10,'hotel','Faire un check-in et poser les questions essentielles.',['reservation','room','breakfast','Wi-Fi','key','check-in','check-out'],['I have a reservation.','I’d like a room for two nights.','What time is breakfast?','Where is my room?']),
directions:L('Demander son chemin','a1',9,'travel','Comprendre gauche, droite et tout droit.',['left','right','straight ahead','near','far','station'],['Where is the station?','Turn left.','Go straight ahead.']),
transport:L('Train, bus, avion','a1',10,'travel','Comprendre horaires, quai, porte et retard.',['platform','gate','delay','departure','arrival','ticket'],['Which platform?','What time does the train leave?','The flight is delayed.']),
shopping:L('Faire un achat','a1',9,'shopping','Demander prix, taille et payer.',['How much is it?','size','cash','card','receipt','try on'],['How much is it?','Can I try this on?','Can I pay by card?']),
smalltalk:L('Small talk','a1',10,'smalltalk','Tenir une conversation légère.',['weather','weekend','family','hobby','work'],['How was your weekend?','What do you do?','Nice weather today.']),
phone:L('Au téléphone','a2',10,'work','Se présenter, transférer et laisser un message.',['speaking','hold on','put you through','leave a message'],['Damien speaking.','Can I leave a message?','I’ll put you through.']),
email:L('E-mails professionnels','a2',12,'work','Comprendre et écrire un e-mail simple.',['regarding','attached','confirm','available','deadline'],['Please find the document attached.','Could you confirm your availability?']),
meetings:L('Réunions','a2',12,'work','Comprendre agenda, action et décision.',['agenda','minutes','action item','deadline','decision'],['Let’s move to the next item.','Who will take this action?']),
'idioms-common':L('Idiomes fréquents','a2',10,'idioms','Comprendre des expressions courantes en contexte.',['a piece of cake','once in a while','on the same page','under the weather'],['The test was a piece of cake.','Let’s make sure we’re on the same page.']),
'phrasal-common':L('Phrasal verbs essentiels','a2',12,'phrasal','Comprendre les verbes à particule les plus utiles.',['pick up','find out','set up','look for','look forward to'],['I’ll pick you up at eight.','We need to find out what happened.']),
'collocations-business':L('Collocations professionnelles','b1',12,'collocations','Parler plus naturellement avec les bonnes associations de mots.',['make a decision','meet a deadline','take responsibility','raise a question'],['We need to make a decision today.','Can we meet the deadline?']),
'connected-speech':L('Connected speech','b1',12,'pronunciation','Reconnaître les mots quand ils se lient et se réduisent.',['gonna','wanna','could you','did you','have to'],['What are you going to do?','Could you send it today?']),
'numbers-listening':L('13 ou 30 ?','b1',8,'pronunciation','Éliminer les confusions de nombres à l’oral.',['thirteen','thirty','fourteen','forty','fifteen','fifty'],['Room thirteen.','Thirty dollars.','Gate fourteen.']),
'false-friends':L('Faux amis','b1',10,'falsefriends','Éviter les erreurs typiques des francophones.',['actually','eventually','sensible','library','attend'],['Actually, I disagree.','She attended the meeting.'])
};

const q=(id,level,prompt,choices,correctIndex,skills,audioText)=>({id:`GEN-${id}`,domain:'general',level,part:null,title:'English',prompt,choices,correctIndex,skills,timeTargetSec:25,explanation:'Observe la phrase en contexte, puis retrouve-la plus tard sans traduire mot à mot.',audioScript:audioText?[{text:audioText,locale:'en-GB',gender:'female'}]:[],transcript:audioText||'',vocabulary:choices.filter(Boolean).slice(0,3)});

export function lessonQuestions(id){
 const l=LESSONS[id];if(!l)return[];const w=l.words,e=l.examples,out=[];
 out.push(q(`${id}-1`,l.level,`Que signifie « ${w[0]} » ?`,[l.goal,'Une date','Un lieu','Une profession'],0,[`general.${l.theme}`],w[0]));
 if(e[0])out.push(q(`${id}-2`,l.level,'Choisis la phrase anglaise la plus naturelle.',[e[0],'I wanting please this.','Me need that now.','Give me.'],0,[`general.${l.theme}`],e[0]));
 if(w[1])out.push(q(`${id}-3`,l.level,`Écoute et reconnais « ${w[1]} ».`,[w[1],w[0],w[2]||'goodbye','maybe'],0,[`general.${l.theme}`],w[1]));
 if(e[1])out.push(q(`${id}-4`,l.level,'Quelle phrase convient le mieux dans cette situation ?',[e[1],'No understand all.','English zero.','Why you say?'],0,[`general.${l.theme}`],e[1]));
 return out;
}

export const PLACEMENT_STAGES=[
{level:'pre-a1',questions:[
 q('place-pre1','pre-a1','Comment dit-on « merci » ?',['Thank you','Tomorrow','Ticket','Room'],0,['general.survival'],'Thank you'),
 q('place-pre2','pre-a1','Quelle phrase demande le nom ?',["What's your name?",'How much is it?','Where is the station?','What time is it?'],0,['general.identity'],"What's your name?"),
 q('place-pre3','pre-a1','Écoute le nombre.',['thirteen','thirty','three','fifty'],0,['general.numbers'],'thirteen'),
 q('place-pre4','pre-a1','À l’hôtel, quelle phrase est correcte ?',['I have a reservation.','I am reservation.','Reservation me.','Have room I.'],0,['general.hotel'],'I have a reservation.')
]},
{level:'a1',questions:[
 q('place-a11','a1','Choose the correct sentence.',['She works in London.','She work in London.','She working London.','She is work London.'],0,['general.grammar']),
 q('place-a12','a1','Best reply to “Where are you from?”',['I’m from France.','I’m thirty years.','At eight o’clock.','Two coffees.'],0,['general.identity']),
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
]}];

export function allGeneralQuestions(){const m=new Map();for(const s of PLACEMENT_STAGES)for(const x of s.questions)m.set(x.id,x);for(const id of Object.keys(LESSONS))for(const x of lessonQuestions(id))m.set(x.id,x);return[...m.values()]}
export function nextLessonId(profile,attempts=[]){const done=new Set(attempts.filter(a=>a.correct).map(a=>a.questionId));const order=Object.keys(LESSONS);return order.find(id=>lessonQuestions(id).some(q=>!done.has(q.id)))||order.at(-1)}
