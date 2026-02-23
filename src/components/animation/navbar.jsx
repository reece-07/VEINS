import React from 'react';

const Navbar = () => {
    return (
        // fixed 铺满全屏，pointer-events: none 确保你还能点到下面的内容
        <nav style={{position:'fixed', inset: 0, zIndex: 999, pointerEvents: 'none' }}>

            {/* 初始状态通过 absolute 和 translate 强制居中，伪装成在首屏中心 */}
            <div id="global-video-wrapper" style={{
                background: '#0f1a13',
                width: '85vw',      // 👈 这是你 Logo 的逻辑宽度，根据视频里文字的大小调整
                height: '85vw',     // 👈 这是你 Logo 的逻辑高度，只露出文字部分
                 // 👈 核心：切掉多余留白
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                top: '50vh',
                left: '50vw',
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
            }}>
                <video
                    id="global-video"
                    src="/videos/VEINS.mp4"
                    muted
                    playsInline
                    style={{
                        width: '80vw',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'invert(1) hue-rotate(180deg)',
                        mixBlendMode: 'screen',
                        position: 'absolute',
                        
                    }}
                />
            </div>

            {/* 导航栏分割线 */}
            <div id="global-nav-line" style={{
                position: 'absolute',
                top: '7.5vh',
                left: '0',
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)'
            }} />
        </nav>
    );
};

export default Navbar;