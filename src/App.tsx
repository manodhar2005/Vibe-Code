import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-[#0ff] flex flex-col items-center p-4 md:p-8 font-sans selection:bg-[#f0f] selection:text-[#0ff] overflow-hidden relative crt-flicker">
      <div className="noise-bg" />
      <div className="scanlines" />
      
      {/* Jarring Background Elements */}
      <div className="fixed top-[20%] left-[-5%] w-[50vw] h-[20vh] bg-[#f0f] mix-blend-difference opacity-30 animate-pulse pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-5%] w-[40vw] h-[30vh] bg-[#0ff] mix-blend-difference opacity-30 animate-[pulse_2s_infinite] pointer-events-none" />
      
      <div className="w-full max-w-6xl z-10 flex flex-col items-center mt-4 screen-tear">
        <header className="mb-12 flex flex-col items-center relative w-full border-b-4 border-[#f0f] pb-4">
          <h1 className="text-6xl md:text-8xl font-mono font-black tracking-tighter text-[#0ff] glitch-text uppercase" data-text="SYS.OVERRIDE">
            SYS.OVERRIDE
          </h1>
          <p className="mt-4 text-[#000] font-sans text-2xl uppercase tracking-[0.5em] font-bold bg-[#0ff] px-4 py-1 border-2 border-[#f0f]">
            // AUDIO_VISUAL_LINK_ESTABLISHED
          </p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 flex justify-center w-full">
            <SnakeGame />
          </div>
          <div className="lg:col-span-4 w-full max-w-sm mx-auto lg:mx-0">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
