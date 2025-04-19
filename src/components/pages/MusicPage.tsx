
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

// Updated music recommendations with working audio URLs
const musicRecommendations = {
  sunny: [
    { id: "s1", title: "Chaleya", artist: "Arijit Singh", mood: "Romantic", duration: "3:45", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Jawan/Chaleya%20-%20Jawan%20128%20Kbps.mp3" },
    { id: "s2", title: "Kesariya", artist: "Arijit Singh", mood: "Uplifting", duration: "4:28", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Brahmastra/Kesariya%20-%20Brahmastra%20128%20Kbps.mp3" },
    { id: "s3", title: "Jhoome Jo Pathaan", artist: "Arijit Singh", mood: "Dance", duration: "3:22", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Pathaan/Jhoome%20Jo%20Pathaan%20-%20Pathaan%20128%20Kbps.mp3" },
  ],
  cloudy: [
    { id: "c1", title: "Tum Hi Ho", artist: "Arijit Singh", mood: "Romantic", duration: "4:22", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Aashiqui%202/Tum%20Hi%20Ho%20-%20Aashiqui%202%20128%20Kbps.mp3" },
    { id: "c2", title: "Phir Le Aya Dil", artist: "Arijit Singh", mood: "Soulful", duration: "4:45", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Barfi/Phir%20Le%20Aya%20Dil%20-%20Barfi%20128%20Kbps.mp3" },
    { id: "c3", title: "Manike", artist: "Yohani", mood: "Dance", duration: "3:30", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Thank%20God/Manike%20-%20Thank%20God%20128%20Kbps.mp3" },
  ],
  rainy: [
    { id: "r1", title: "Baarish Ban Jana", artist: "Stebin Ben", mood: "Romantic", duration: "3:48", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Baarish%20Ban%20Jaana/Baarish%20Ban%20Jaana%20-%20Baarish%20Ban%20Jaana%20128%20Kbps.mp3" },
    { id: "r2", title: "Baarish", artist: "Ash King", mood: "Romantic", duration: "4:15", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Half%20Girlfriend/Baarish%20-%20Half%20Girlfriend%20128%20Kbps.mp3" },
    { id: "r3", title: "Rim Jhim", artist: "Jubin Nautiyal", mood: "Peaceful", duration: "4:10", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Rim%20Jhim/Rim%20Jhim%20-%20Rim%20Jhim%20128%20Kbps.mp3" },
  ],
};

// More Indian songs from various genres
const additionalSongs = [
  { id: "i1", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", mood: "Romantic", duration: "3:50", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Shershaah/Raataan%20Lambiyan%20-%20Shershaah%20128%20Kbps.mp3" },
  { id: "i2", title: "Tere Vaaste", artist: "Arijit Singh", mood: "Romantic", duration: "3:25", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Zara%20Hatke%20Zara%20Bachke/Tere%20Vaaste%20-%20Zara%20Hatke%20Zara%20Bachke%20128%20Kbps.mp3" },
  { id: "i3", title: "O Bedardeya", artist: "Arijit Singh", mood: "Sad", duration: "4:01", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Tu%20Jhoothi%20Main%20Makkaar/O%20Bedardeya%20-%20Tu%20Jhoothi%20Main%20Makkaar%20128%20Kbps.mp3" },
  { id: "i4", title: "Pasoori Nu", artist: "Arijit Singh", mood: "Fusion", duration: "3:12", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Satyaprem%20Ki%20Katha/Pasoori%20Nu%20-%20Satyaprem%20Ki%20Katha%20128%20Kbps.mp3" },
  { id: "i5", title: "Heeriye", artist: "Arijit Singh", mood: "Upbeat", duration: "2:41", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Heeriye/Heeriye%20-%20Heeriye%20128%20Kbps.mp3" },
  { id: "i6", title: "Kaavaalaa", artist: "Shilpa Rao", mood: "Dance", duration: "3:18", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Jailer/Kaavaalaa%20-%20Jailer%20128%20Kbps.mp3" },
  { id: "i7", title: "Apna Bana Le", artist: "Arijit Singh", mood: "Romantic", duration: "4:22", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Bhediya/Apna%20Bana%20Le%20-%20Bhediya%20128%20Kbps.mp3" },
  { id: "i8", title: "What Jhumka", artist: "Arijit Singh", mood: "Dance", duration: "3:19", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Rocky%20Aur%20Rani%20Kii%20Prem%20Kahaani/What%20Jhumka%20-%20Rocky%20Aur%20Rani%20Kii%20Prem%20Kahaani%20128%20Kbps.mp3" },
  { id: "i9", title: "Chammak Challo", artist: "Akon", mood: "Dance", duration: "3:43", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Ra.One/Chammak%20Challo%20-%20Ra.One%20128%20Kbps.mp3" },
  { id: "i10", title: "Chaleya", artist: "Arijit Singh", mood: "Romantic", duration: "3:21", audio: "https://pagalsong.in/uploads/systemuploads/mp3/Jawan/Chaleya%20-%20Jawan%20128%20Kbps.mp3" },
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
        playAudio();
      }
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

  const handleAudioError = (e: any) => {
    console.error("Audio error:", e);
    toast.error("Could not play this song. Trying next song...");
    nextSong();
  };

  const loadAudio = () => {
    if (!audioRef.current || !playlistSongs[currentSong]) return;
    
    const audioSrc = playlistSongs[currentSong].audio;
    audioRef.current.src = audioSrc;
    audioRef.current.load();
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        toast.success(`Now playing: ${playlistSongs[currentSong].title}`);
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
        toast.error("Could not play audio. Trying another song...");
        setIsPlaying(false);
        nextSong();
      });
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
          <span>Indian Music</span>
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
              Here's some {playlistSongs[0]?.mood?.toLowerCase() || ''} Bollywood music that matches today's {currentCondition} weather.
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
