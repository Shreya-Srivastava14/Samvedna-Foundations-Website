import os
import shutil
from PIL import Image

src_dir = "images/images"
backup_dir = "images/images_backup"

# Ensure backup directory exists
os.makedirs(backup_dir, exist_ok=True)

# List of files categorized
team_members = [
    'shweta.jpeg',
    'pra_kul.jpeg',
    'Roopam Sadh.jpeg',
    'Shyam Gupta.jpg',
    'Rahul Verma(Secratary).jpg',
    'Anju Kandhari.jpeg',
    'Niharika Upadh.jpeg',
    'shreya.jpeg',
    'vipulpic.jpeg'
]

partner_logos = [
    'mahilalogopartner.jpeg',
    'logojune4.jpg',
    'amcareslogo.jpeg',
    'sunstatspartners.jpeg',
    'logojune5.jpg',
    'Shrijipartners.jpeg',
    'aashrayapartners.jpeg',
    'logojune6.jpg',
    'logojune2.jpg',
    'navratanpartnerlogojune.jpeg',
    'logojune3.jpg'
]

hero_slides = [
    'homepageimagejune1.jpg',
    'homepageimagejune2.jpg',
    'homepageimagejune3.jpg',
    'homepageimagejune4.jpg',
    'homepageimagejune5.jpg',
    'homepageimagejune6.jpg',
    'homepageimagejune7.jpg',
    'pic201.jpeg',
    'pic202.jpeg',
    'pic203.jpeg'
]

# Grid items / cards (Project, Success stories, Gallery, Articles, etc.)
medium_images = [
    'founderspic201.jpeg',
    'projectashiyana.jpeg',
    'gyanshala.jpeg',
    'sanginiiii.jpeg',
    'samvednaeshiksha.jpg',
    'samvednapadbank.jpg',
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.JPG',
    'articlepic.jpeg',
    'Article eshiksha 2.jpg',
    'Article 3.jpg',
    'Sanitary pad bank 2.jpg',
    'sanitary pad banl 1.jpg',
    '1st eshiksha .jpg',
    'poojapalsuccessstory.jpeg',
    'rinkudevi.jpg',
    'gyanshalasuccessstory.jpeg'
]

special_images = [
    'samvendna foundatioin logo (1).png',
    'qrcode_final.png'
]

def crop_to_square(img):
    width, height = img.size
    if width == height:
        return img
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    return img.crop((left, top, right, bottom))

def backup_and_optimize(filename, category):
    src_path = os.path.join(src_dir, filename)
    backup_path = os.path.join(backup_dir, filename)
    
    if not os.path.exists(src_path):
        print(f"Skipping {filename}: Not found in src")
        return
        
    # Backup first if not already backed up
    if not os.path.exists(backup_path):
        shutil.copy2(src_path, backup_path)
        print(f"Backed up {filename}")
    
    # Process image
    with Image.open(backup_path) as img:
        if category == 'team':
            # Crop to square and resize to 300x300
            img = crop_to_square(img)
            img = img.resize((300, 300), Image.Resampling.LANCZOS)
            img = img.convert('RGB')
            img.save(src_path, 'JPEG', quality=85)
            print(f"Optimized team member: {filename} (cropped & resized to 300x300)")
            
        elif category == 'partner':
            # Resize max 200x200 keeping aspect ratio
            img.thumbnail((200, 200), Image.Resampling.LANCZOS)
            img = img.convert('RGB')
            img.save(src_path, 'JPEG', quality=85)
            print(f"Optimized partner logo: {filename} (thumbnail 200x200)")
            
        elif category == 'hero':
            # Keep original resolution (typically 800px wide) but compress to quality 75
            img = img.convert('RGB')
            img.save(src_path, 'JPEG', quality=75)
            print(f"Optimized hero slide: {filename} (compressed quality 75)")
            
        elif category == 'medium':
            # Thumbnail to max width 600px
            width, height = img.size
            if width > 600:
                new_height = int(height * (600 / width))
                img = img.resize((600, new_height), Image.Resampling.LANCZOS)
            img = img.convert('RGB')
            img.save(src_path, 'JPEG', quality=80)
            print(f"Optimized medium image: {filename} (resized to width 600)")
            
        elif category == 'special':
            # Handle Logo / QR code (preserve PNG format for logo if transparent)
            if filename.endswith('.png'):
                # Resize max width 300px
                width, height = img.size
                if width > 300:
                    new_height = int(height * (300 / width))
                    img = img.resize((300, new_height), Image.Resampling.LANCZOS)
                # Keep PNG format to preserve alpha transparency
                img.save(src_path, 'PNG', optimize=True)
                print(f"Optimized PNG special image: {filename}")
            else:
                img.thumbnail((400, 400), Image.Resampling.LANCZOS)
                img.save(src_path, quality=80)
                print(f"Optimized special image: {filename}")

# Run optimization for all categories
for f in team_members:
    backup_and_optimize(f, 'team')

for f in partner_logos:
    backup_and_optimize(f, 'partner')

for f in hero_slides:
    backup_and_optimize(f, 'hero')

for f in medium_images:
    backup_and_optimize(f, 'medium')

for f in special_images:
    backup_and_optimize(f, 'special')

print("All image optimizations completed!")
