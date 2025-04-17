
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Shirt, Compass, Music } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface MainLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MainLayout = ({ children, activeTab, onTabChange }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b py-3 px-4 bg-background flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-primary">WeatherWise</span>
          <span role="img" aria-label="Weather" className="text-xl">🌤️</span>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-16">
            <TabsTrigger value="weather" className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary">
              <Home className="h-5 w-5" />
              <span className="text-xs">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="outfit" className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary">
              <Shirt className="h-5 w-5" />
              <span className="text-xs">Outfit</span>
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary">
              <Compass className="h-5 w-5" />
              <span className="text-xs">Travel</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary">
              <Music className="h-5 w-5" />
              <span className="text-xs">Music</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default MainLayout;
