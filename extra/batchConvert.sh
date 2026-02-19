for file in *.jpg *.png; do
  convert "$file" -resize 2000x2000\> "resized_$file"
  cwebp "resized_$file" -lossless -q 100 -o "${file%.png}.webp"
  rm "resized_$file"
done
