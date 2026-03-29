import { TestBed } from '@angular/core/testing';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUploadService],
    });

    service = TestBed.inject(FileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate video file types', () => {
    const validFile = new File([''], 'test.mp4', { type: 'video/mp4' });
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

    expect(service.isValidVideoFile(validFile)).toBe(true);
    expect(service.isValidVideoFile(invalidFile)).toBe(false);
  });

  it('should format file sizes correctly', () => {
    expect(service.getFileSize(500)).toBe('500 Bytes');
    expect(service.getFileSize(1024)).toBe('1.00 KB');
    expect(service.getFileSize(1048576)).toBe('1.00 MB');
    expect(service.getFileSize(1073741824)).toBe('1.00 GB');
  });

  it('should format duration correctly', () => {
    expect(service.formatDuration(59)).toBe('00:59');
    expect(service.formatDuration(125)).toBe('02:05');
    expect(service.formatDuration(3661)).toBe('61:01');
  });
});
