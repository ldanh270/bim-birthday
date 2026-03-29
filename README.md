# 🎂 Bim Birthday

An interactive birthday web experience built with React, TypeScript, and React Three Fiber.  
It includes a cinematic opening card, 3D photo scene, background music, and gesture-based
interaction.

## Features

- Animated invitation card overlay
- 3D scene rendering with **@react-three/fiber**
- Two display modes: `FORMED` and `CHAOS`
- Photo gallery support via `uploadedPhotos`
- Optional gesture control via `GestureController`
- Background music playback (`public/song.mp3`)
- Error boundary for 3D resource loading failures

## Tech Stack

- React + TypeScript
- Vite
- @react-three/fiber
- @react-three/drei
- Tailwind CSS (utility classes in JSX)

## Project Structure

```text
public/
  photos/              # birthday photos used in the 3D scene
  song.mp3             # background audio
src/
  components/
    Experience.tsx
    UIOverlay.tsx
    GestureController.tsx
  types/
  App.tsx
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Photo Management

Photos are currently hardcoded in `App.tsx` inside:

- `uploadedPhotos` state
- Format: `"/photos/<file-name>.jpeg"`

When adding new images to `public/photos`, also add the corresponding path to `uploadedPhotos`.

## Notes

- If an image fails to load in the 3D scene, verify:
  - exact filename match
  - correct extension (`.jpg`, `.jpeg`, `.png`, etc.)
- Some browsers block autoplay audio; playback is attempted with fallback handling in `useEffect`.

## License

Personal project for private/non-commercial use.
