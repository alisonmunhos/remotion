# Vídeo 1 — Quem decide a temperatura?

Motion graphic vertical (1080×1920, 30 fps, 1min14) feito com Remotion, com narração e legendas sincronizadas.

- `public/narracao.wav` — narração (1,25×), já em −14 LUFS.
- `src/tempos.json` — tempos de cada trecho e de cada palavra. As cenas e as legendas são calculadas a partir dele.
- `src/scenes.tsx` — uma cena por trecho (01 a 11).
- `src/Captions.tsx` — legenda estilo TikTok com a palavra falada em destaque.
- `src/sfx.ts` — efeitos sonoros (momento e volume). Os arquivos ficam em `public/sfx`; `pop`, `boing` e `beep` foram sintetizados com ffmpeg, os demais vêm de remotion.media.

## Comandos

```bash
npm install
npm run dev      # Remotion Studio (http://localhost:3000)
npm run render   # gera out/video1.mp4
npm run player   # gera dist/ com a prévia web (player + MP3 + fontes)
```

Correções feitas no `tempos.json` original (início de palavra adiantado em ~0,3 s, conferido contra o áudio):
"Quanto" 22,72 s · "Agora," 26,86 s · "Ela" 44,48 s · "Quem" 67,02 s · "e" 68,72 s.
