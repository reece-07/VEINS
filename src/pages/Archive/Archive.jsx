import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Archive.css';
import ALBUM_COVER from '../../assets/images/album_cover.png';
import GYAT_COVER from '../../assets/images/single_covers/gyat.png';
import TTPD_COVER from '../../assets/images/single_covers/ttpd.png';
import SYAIL_COVER from '../../assets/images/single_covers/syail.png';
import MOL_COVER from '../../assets/images/single_covers/mol.png';
import FIILY_COVER from '../../assets/images/single_covers/fiily.png';
import NSE_COVER from '../../assets/images/single_covers/nse.png';
import E_COVER from '../../assets/images/single_covers/e.png';
import CSAATW_COVER from '../../assets/images/single_covers/csaatw.png';
import VEINS_WHITE from "../../assets/images/VEINS_white.PNG";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

const Archive = () => {
  const containerRef = useRef(null);
  const coverLayerRef = useRef(null);
  const coverRef = useRef(null);
  const lineRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const [activeSong, setActiveSong] = useState(null);
  const [hoveredSong, setHoveredSong] = useState(null); // 悬浮信息数据

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    // 🌟 核心保护：组件一挂载就锁死网页滚动，强制用户看完开场动画
    document.body.style.overflow = "hidden";

    const handleSnap = (e) => {
      if (e.deltaY > 0) {
        // 🌟 修复关键 1：强行拦住鼠标滚轮的默认跳跃
        e.preventDefault();

        // 立刻移除监听器，防止用户狂滚鼠标触发多次动画
        window.removeEventListener('wheel', handleSnap);

        // 🌟 修复关键 2：在 GSAP 开始滚动前，把网页的滚动权限还给它
        document.body.style.overflow = "auto";

        const targetY =
          contentRef.current.getBoundingClientRect().top + window.scrollY;

        gsap.to(window, {
          scrollTo: targetY,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            console.log('吸附动画完美结束！');
            console.log(targetY);
          }
        });
      }
    };

    // 1. 设置初始状态
    gsap.set(contentRef.current.children, { opacity: 0, y: 30 });
    gsap.set(overlayRef.current, { opacity: 0 });

    // 2. 动画序列
    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 1.2,
      delay: 0.5,
    })
      .to([coverLayerRef.current], {
        height: "50vh",

        duration: 1.5,
      }, "-=1")
      .to(overlayRef.current, {
        opacity: 0.5,
        duration: 1.5
      }, "<")
      .to(titleRef.current, {
        opacity: 1,
        duration: 0.8
      }, "-=1")
      .to(contentRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.5")
      .add(() => {
        // 🌟 修复关键 3：必须加 { passive: false }，否则 e.preventDefault() 会报错失效
        window.addEventListener('wheel', handleSnap, { passive: false });
      });

    // 🌟 修复关键 4：保命符！当离开这个页面时，清理事件，恢复正常滚动
    return () => {
      window.removeEventListener('wheel', handleSnap);
      document.body.style.overflow = "auto";
      tl.kill();
    };

  }, []);

  const SongItem = ({ id, className, cover, video, title, artist, genre, region }) => {
    const videoRef = useRef(null);
    const isActive = activeSong === id;

    useEffect(() => {
      if (isActive) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }
    }, [isActive]);

    return (
      <div
        className={`gallery-item ${className} ${isActive ? 'is-active' : ''}`}
        onMouseEnter={() => !activeSong && setHoveredSong({ title, artist, genre, region })}
        onMouseLeave={() => setHoveredSong(null)}
        onClick={() => {
          if (!isActive) {
            setActiveSong(id);
            setHoveredSong(null); // 点击时清除悬浮文字
          }
        }}
      >
        <img src={cover} alt={title} />
        <video
          ref={videoRef}
          src={video}
          loop
          playsInline
          controls={isActive}
          className="preview-video"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="item-overlay"></div>
      </div>
    );
  };

  return (
    <div className={`view-container ${activeSong ? 'has-active-item' : ''}`} ref={containerRef}>
      {activeSong && (
        <div className="global-close-overlay" onClick={() => setActiveSong(null)}></div>
      )}
      {/* 封面层 */}
      <div className="cover-layer" ref={coverLayerRef}>
        <img ref={coverRef}
          src={ALBUM_COVER}
          alt="Cover"
          className="cover-img"
        />
        <div className="dark-overlay" ref={overlayRef}></div>
      </div>
      <div className="upper-wrapper">

        <div className="cover-text" ref={titleRef}>
          <h1 className="band-name">VEINS</h1> 
          {/* <img className="band-name-img" src={VEINS_WHITE} alt="VEINS" /> */}
          <p className="album-name">Orange Hour, Green Mood</p>
        </div>
      </div>
      {/* 中心分割线 */}
      <div className="reveal-line" ref={lineRef}></div>

      {/* 下方内容展示层 */}
      <div className="main-content" ref={contentRef}>
        <div className="grid">
          {/* 四个区域的固定信息展示位 */}
          {['tl', 'tr', 'bl', 'br'].map((reg) => (
            <div 
              key={reg} 
              className={`info-panel info-${reg} ${hoveredSong?.region === reg ? 'visible' : ''}`}
            >
              <h3 className="info-title">{hoveredSong?.title}</h3>
              <p className="info-artist">Orig. {hoveredSong?.artist}</p>
              <span className="info-genre">{hoveredSong?.genre}</span>
            </div>
          ))}
          
          <SongItem id="ttpd" region="br" className="ttpd" cover={TTPD_COVER} video="/videos/ttpd.mp4" title="The Tortured Poets Department" artist="Taylor Swift" genre="Indie Rock" />
          <SongItem id="gyat" region="tl" className="gyat" cover={GYAT_COVER} video="/videos/gyat.mp4" title="Give Yourself A Try" artist="The 1975" genre="Post Punk, Electro Pop" />
          <SongItem id="syail" region="tr" className="syail" cover={SYAIL_COVER} video="/videos/syail.mp4" title="Slut! / You Are In Love" artist="Taylor Swift" genre="Synth Pop, Dream Pop" />
          <SongItem id="mol" region="tl" className="mol" cover={MOL_COVER} video="/videos/mol.mp4" title="Mystery of Love" artist="Sufjan Stevens" genre="Acoustic Pop, Folk" />
          <SongItem id="fiily" region="bl" className="fiily" cover={FIILY_COVER} video="/videos/fiily.mp4" title="Fuck it I love you" artist="Lana Del Rey" genre="Dark Dream Pop" />
          <SongItem id="nse" region="br" className="nse" cover={NSE_COVER} video="/videos/nse.mp4" title="Not Strong Enough" artist="boygenius" genre="Indie Rock" />
          <SongItem id="e" region="bl" className="e" cover={E_COVER} video="/videos/easy.mp4" title="Easy" artist="Troye Sivan" genre="Synth Pop" />
          <SongItem id="csaatw" region="tr" className="csaatw" cover={CSAATW_COVER} video="/videos/csaatw.mp4" title="Champagne Supernova" artist="Oasis" genre="Britpop, Rock" />
        </div>


      </div>
    </div>
  );
};

export default Archive;