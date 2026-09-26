import {applyChoiceOrder} from '../src/lib/randomize.js';

const q={
  id:'TEST',
  choices:['Correct','Wrong B','Wrong C','Wrong D'],
  correctIndex:0,
  choiceExplanations:['why A','why B','why C','why D']
};
for(const order of [[1,0,2,3],[3,2,1,0],[2,3,0,1]]){
  const x=applyChoiceOrder(q,order);
  if(x.choices[x.correctIndex]!=='Correct')throw new Error('Bonne réponse perdue pendant le mélange');
  if(x.choiceExplanations[x.correctIndex]!=='why A')throw new Error('Explication non remappée');
  if(x._choiceOrder.join(',')!==order.join(','))throw new Error('Permutation non conservée');
}
console.log('Choice randomization QA OK');
