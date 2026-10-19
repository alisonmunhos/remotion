# Quadros de teste — direção visual

`frame_01.png` … `frame_08.png` (1080×1920). Gerados por `gerar.js` (SVG desenhado em código → PNG via Chromium/Playwright).

## Fontes (todas com licença aberta)
- **Inter** (SIL OFL): legendas e rótulos.
- **JetBrains Mono** (SIL OFL): indicador de capítulo, valores, linha de fonte.
- **Caveat** (SIL OFL, Google Fonts): textos manuscritos. Arquivos e licença em `fonts/`.

## Dados geográficos
- Estados do Brasil: `brazil-states.geojson` (click_that_hood, a partir de dados do IBGE).
- EUA: `us-atlas@3` (US Census Bureau, domínio público).
- Projeção: `d3-geo`; `topojson-client`.

## Papel das cores
| Cor | Papel |
|---|---|
| Creme `#EEE9E1` | fundo e papel dos objetos |
| Escuro `#141414` | traço, textos, pictogramas |
| Coral `#FF5F45` | foco / "mão do narrador": capítulo, manuscritos, círculos, rasuras, palavra-chave da legenda, elemento ativo |
| Ocre `#C9A26B` | apoio neutro: sombras do papel, hachura dos mapas, massa do bolo, conteúdo do pote |
| Vermelho `#9B2C2C` | o que é tirado de você: descontos e carimbo DESCONTADO |
| Roxo `#7A5CC4` | o Estado / dinheiro público: carteira de trabalho, frontão da Receita, Nordeste, confeitos do bolo (eco do prédio) |

## Regerar
```
cd <pasta-com-dados>; npm i playwright-core@1.56.1 d3-geo@3.1.1 topojson-client@3.1.0
node gerar.js <pasta-com-dados> [frame_0X]
```
