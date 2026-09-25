#!/usr/bin/env python3
import json, pathlib, subprocess, tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT=pathlib.Path(__file__).resolve().parents[1]
SPEC_PATH=ROOT/'public'/'audio'/'audio-spec.json'
OUT=ROOT/'public'/'audio'/'generated'
MANIFEST=ROOT/'public'/'audio'/'audio-manifest.json'
OUT.mkdir(parents=True,exist_ok=True)

spec=json.loads(SPEC_PATH.read_text())
pipelines={}
files={}
expected=set()

def pipeline_for(locale):
    code='b' if locale=='en-GB' else 'a'
    if code not in pipelines:
        pipelines[code]=KPipeline(lang_code=code)
    return pipelines[code]

for e in spec['entries']:
    if not e.get('supported'):
        continue
    target=OUT/e['file']
    expected.add(target.name)
    if not target.exists():
        pipe=pipeline_for(e['locale'])
        chunks=[]
        for _,_,audio in pipe(e['text'],voice=e['voice'],speed=1.0,split_pattern=r'\n+'):
            if hasattr(audio,'cpu'):
                audio=audio.cpu().numpy()
            chunks.append(np.asarray(audio,dtype=np.float32).reshape(-1))
        if not chunks:
            raise RuntimeError(f"No audio generated for {e['key']}")
        pcm=np.concatenate(chunks)
        with tempfile.NamedTemporaryFile(suffix='.wav',delete=False) as tmp:
            wav=pathlib.Path(tmp.name)
        sf.write(wav,pcm,24000)
        subprocess.run([
            'ffmpeg','-y','-loglevel','error','-i',str(wav),
            '-codec:a','libmp3lame','-q:a','3',str(target)
        ],check=True)
        wav.unlink(missing_ok=True)
    files[e['key']]={
        'url':f"./audio/generated/{e['file']}",
        'voice':e['voice'],
        'accent':'British' if e['locale']=='en-GB' else 'American',
        'locale':e['locale'],
        'gender':e['gender'],
        'engine':'Kokoro-82M',
        'license':'Apache-2.0'
    }

for p in OUT.glob('*.mp3'):
    if p.name not in expected:
        p.unlink()

manifest={
    'version':1,
    'engine':spec['engine'],
    'strategy':{
        'speakingReference':'British English',
        'generalEnglish':'British-majority with male/female variation; American exposure from B1',
        'unsupportedAccents':'System TTS or authorized ETS audio until a faithful local neural voice is available'
    },
    'files':files
}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f"Generated/verified {len(files)} neural MP3 segments")
