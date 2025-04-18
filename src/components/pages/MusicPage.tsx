
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

// Updated music recommendations with valid audio URLs
const musicRecommendations = {
  sunny: [
    { id: "s1", title: "Chaleya", artist: "Arijit Singh", mood: "Romantic", duration: "3:45", audio: "https://www2.pagalworld.tv/GpE34Kg9Mw8/113606/143748-chaleya-jawan-mp3-song-320kbps.mp3" },
    { id: "s2", title: "Tum Hi Ho", artist: "Arijit Singh", mood: "Love", duration: "4:22", audio: "https://pwdown.info/113517/Tum%20Hi%20Ho%20-%20Aashiqui%202.mp3" },
    { id: "s3", title: "Kesariya", artist: "Arijit Singh", mood: "Uplifting", duration: "4:28", audio: "https://paglasongs.com/files/download/id/2560" },
  ],
  cloudy: [
    { id: "c1", title: "Tu Hai Ki Nahi", artist: "Ankit Tiwari", mood: "Melancholic", duration: "5:10", audio: "https://paglasongs.com/files/download/id/3237" },
    { id: "c2", title: "Tum Mile", artist: "Pritam", mood: "Romantic", duration: "4:25", audio: "https://paglasongs.com/files/download/id/1572" },
    { id: "c3", title: "Phir Le Aya Dil", artist: "Arijit Singh", mood: "Soulful", duration: "4:45", audio: "https://paglasongs.com/files/download/id/1638" },
  ],
  rainy: [
    { id: "r1", title: "Barish Ban Jana", artist: "Stebin Ben", mood: "Romantic", duration: "3:48", audio: "https://paglasongs.com/files/download/id/10280" },
    { id: "r2", title: "Baarish", artist: "Ash King", mood: "Romantic", duration: "4:15", audio: "https://paglasongs.com/files/download/id/1493" },
    { id: "r3", title: "Rim Jhim", artist: "Jubin Nautiyal", mood: "Peaceful", duration: "4:10", audio: "https://paglasongs.com/files/download/id/5474" },
  ],
};

const additionalSongs = [
  { id: "i1", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", mood: "Romantic", duration: "3:50", audio: "https://paglasongs.com/files/download/id/10201" },
  { id: "i2", title: "Mehrma", artist: "Darshan Raval", mood: "Soulful", duration: "4:12", audio: "https://paglasongs.com/files/download/id/17673" },
  { id: "i3", title: "Nainowale Ne", artist: "Neeti Mohan", mood: "Classical", duration: "4:30", audio: "https://paglasongs.com/files/download/id/2264" },
  { id: "i4", title: "Manike", artist: "Yohani", mood: "Dance", duration: "3:30", audio: "https://paglasongs.com/files/download/id/13036" },
  { id: "i5", title: "Pasoori", artist: "Ali Sethi", mood: "Fusion", duration: "3:44", audio: "https://paglasongs.com/files/download/id/12853" },
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
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleSongEnd);
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
    if (isPlaying && audioRef.current) {
      loadAndPlayAudio();
    }
  }, [currentSong]);

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setSongDuration(audioRef.current.duration);
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

  const loadAndPlayAudio = () => {
    if (!audioRef.current || !playlistSongs[currentSong]) return;
    
    const audioSrc = playlistSongs[currentSong].audio;
    audioRef.current.src = audioSrc;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        toast.success(`Now playing: ${playlistSongs[currentSong].title}`);
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
        toast.error("Could not play audio. Please try again.");
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast.info("Music paused");
    } else {
      loadAndPlayAudio();
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
  };

  const resetSearch = () => {
    setSearchQuery("");
    setPlaylistSongs(songs);
    setCurrentSong(0);
    setIsPlaying(false);
    setProgress([0]);
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
            placeholder="Search by song title, artist, or mood..."
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
                <span>{formatTime(currentTime)} / {playlistSongs[currentSong]?.duration || "0:00"}</span>
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
              "Playlist"}
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
