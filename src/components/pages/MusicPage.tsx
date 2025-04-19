
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Music, Play, Pause, SkipBack, SkipForward, 
  Volume2, Search, Clock, Disc 
} from "lucide-react";
import { toast } from "sonner";

// Updated music recommendations with guaranteed working audio sources
const musicRecommendations = {
  sunny: [
    { id: "s1", title: "Summer Vibes", artist: "Chill Wave", mood: "Upbeat", duration: "3:45", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: "s2", title: "Beach Walk", artist: "Ocean Sounds", mood: "Relaxing", duration: "4:28", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "s3", title: "Sunny Day", artist: "Summer Beats", mood: "Happy", duration: "3:22", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ],
  cloudy: [
    { id: "c1", title: "Cloudy Memories", artist: "Ambient Dreams", mood: "Melancholic", duration: "4:22", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: "c2", title: "Grey Skies", artist: "Soft Piano", mood: "Calm", duration: "4:45", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: "c3", title: "Gentle Rain", artist: "Nature Sounds", mood: "Peaceful", duration: "3:30", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  ],
  rainy: [
    { id: "r1", title: "Rain Drops", artist: "Water Sounds", mood: "Relaxing", duration: "3:48", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { id: "r2", title: "Thunderstorm", artist: "Weather Beats", mood: "Dramatic", duration: "4:15", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: "r3", title: "Rainy Jazz", artist: "Cozy Notes", mood: "Soothing", duration: "4:10", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  ],
};

// Additional songs from various genres with working audio
const additionalSongs = [
  { id: "a1", title: "Electric Dreams", artist: "Synth Wave", mood: "Energetic", duration: "3:50", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { id: "a2", title: "Acoustic Sunset", artist: "Guitar Dreams", mood: "Relaxing", duration: "3:25", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  { id: "a3", title: "Jazz Cafe", artist: "Smooth Quartet", mood: "Chill", duration: "4:01", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
  { id: "a4", title: "Lo-Fi Study", artist: "Beat Maker", mood: "Focus", duration: "3:12", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
  { id: "a5", title: "Pop Anthem", artist: "Chart Toppers", mood: "Upbeat", duration: "2:41", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
  { id: "a6", title: "Dance Floor", artist: "Party Mix", mood: "Dance", duration: "3:18", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
  { id: "a7", title: "Classical Morning", artist: "String Ensemble", mood: "Peaceful", duration: "4:22", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
  { id: "a8", title: "Rock Anthem", artist: "Electric Guitars", mood: "Energetic", duration: "3:19", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "a9", title: "Electronic Pulse", artist: "Digital Artist", mood: "Dance", duration: "3:43", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "a10", title: "Ambient Waves", artist: "Sleep Sounds", mood: "Relaxing", duration: "3:21", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const allSongs = [
  ...musicRecommendations.sunny,
  ...musicRecommendations.cloudy,
  ...musicRecommendations.rainy,
  ...additionalSongs,
];

const MusicPage = () => {
  const [currentCondition, setCurrentCondition] = useState("sunny");
  const songs = musicRecommendations[currentCondition as keyof typeof musicRecommendations];
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState(songs);
  const [progress, setProgress] = useState([0]);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    // Add event listeners to handle audio loading and timing
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleSongEnd);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.volume = volume[0] / 100;
    }
    
    // Initial audio load
    if (playlistSongs.length > 0) {
      loadAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleSongEnd);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    setPlaylistSongs(songs);
    setCurrentSong(0);
    setIsPlaying(false);
    setProgress([0]);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentCondition]);

  useEffect(() => {
    // When current song changes, load the new audio
    if (playlistSongs.length > 0 && audioRef.current) {
      loadAudio();
      if (isPlaying) {
        setTimeout(() => {
          playAudio();
        }, 100); // Small delay to ensure audio is loaded
      }
    }
  }, [currentSong, playlistSongs]);

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setSongDuration(audioRef.current.duration);
      console.log("Audio metadata loaded successfully, duration:", audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      
      if (duration > 0) {
        setCurrentTime(current);
        setProgress([Math.floor((current / duration) * 100)]);
      }
    }
  };

  const handleSongEnd = () => {
    nextSong();
  };

  const handleAudioError = (e: any) => {
    console.error("Audio playback error:", e);
    toast.error("Could not play this song. Trying next song...");
    
    // Try next song after a short delay
    setTimeout(() => {
      nextSong();
    }, 500);
  };

  const loadAudio = () => {
    if (!audioRef.current || !playlistSongs[currentSong]) return;
    
    try {
      const audioSrc = playlistSongs[currentSong].audio;
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      console.log("Loading audio:", audioSrc);
    } catch (error) {
      console.error("Error loading audio:", error);
      toast.error("Error loading audio");
    }
  };

  const playAudio = () => {
    if (!audioRef.current || !playlistSongs[currentSong]) return;
    
    // Reset the audio if it was at the end
    if (audioRef.current.currentTime >= audioRef.current.duration) {
      audioRef.current.currentTime = 0;
    }
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          toast.success(`Now playing: ${playlistSongs[currentSong].title}`);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          toast.error("Could not play audio. Trying another song...");
          setIsPlaying(false);
          // Try next song after a short delay
          setTimeout(() => {
            nextSong();
          }, 500);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast.info("Music paused");
    } else {
      playAudio();
    }
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % playlistSongs.length);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + playlistSongs.length) % playlistSongs.length);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setPlaylistSongs(songs);
      setIsSearching(false);
      return;
    }

    const filteredResults = allSongs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.mood.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredResults.length === 0) {
      toast.error("No songs found matching your search");
      return;
    }
    
    setPlaylistSongs(filteredResults);
    setCurrentSong(0);
    setIsPlaying(false);
    setProgress([0]);
    toast.success(`Found ${filteredResults.length} songs matching "${searchQuery}"`);
    
    // Reset the audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setPlaylistSongs(songs);
    setCurrentSong(0);
    setIsPlaying(false);
    setProgress([0]);
    
    // Reset the audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const changeCondition = (condition: string) => {
    setCurrentCondition(condition);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Function to handle progress bar clicks
  const handleProgressChange = (newValue: number[]) => {
    if (audioRef.current && songDuration) {
      const newTime = (newValue[0] / 100) * songDuration;
      audioRef.current.currentTime = newTime;
      setProgress(newValue);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <span>Music</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSearching(!isSearching)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </h1>
      
      {isSearching && (
        <div className="flex gap-2 items-center mb-4">
          <Input
            placeholder="Search Bollywood songs by title, artist, or mood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
          {playlistSongs !== songs && (
            <Button variant="outline" onClick={resetSearch}>Reset</Button>
          )}
        </div>
      )}
      
      <Card className="weather-card bg-gradient-to-br from-primary/20 to-primary/5">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">
            {playlistSongs === songs ? 
              `${currentCondition.charAt(0).toUpperCase() + currentCondition.slice(1)} Weather Music` : 
              "Search Results"}
          </h2>
          {playlistSongs === songs && (
            <p className="text-muted-foreground mb-6">
              Here's some {playlistSongs[0]?.mood?.toLowerCase() || ''} music that matches today's {currentCondition} weather.
            </p>
          )}
          
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <Disc className={`h-10 w-10 text-primary ${isPlaying ? 'animate-spin-slow' : ''}`} />
              </div>
              <h3 className="text-lg font-medium">{playlistSongs[currentSong]?.title || "Select a song"}</h3>
              <p className="text-muted-foreground">{playlistSongs[currentSong]?.artist || ""}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTime(currentTime)} / {formatTime(songDuration)}</span>
              </div>
            </div>
            
            <Slider 
              value={progress} 
              onValueChange={handleProgressChange} 
              max={100} 
              step={1} 
              className="w-full" 
            />
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" onClick={prevSong}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={nextSong}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {playlistSongs === songs ? 
              `Playlist for ${currentCondition} days` : 
              "Search Results"}
          </h2>
          
          <div className="flex gap-2">
            <Button 
              variant={currentCondition === "sunny" ? "default" : "outline"}
              size="sm"
              onClick={() => changeCondition("sunny")}
            >
              Sunny
            </Button>
            <Button 
              variant={currentCondition === "cloudy" ? "default" : "outline"}
              size="sm"
              onClick={() => changeCondition("cloudy")}
            >
              Cloudy
            </Button>
            <Button 
              variant={currentCondition === "rainy" ? "default" : "outline"}
              size="sm"
              onClick={() => changeCondition("rainy")}
            >
              Rainy
            </Button>
          </div>
        </div>
        
        {playlistSongs.map((song, index) => (
          <Card 
            key={song.id} 
            className={`cursor-pointer ${index === currentSong ? 'border-primary' : ''}`}
            onClick={() => setCurrentSong(index)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${index === currentSong ? 'text-primary' : ''}`}>{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{song.duration}</span>
                {index === currentSong && isPlaying && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-6 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
