import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave Protocol // 01",
    artist: "AI_GEN_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neon Overdrive // 02",
    artist: "AI_GEN_BETA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Cybernetic Serenade // 03",
    artist: "AI_GEN_GAMMA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Auto-play blocked", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="flex flex-col gap-4 p-5 neon-border rounded-xl bg-black/40 backdrop-blur-md w-full max-w-sm shrink-0 h-fit">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between pointer-events-none">
          <h3 className="text-xl font-black tracking-widest text-[#00ffcc] uppercase neon-text truncate">
            {currentTrack.title}
          </h3>
          <Volume2 className={`w-5 h-5 transition-opacity ${isPlaying && !isMuted ? 'text-[#ff00ff] neon-text-magenta animate-pulse' : 'text-gray-600'}`} />
        </div>
        <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-wider">{currentTrack.artist}</p>
      </div>

      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#00ffcc] to-[#ff00ff] transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={toggleMute}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-gray-300 hover:text-[#00ffcc] hover:neon-text transition-all"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#00ffcc] text-black hover:bg-white hover:shadow-[0_0_15px_#00ffcc] transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-gray-300 hover:text-[#00ffcc] hover:neon-text transition-all"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-8" /> {/* Spacer to balance the mute button */}
      </div>
    </div>
  );
}
