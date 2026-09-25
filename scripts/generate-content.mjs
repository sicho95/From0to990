import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const out=join(root,'../public/content');
await mkdir(out,{recursive:true});
const Q=[];
const accents=['en-US','en-GB','en-AU','en-CA'];
const names=['Emma','Lucas','Olivia','Noah','Sofia','Liam','Chloe','Mason'];
const topics=['invoice','shipment','schedule','reservation','conference','budget','delivery','contract'];
const add=q=>Q.push({difficulty:1+(Q.length%5),origin:'original',...q});

for(let i=1;i<=6;i++) add({
 id:`P1-${String(i).padStart(3,'0')}`,part:1,title:'Photograph',
 prompt:'Which statement best describes the picture?',
 choices:['Several items are being arranged carefully.','A customer is paying at a counter.','The lights have just been turned off.','A meeting is beginning online.'],
 correctIndex:0,explanation:'Choose the statement that describes the visible action rather than a plausible but unrelated workplace detail.',
 skills:['detail','distractors'],timeTargetSec:18,
 audioScript:[
  {text:'A. Several items are being arranged carefully.',locale:accents[i%4],gender:'female'},
  {text:'B. A customer is paying at a counter.',locale:accents[(i+1)%4],gender:'male'},
  {text:'C. The lights have just been turned off.',locale:accents[(i+2)%4],gender:'female'},
  {text:'D. A meeting is beginning online.',locale:accents[(i+3)%4],gender:'male'}
 ],transcript:'Four descriptions of a workplace photograph.',vocabulary:['arranged','counter','meeting']
});

const p2=[
 ['Where will the seminar be held?',['In Room 204 on the second floor.','No, the speaker has arrived.','For about two hours.']],
 ['When did the package arrive?',['Early this morning.','By express delivery.','At the front desk.']],
 ['Why was the invoice returned?',['Because a signature was missing.','At the finance office.','Yes, it was printed yesterday.']],
 ['Who is taking over the presentation?',['Ms. Patel is.','On Thursday afternoon.','At the convention center.']],
 ['Could you send me the revised schedule?',['Sure, I will email it this afternoon.','The schedule was shorter than usual.','Yes, the room is available.']]
];
for(let i=1;i<=25;i++){const t=p2[(i-1)%p2.length];add({
 id:`P2-${String(i).padStart(3,'0')}`,part:2,title:'Question-Response',prompt:'Choose the best response.',
 choices:t[1],correctIndex:0,explanation:'Match the communicative function of the question. Related vocabulary alone is not enough.',
 skills:['p2-response','distractors'],timeTargetSec:18,
 audioScript:[{text:t[0],locale:accents[i%4],gender:i%2?'male':'female'}],transcript:t[0],vocabulary:['response','schedule','invoice']
});}

for(let i=1;i<=39;i++){const a=names[i%names.length],b=names[(i+3)%names.length],topic=topics[i%topics.length];add({
 id:`P3-${String(i).padStart(3,'0')}`,part:3,title:'Conversation',
 prompt:i%3===0?'What are the speakers mainly discussing?':i%3===1?'What problem does the woman mention?':'What will the man probably do next?',
 choices:i%3===0?[`A change to a ${topic}`,'A new company logo','A meal order','A parking policy']:i%3===1?['Some information is missing.','The office is closed.','A speaker cancelled.','The internet improved.']:['Send an updated file.','Call the building manager.','Meet a supplier.','Take a taxi home.'],
 correctIndex:0,explanation:'Use the whole conversation and implied meaning rather than matching a single word.',
 skills:i%3===0?['inference','paraphrase']:i%3===1?['detail','purpose']:['detail','inference'],timeTargetSec:38,
 audioScript:[
  {text:`${a}: Hi ${b}, did you see the note about the ${topic}?`,locale:accents[i%4],gender:'female'},
  {text:`${b}: Yes, but the draft is missing one section, so I could not send it to the client yet.`,locale:accents[(i+1)%4],gender:'male'},
  {text:`${a}: I can add the missing details this morning.`,locale:accents[i%4],gender:'female'},
  {text:`${b}: Great. Then I will send the updated file right away.`,locale:accents[(i+1)%4],gender:'male'}
 ],transcript:`${a} and ${b} discuss a ${topic}; information is missing and an updated file will be sent.`,vocabulary:[topic,'draft','client','updated']
});}

