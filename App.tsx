
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { GestureController } from './components/GestureController';
import { SceneMode } from './types';

// Simple Error Boundary to catch 3D resource loading errors (like textures)
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error loading 3D scene:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can customize this fallback UI
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-[#ADD8E6] font-serif p-8 text-center">
          <div>
            <h2 className="text-2xl mb-2">Something went wrong</h2>
            <p className="opacity-70">A resource failed to load (likely a missing image). Check the console for details.</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 border border-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-black transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [mode, setMode] = useState<SceneMode>(SceneMode.FORMED);
  const [handPosition, setHandPosition] = useState<{ x: number; y: number; detected: boolean }>({ x: 0.5, y: 0.5, detected: false });
  // Default to the actual photos in public/photos
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    '/photos/IMG_1686058167670_1687187842924.jpg',
    '/photos/IMG_20230606_210506.jpg',
    '/photos/IMG_20241002_234703_014.jpg',
    '/photos/IMG_20241002_234705_668.jpg',
    '/photos/received_1041058090472192.jpeg',
    '/photos/received_1130687188353927.jpeg',
    '/photos/received_1481050892477044.jpeg',
    '/photos/received_419739320666904 - Copy.jpeg',
    '/photos/received_555805509791306.jpeg',
    '/photos/received_572765741125531.jpeg',
    '/photos/received_613394867173208.jpeg',
    '/photos/received_630331674946234.jpeg',
    '/photos/received_684719863491467.jpeg',
    '/photos/received_708831924175840.jpeg',
    '/photos/received_724953295848901.jpeg',
    '/photos/received_784712933230902.jpeg',
    '/photos/received_842067888102242.jpeg',
    '/photos/received_859086068654099.jpeg',
    '/photos/received_894174548535747.jpeg',
    '/photos/received_962633061060995.jpeg'
  ]);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [twoHandsDetected, setTwoHandsDetected] = useState(false);
  const [closestPhoto, setClosestPhoto] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);


  // Check for share parameter in URL on mount
  useEffect(() => {
    // Disabled loadSharedPhotos effect as per "tắt chế độ tự thêm đi"
    /*
    const loadSharedPhotos = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('share');

      if (!shareId) return;

      setIsSharedView(true);
      setIsLoadingShare(true);

      try {
        // Try API first (works in vercel dev and production)
        try {
          const response = await fetch(`/api/share?id=${shareId}`);
          const data = await response.json();

          if (response.ok && data.success) {
            setUploadedPhotos(data.images);
            return;
          }
        } catch (apiError) {
          console.log('API not available, trying localStorage fallback');
        }

        // Fallback to localStorage if API fails (pure vite dev mode)
        const shareDataStr = localStorage.getItem(`share_${shareId}`);
        if (shareDataStr) {
          const shareData = JSON.parse(shareDataStr);
          setUploadedPhotos(shareData.images);
        } else {
          console.error('Share not found');
        }
      } catch (error) {
        console.error('Error loading shared photos:', error);
      } finally {
        setIsLoadingShare(false);
      }
    };

    loadSharedPhotos();
    */
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === SceneMode.FORMED ? SceneMode.CHAOS : SceneMode.FORMED));
  };

  const handleHandPosition = (x: number, y: number, detected: boolean) => {
    setHandPosition({ x, y, detected });
  };

  const handleTwoHandsDetected = (detected: boolean) => {
    setTwoHandsDetected(detected);
  };

  const handleClosestPhotoChange = (photoUrl: string | null) => {
    setClosestPhoto(photoUrl);
  };

  const handlePhotosUpload = (photos: string[]) => {
    setUploadedPhotos(photos);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] overflow-hidden">
      
      {/* Feminine Invitation Card Overlay with Silk Effect */}
      <div 
        className={`absolute inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${isOpened ? 'pointer-events-none' : ''}`}
      >
        {/* Left Silk Curtain */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full bg-[#FFF5F5] z-10 transition-transform duration-[1500ms] ease-in-out ${isOpened ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ 
            boxShadow: 'inset -20px 0 50px rgba(255,182,193,0.2)',
            background: 'linear-gradient(to right, #FFF5F5, #FFF0F0)'
          }}
        >
          {/* Soft silk texture lines */}
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_20px,_rgba(255,182,193,0.3)_21px)]"></div>
        </div>
        
        {/* Right Silk Curtain */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full bg-[#FFF5F5] z-10 transition-transform duration-[1500ms] ease-in-out ${isOpened ? 'translate-x-full' : 'translate-x-0'}`}
          style={{ 
            boxShadow: 'inset 20px 0 50px rgba(255,182,193,0.2)',
            background: 'linear-gradient(to left, #FFF5F5, #FFF0F0)'
          }}
        >
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_20px,_rgba(255,182,193,0.3)_21px)]"></div>
        </div>

        {/* Content Layer (Feminine Card) */}
        <div className={`relative z-20 flex flex-col items-center justify-center transition-all duration-[1000ms] ${isOpened ? 'opacity-0 scale-90 blur-md' : 'opacity-100 scale-100'}`}>
          
          {/* Soft Glow behind the card */}
          <div className="absolute w-[120%] h-[120%] bg-[#FFB6C1]/20 blur-[80px] rounded-full"></div>
          
          {/* Floating Balloons and Petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {/* Balloons */}
             {[...Array(8)].map((_, i) => (
               <div 
                 key={`balloon-${i}`}
                 className="absolute animate-bounce"
                 style={{
                   bottom: `-10%`,
                   left: `${10 + i * 12}%`,
                   animationDuration: `${3 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 2}s`,
                   opacity: 0.6
                 }}
               >
                 <div className="flex flex-col items-center">
                    <div 
                      className="w-10 h-12 rounded-[50%_50%_50%_50%/40%_40%_60%_60%]"
                      style={{ 
                        backgroundColor: ['#FFB6C1', '#ADD8E6', '#FFFDD0', '#E0F2FE'][i % 4],
                        boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div className="w-[1px] h-10 bg-white/40"></div>
                 </div>
               </div>
             ))}

             {/* Petals */}
             {[...Array(15)].map((_, i) => (
               <div 
                 key={`petal-${i}`}
                 className="absolute w-2 h-2 bg-[#FFB6C1] rounded-full animate-pulse opacity-40"
                 style={{
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 5}s`,
                   transform: `scale(${Math.random() * 1.5})`
                 }}
               />
             ))}
          </div>

          {/* The Feminine Card */}
          <div className="relative w-[85vw] max-w-md aspect-[3/4.5] bg-white/80 backdrop-blur-md border-[6px] border-white shadow-[0_20px_60px_rgba(255,182,193,0.3)] rounded-[3rem] p-10 flex flex-col items-center justify-between text-center overflow-hidden">
            
            {/* Floral Decorative Corners */}
            <div className="absolute top-0 left-0 w-24 h-24 text-[#FFB6C1] opacity-40 rotate-0 p-4">🌸</div>
            <div className="absolute top-0 right-0 w-24 h-24 text-[#FFB6C1] opacity-40 rotate-90 p-4">🌸</div>
            <div className="absolute bottom-0 left-0 w-24 h-24 text-[#FFB6C1] opacity-40 -rotate-90 p-4">🌸</div>
            <div className="absolute bottom-0 right-0 w-24 h-24 text-[#FFB6C1] opacity-40 180 p-4">🌸</div>

            <div className="flex flex-col items-center mt-6">
              <div className="w-32 h-32 mb-8 bg-[#FFF0F0] rounded-full flex items-center justify-center shadow-inner relative">
                <span className="text-6xl animate-bounce select-none">🎂</span>
                <div className="absolute -top-2 -right-2 text-3xl">🎀</div>
              </div>
              
              <h3 className="text-[12px] uppercase tracking-[0.4em] text-[#FFB6C1] mb-3 font-serif font-bold">Sweetest Birthday</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-[#FF8E9E] mb-6 leading-tight italic">Happy Birthday, Bim</h2>
              
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#FFB6C1] to-transparent mb-6"></div>
              
              <p className="text-[#888] font-serif text-lg italic leading-relaxed max-w-[260px] select-none">
                "May your day be as beautiful and sweet as a garden in full bloom."
              </p>
            </div>

            <button 
              onClick={() => setIsOpened(true)}
              className="group relative pointer-events-auto px-12 py-4 overflow-hidden rounded-full bg-[#FFB6C1] transition-all duration-500 hover:bg-[#FF8E9E] hover:shadow-[0_10px_30px_rgba(255,142,158,0.4)] hover:-translate-y-1 active:scale-95"
            >
              <span className="relative z-10 text-white font-serif tracking-[0.2em] text-sm font-bold">
                Open Your Gift ✧
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            <div className="mb-4 text-[#FFB6C1] opacity-60 text-xl tracking-[0.5em]">
              ✨ 🦋 ✨
            </div>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 4, 20], fov: 45 }}
          gl={{ antialias: false, stencil: false, alpha: false }}
          shadows
        >
          <Suspense fallback={null}>
            <Experience mode={mode} handPosition={handPosition} uploadedPhotos={uploadedPhotos} twoHandsDetected={twoHandsDetected} onClosestPhotoChange={handleClosestPhotoChange} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <Loader
        containerStyles={{ background: '#E0F2FE' }}
        innerStyles={{ width: '300px', height: '10px', background: '#BAE6FD' }}
        barStyles={{ background: '#ADD8E6', height: '10px' }}
        dataStyles={{ color: '#ADD8E6', fontFamily: 'Cinzel' }}
      />

      <UIOverlay
        mode={mode}
        onToggle={toggleMode}
        onPhotosUpload={handlePhotosUpload}
        hasPhotos={uploadedPhotos.length > 0}
        uploadedPhotos={uploadedPhotos}
        isSharedView={isSharedView}
      />

      {/* Loading indicator for shared photos */}
      {isLoadingShare && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-[#ADD8E6] font-serif text-xl">
            加载分享的照片中...
          </div>
        </div>
      )}

      {/* Gesture Control Module */}
      <GestureController currentMode={mode} onModeChange={setMode} onHandPosition={handleHandPosition} onTwoHandsDetected={handleTwoHandsDetected} />

      {/* Photo Overlay - Shows when two hands detected */}
      {closestPhoto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
          {/* Semi-transparent backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Polaroid frame with photo */}
          <div className="relative z-50 transform transition-all duration-500 ease-out animate-scale-in">
            {/* Polaroid container */}
            <div className="bg-white p-4 pb-8 shadow-2xl" style={{ width: '60vmin', maxWidth: '600px' }}>
              {/* Light Blue clip at top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-6 bg-gradient-to-b from-[#ADD8E6] to-[#87CEEB] rounded-sm shadow-lg"></div>

              {/* Photo */}
              <img
                src={closestPhoto}
                alt="Selected Memory"
                className="w-full aspect-square object-cover"
              />

              {/* Text label */}
              <div className="text-center mt-4 font-serif text-gray-700 text-lg">
                Birthday Wish
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
