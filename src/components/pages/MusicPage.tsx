
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

// Mock data for music recommendations
const musicRecommendations = {
  sunny: [
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", mood: "Upbeat" },
    { title: "Good Day Sunshine", artist: "The Beatles", mood: "Cheerful" },
    { title: "Here Comes the Sun", artist: "The Beatles", mood: "Uplifting" },
  ],
  cloudy: [
    { title: "Riders on the Storm", artist: "The Doors", mood: "Atmospheric" },
    { title: "Cloudbusting", artist: "Kate Bush", mood: "Dreamy" },
    { title: "The Sound of Silence", artist: "Simon & Garfunkel", mood: "Contemplative" },
  ],
  rainy: [
    { title: "Singing in the Rain", artist: "Gene Kelly", mood: "Playful" },
    { title: "Rainy Day", artist: "Coldplay", mood: "Melancholic" },
    { title: "Purple Rain", artist: "Prince", mood: "Emotional" },
  ],
};

// For demo purposes, we'll use sunny as the current condition
const currentCondition = "sunny";

const MusicPage = () => {
  const songs = musicRecommendations[currentCondition as keyof typeof musicRecommendations];
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  
  // In a real app, this would be connected to actual audio files
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the audio element
  };
  
  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length);
  };
  
  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
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
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Music className="h-6 w-6 text-primary" />
        Music Recommendations
      </h1>
      
      <Card className="weather-card bg-gradient-to-br from-primary/20 to-primary/5">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Weather-Based Music</h2>
          <p className="text-muted-foreground mb-6">
            Here's some {songs[0].mood.toLowerCase()} music that matches today's {currentCondition} weather.
          </p>
          
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <Music className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium">{songs[currentSong].title}</h3>
              <p className="text-muted-foreground">{songs[currentSong].artist}</p>
            </div>
            
            <Slider disabled defaultValue={[33]} max={100} step={1} className="w-full" />
            
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
        <h2 className="text-xl font-medium">Playlist for {currentCondition} days</h2>
        {songs.map((song, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer ${index === currentSong ? 'border-primary' : ''}`}
            onClick={() => setCurrentSong(index)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${index === currentSong ? 'text-primary' : ''}`}>{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
              {index === currentSong && isPlaying && (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
