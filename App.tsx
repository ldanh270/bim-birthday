import React, { useState, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { UIOverlay } from "./components/UIOverlay";
import { GestureController } from "./components/GestureController";
import { SceneMode } from "./types";

// Simple Error Boundary to catch 3D resource loading errors (like textures)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
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
						<p className="opacity-70">
							A resource failed to load (likely a missing image). Check the console for details.
						</p>
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
	const [handPosition, setHandPosition] = useState<{ x: number; y: number; detected: boolean }>({
		x: 0.5,
		y: 0.5,
		detected: false,
	});
	// Default to the actual photos in public/photos
	const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
		"/photos/IMG_1686058167670_1687187842924.jpeg",
		"/photos/received_555805509791306.jpeg",
		"/photos/IMG_1766766953536_1766766967910.jpeg",
		"/photos/IMG_1767183254426_1767183258617.jpeg",
		"/photos/IMG_1771044312014_1771044330902.jpeg",
		"/photos/IMG_1771044312028_1771044331553.jpeg",
		"/photos/Locket_1771897171184_77.jpeg",
		"/photos/Messenger_creation_385737044629531.jpeg",
		"/photos/Messenger_creation_1593363957956257.jpeg",
		"/photos/Messenger_creation_1818593485554210.jpeg",
		"/photos/Messenger_creation_CBFD03ED-7AD8-4A92-9CA8-7983BA73B1D0.jpeg",
		"/photos/received_555805509791306.jpeg",
		"/photos/received_572765741125531.jpeg",
		"/photos/received_613394867173208.jpeg",
		"/photos/received_630331674946234.jpeg",
		"/photos/received_684719863491467.jpeg",
		"/photos/received_708831924175840.jpeg",
		"/photos/received_724953295848901.jpeg",
		"/photos/received_784712933230902.jpeg",
		"/photos/received_842067888102242.jpeg",
		"/photos/received_859086068654099.jpeg",
		"/photos/received_894174548535747.jpeg",
		"/photos/received_962633061060995.jpeg",
		"/photos/received_1041058090472192.jpeg",
		"/photos/received_1130687188353927.jpeg",
		"/photos/received_1481050892477044.jpeg",
	]);
	const [isLoadingShare, setIsLoadingShare] = useState(false);
	const [isSharedView, setIsSharedView] = useState(false);
	const [isOpened, setIsOpened] = useState(false);

	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		// Thử phát nhạc ngay khi trang load
		const playAudio = () => {
			audioRef?.current?.play().catch((error) => {
				console.log("Trình duyệt chặn tự phát âm thanh:", error);
			});
		};

		playAudio();
	}, []);

	const toggleMode = () => {
		setMode((prev) => (prev === SceneMode.FORMED ? SceneMode.CHAOS : SceneMode.FORMED));
	};

	const handleHandPosition = (x: number, y: number, detected: boolean) => {
		setHandPosition({ x, y, detected });
	};

	const handlePhotosUpload = (photos: string[]) => {
		setUploadedPhotos(photos);
	};

	const seeded = (seed: number) => {
		const value = Math.sin(seed * 43758.5453123) * 10000;
		return value - Math.floor(value);
	};

	const balloonDecor = useMemo(
		() =>
			Array.from({ length: 10 }, (_, i) => {
				const randA = seeded(i + 1);
				const randB = seeded(i + 17);
				return {
					id: i,
					left: `${8 + i * 8.8 + randA * 4}%`,
					size: 26 + randB * 18,
					duration: 5.5 + seeded(i + 33) * 4,
					delay: -(seeded(i + 51) * 5),
					color: ["#93C5FD", "#BAE6FD", "#60A5FA", "#BFDBFE", "#DBEAFE"][i % 5],
				};
			}),
		[],
	);

	const sparkleDecor = useMemo(
		() =>
			Array.from({ length: 28 }, (_, i) => ({
				id: i,
				left: `${4 + seeded(i + 101) * 92}%`,
				top: `${6 + seeded(i + 131) * 86}%`,
				size: 4 + seeded(i + 161) * 7,
				duration: 1.8 + seeded(i + 191) * 2.6,
				delay: -(seeded(i + 211) * 4),
			})),
		[],
	);

	const petalDecor = useMemo(
		() =>
			Array.from({ length: 20 }, (_, i) => ({
				id: i,
				left: `${3 + seeded(i + 251) * 94}%`,
				size: 8 + seeded(i + 281) * 10,
				duration: 10 + seeded(i + 311) * 10,
				delay: -(seeded(i + 341) * 12),
				opacity: 0.25 + seeded(i + 371) * 0.5,
			})),
		[],
	);

	return (
		<div className="w-full h-screen relative bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] overflow-hidden">
			<style>{`
				@keyframes dreamyGradient {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				@keyframes curtainWave {
					0%, 100% { transform: translateX(0) skewX(0deg); }
					50% { transform: translateX(2%) skewX(1deg); }
				}
				@keyframes shimmerSweep {
					0% { transform: translateX(-140%) rotate(12deg); opacity: 0; }
					30% { opacity: 0.5; }
					60% { opacity: 0.65; }
					100% { transform: translateX(140%) rotate(12deg); opacity: 0; }
				}
				@keyframes balloonFloat {
					0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
					50% { transform: translate3d(0, -20px, 0) rotate(2deg); }
				}
				@keyframes twinkle {
					0%, 100% { opacity: 0.25; transform: scale(0.6); }
					50% { opacity: 1; transform: scale(1.2); }
				}
				@keyframes petalFall {
					0% { transform: translate3d(0, -16vh, 0) rotate(0deg); }
					50% { transform: translate3d(18px, 45vh, 0) rotate(160deg); }
					100% { transform: translate3d(-16px, 110vh, 0) rotate(340deg); }
				}
				@keyframes softPulse {
					0%, 100% { transform: scale(0.95); opacity: 0.45; }
					50% { transform: scale(1.06); opacity: 0.75; }
				}
				@keyframes cardFloat {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-8px); }
				}
			`}</style>

			<audio
				ref={audioRef}
				src="/song.mp3"
				loop
			/>

			{/* Invitation Card Overlay */}
			<div
				className={`absolute inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${isOpened ? "pointer-events-none" : ""}`}
			>
				<div
					className={`absolute inset-0 transition-opacity duration-[1200ms] ${isOpened ? "opacity-0" : "opacity-100"}`}
					style={{
						background:
							"radial-gradient(circle at 20% 20%, rgba(255,255,255,0.82), transparent 45%), radial-gradient(circle at 80% 10%, rgba(191,219,254,0.55), transparent 40%), radial-gradient(circle at 50% 80%, rgba(147,197,253,0.45), transparent 40%), linear-gradient(130deg, #f0f9ff, #e0f2fe, #dbeafe, #eff6ff)",
						backgroundSize: "220% 220%",
						animation: "dreamyGradient 14s ease infinite",
					}}
				/>

				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{sparkleDecor.map((sparkle) => (
						<div
							key={`sparkle-${sparkle.id}`}
							className="absolute rounded-full bg-white"
							style={{
								left: sparkle.left,
								top: sparkle.top,
								width: `${sparkle.size}px`,
								height: `${sparkle.size}px`,
								opacity: 0.7,
								boxShadow: "0 0 10px rgba(255,255,255,0.8)",
								animation: `twinkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
							}}
						/>
					))}

					{petalDecor.map((petal) => (
						<div
							key={`petal-${petal.id}`}
							className="absolute bg-[#93C5FD]"
							style={{
								left: petal.left,
								width: `${petal.size}px`,
								height: `${petal.size * 1.15}px`,
								opacity: petal.opacity,
								borderRadius: "60% 40% 65% 35%",
								animation: `petalFall ${petal.duration}s linear ${petal.delay}s infinite`,
								filter: "blur(0.2px)",
							}}
						/>
					))}
				</div>

				{/* Content Layer */}
				<div
					className={`relative z-20 flex flex-col items-center justify-center transition-all duration-[1000ms] ${
						isOpened ? "opacity-0 scale-90 blur-md" : "opacity-100 scale-100"
					}`}
					style={{ animation: isOpened ? "none" : "cardFloat 5.5s ease-in-out infinite" }}
				>
					<div
						className="absolute w-[125%] h-[125%] rounded-full pointer-events-none"
						style={{
							background:
								"radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(96,165,250,0.12) 45%, transparent 75%)",
							filter: "blur(28px)",
							animation: "softPulse 3.6s ease-in-out infinite",
						}}
					/>

					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						{balloonDecor.map((balloon) => (
							<div
								key={`balloon-${balloon.id}`}
								className="absolute"
								style={{
									bottom: "-12%",
									left: balloon.left,
									opacity: 0.72,
									animation: `balloonFloat ${balloon.duration}s ease-in-out ${balloon.delay}s infinite`,
								}}
							>
								<div className="flex flex-col items-center">
									<div
										className="rounded-[50%_50%_48%_52%/40%_38%_62%_60%]"
										style={{
											width: `${balloon.size}px`,
											height: `${balloon.size * 1.24}px`,
											backgroundColor: balloon.color,
											boxShadow:
												"inset -6px -8px 14px rgba(0,0,0,0.12), 0 8px 20px rgba(255,255,255,0.5)",
										}}
									/>
									<div className="w-[1px] h-10 bg-white/60" />
								</div>
							</div>
						))}
					</div>

					<div
						className="relative w-[88vw] max-w-md aspect-[3/4.6] backdrop-blur-xl border border-[#DBEAFE] shadow-[0_24px_90px_rgba(59,130,246,0.28)] rounded-[2.8rem] p-10 flex flex-col items-center justify-between text-center overflow-hidden"
						style={{
							background:
								"linear-gradient(160deg, rgba(224,242,254,0.92) 0%, rgba(191,219,254,0.88) 55%, rgba(186,230,253,0.84) 100%)",
						}}
					>
						<div className="absolute inset-0 pointer-events-none">
							<div
								className="absolute -inset-[110%]"
								style={{
									background:
										"linear-gradient(100deg, transparent 36%, rgba(255,255,255,0.7) 48%, transparent 60%)",
									animation: "shimmerSweep 4.8s ease-in-out infinite",
								}}
							/>
						</div>

						<div className="absolute inset-3 rounded-[2.4rem] border border-white/70" />

						<div className="absolute top-0 left-0 w-24 h-24 text-[#93C5FD] opacity-60 rotate-0 p-4">
							🌸
						</div>
						<div className="absolute top-0 right-0 w-24 h-24 text-[#93C5FD] opacity-60 rotate-90 p-4">
							🌸
						</div>
						<div className="absolute bottom-0 left-0 w-24 h-24 text-[#93C5FD] opacity-60 -rotate-90 p-4">
							🌸
						</div>
						<div className="absolute bottom-0 right-0 w-24 h-24 text-[#93C5FD] opacity-60 rotate-180 p-4">
							🌸
						</div>

						<div className="flex flex-col items-center mt-6">
							<div className="w-32 h-32 mb-8 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-full flex items-center justify-center shadow-inner relative">
								<span
									className="text-6xl select-none"
									style={{ animation: "balloonFloat 2.4s ease-in-out infinite" }}
								>
									🎂
								</span>
								<div className="absolute -top-2 -right-2 text-3xl">🫧</div>
								<div className="absolute -bottom-3 -left-2 text-2xl">❄️</div>
							</div>

							<h3 className="text-[12px] uppercase tracking-[0.4em] text-[#60A5FA] mb-3 font-serif font-bold">
								A Lovely Day
							</h3>
							<h2 className="text-4xl md:text-5xl font-serif text-[#3B82F6] mb-6 leading-tight italic drop-shadow-sm">
								Happy Birthday, Bim
							</h2>

							<div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent mb-6"></div>

							<p className="text-[#475569] font-serif text-lg italic leading-relaxed max-w-[260px] select-none">
								"Chúc bim iu có một ngày sinh nhật thật ngọt ngào, tỏa sáng và đầy yêu thương."
							</p>
						</div>

						<button
							onClick={() => setIsOpened(true)}
							className="group relative pointer-events-auto px-12 py-4 overflow-hidden rounded-full bg-gradient-to-r from-[#60A5FA] to-[#38BDF8] transition-all duration-500 hover:shadow-[0_14px_34px_rgba(59,130,246,0.45)] hover:-translate-y-1 active:scale-95"
							style={{ boxShadow: "0 10px 24px rgba(59,130,246,0.35)" }}
						>
							<span className="relative z-10 text-white font-serif tracking-[0.2em] text-sm font-bold">
								Open Gift ✨
							</span>
							<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
						</button>

						<div className="mb-4 text-[#60A5FA] opacity-75 text-xl tracking-[0.4em]">✨ 🦋 ✨</div>
					</div>
				</div>
			</div>

			<ErrorBoundary>
				<Canvas
					dpr={[1, 2]}
					camera={{ position: [0, 0, 25], fov: 45 }}
					gl={{ antialias: false, stencil: false, alpha: false }}
					shadows
				>
					<Suspense fallback={null}>
						<Experience
							mode={mode}
							handPosition={handPosition}
							uploadedPhotos={uploadedPhotos}
						/>
					</Suspense>
				</Canvas>
			</ErrorBoundary>

			<Loader
				containerStyles={{ background: "#E0F2FE" }}
				innerStyles={{ width: "300px", height: "10px", background: "#BAE6FD" }}
				barStyles={{ background: "#ADD8E6", height: "10px" }}
				dataStyles={{ color: "#ADD8E6", fontFamily: "Cinzel" }}
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
					<div className="text-[#ADD8E6] font-serif text-xl">加载分享的照片中...</div>
				</div>
			)}

			{/* Gesture Control Module */}
			<GestureController
				currentMode={mode}
				onModeChange={setMode}
				onHandPosition={handleHandPosition}
			/>
		</div>
	);
}
