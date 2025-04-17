
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Music, Play, Pause, SkipBack, SkipForward, 
  Volume2, Search, Clock, Disc 
} from "lucide-react";
import { toast } from "sonner";

// Mock data for music recommendations
const musicRecommendations = {
  sunny: [
    { id: "s1", title: "Walking on Sunshine", artist: "Katrina & The Waves", mood: "Upbeat", duration: "3:45" },
    { id: "s2", title: "Good Day Sunshine", artist: "The Beatles", mood: "Cheerful", duration: "2:10" },
    { id: "s3", title: "Here Comes the Sun", artist: "The Beatles", mood: "Uplifting", duration: "3:06" },
  ],
  cloudy: [
    { id: "c1", title: "Riders on the Storm", artist: "The Doors", mood: "Atmospheric", duration: "7:10" },
    { id: "c2", title: "Cloudbusting", artist: "Kate Bush", mood: "Dreamy", duration: "4:25" },
    { id: "c3", title: "The Sound of Silence", artist: "Simon & Garfunkel", mood: "Contemplative", duration: "3:05" },
  ],
  rainy: [
    { id: "r1", title: "Singing in the Rain", artist: "Gene Kelly", mood: "Playful", duration: "3:20" },
    { id: "r2", title: "Rainy Day", artist: "Coldplay", mood: "Melancholic", duration: "4:15" },
    { id: "r3", title: "Purple Rain", artist: "Prince", mood: "Emotional", duration: "8:40" },
  ],
};

// Mock search results
const searchResults = [
  { id: "sr1", title: "Imagine", artist: "John Lennon", mood: "Reflective", duration: "3:04" },
  { id: "sr2", title: "Bohemian Rhapsody", artist: "Queen", mood: "Epic", duration: "5:55" },
  { id: "sr3", title: "Billie Jean", artist: "Michael Jackson", mood: "Groovy", duration: "4:54" },
  { id: "sr4", title: "Shape of You", artist: "Ed Sheeran", mood: "Upbeat", duration: "3:54" },
  { id: "sr5", title: "Rolling in the Deep", artist: "Adele", mood: "Powerful", duration: "3:48" },
];

// For demo purposes, we'll use sunny as the current condition
const currentCondition = "sunny";

const MusicPage = () => {
  const songs = musicRecommendations[currentCondition as keyof typeof musicRecommendations];
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState(songs);
  
  // In a real app, this would be connected to actual audio files
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the audio element
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

    // In a real app, this would call a music API with the search query
    // For demo, use mock search results
    setPlaylistSongs(searchResults);
    setCurrentSong(0);
    setIsPlaying(false);
    setIsSearching(true);
    toast.success(`Found ${searchResults.length} songs for "${searchQuery}"`);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setPlaylistSongs(songs);
    setCurrentSong(0);
    setIsPlaying(false);
    setIsSearching(false);
  };
  
  useEffect(() => {
    // Reset play state when changing songs
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  }, [currentSong]);
  
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
            placeholder="Search for songs or artists..."
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
            {playlistSongs === songs ? "Weather-Based Music" : "Search Results"}
          </h2>
          {playlistSongs === songs && (
            <p className="text-muted-foreground mb-6">
              Here's some {playlistSongs[0].mood.toLowerCase()} music that matches today's {currentCondition} weather.
            </p>
          )}
          
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <Disc className="h-10 w-10 text-primary animate-spin-slow" />
              </div>
              <h3 className="text-lg font-medium">{playlistSongs[currentSong].title}</h3>
              <p className="text-muted-foreground">{playlistSongs[currentSong].artist}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{playlistSongs[currentSong].duration}</span>
              </div>
            </div>
            
            <Slider disabled value={[33]} max={100} step={1} className="w-full" />
            
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
        <h2 className="text-xl font-medium">
          {playlistSongs === songs ? `Playlist for ${currentCondition} days` : "Playlist"}
        </h2>
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
