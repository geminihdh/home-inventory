import { describe, it, expect, vi } from 'vitest';
import { uploadImage, base64ToFile } from '../imageUpload';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

vi.mock('../firebase', () => ({
  storage: {}
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

describe('imageUpload service', () => {
  it('should upload an image and return download URL', async () => {
    const userId = 'user123';
    const itemId = 'item456';
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const mockRef = { fullPath: `users/${userId}/images/${itemId}` };
    const mockSnapshot = { ref: mockRef };
    const mockUrl = 'https://firebasestorage.googleapis.com/v0/b/test/o/test.png?alt=media';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(ref).mockReturnValue(mockRef as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(uploadBytes).mockResolvedValue(mockSnapshot as any);
    vi.mocked(getDownloadURL).mockResolvedValue(mockUrl);

    const url = await uploadImage(userId, itemId, file);

    expect(ref).toHaveBeenCalledWith(storage, `users/${userId}/images/${itemId}`);
    expect(uploadBytes).toHaveBeenCalledWith(mockRef, file);
    expect(getDownloadURL).toHaveBeenCalledWith(mockRef);
    expect(url).toBe(mockUrl);
  });

  describe('base64ToFile', () => {
    it('should convert base64 to File object', () => {
      const base64 = 'data:image/png;base64,dGVzdA=='; // "test" in base64
      const filename = 'test.png';
      const file = base64ToFile(base64, filename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe('image/png');
    });
  });
});
