import struct
import zlib

def create_simple_png(size, filename):
    width = height = size
    purple_r, purple_g, purple_b = 102, 126, 234
    white_r, white_g, white_b = 255, 255, 255
    
    img_data = []
    for y in range(height):
        row = []
        for x in range(width):
            r = int(purple_r + (118 - purple_r) * y / height)
            g = int(purple_g + (75 - purple_g) * y / height)
            b = int(purple_b + (162 - purple_b) * y / height)
            
            center_x, center_y = width // 2, height // 2
            letter_size = int(size * 0.4)
            
            is_letter = False
            if abs(x - center_x) < letter_size // 4 and abs(y - center_y) < letter_size // 2:
                is_letter = True
            elif y < center_y and abs(y - (center_y - letter_size // 4)) < letter_size // 8 and x > center_x and x < center_x + letter_size // 2:
                is_letter = True
            elif abs(y - center_y) < letter_size // 8 and x > center_x and x < center_x + letter_size // 3:
                is_letter = True
            
            if is_letter:
                row.extend([white_r, white_g, white_b, 255])
            else:
                row.extend([r, g, b, 255])
        
        img_data.append(bytes(row))
    
    def png_pack(tag, data):
        chunk_head = tag + data
        return struct.pack("!I", len(data)) + chunk_head + struct.pack("!I", zlib.crc32(chunk_head) & 0xffffffff)
    
    png_data = b'\x89PNG\r\n\x1a\n'
    png_data += png_pack(b'IHDR', struct.pack("!2I5B", width, height, 8, 6, 0, 0, 0))
    raw_data = b''.join(b'\x00' + row for row in img_data)
    png_data += png_pack(b'IDAT', zlib.compress(raw_data, 9))
    png_data += png_pack(b'IEND', b'')
    
    with open(filename, 'wb') as f:
        f.write(png_data)
    
    print(f'✅ Creado: {filename}')

print('🎨 Creando iconos...\n')
create_simple_png(16, 'icon16.png')
create_simple_png(48, 'icon48.png')
create_simple_png(128, 'icon128.png')

print('\n🎉 ¡Iconos creados exitosamente!')
print('📁 Ubicación: ~/Desktop/chrome-extension/')
print('\n✅ Ahora puedes cargar la extensión en Chrome')
