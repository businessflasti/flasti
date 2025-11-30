-- Agregar campos de personalización visual a custom_offers
ALTER TABLE custom_offers
ADD COLUMN IF NOT EXISTS task_type TEXT DEFAULT 'Audio',
ADD COLUMN IF NOT EXISTS block_bg_color TEXT DEFAULT '#255BA5',
ADD COLUMN IF NOT EXISTS image_bg_color TEXT DEFAULT '#255BA5',
ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';

-- Actualizar ofertas existentes con valores por defecto
UPDATE custom_offers
SET 
  task_type = COALESCE(task_type, 'Audio'),
  block_bg_color = COALESCE(block_bg_color, '#255BA5'),
  image_bg_color = COALESCE(image_bg_color, '#255BA5'),
  video_url = COALESCE(video_url, '')
WHERE task_type IS NULL OR block_bg_color IS NULL OR image_bg_color IS NULL OR video_url IS NULL;
