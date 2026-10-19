#!/usr/bin/env bash
# Monta o fecho: quadros renderizados (render.js) + narração + mp4 da marca.
# A crase coral (crase.png) cobre a crase creme da marca até o quadro 19, quando a crase coral original assume.
# Uso: ./montar.sh <narracao.mp3> <fecho-marca.mp4> <saida.mp4>
set -e
cd "$(dirname "$0")"
N=$(ls frames/*.png | wc -l)
DUR=$(python3 -c "print($N/30)")
ffmpeg -v error -y -framerate 30 -i frames/%04d.png -i "$1" -i "$2" -i crase.png -filter_complex "\
[0:v]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setsar=1[v0];\
[2:v]scale=in_color_matrix=bt709:in_range=tv,format=rgb24[m];\
[m][3:v]overlay=376:840:enable='lt(n,19)':format=rgb,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setsar=1,fps=30[v1];\
[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=$DUR[a0];\
[2:a]aresample=48000,aformat=channel_layouts=stereo[a1];\
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
 -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p \
 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -c:a aac -b:a 256k -movflags +faststart "$3"
