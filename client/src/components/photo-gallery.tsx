import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoUploadModal from "./photo-upload-modal";
import PhotoModal from "./photo-modal";
import type { Photo } from "@shared/schema";

export default function PhotoGallery() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await apiRequest('DELETE', `/api/photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    }
  });

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Our Photo Gallery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every picture tells a story, and together they create the beautiful tapestry of our friendship
            </p>
          </div>
          
          <div className="masonry">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="masonry-item">
                <Card>
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="gallery" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-gallery-title">
              Our Photo Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-subtitle">
              Every picture tells a story, and together they create the beautiful tapestry of our friendship
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-card rounded-xl p-8 mb-12 shadow-sm border border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2" data-testid="text-upload-title">Add New Memories</h3>
                <p className="text-muted-foreground" data-testid="text-upload-subtitle">Share your favorite moments with the group</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3"
                  data-testid="button-upload-photos"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Upload Photos
                </Button>
                <Button
                  variant="outline"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3"
                  data-testid="button-take-photo"
                >
                  <i className="fas fa-camera mr-2"></i>
                  Take Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          {!photos || photos.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-images text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-no-photos">No photos yet</h3>
              <p className="text-muted-foreground mb-6" data-testid="text-no-photos-subtitle">
                Be the first to share a memory by uploading a photo!
              </p>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-upload-first-photo"
              >
                Upload Your First Photo
              </Button>
            </div>
          ) : (
            <div className="masonry">
              {photos.map((photo) => (
                <div key={photo.id} className="masonry-item">
                  <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
                    <div
                      onClick={() => setSelectedPhoto(photo)}
                      data-testid={`card-photo-${photo.id}`}
                    >
                      <img
                        src={`/uploads/${photo.filename}`}
                        alt={photo.caption || photo.originalName}
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-photo-${photo.id}`}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground" data-testid={`text-photo-caption-${photo.id}`}>
                            {photo.caption || 'Untitled'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-photo-uploaded-by-${photo.id}`}>
                            by {photo.uploadedBy}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePhotoMutation.mutate(photo.id)}
                          className="text-destructive hover:text-destructive/90"
                          data-testid={`button-delete-photo-${photo.id}`}
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <PhotoModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
