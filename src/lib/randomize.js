function randomInt(max){
  if(max<=1)return 0;
  if(globalThis.crypto?.getRandomValues){
    // Rejection sampling avoids modulo bias.
    const limit=Math.floor(0x100000000/max)*max;
    const buf=new Uint32Array(1);
    do{globalThis.crypto.getRandomValues(buf)}while(buf[0]>=limit);
    return buf[0]%max;
  }
  return Math.floor(Math.random()*max);
}

export function randomOrder(length){
  const order=Array.from({length},(_,i)=>i);
  for(let i=order.length-1;i>0;i--){
    const j=randomInt(i+1);
    [order[i],order[j]]=[order[j],order[i]];
  }
  return order;
}

function validOrder(order,length){
  return Array.isArray(order)&&order.length===length&&new Set(order).size===length&&order.every(i=>Number.isInteger(i)&&i>=0&&i<length);
}

export function applyChoiceOrder(question,forcedOrder=null){
  const choices=Array.isArray(question?.choices)?question.choices:[];
  if(choices.length<2)return {...question,_choiceOrder:choices.map((_,i)=>i)};
  const order=validOrder(forcedOrder,choices.length)?[...forcedOrder]:randomOrder(choices.length);
  const originalCorrect=Number.isInteger(question.correctIndex)?question.correctIndex:0;
  const correctIndex=order.indexOf(originalCorrect);
  const explanations=Array.isArray(question.choiceExplanations)&&question.choiceExplanations.length===choices.length
    ?order.map(i=>question.choiceExplanations[i])
    :question.choiceExplanations;
  return {
    ...question,
    choices:order.map(i=>choices[i]),
    correctIndex,
    choiceExplanations:explanations,
    _choiceOrder:order
  };
}

export function randomSample(items,count){
  const arr=Array.isArray(items)?items:[];
  if(count>=arr.length)return randomOrder(arr.length).map(i=>arr[i]);
  return randomOrder(arr.length).slice(0,Math.max(0,count)).map(i=>arr[i]);
}
