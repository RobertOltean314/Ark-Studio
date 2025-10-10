import { Injectable } from '@angular/core';

export interface VideoMetadata {
  fileName: string;
  duration: number; // in seconds
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // Extract only the metadata we need from video file
  extractVideoMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        // Clean up the object URL to free memory
        window.URL.revokeObjectURL(video.src);
        
        const videoMetadata: VideoMetadata = {
          fileName: file.name,
          duration: Math.round(video.duration || 0) // Round to nearest second
        };
        
        resolve(videoMetadata);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata. Please ensure this is a valid video file.'));
      };
      
      // Create temporary object URL to load video metadata
      video.src = URL.createObjectURL(file);
    });
  }

  // Validate video file without size restrictions (since we're not uploading)
  isValidVideoFile(file: File): boolean {
    const allowedTypes = [
      'video/mp4', 
      'video/avi', 
      'video/mov', 
      'video/wmv', 
      'video/flv',
      'video/webm',
      'video/mkv'
    ];
    
    return allowedTypes.includes(file.type);
  }

  // Get human-readable file size (for display purposes)
  getFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Format duration in minutes:seconds
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}