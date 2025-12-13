"use client";

import Autoplay from "embla-carousel-autoplay";
import NextImage from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/ffd.module.css";

interface FfdCarouselProps {
	setShowCarousel: React.Dispatch<React.SetStateAction<boolean>>;
	mobile: boolean | null;
	imgs: string[];
}

export default function FfdCarousel({
	setShowCarousel,
	mobile,
	imgs,
}: FfdCarouselProps) {
	const modalRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const xRef = useRef<HTMLButtonElement | null>(null);
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const autoplayRef = useRef(
		Autoplay({
			delay: 1500,
			stopOnInteraction: false,
			stopOnMouseEnter: false,
			stopOnFocusIn: false,
			playOnInit: true,
		}),
	);

	// Autoplay 플러그인 인스턴스를 메모이제이션
	const plugins = useMemo(() => [autoplayRef.current], []);

	const handleX = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			// 모달 배경을 클릭한 경우에만 모달을 닫음
			if (e.target === modalRef.current) {
				setShowCarousel(false);
			}
		},
		[setShowCarousel],
	);

	const handleContentClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
		},
		[],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Escape") {
				setShowCarousel(false);
			}
		},
		[setShowCarousel],
	);

	const handleXKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				setShowCarousel(false);
			}
		},
		[setShowCarousel],
	);

	// 현재 슬라이드 인덱스 추적
	useEffect(() => {
		if (!api) return;

		const handleSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on("select", handleSelect);
		setCurrent(api.selectedScrollSnap());

		return () => {
			api.off("select", handleSelect);
		};
	}, [api]);

	// 자동 재생 제어 - api가 준비된 후에만 작동
	useEffect(() => {
		if (!api || !autoplayRef.current) return;

		// api가 준비된 후 플러그인 상태 동기화
		const checkAndControl = () => {
			try {
				const currentlyPlaying = autoplayRef.current?.isPlaying() ?? false;

				if (isPlaying && !currentlyPlaying) {
					autoplayRef.current?.play();
				} else if (!isPlaying && currentlyPlaying) {
					autoplayRef.current?.stop();
				}
			} catch (error) {
				// 플러그인이 아직 초기화되지 않은 경우 무시
				console.warn("Autoplay plugin not ready:", error);
			}
		};

		// 약간의 지연을 두어 플러그인이 완전히 초기화되도록 함
		const timer = setTimeout(checkAndControl, 100);

		return () => {
			clearTimeout(timer);
		};
	}, [api, isPlaying]);

	const handleFirst = useCallback(() => {
		api?.scrollTo(0);
	}, [api]);

	const handleLast = useCallback(() => {
		if (api) {
			const slideCount = api.scrollSnapList().length;
			api.scrollTo(slideCount - 1);
		}
	}, [api]);

	const handlePlayPause = useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	return (
		<div
			ref={modalRef}
			onClick={handleX}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			aria-label="뮤직비디오 이미지 갤러리"
			className={styles.modalcontain}
			style={{ zIndex: "1100", backgroundColor: "#000000ba" }}
		>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "flex-end",
					color: "white",
					fontSize: "1.5rem",
					fontFamily: "DosGothic",
				}}
			>
				<button
					ref={xRef}
					type="button"
					className="cursor-pointer bg-transparent border-none text-white text-[1.5rem] font-DosGothic"
					onClick={() => setShowCarousel(false)}
					onKeyDown={handleXKeyDown}
					aria-label="모달 닫기"
				>
					X
				</button>
			</div>
			<div className={styles.centerbox}>
				<div
					className={styles.centerdiv}
					ref={contentRef}
					onClick={handleContentClick}
					onKeyDown={(e) => {
						e.stopPropagation();
					}}
					role="presentation"
				>
					<div className={styles.modalp}>
						{`드래그 혹은 터치로 넘겨보실 수 있습니다.`}
					</div>
					<p style={{ textAlign: "center", lineHeight: "2.5rem" }}>
						<Link
							href={"https://youtu.be/HV1Bg7adKto?si=0bGhQELJaAeF7HVE"}
							target="_blank"
							className={styles.modalp}
						>
							MV 보러가기
						</Link>
					</p>

					<div
						className={styles.carouselcontain}
						style={{ width: mobile ? "90%" : "70%" }}
					>
						<Carousel
							setApi={setApi}
							className="w-full"
							opts={{
								loop: true, // 마지막 슬라이드에서 처음으로 순환
							}}
							plugins={plugins}
						>
							<CarouselContent>
								{imgs.map((src, index) => (
									<CarouselItem key={src}>
										<div className="relative w-full aspect-square flex items-center justify-center">
											<NextImage
												src={src}
												alt={`뮤직비디오 스크린샷 ${index + 1}`}
												width={1920}
												height={1920}
												className="w-full h-full object-contain"
												priority={index < 3}
												unoptimized
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<div className={styles.btns}>
								<Button
									onClick={handleFirst}
									className={styles.btn}
									disabled={current === 0 && !api?.canScrollPrev()}
								>
									First
								</Button>
								<Button onClick={handlePlayPause} className={styles.btn}>
									{isPlaying ? "Pause" : "Play"}
								</Button>
								<Button
									onClick={handleLast}
									className={styles.btn}
									disabled={
										current === imgs.length - 1 && !api?.canScrollNext()
									}
								>
									Last
								</Button>
							</div>
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	);
}
