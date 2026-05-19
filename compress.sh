#!/bin/bash
# compress.sh — convierte todo a webp (imágenes) y mp4 (vídeos) y comprime
# Uso: ./compress.sh
# Requiere: imagemagick (convert) y ffmpeg

# ── CONFIGURACIÓN ──────────────────────────────────────────
CARPETAS="mm me mt ms"   # carpetas a procesar
WEBP_QUALITY=80          # calidad webp (0-100). 80 es buen equilibrio
IMG_MAX_PX=1200          # tamaño máximo en píxeles (lado más largo)
VIDEO_CRF=28             # calidad vídeo (18=alta, 28=media, 35=baja)
VIDEO_SCALE=640          # anchura máxima del vídeo en píxeles
# ───────────────────────────────────────────────────────────

echo "── Iniciando conversión a webp / mp4 ──"

for CARPETA in $CARPETAS; do
  if [ ! -d "$CARPETA" ]; then
    echo "  [skip] carpeta '$CARPETA' no encontrada"
    continue
  fi

  echo ""
  echo "📁 $CARPETA/"

  # IMÁGENES → webp
  for EXT in jpg JPG jpeg JPEG png PNG; do
    for FILE in "$CARPETA"/*.$EXT; do
      [ -f "$FILE" ] || continue
      BASE="${FILE%.*}"
      OUT="${BASE}.webp"
      SIZE_ANTES=$(du -k "$FILE" | cut -f1)

      convert "$FILE" \
        -resize "${IMG_MAX_PX}x${IMG_MAX_PX}>" \
        -quality $WEBP_QUALITY \
        -strip \
        "$OUT"

      SIZE_DESPUES=$(du -k "$OUT" | cut -f1)
      rm "$FILE"   # borrar original
      echo "  ✓ $(basename $FILE) → $(basename $OUT)  ${SIZE_ANTES}KB → ${SIZE_DESPUES}KB"
    done
  done

  # VÍDEOS → mp4 recodificado
  for EXT in mov MOV avi AVI mkv MKV; do
    for FILE in "$CARPETA"/*.$EXT; do
      [ -f "$FILE" ] || continue
      BASE="${FILE%.*}"
      OUT="${BASE}.mp4"
      SIZE_ANTES=$(du -k "$FILE" | cut -f1)

      if ffmpeg -i "$FILE" \
        -vf "scale=${VIDEO_SCALE}:-2" \
        -c:v libx264 -crf $VIDEO_CRF -preset fast \
        -an -movflags +faststart \
        -y "$OUT" 2>/dev/null; then
        rm "$FILE"
        SIZE_DESPUES=$(du -k "$OUT" | cut -f1)
        echo "  ✓ $(basename $FILE) → $(basename $OUT)  ${SIZE_ANTES}KB → ${SIZE_DESPUES}KB"
      else
        echo "  ✗ ERROR convirtiendo $(basename $FILE), no se borra el original"
        rm -f "$OUT"
      fi
    done
  done

  # MP4 ya existentes → recomprimir en sitio
  for FILE in "$CARPETA"/*.mp4; do
    [ -f "$FILE" ] || continue
    TMP="${FILE%.mp4}_tmp.mp4"
    SIZE_ANTES=$(du -k "$FILE" | cut -f1)

    if ffmpeg -i "$FILE" \
      -vf "scale=${VIDEO_SCALE}:-2" \
      -c:v libx264 -crf $VIDEO_CRF -preset fast \
      -an -movflags +faststart \
      -y "$TMP" 2>/dev/null; then
      mv "$TMP" "$FILE"
      SIZE_DESPUES=$(du -k "$FILE" | cut -f1)
      echo "  ✓ $(basename $FILE)  ${SIZE_ANTES}KB → ${SIZE_DESPUES}KB"
    else
      echo "  ✗ ERROR recomprimiendo $(basename $FILE), se conserva el original"
      rm -f "$TMP"
    fi
  done

done

echo ""
echo "── Listo. Recuerda actualizar FILE_OVERRIDES en el HTML ──"
echo "   Todas las imágenes son ahora .webp"
echo "   Todos los vídeos son ahora .mp4"