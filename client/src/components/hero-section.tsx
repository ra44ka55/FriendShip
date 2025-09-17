export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 fade-in" data-testid="text-hero-title">
          Our Amazing Journey
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed fade-in" data-testid="text-hero-subtitle">
          Welcome to our little corner of the internet where memories come alive and friendships shine brighter than ever
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
          <button 
            onClick={() => scrollToSection('gallery')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            data-testid="button-explore-memories"
          >
            <i className="fas fa-images mr-2"></i>
            Explore Memories
          </button>
          <button 
            onClick={() => scrollToSection('youtube')}
            className="bg-card/20 backdrop-blur-sm hover:bg-card/30 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold transition-all"
            data-testid="button-watch-channel"
          >
            <i className="fab fa-youtube mr-2"></i>
            Watch Our Channel
          </button>
        </div>
      </div>
    </section>
  );
}
