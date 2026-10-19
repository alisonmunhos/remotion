# Vídeo "Imposto de Renda" — Vire à Esquerda

Projeto Remotion completo do vídeo (corpo de 67 s + fecho de 7,5 s = 74,6 s, 1080×1920, 30 fps).
A prévia aprovada foi renderizada a partir **exatamente** deste código. Para a versão final, só aumente a qualidade de render: não é preciso mudar nada no desenho.

## Para o Claude Code: como gerar a versão final

```bash
npm install
npm run studio          # abre o Remotion Studio para conferir (opcional)
npm run final           # render em 1080x1920, H.264 CRF 12, AAC 320 kbps -> out/final.mp4
```

Depois, ajuste o volume ao padrão das redes (-14 LUFS) sem re-encodar o vídeo:

```bash
ffmpeg -i out/final.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 320k out/final_instagram.mp4
```

Recomendações para o Instagram/TikTok não degradarem a imagem:
- Manter 1080×1920, 30 fps, H.264 (High), yuv420p, BT.709 — é o que `npm run final` já gera.
- CRF 12 já dá folga de qualidade; se o arquivo passar de ~200 MB, use CRF 14.
- Subir pelo app com a opção "Enviar na mais alta qualidade" ligada (Configurações > Uso de dados e qualidade da mídia).

### O que NÃO mudar (é a identidade aprovada)
- Paleta: só as 6 cores de `src/tokens.ts` (e transparências delas). Papéis de cada cor estão comentados lá.
- Traço: espessura 6 px, pontas redondas, filtro `#traco` (tremor 8x/s) em todo desenho.
- Preenchimentos: só hachura a 45° ou cor chapada com opacidade fixa. Nada de degradê, emoji ou ícone pronto.
- O mesmo personagem (`Pessoa`) e os mesmos pictogramas (`Picto`/`Medalhao`) no vídeo inteiro.
- Papéis entram pela direita e saem pela esquerda.
- O fecho (`public/fecho.mp4`) já está pronto e não deve ser refeito aqui (fontes dele na pasta `../fecho` do repositório).

### Se trocar a narração
Todas as animações estão presas ao tempo de cada palavra.
1. Substitua `public/narracao_corpo.wav` (corte o áudio exatamente antes de "Você pode acreditar em mim").
2. Gere a transcrição com tempo por palavra (ElevenLabs Speech-to-Text, `timestamps_granularity=word`) e salve como `scripts/transcricao.json`.
3. Rode `node scripts/gerar-dados.js <pasta com node_modules de d3-geo e topojson-client>` para atualizar `src/data/palavras.json` (legenda).
4. Ajuste os tempos fixos das cenas (`tIn`, `tOut` e os `t0` de cada elemento em `src/cenas-a.tsx` e `src/cenas-b.tsx`), além de `CORPO_S` em `src/tokens.ts`.

## Estrutura

| Arquivo | O que tem |
|---|---|
| `src/tokens.ts` | paleta, fontes, duração, funções de easing |
| `src/base.tsx` | mesa (fundo), papel 3D, traço, pessoa, manuscrito, capítulo, legenda palavra a palavra, linha de fonte, barra de progresso |
| `src/cenas-a.tsx` | cenas 01–04 e 16 (contracheque, pote, carteira, Receita/bolo) e pictogramas |
| `src/cenas-b.tsx` | cenas 05–15 e 17 (declaração, pra onde vai, mapas, EUA, hospital, novidade, próximo post) |
| `src/Video.tsx` | monta corpo + narração + fecho |
| `src/data/` | caminhos dos mapas e tempos das palavras (gerados por `scripts/gerar-dados.js`) |
| `public/` | narração, fecho pronto, fundo da mesa e fontes (todas SIL OFL) |
| `STORYBOARD.md` | roteiro visual cena a cena |

## Fontes e dados
- Fontes: Inter, JetBrains Mono, Caveat — SIL Open Font License (licenças em `public/fonts`).
- Mapa do Brasil: estados do IBGE (via click_that_hood). EUA: `us-atlas` (US Census Bureau, domínio público).
