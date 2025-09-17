import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Friend } from "@shared/schema";

export default function FriendsSection() {
  const { data: friends, isLoading } = useQuery<Friend[]>({
    queryKey: ['/api/friends'],
  });

  const getSocialIcon = (social: string) => {
    switch (social.toLowerCase()) {
      case 'instagram':
        return 'fab fa-instagram';
      case 'twitter':
        return 'fab fa-twitter';
      case 'linkedin':
        return 'fab fa-linkedin';
      case 'github':
        return 'fab fa-github';
      case 'camera':
        return 'fas fa-camera';
      default:
        return 'fas fa-link';
    }
  };

  const getRoleColor = (index: number) => {
    const colors = ['primary', 'secondary', 'accent'];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <section id="friends" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Meet Our Squad</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The amazing people who make every moment unforgettable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="text-center">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-center space-x-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="friends" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-friends-title">
            Meet Our Squad
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-friends-subtitle">
            The amazing people who make every moment unforgettable
          </p>
        </div>

        {!friends || friends.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-users text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2" data-testid="text-no-friends">No friends added yet</h3>
            <p className="text-muted-foreground" data-testid="text-no-friends-subtitle">
              Add your squad members to showcase your amazing group!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {friends.map((friend, index) => (
              <Card
                key={friend.id}
                className="p-6 shadow-sm border border-border hover:shadow-lg transition-shadow"
                data-testid={`card-friend-${friend.id}`}
              >
                <div className="relative mb-6">
                  <img
                    src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`}
                    alt={friend.name}
                    className={`w-24 h-24 rounded-full mx-auto object-cover border-4 border-${getRoleColor(index)}/20`}
                    data-testid={`img-friend-avatar-${friend.id}`}
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span
                      className={`bg-${getRoleColor(index)} text-${getRoleColor(index)}-foreground px-3 py-1 rounded-full text-xs font-medium`}
                      data-testid={`text-friend-role-${friend.id}`}
                    >
                      {friend.role}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2" data-testid={`text-friend-name-${friend.id}`}>
                    {friend.name}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`text-friend-bio-${friend.id}`}>
                    {friend.bio}
                  </p>
                  
                  {friend.socialLinks && friend.socialLinks.length > 0 && (
                    <div className="flex justify-center space-x-3">
                      {friend.socialLinks.map((social, socialIndex) => (
                        <a
                          key={socialIndex}
                          href="#"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          data-testid={`link-friend-social-${friend.id}-${socialIndex}`}
                        >
                          <i className={getSocialIcon(social)}></i>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
