import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
    const containerRef = useRef(null);
    const heroBgRef = useRef(null);

    useLayoutEffect(() => {
        // 直接通过 ID 抓取 Navbar 里的元素
        const video = document.getElementById('global-video');
        const wrapper = document.getElementById('global-video-wrapper');
        const navLine = document.getElementById('global-nav-line');

        let ctx;

        const setupVideoAnimation = () => {
            ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=1200",
                        scrub: 1,
                        pin: true,
                        pinSpacing: false,
                    }
                });

                if (video && wrapper && navLine) {
                    // 1. 视频播放进度
                    tl.to(video, {
                        currentTime: 10,
                        ease: "none",
                    }, 0);

                    // 2. 缩小并推到顶部（你的比例 0.1 和 0.46 保持不变）
                    tl.to(wrapper, {
                        scale: 0.1,
                        top: '3.75vh',
                        ease: "power2.in",
                    }, 0);
                    tl.to(heroBgRef.current, {
                        // autoAlpha: 0,
                        position: "fixed",
                        height:"7.5vh",
                        duration: 0.5
                    }, ">-0.5");
                    // 3. 导航线生长
                    tl.to(navLine, {
                        scaleX: 1,
                        ease: "power2.out"
                    }, ">-0.1");
                }

                // 4. 淡出 Hero 自己的深绿背景，露出 VineSection


            }, containerRef);
        };

        if (video && video.readyState >= 2) {
            setupVideoAnimation();
        } else if (video) {
            video.addEventListener('loadedmetadata', setupVideoAnimation);
        }

        return () => {
            if (ctx) ctx.revert();
            if (video) video.removeEventListener('loadedmetadata', setupVideoAnimation);
        };
    }, []);

    return (<><div ref={heroBgRef} className="hero-bg" style={{
                position: 'absolute',
                inset: 0,
                background: '#0f1a13',
                zIndex: 1
            }} />
        <section ref={containerRef} className="hero-section" style={{ height: '100vh', position: 'relative', zIndex: 10 }}>
            {/* 整个 DOM 里现在只有这一个负责铺底和淡出的色块 */}
            
        </section>
    </>);
};

export default HeroSection;