for(let i=1;i<=30;i++){const topic=topics[(i+2)%topics.length];add({
 id:`P4-${String(i).padStart(3,'0')}`,part:4,title:'Talk',
 prompt:i%3===0?'What is the purpose of the talk?':i%3===1?'What does the speaker ask listeners to do?':'What will happen next?',
 choices:i%3===0?['To explain a change in procedure.','To introduce a menu.','To announce a sports result.','To compare products.']:i%3===1?['Confirm attendance online.','Leave the building immediately.','Contact a travel agency.','Bring food.']:['A follow-up email will be sent.','The store will close permanently.','A cash refund will be issued.','Guests will board a train.'],
 correctIndex:0,explanation:'Focus on purpose, sequence and explicit instructions in the talk.',
 skills:['detail',i%2===0?'purpose':'inference'],timeTargetSec:38,
 audioScript:[
  {text:'Good morning. This is a brief workplace announcement.',locale:accents[i%4],gender:'female'},
  {text:`Starting next week, the procedure for handling ${topic} requests will change.`,locale:accents[(i+1)%4],gender:'male'},
  {text:'Please confirm your attendance online by Friday.',locale:accents[(i+2)%4],gender:'female'},
  {text:'A follow-up email with all details will be sent this afternoon.',locale:accents[(i+3)%4],gender:'male'}
 ],transcript:`A workplace announcement about a change involving ${topic} requests.`,vocabulary:[topic,'procedure','attendance','follow-up']
});}

const g=[
 ['All visitors must sign in before ____ the building.',['entering','enter','entered','to enter'],0],
 ['The manager asked whether the report had been completed ____ time.',['on','for','with','at'],0],
 ['Because the shipment was delayed, the customer requested a full ____.',['refund','reserve','record','repair'],0],
 ['Ms. Chen is responsible for ____ the weekly sales figures.',['reviewing','review','reviewed','reviews'],0],
 ['Please submit the form no later ____ Friday afternoon.',['than','to','by','from'],2]
];
for(let i=1;i<=30;i++){const t=g[(i-1)%g.length];add({
 id:`P5-${String(i).padStart(3,'0')}`,part:5,title:'Incomplete Sentence',prompt:t[0],choices:t[1],correctIndex:t[2],
 explanation:'Identify the grammatical function, verb form, preposition or vocabulary item required by the sentence.',
 skills:['grammar',i%3===0?'timing':'detail'],timeTargetSec:28,vocabulary:['visitors','report','shipment','figures']
});}

for(let i=1;i<=16;i++){const topic=topics[(i+3)%topics.length];add({
 id:`P6-${String(i).padStart(3,'0')}`,part:6,title:'Text Completion',
 passage:`Dear team,\n\nThe new ${topic} procedure begins next Monday. Please review the attached guidelines. Every form must be checked carefully before it is submitted.\n\nOperations Department`,
 prompt:'Choose the best word or phrase to complete the message.',choices:['implemented','implementing','implementation','implements'],correctIndex:0,
 explanation:'Read the entire message and identify the word form required by the sentence.',
 skills:['grammar','detail'],timeTargetSec:55,vocabulary:[topic,'guidelines','submitted']
});}

for(let i=1;i<=54;i++){const topic=topics[(i+5)%topics.length],name=names[(i+2)%names.length];const mode=i%3;add({
 id:`P7-${String(i).padStart(3,'0')}`,part:7,title:'Reading Comprehension',
 passage:`To: ${name}@company.com\nSubject: ${topic} update\n\nHello ${name},\n\nWe reviewed the recent ${topic} request and will finalize the remaining details by Thursday. The client asked us to include a revised schedule and a short summary of expected costs. If you send the draft before noon, I will forward it to the finance team this afternoon.\n\nProject Office`,
 prompt:mode===0?'Why did the writer send this email?':mode===1?'What does the client want included?':'What will probably happen next?',
 choices:mode===0?['To request a revised draft.','To book a table.','To cancel a shipment.','To compare hotel prices.']:mode===1?['A revised schedule and expected costs.','A restaurant recommendation.','A parking permit.','A leave list.']:['The draft will be forwarded to finance.','The office will close.','The customer will visit a warehouse.','The manager will call a taxi.'],
 correctIndex:0,explanation:'Use scanning, paraphrase recognition and the sequence of actions in the message.',
 skills:[mode===0?'purpose':mode===1?'detail':'inference','paraphrase'],timeTargetSec:75,vocabulary:[topic,'revised','costs','draft']
});}

if(Q.length!==200) throw new Error(`Expected 200 questions, got ${Q.length}`);
const meta={title:'From0to990 content',version:'2026.09.25.1',questionCount:Q.length,source:'original',parts:{1:6,2:25,3:39,4:30,5:30,6:16,7:54}};
await writeFile(join(out,'content.json'),JSON.stringify({meta,questions:Q},null,2));
console.log(`Generated ${Q.length} questions`);
