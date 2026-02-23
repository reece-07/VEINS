import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from "react-router-dom";
import './VineSection.css';
import ALBUM_COVER from '../../assets/images/album_cover.png';
import FLAG_STICKER from '../../assets/images/stickers/flag_sticker.png';
import DANCING_MAN_STICKER from '../../assets/images/stickers/dancing_man_sticker.png';

gsap.registerPlugin(ScrollTrigger);

const STICKERS = [
    { id: 1, type: 'text', content: 'EST. 2024', x: '10%', y: '15%', rotate: -90, speed: 0.2 },
    { id: 2, type: 'img', src: FLAG_STICKER, x: '5%', y: '45%', rotate: 5, speed: 0.5 },
    { id: 3, type: 'text', content: 'RAW_AUDIO', x: '15%', y: '75%', rotate: 0, speed: 0.3 },
    { id: 4, type: 'img', src: DANCING_MAN_STICKER, x: '20%', y: '60%', rotate: -10, speed: 0.25 },
];

const VineSection = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const leftRef = useRef(null);
    const [pathData, setPathData] = useState("");
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

    // --- 1. 路径生成 ---
    useEffect(() => {
        const generatePath = () => {
            if (!leftRef.current) return;

            const colWidth = leftRef.current.offsetWidth;
            const height = leftRef.current.offsetHeight;
            setSvgSize({ width: colWidth, height });
            const startX = 2 * colWidth / 3;
            const waveAmpSmall = colWidth * 0.2;
            const waveAmpMid = colWidth * 0.4;
            const waveAmpLarge = colWidth * 0.8;
            const d = `
                M ${startX} 0 
                C ${startX + waveAmpMid} ${height * 0.05}, ${startX - waveAmpMid} ${height * 0.1}, ${startX} ${height * 0.15}
                S ${startX + waveAmpMid} ${height * 0.25}, ${startX} ${height * 0.35}
                C ${startX - waveAmpMid} ${height * 0.45}, ${startX + waveAmpMid} ${height * 0.55}, ${startX} ${height * 0.65}
                S ${startX - waveAmpMid} ${height * 0.8}, ${startX} ${height * 0.87}
                C ${startX + waveAmpMid} ${height * 0.95}, ${startX - waveAmpMid} ${height * 0.97}, ${startX} ${height}
`;
            setPathData(d);
        };
        generatePath();
        //window.addEventListener('resize', generatePath);
        //return () => window.removeEventListener('resize', generatePath);
    }, []);

    // --- 2. 核心动画逻辑 ---
    useLayoutEffect(() => {
        if (!pathData) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=8000",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                }
            });

            // A. 藤蔓生长
            const vinePath = document.querySelector('.vine-path-anim');
            if (vinePath) {
                const len = vinePath.getTotalLength();
                gsap.set(vinePath, { strokeDasharray: len, strokeDashoffset: len, strokeOpacity: 0 });
                tl.to(vinePath, {
                    strokeOpacity: 1,
                    duration: 0.05,  // 极快显示，几乎瞬间
                }, 0.1);
                tl.to(vinePath, { strokeDashoffset: 0, ease: "none", duration: 16.3 }, 0.1);
            }

            // === SCENE 1: ARCHIVES (1s - 7s) ===

            // ① slide1 延迟到 1 秒进入
            tl.fromTo(".slide-archives",
                { autoAlpha: 0, y: 100 },
                { autoAlpha: 1, y: 0, duration: 1 },
                0.3
            );

            tl.fromTo(".archive-layout",
                { autoAlpha: 0, y: 100 },
                { autoAlpha: 1, y: 0, duration: 1 },
                1
            );

            tl.fromTo(".vine-btn",
                { autoAlpha: 0, y: 100 },
                { autoAlpha: 1, y: 0, duration: 1 },
                1.7
            );

            // ② 黑胶动画稍微再晚一点
            tl.to(".vinyl-record",
                { x: 40, rotation: 90, duration: 2, ease: "power1.inOut" },
                2.5
            );

            tl.to(".vinyl-cover",
                { x: -40, duration: 2, ease: "power1.inOut" },
                3
            );

            // ③ slide1 退出
            tl.to(".slide-archives",
                { autoAlpha: 0, y: -100, duration: 1 },
                5
            );



            // === SCENE 2: MEMBERS (7s - 19s) ===

            tl.fromTo(".slide-members",
                { autoAlpha: 0, y: 100 },
                { autoAlpha: 1, y: 0, duration: 1 },
                5.5
            );

            tl.fromTo(".band-identity-intro",
                { autoAlpha: 0, x: -20 },
                { autoAlpha: 1, x: 0, duration: 1 },
                6.5
            );

            tl.to(".highlight-text", {
                color: "#fff",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                duration: 3,
                stagger: 0.7
            }, 7.2);

            tl.fromTo(".members-grid-wrapper",
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 1 },
                10
            );

            tl.from(".layered-glass-card", {
                y: 50,
                opacity: 0.6,
                //stagger: 0.75,
                duration: 2,
                ease: "back.out(2)"
            }, 10.5);

            tl.to(".slide-members",
                { autoAlpha: 0, y: -100, duration: 1 },
                14
            );



            // === SCENE 3: FOOTER (19s - 26s) ===

            tl.fromTo(".slide-footer",
                { autoAlpha: 0, y: 100 },
                { autoAlpha: 1, y: 0, duration: 1 },
                14.5
            );

            // tl.fromTo(".sign-up-desc",
            //     { autoAlpha: 0, y: 100 },
            //     { autoAlpha: 1, y: 0, duration: 1 },
            //     15.2
            // );

            tl.fromTo(".minimal-input",
                { width: "0.1%" },
                { width: "100%", duration: 0.8 },
                15
            );

            // tl.fromTo(".vine-btn-subscribe",
            //     { autoAlpha: 0, y: 100 },
            //     { autoAlpha: 1, y: 0, duration: 1 },
            //     16.7
            // );

            // C. 贴纸入场与微视差

            // 1. 进场动画：移出循环！
            // 使用 stagger（错开时间）让贴纸依次浮现，加一点微弱的缩放，模拟被“贴”上去的动作
            tl.fromTo(".sticker",
                { autoAlpha: 0, scale: 0.85, y: 15 },
                { 
                    autoAlpha: 1, 
                    scale: 1, 
                    y: 0, 
                    duration: 1.5, 
                    stagger: 0.6, // 每个贴纸间隔 0.6 秒出现
                    ease: "back.out(1.2)" // 轻微的回弹感
                },
                0.5 // 在藤蔓开始生长后 0.5 秒开始贴纸动画
            );

            // 2. 极其克制的视差漂浮
            gsap.utils.toArray(".sticker").forEach((el, i) => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
                
                // 奇偶数决定轻微旋转的方向
                const rotateDir = i % 2 === 0 ? 1 : -1; 

                tl.to(el, { 
                    y: speed * 80, // 从 300 大幅降低到 80，动作非常克制
                    rotation: rotateDir * (speed * 15), // 随滚动产生极其微小的随机转动
                    ease: "sine.inOut", // 使用 sine 曲线，比 none 的匀速看起来更有机、柔和
                    duration: 18 
                }, 0); // 视差贯穿整个 18 秒的滚动周期
            });

        }, containerRef);

        return () => ctx.revert();
    }, [pathData]);

    return (
        <section ref={containerRef} className="vine-section">
            <div className="vine-col-left">
                <div ref={leftRef} className="vine-svg-wrapper">
                    <svg width="100%" height="100%" viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <path className="vine-path-anim" d={pathData} fill="none" stroke="#d4a535" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
                {STICKERS.map((s, i) => (
                    <div key={i} className="sticker" data-speed={s.speed} style={{ left: s.x, top: s.y }}>
                        {s.type === 'text' ? (
                            <div className="sticker-text" style={{ transform: `rotate(${s.rotate}deg)` }}>{s.content}</div>
                        ) : (
                            <img src={s.src} alt="sticker" className="sticker-img" style={{ transform: `rotate(${s.rotate}deg)` }} />
                        )}
                    </div>
                ))}
            </div>

            <div className="vine-col-right">
                {/* SLIDE 1: ARCHIVES */}
                <div className="content-slide slide-archives content-block">
                    <div className="content-label">Latest Release</div>
                    <h2 className="content-title">
                        Orange Hour, <br></br> Green Mood
                    </h2>

                    <div className="archive-layout">
                        <div className="text-col">
                            <p className="content-desc archive-desc">
                                We've chosen a selection of songs centered around the theme of summer to rearrange and cover. By coincidence, they all relate to certain emotions of youth:<br /><br />
                                Rebellion, doubt, longing, loneliness, love & identity.
                            </p>
                        </div>
                        <div className="visual-col">
                            <div className="archive-visual">
                                <div className="vinyl-record"></div>
                                <div className="vinyl-cover">
                                    <img src={ALBUM_COVER} alt="Album Art" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="vine-btn" onClick={() => navigate("/archive")}>See Archive</button>
                </div>

                {/* SLIDE 2: MEMBERS */}
                <div className="content-slide slide-members content-block">
                    {/* 1. Label 和 Title */}
                    <div className="content-label">The Band</div>


                    {/* 2. 身份信息 */}
                    <div className="band-identity-intro">
                        <div className="identity-row">
                            <span className="identity-label">NAME:</span>
                            <span className="highlight-text">VEINS</span>
                        </div>
                        <div className="identity-row">
                            <span className="identity-label">EST:</span>
                            <span className="highlight-text">2025.05.19</span>
                        </div>
                        <div className="identity-row">
                            <span className="identity-label">GENRE:</span>
                            <span className="highlight-text">POP / ROCK</span>
                        </div>
                    </div>

                    {/* 3. 成员卡片 */}
                    <div className="members-grid-wrapper">
                        <div className="members-grid">
                            {/* 成员 1 */}
                            <div className="layered-glass-card">
                                <div className="glass-glow"></div>
                                <div className="glass-panel">
                                    {/* 你可以在这里预留一个绝对定位的头像/图形区域 */}
                                    <div className="member-avatar-placeholder">
                                        <svg viewBox="0 0 1024 1024" width="60" height="60" fill="currentColor"><path d="M713.6 830.92H465.04c-3.52 0-6.86-1.54-9.14-4.23a11.981 11.981 0 0 1-2.7-9.7c5.03-30.84 19.37-52.41 42.62-64.11 11.24-5.65 24.27-8.87 39.42-9.71-9.14-15.26-16.11-32.91-20.51-52.12-6.02-26.34-6.62-53.6-1.69-76.76 5.84-27.41 19.15-47.17 37.48-55.63 6.02-2.78 13.15-0.15 15.92 5.87 2.78 6.02 0.15 13.15-5.87 15.92-11.3 5.21-19.84 19.01-24.07 38.84-7.86 36.94 0.46 92.94 31.58 128.51 3.23 3.69 3.89 8.98 1.66 13.35a11.993 11.993 0 0 1-11.78 6.5c-21.71-1.97-38.52 0.21-51.37 6.67-12.71 6.39-21.43 17.12-26.43 32.6H708.2c26.06-30.19 37.47-65.44 33.93-104.84-5.4-60.1-45.81-132.39-116.85-209.07-54.47-58.79-108.07-99.63-108.61-100.03-2.18-1.65-3.73-4-4.39-6.65L467.7 208c-47.78-33.49-89.22-46.58-123.2-38.9-30.66 6.93-57.75 31.35-80.51 72.6a11.99 11.99 0 0 1-8.74 6.07c-40.39 6.02-64.39 17.16-67.58 31.37-4.64 20.67 31.26 53.11 51.97 67.69h70.03c3.36 0 6.56 1.41 8.84 3.88 2.27 2.47 3.4 5.79 3.12 9.14-0.03 0.4-3.39 41.03 0.46 84.73 4.75 53.95 18.55 89.59 38.85 100.33 3.93 2.08 6.39 6.16 6.39 10.61V752.2a12 12 0 0 1-10.18 11.86c-11.95 1.86-48.04 11.05-56.61 28.22-0.88 1.76-3.21 6.43-0.58 14.65h80.63l54.28-274.81c1.28-6.5 7.59-10.74 14.1-9.45 6.5 1.28 10.73 7.6 9.45 14.1l-56.19 284.49a11.996 11.996 0 0 1-11.77 9.67h-98.34c-4.43 0-8.5-2.44-10.59-6.35-10.23-19.17-6.97-34-2.43-43.06 12.15-24.26 46.58-35.1 64.24-39.18V562.19c-24.8-17.54-39.98-56.44-45.17-115.83-2.69-30.83-2.02-59.56-1.25-75.53h-60.99c-2.37 0-4.69-0.7-6.66-2.02-0.74-0.49-18.22-12.21-34.89-28.82-24.37-24.29-34.5-46.52-30.13-66.08 5.52-24.7 32.25-40.74 81.64-48.96 25.69-44.42 57.06-71.07 93.32-79.27 42.39-9.58 90.16 5.26 146.05 45.34 2.31 1.66 3.96 4.08 4.65 6.84l44.65 178.59c12.83 10.03 59.47 47.55 108.06 99.94 32.96 35.55 59.87 70.52 79.95 103.94 25.52 42.46 40.15 82.69 43.47 119.56 4.33 48.13-10.34 90.91-43.61 127.14a12.013 12.013 0 0 1-8.84 3.88z" fill="#999999" p-id="13430"></path><path d="M404.76 331.95c-20.6 0-38.68-5.99-42.42-7.32-4-1.11-16.74-5.75-22.59-21.07-8.81-23.04 2.99-56.19 36.07-101.35 3.92-5.35 11.43-6.51 16.77-2.59 5.35 3.92 6.51 11.42 2.59 16.77-36.93 50.42-35.49 71.47-33.16 78.18 1.75 5.04 5.58 6.56 6.52 6.86 0.68 0.11 0.82 0.2 1.55 0.47 12.47 4.59 48.76 12.77 66.41-4.33 17.47-16.92 16.56-56.42-2.63-114.2-2.09-6.29 1.32-13.08 7.61-15.17s13.08 1.32 15.17 7.61c11.79 35.51 17.22 65.39 16.12 88.8-1.02 21.77-7.63 38.69-19.64 50.28-13.68 13.21-31.83 17.06-48.35 17.06z m-36.39-30.53zM512.5 770.88c-3.07 0-6.14-1.17-8.49-3.51l-91.99-91.99c-4.69-4.69-4.69-12.28 0-16.97 4.69-4.69 12.28-4.69 16.97 0l91.99 91.99c4.69 4.69 4.69 12.28 0 16.97a11.96 11.96 0 0 1-8.49 3.51zM713.58 830.92c-6.14 0-11.37-4.68-11.94-10.91-0.6-6.6 4.26-12.43 10.85-13.04 1.02-0.1 78.9-8.06 116.2-62.91 17.98-26.45 23.92-59.88 17.75-99.69-2.09 3.91-4.34 7.97-6.72 12.04-19.22 32.8-35.91 48.08-52.52 48.08-6.63 0-12-5.37-12-12s5.37-12 12-12c0.43 0 10.8-0.41 31.7-36.02 11.83-20.15 20.51-40.71 20.6-40.92 1.97-4.69 6.67-7.63 11.75-7.33a12 12 0 0 1 10.83 8.63c17.98 61.79 13.38 113.22-13.66 152.87-43.85 64.3-130.11 72.83-133.76 73.17-0.37 0.03-0.74 0.05-1.1 0.05z" fill="#999999" p-id="13431"></path></svg>
                                    </div>

                                    <div className="member-info-wrapper">
                                        <div className="member-role">KEYBOARDIST / DRUMMER</div>
                                        <div className="member-name">Reece</div>

                                        <div className="member-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">AGE</span>
                                                <span className="stat-value">19</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">GENRE</span>
                                                <span className="stat-value">INDIE / POP / ROCK</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 成员 2 */}
                            <div className="layered-glass-card">
                                <div className="glass-glow glass-glow-alt"></div>
                                <div className="glass-panel">
                                    <div className="member-avatar-placeholder">
                                        <svg viewBox="0 0 1024 1024" width="60" height="60" fill="currentColor"><path d="M532.97 842.57H367.02c-3.56 0-6.94-1.58-9.22-4.32a12.007 12.007 0 0 1-9.22 4.32h-81.61c-0.37 0-0.74-0.02-1.11-0.05-4.63-0.43-27.95-3.47-32.07-21.33-3.61-15.66 9.69-32.16 43.02-53.13l19.5-153.6c-35.07-29.63-54.24-77.01-55.55-137.6-0.73-33.91 4.22-63.22 7.19-77.46-38.3-21.47-61.99-36.78-67.28-59.17-4.41-18.68 5.46-37.27 17.19-54.67 13.92-53.55 37.75-65.56 58.81-76.18 3.41-1.72 6.69-3.37 9.81-5.16 4.84-29.91 9.56-53.04 28.43-57.73 13.35-3.32 28.25 4.33 49.83 25.58 19.31 19.01 44.5 49.34 79.28 95.46 1.57 2.08 2.42 4.62 2.42 7.23v6.65c-0.06 46.91-0.13 105.3 24.64 126.8 8.64 7.49 20.22 10.07 35.41 7.89 41.03-5.9 103.03 34.95 150.76 99.34 28.57 38.53 48.44 80.96 57.47 122.7 10.78 49.84 6.11 96.79-13.9 139.56a11.998 11.998 0 0 1-10.87 6.92c-9.72 0-19.15-0.16-28.27-0.31-40.5-0.67-75.48-1.26-89.24 13.36-6.19 6.58-8.65 17.04-7.5 31.98a12.005 12.005 0 0 1-11.96 12.92z m-151.05-24h138.84c0.71-15.71 5.4-28 14.2-37.35 21.04-22.34 59.02-21.7 107.12-20.91 6.54 0.11 13.25 0.22 20.07 0.27 28.63-68.89 12.4-154.55-44.18-230.85-20.73-27.96-45.63-52.48-70.11-69.03-22.62-15.29-43.74-22.88-57.96-20.85-22.18 3.19-40.53-1.36-54.55-13.52-33.06-28.69-32.98-93.15-32.92-144.95v-2.6c-31.92-42.19-56.06-71.27-73.74-88.83-20.17-20.03-27.2-20.2-27.93-20.17-0.37 0.27-2.62 2.24-5.21 11.3-2.42 8.49-4.27 20.08-6.24 32.35-0.53 3.3-2.41 6.23-5.19 8.09-5.56 3.71-11.2 6.55-16.64 9.29-19.15 9.65-35.69 17.98-46.86 62.66a12.06 12.06 0 0 1-1.74 3.87c-12.17 17.78-16.75 29.31-14.84 37.37 3.24 13.72 28.34 28.59 63.45 48.09 4.79 2.66 7.17 8.23 5.78 13.54-0.1 0.36-9.52 36.91-8.49 80.56 1.33 56.61 18.67 97.93 51.54 122.83 3.42 2.59 5.2 6.82 4.66 11.08l-21.07 165.95c-0.46 3.63-2.55 6.85-5.68 8.75-29.09 17.66-35.35 27.18-36.65 30.02 1.96 1.24 6.32 2.59 10.05 3.04h71.88l46.92-166.17c2.43-14.86 7.04-31.37 14.17-50.02 2.29-5.99 8.9-9.12 14.99-7.1 6.09 2.02 9.52 8.47 7.77 14.65l-13.6 48.16c-7.62 50.15 14.7 75.96 50.05 111.31a12 12 0 0 1 2.6 13.08 12.01 12.01 0 0 1-11.09 7.41c-51.84 0-63.34 6.78-69.39 28.68z m10.49-99.08l-18.42 65.22a48.01 48.01 0 0 1 7.9-6.36c9.86-6.4 22.59-10.01 42.18-11.56-13.66-15.16-24.71-30.23-31.66-47.3z" fill="#999999" p-id="14871"></path><path d="M669.51 852c-37.8 0-83.97-3.18-137.94-9.51-6.58-0.77-11.29-6.73-10.52-13.32 0.77-6.58 6.73-11.29 13.32-10.52 57.85 6.79 101.62 9.3 134.69 9.3 81.92 0 98.31-15.43 101.24-19.6 0.88-1.26 2.53-3.61-0.25-9.13-4.6-9.17-17.56-19.79-34.68-28.4-18.18-9.15-38.21-14.69-54.96-15.18-6.62-0.2-11.84-5.72-11.64-12.35 0.19-6.62 5.75-11.83 12.35-11.64 43.49 1.28 96.11 28.36 110.38 56.81 5.93 11.82 5.38 23.78-1.55 33.67-10.65 15.2-35.48 24.38-75.89 28.06-13.23 1.21-28.09 1.81-44.54 1.81z" fill="#999999" p-id="14872"></path></svg>
                                    </div>

                                    <div className="member-info-wrapper">
                                        <div className="member-role">GUITARIST / BASSIST</div>
                                        <div className="member-name">Chloe</div>

                                        <div className="member-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">AGE</span>
                                                <span className="stat-value">19</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">GENRE</span>
                                                <span className="stat-value">BRITPOP / POP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE 3: Sign Up */}
                <div className="content-slide slide-footer content-block">
                    <div className="content-label">Sign Up</div>

                    <div className="root-form-container">
                        <p className="content-desc sign-up-desc">Subscribe to get notified about new drops and tour dates.</p>
                        <form className="email-sign-up-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="ENTER YOUR EMAIL..." className="minimal-input" />
                            <button className="vine-btn vine-btn-subscribe">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VineSection;