from PIL import Image
import sys

# Usage: python image_background_change.py input.png output.png

if len(sys.argv) != 3:
    print("Usage: python image_background_change.py input.png output.png")
    sys.exit(1)

input_file = sys.argv[1]
output_file = sys.argv[2]

background_color = (20, 24, 31)  # Example: #14181F

img = Image.open(input_file).convert("RGBA")
bg = Image.new("RGBA", img.size, background_color + (255,))
bg.paste(img, (0, 0), img)
bg.convert("RGB").save(output_file, "PNG")