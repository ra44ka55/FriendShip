import { type Photo, type InsertPhoto, type Friend, type InsertFriend, type YoutubeVideo, type InsertYoutubeVideo, type Memory, type InsertMemory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Photos
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: string): Promise<void>;

  // Friends
  getFriends(): Promise<Friend[]>;
  getFriend(id: string): Promise<Friend | undefined>;
  createFriend(friend: InsertFriend): Promise<Friend>;
  updateFriend(id: string, friend: Partial<InsertFriend>): Promise<Friend | undefined>;
  deleteFriend(id: string): Promise<void>;

  // YouTube Videos
  getYoutubeVideos(): Promise<YoutubeVideo[]>;
  getYoutubeVideo(id: string): Promise<YoutubeVideo | undefined>;
  upsertYoutubeVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo>;
  deleteYoutubeVideo(id: string): Promise<void>;

  // Memories
  getMemories(): Promise<Memory[]>;
  getMemory(id: string): Promise<Memory | undefined>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  updateMemory(id: string, memory: Partial<InsertMemory>): Promise<Memory | undefined>;
  deleteMemory(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private photos: Map<string, Photo>;
  private friends: Map<string, Friend>;
  private youtubeVideos: Map<string, YoutubeVideo>;
  private memories: Map<string, Memory>;

  constructor() {
    this.photos = new Map();
    this.friends = new Map();
    this.youtubeVideos = new Map();
    this.memories = new Map();

    // Initialize with some sample friends
    this.initializeData();
  }

  private async initializeData() {
    // Add sample friends
    const sampleFriends: InsertFriend[] = [
      {
        name: "Sarah",
        bio: "The one who always suggests the craziest adventures and somehow convinces us all to join. Mountain climbing, anyone?",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b02eaf48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        role: "Adventure Seeker",
        socialLinks: ["instagram", "twitter"]
      },
      {
        name: "Mike",
        bio: "Our resident foodie who can turn any random ingredients into a gourmet meal. Pizza night coordinator extraordinaire!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        role: "Master Chef",
        socialLinks: ["linkedin", "github"]
      },
      {
        name: "Emma",
        bio: "The photographer of the group who captures every moment. Thanks to her, we have all these amazing memories preserved!",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        role: "Memory Keeper",
        socialLinks: ["instagram", "camera"]
      }
    ];

    for (const friend of sampleFriends) {
      await this.createFriend(friend);
    }

    // Add sample memories
    const sampleMemories: InsertMemory[] = [
      {
        title: "Squad Formation",
        description: "The day we all officially became best friends. It started with a random group chat and now look at us!",
        date: "January 2023",
        type: "milestone"
      },
      {
        title: "First Epic Adventure",
        description: "Our first group hiking trip where Mike forgot the map and we got 'temporarily lost' for 4 hours.",
        date: "March 2023",
        type: "adventure"
      },
      {
        title: "YouTube Channel Launch",
        description: '"Let\'s start a YouTube channel," said Sarah. "It\'ll be fun," she said. And it actually was!',
        date: "June 2023",
        type: "milestone"
      },
      {
        title: "Festival Squad Goals",
        description: "Three days of music, questionable food choices, and the best group bonding experience ever.",
        date: "September 2023",
        type: "event"
      },
      {
        title: "Squad Website Launch",
        description: "Emma suggested we needed a place to keep all our memories safe. And here we are!",
        date: "December 2023",
        type: "milestone"
      }
    ];

    for (const memory of sampleMemories) {
      await this.createMemory(memory);
    }
  }

  // Photos
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      caption: insertPhoto.caption || null,
      id,
      createdAt: new Date()
    };
    this.photos.set(id, photo);
    return photo;
  }

  async deletePhoto(id: string): Promise<void> {
    this.photos.delete(id);
  }

  // Friends
  async getFriends(): Promise<Friend[]> {
    return Array.from(this.friends.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getFriend(id: string): Promise<Friend | undefined> {
    return this.friends.get(id);
  }

  async createFriend(insertFriend: InsertFriend): Promise<Friend> {
    const id = randomUUID();
    const friend: Friend = {
      ...insertFriend,
      avatar: insertFriend.avatar || null,
      socialLinks: insertFriend.socialLinks || null,
      id,
      createdAt: new Date()
    };
    this.friends.set(id, friend);
    return friend;
  }

  async updateFriend(id: string, updateData: Partial<InsertFriend>): Promise<Friend | undefined> {
    const friend = this.friends.get(id);
    if (!friend) return undefined;

    const updatedFriend = { ...friend, ...updateData };
    this.friends.set(id, updatedFriend);
    return updatedFriend;
  }

  async deleteFriend(id: string): Promise<void> {
    this.friends.delete(id);
  }

  // YouTube Videos
  async getYoutubeVideos(): Promise<YoutubeVideo[]> {
    return Array.from(this.youtubeVideos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getYoutubeVideo(id: string): Promise<YoutubeVideo | undefined> {
    return this.youtubeVideos.get(id);
  }

  async upsertYoutubeVideo(insertVideo: InsertYoutubeVideo): Promise<YoutubeVideo> {
    const existingVideo = this.youtubeVideos.get(insertVideo.id);
    const video: YoutubeVideo = {
      ...insertVideo,
      description: insertVideo.description || null,
      createdAt: existingVideo?.createdAt || new Date()
    };
    this.youtubeVideos.set(insertVideo.id, video);
    return video;
  }

  async deleteYoutubeVideo(id: string): Promise<void> {
    this.youtubeVideos.delete(id);
  }

  // Memories
  async getMemories(): Promise<Memory[]> {
    return Array.from(this.memories.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getMemory(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const id = randomUUID();
    const memory: Memory = {
      ...insertMemory,
      type: insertMemory.type || "milestone",
      id,
      createdAt: new Date()
    };
    this.memories.set(id, memory);
    return memory;
  }

  async updateMemory(id: string, updateData: Partial<InsertMemory>): Promise<Memory | undefined> {
    const memory = this.memories.get(id);
    if (!memory) return undefined;

    const updatedMemory = { ...memory, ...updateData };
    this.memories.set(id, updatedMemory);
    return updatedMemory;
  }

  async deleteMemory(id: string): Promise<void> {
    this.memories.delete(id);
  }
}

export const storage = new MemStorage();
