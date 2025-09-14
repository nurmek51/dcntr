# Assets Navigation and Replacement Guide

## 📁 Assets Location
All assets are located in: `/src/assets/`

## 🎨 Asset Usage Map

### 🏢 Header Component (`/src/components/layout/header.tsx`)
- **InDrive Logo**: `indrive-logo-65b35d.png` - Main logo on the left
- **Nomadia Icon**: `nomadia-icon.png` - Icon on the right side
- **Decentrathon Logo**: `decentrathon-logo-63c751.png` - Logo on the right side

### 👥 Client-Driver Section (`/src/components/sections/client-driver-section.tsx`)
- **Client Person**: `client-person.png` - Main client character image
- **Taxi Car**: `taxi-car-6da396.png` - Main taxi/driver vehicle image
- **InDrive Small Logo**: `indrive-logo-small.png` - Floating circular icons
- **Nomadia Small Icon**: `nomadia-icon-small.png` - Scattered decorative icons

## 🔄 How to Replace Assets

### Method 1: Direct File Replacement
1. Navigate to `/src/assets/`
2. Replace the file with the same name and format
3. Keep the same file extension (`.png`, `.svg`, etc.)
4. The changes will automatically reflect in the application

### Method 2: Import Path Update
If you want to use a different filename:

1. **Add your new asset** to `/src/assets/`
2. **Update the import statement** in the relevant component:

```tsx
// OLD
import clientPerson from '../../assets/client-person.png';

// NEW
import clientPerson from '../../assets/your-new-client-image.png';
```

## 📍 Specific Asset Locations on Screen

### Desktop Layout:
- **Client Section (Left Half)**:
  - Client person image: Center of left section
  - InDrive logos: 4 circular icons scattered around
  - Nomadia icons: 4 small icons floating in corners
  - Green star shapes: Background decorative elements

- **Taxi Driver Section (Right Half)**:
  - Taxi car image: Center of right section
  - InDrive logos: 4 circular icons scattered around
  - Nomadia icons: 4 small icons floating in corners
  - Green star shapes: Background decorative elements

- **Central Divider**: Green zigzag SVG pattern

### Mobile Layout:
- **Client Section (Top Screen)**:
  - Client person: Centered
  - 2 InDrive logos in circles
  - 2 Nomadia icons
  - Green decorative squares

- **Taxi Driver Section (Bottom Screen)**:
  - Taxi car: Centered
  - 2 InDrive logos in circles
  - 2 Nomadia icons
  - Green decorative squares

## 🎯 Quick Asset Replacement Commands

### Replace Client Image:
```bash
# Navigate to assets folder
cd src/assets

# Replace with your new image (keep same name)
cp /path/to/your/new-client-image.png client-person.png
```

### Replace Taxi Image:
```bash
cp /path/to/your/new-taxi-image.png taxi-car-6da396.png
```

### Replace InDrive Logo:
```bash
# For header
cp /path/to/your/new-logo.png indrive-logo-65b35d.png

# For floating icons
cp /path/to/your/new-small-logo.png indrive-logo-small.png
```

## 🛠️ Customization Tips

### Image Sizing:
- **Client Person**: Optimized for 280x380px (desktop), 180x250px (mobile)
- **Taxi Car**: Optimized for 320x180px (desktop), 200x110px (mobile)
- **InDrive Logos**: Circular containers 60x60px (desktop), 40x40px (mobile)
- **Nomadia Icons**: 35x35px (desktop), 25x25px (mobile)

### Color Scheme:
- **Primary Green**: `#94EA0D`
- **Background**: `#FFFEE9`
- **Text**: Black

### Layout Modifications:
To modify positions, edit the CSS classes in:
- `/src/components/sections/client-driver-section.tsx`

### Adding New Assets:
1. Add file to `/src/assets/`
2. Import in component: `import newAsset from '../../assets/new-asset.png';`
3. Use in JSX: `<img src={newAsset} alt="Description" />`

## 📱 Responsive Behavior
- **Desktop**: Side-by-side layout with zigzag divider
- **Tablet/Mobile**: Stacked layout, client first, then taxi driver on scroll
- **Breakpoint**: Uses Tailwind's `md:` (768px+) for desktop layout

## 🔍 Asset Quality Requirements
- **Format**: PNG for photos, SVG for icons/logos
- **Resolution**: 2x for retina displays recommended
- **Optimization**: Compress images to reduce bundle size
- **Accessibility**: Always include meaningful `alt` attributes

## 🚀 Development Workflow
1. Replace asset file
2. Restart dev server if needed: `npm run dev`
3. Check both desktop and mobile views
4. Verify all breakpoints work correctly

## 📝 Notes
- All assets use responsive sizing with Tailwind CSS
- Images are optimized with `object-contain` to maintain aspect ratios
- Mobile layout automatically stacks sections vertically
- Header remains fixed/overlay on all screen sizes
