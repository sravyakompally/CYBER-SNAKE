import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Dynamic Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.3) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
        }} 
      />

      <div className="z-10 flex flex-col lg:flex-row shadow-2xl bg-black/40 p-4 md:p-12 rounded-3xl backdrop-blur-sm neon-border items-center justify-center gap-12 lg:gap-24 w-full max-w-7xl mx-auto my-4 md:my-8 scale-95 md:scale-100">
        
        {/* Game Region */}
        <div className="w-full max-w-[500px] xl:max-w-[600px] flex justify-center order-2 lg:order-1">
          <SnakeGame />
        </div>

        {/* Info & Music Player Region */}
        <div className="w-full lg:w-auto flex flex-col gap-10 items-center justify-center order-1 lg:order-2 shrink-0">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start select-none">
            <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter mb-2 leading-[0.85]">
              Neon<br/>
              <span className="text-[#00ffcc] neon-text italic mr-4">Snake</span><br/>
              <span className="text-[#ff00ff] neon-text-magenta">Radio</span>
            </h1>
            <p className="font-mono text-xs md:text-sm text-gray-500 tracking-[0.3em] uppercase mt-4">
              AI_Gen_Audio // SYS.OP.1.2
            </p>
          </div>
          
          <MusicPlayer />
        </div>

      </div>
    </div>
  );
}
