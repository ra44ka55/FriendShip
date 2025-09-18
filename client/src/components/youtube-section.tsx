import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatYoutubeDuration } from "@/lib/youtube";
import type { YoutubeVideo } from "@shared/schema";

interface ChannelInfo {
  name: string;
  description: string;
  subscribers: string;
  videos: string;
  views: string;
}

export default function YoutubeSection() {
  const { data: videos, isLoading: videosLoading } = useQuery<YoutubeVideo[]>({
    queryKey: ['/api/youtube/videos'],
  });

  const { data: channelInfo, isLoading: channelLoading } = useQuery<ChannelInfo>({
    queryKey: ['/api/youtube/channel'],
  });

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const openChannel = () => {
    const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCYourChannelId';
    window.open(`https://www.youtube.com/channel/${channelId}`, '_blank');
  };

  const subscribe = () => {
    const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCYourChannelId';
    window.open(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`, '_blank');
  };

  return (
    <section id="youtube" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-youtube-title">
            Our YouTube Channel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-youtube-subtitle">
            Subscribe to follow our adventures in video form - behind the scenes, vlogs, and epic fails included!
          </p>
        </div>

        {/* Channel Info */}
        <div className="bg-card rounded-xl p-8 mb-12 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <i className="fab fa-youtube text-white text-3xl"></i>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {channelLoading ? (
                <>
                  <Skeleton className="h-8 w-48 mb-2 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-2" data-testid="text-channel-name">
                    {channelInfo?.name || 'VNP Comedians'}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid="text-channel-description">
                    {channelInfo?.description || 'Join us on our funny videos That Make you Laugh every day. New videos every day!'}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <span data-testid="text-channel-subscribers">
                      <i className="fas fa-users mr-1"></i>
                      {channelInfo?.subscribers || '15.2K'} subscribers
                    </span>
                    <span data-testid="text-channel-videos">
                      <i className="fas fa-video mr-1"></i>
                      {channelInfo?.videos || '47'} videos
                    </span>
                    <span data-testid="text-channel-views">
                      <i className="fas fa-eye mr-1"></i>
                      {channelInfo?.views || '1.2M'} views
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={subscribe}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                data-testid="button-subscribe"
              >
                <i className="fab fa-youtube mr-2"></i>
                Subscribe
              </Button>
              <Button
                variant="outline"
                onClick={openChannel}
                className="bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-3"
                data-testid="button-visit-channel"
              >
                Visit Channel
              </Button>
            </div>
          </div>
        </div>

        {/* Latest Videos */}
        {videosLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="text-center py-12">
            <i className="fab fa-youtube text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2" data-testid="text-no-videos">No videos available</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-no-videos-subtitle">
              Check back later for our latest adventures!
            </p>
            <Button
              onClick={openChannel}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-visit-channel-empty"
            >
              Visit Our Channel
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openVideo(video.id)}
                data-testid={`card-video-${video.id}`}
              >
                <div className="relative aspect-video bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-video-thumbnail-${video.id}`}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <i className="fas fa-play text-white text-3xl"></i>
                  </div>
                  <span
                    className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm"
                    data-testid={`text-video-duration-${video.id}`}
                  >
                    {formatYoutubeDuration(video.duration)}
                  </span>
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 line-clamp-2" data-testid={`text-video-title-${video.id}`}>
                    {video.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2" data-testid={`text-video-stats-${video.id}`}>
                    {parseInt(video.viewCount).toLocaleString()} views • {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-video-description-${video.id}`}>
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
