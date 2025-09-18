import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PhotoGallery from "@/components/photo-gallery";
import FriendsSection from "@/components/friends-section";
import YoutubeSection from "@/components/youtube-section";
import MemoriesTimeline from "@/components/memories-timeline";

export default function Home() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navigation />
      <HeroSection />
      <PhotoGallery />
      <FriendsSection />
      <YoutubeSection />
      <MemoriesTimeline />
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <i className="fas fa-heart text-primary text-2xl"></i>
              <h3 className="text-2xl font-display font-bold text-foreground">RNP Squad</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Made with love, laughter, and way too much caffeine. 
              Here's to many more adventures together! 🎉
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-youtube">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-email">
                <i className="fas fa-envelope text-xl"></i>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Our Amazing Squad. All memories preserved with care. 💕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
