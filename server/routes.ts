import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertPhotoSchema, insertFriendSchema, insertMemorySchema } from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'client', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Add CORS headers for uploaded files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }, (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  // Photos endpoints
  app.get('/api/photos', async (req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch photos' });
    }
  });

  app.post('/api/photos', upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const photoData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        caption: req.body.caption || '',
        uploadedBy: req.body.uploadedBy || 'Anonymous'
      };

      const validatedData = insertPhotoSchema.parse(photoData);
      const photo = await storage.createPhoto(validatedData);
      
      res.status(201).json(photo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  });

  app.delete('/api/photos/:id', async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      // Delete file from disk
      const filePath = path.join(uploadsDir, photo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await storage.deletePhoto(req.params.id);
      res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  });

  // Friends endpoints
  app.get('/api/friends', async (req, res) => {
    try {
      const friends = await storage.getFriends();
      res.json(friends);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch friends' });
    }
  });

  app.post('/api/friends', async (req, res) => {
    try {
      const validatedData = insertFriendSchema.parse(req.body);
      const friend = await storage.createFriend(validatedData);
      res.status(201).json(friend);
    } catch (error) {
      res.status(400).json({ message: 'Invalid friend data' });
    }
  });

  app.put('/api/friends/:id', async (req, res) => {
    try {
      const validatedData = insertFriendSchema.partial().parse(req.body);
      const friend = await storage.updateFriend(req.params.id, validatedData);
      
      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }
      
      res.json(friend);
    } catch (error) {
      res.status(400).json({ message: 'Invalid friend data' });
    }
  });

  // YouTube endpoints
  app.get('/api/youtube/videos', async (req, res) => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API || process.env.API_KEY || '';
      const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.CHANNEL_ID || '';

      if (!apiKey || !channelId) {
        // Return cached videos if API key not available
        const cachedVideos = await storage.getYoutubeVideos();
        return res.json(cachedVideos);
      }

      // Fetch latest videos from YouTube API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=6&type=video`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from YouTube API');
      }

      const data = await response.json();
      
      // Get video details for duration and view count
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,statistics`
      );

      const detailsData = await detailsResponse.json();
      
      // Process and store videos
      const videos = await Promise.all(
        data.items.map(async (item: any, index: number) => {
          const details = detailsData.items[index];
          const videoData = {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            duration: details?.contentDetails?.duration || 'PT0S',
            viewCount: details?.statistics?.viewCount || '0',
            publishedAt: item.snippet.publishedAt
          };

          return await storage.upsertYoutubeVideo(videoData);
        })
      );

      res.json(videos);
    } catch (error) {
      // Return cached videos on error
      const cachedVideos = await storage.getYoutubeVideos();
      res.json(cachedVideos);
    }
  });

  app.get('/api/youtube/channel', async (req, res) => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API || process.env.API_KEY || '';
      const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.CHANNEL_ID || '';

      if (!apiKey || !channelId) {
        return res.json({
          name: 'Squad Adventures',
          description: 'Join us on our crazy adventures, cooking experiments, and friendship moments. New videos every week!',
          subscribers: '15.2K',
          videos: '47',
          views: '1.2M'
        });
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch channel info');
      }

      const data = await response.json();
      const channel = data.items[0];

      res.json({
        name: channel.snippet.title,
        description: channel.snippet.description,
        subscribers: parseInt(channel.statistics.subscriberCount).toLocaleString(),
        videos: parseInt(channel.statistics.videoCount).toLocaleString(),
        views: parseInt(channel.statistics.viewCount).toLocaleString()
      });
    } catch (error) {
      res.json({
        name: 'Squad Adventures',
        description: 'Join us on our crazy adventures, cooking experiments, and friendship moments. New videos every week!',
        subscribers: '15.2K',
        videos: '47',
        views: '1.2M'
      });
    }
  });

  // Memories endpoints
  app.get('/api/memories', async (req, res) => {
    try {
      const memories = await storage.getMemories();
      res.json(memories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch memories' });
    }
  });

  app.post('/api/memories', async (req, res) => {
    try {
      const validatedData = insertMemorySchema.parse(req.body);
      const memory = await storage.createMemory(validatedData);
      res.status(201).json(memory);
    } catch (error) {
      res.status(400).json({ message: 'Invalid memory data' });
    }
  });

  app.put('/api/memories/:id', async (req, res) => {
    try {
      const validatedData = insertMemorySchema.partial().parse(req.body);
      const memory = await storage.updateMemory(req.params.id, validatedData);
      
      if (!memory) {
        return res.status(404).json({ message: 'Memory not found' });
      }
      
      res.json(memory);
    } catch (error) {
      res.status(400).json({ message: 'Invalid memory data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
