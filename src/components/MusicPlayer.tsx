import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'DATA_CORRUPTION',
    artist: 'AI_GEN_ALPHA',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400?grayscale',
  },
  {
    id: 2,
    title: 'NEURAL_DECAY',
    artist: 'SYNTH_BOT_X',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400?grayscale',
  },
  {
    id: 3,
    title: 'VOID_STATIC',
    artist: 'NULL_POINTER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400?grayscale',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full bg-[#000] border-4 border-[#0ff] p-6 relative z-10">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b-2 border-[#f0f] pb-2">
          <div className="flex items-center gap-2 text-[#f0f] text-xl font-bold uppercase tracking-widest">
            <span>[ AUDIO_STREAM ]</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] px-2 border-2 border-transparent hover:border-[#f0f] transition-colors font-mono"
          >
            {isMuted ? 'MUTE: ON' : 'MUTE: OFF'}
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 border-2 border-[#0ff] flex-shrink-0 bg-[#000] overflow-hidden">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className={`w-full h-full object-cover mix-blend-luminosity ${isPlaying ? 'animate-pulse' : ''}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#f0f] mix-blend-overlay opacity-50" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-2xl font-mono font-bold text-[#0ff] truncate mb-1 uppercase">
              {currentTrack.title}
            </h3>
            <p className="text-lg text-[#f0f] truncate uppercase font-sans">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div 
            className="h-4 w-full bg-[#000] border-2 border-[#0ff] cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#f0f] relative"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-2">
          <button 
            onClick={handlePrev}
            className="flex-1 py-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-[#000] font-mono text-xl transition-colors"
          >
            &lt;&lt;
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-1 py-2 border-2 border-[#f0f] bg-[#f0f] text-[#000] hover:bg-[#000] hover:text-[#f0f] font-mono text-xl transition-colors"
          >
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>

          <button 
            onClick={handleNext}
            className="flex-1 py-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-[#000] font-mono text-xl transition-colors"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
