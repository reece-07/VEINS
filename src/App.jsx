import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// 引入组件
import Navbar from './components/animation/navbar'; 
import HeroSection from './components/animation/HeroSection';
import VineSection from './components/animation/VineSection';
import Footer from './components/animation/Footer';
import Archive from './pages/Archive/Archive';

gsap.registerPlugin(ScrollTrigger);

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
    <VineSection />
  </>
);

// 💡 核心新增：专门用来管理平滑滚动和路由切换的拦截器
const ScrollManager = ({ children }) => {
  const location = useLocation();
  const lenisRef = useRef(null);

  // 1. 初始化平滑滚动
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    
    lenisRef.current = lenis; // 存入 ref 供后续调用

    lenis.on('scroll', ScrollTrigger.update);
    const update = (time) => {
  lenis.raf(time * 1000);
};

gsap.ticker.add(update);
gsap.ticker.lagSmoothing(0);

return () => {
  gsap.ticker.remove(update); // ✅ 正确移除
  lenis.destroy();
};
  }, []);

  // 2. 监听路由变化
  useEffect(() => {
    // 切换页面时，瞬间回到顶部，防止滚动位置残留导致白屏
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // 延迟一丢丢，等新页面的 DOM 完全渲染撑开后，刷新 GSAP 触发器
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location]); // 👈 每次 URL 发生变化都会触发这里

  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* 用 ScrollManager 包裹你的内容 */}
      <ScrollManager>
        <div
          className="main-container"
          style={{
            position: 'relative',
            background: '#0f1a13',
            minHeight: '100vh' // 加上兜底高度
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
          <Footer />
        </div>
      </ScrollManager>
    </BrowserRouter>
  );
}

export default App;