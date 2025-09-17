import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoUploadModal({ isOpen, onClose }: PhotoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      toast({
        title: "Success!",
        description: "Photo uploaded successfully"
      });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setSelectedFiles(null);
    setCaption("");
    setUploadedBy("");
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a photo to upload",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFiles[0]);
    formData.append('caption', caption);
    formData.append('uploadedBy', uploadedBy || 'Anonymous');

    uploadMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Photo</DialogTitle>
          <DialogDescription>
            Share a memory with your friends by uploading a photo with an optional caption.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="photo-upload">Select Photo</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
              data-testid="input-file-upload"
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's the story behind this photo?"
              className="mt-1"
              data-testid="textarea-photo-caption"
            />
          </div>

          <div>
            <Label htmlFor="uploaded-by">Your Name</Label>
            <Input
              id="uploaded-by"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="Who's uploading this photo?"
              className="mt-1"
              data-testid="input-uploaded-by"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1"
              data-testid="button-cancel-upload"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploadMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-submit-upload"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
