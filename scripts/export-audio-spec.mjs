import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {allGeneralQuestions} from '../src/lib/curriculum.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const toeic=JSON.parse(await readFile(resolve(root,'public/content/content.json'),'utf8')).questions;
const questions=[...allGeneralQuestions(),...toeic];

const pools={
  'en-GB':{
    female:['bf_emma','bf_isabella','bf_lily','bf_alice'],
    male:['bm_george','bm_daniel','bm_lewis','bm_fable']
  },
  'en-US':{
    female:['af_heart','af_bella','af_sarah','af_nova'],
    male:['am_michael','am_adam','am_onyx','am_liam']
  }
};

const entries=new Map();
for(const q of questions){
  for(const item of q.audioScript||[]){
    const text=String(item.text||'').trim();if(!text)continue;
    const locale=item.locale||'en-GB',gender=item.gender||'female';
    const key=`${locale}|${gender}|${text}`;
    if(entries.has(key))continue;
    const supported=Boolean(pools[locale]?.[gender]?.length);
    const hash=createHash('sha256').update(key).digest('hex');
    const pool=supported?pools[locale][gender]:[];
    const voice=supported?pool[parseInt(hash.slice(0,8),16)%pool.length]:null;
    entries.set(key,{
      key,text,locale,gender,voice,supported,
      file:`${hash.slice(0,24)}.mp3`,
      engine:'Kokoro-82M'
    });
  }
}
const spec={
  version:1,
  engine:{name:'Kokoro-82M',license:'Apache-2.0',sampleRate:24000},
  entries:[...entries.values()]
};
await mkdir(resolve(root,'public/audio'),{recursive:true});
await writeFile(resolve(root,'public/audio/audio-spec.json'),JSON.stringify(spec,null,2));
console.log(`Audio spec: ${spec.entries.length} segments, ${spec.entries.filter(x=>x.supported).length} neural candidates`);
