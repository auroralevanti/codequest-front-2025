import { likePost, unlikePost, checkIfLiked, getLikeCount } from '../lib/likeService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('likeService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('likePost', () => {
    it('should call the API with correct parameters', async () => {
      // Mock successful response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { id: 'like123', userId: 'user123', postId: 'post123', createdAt: '2023-01-01' } })
      });

      // Mock cookie
      Object.defineProperty(document, 'cookie', {
        value: 'user={"id":"user123","token":"test-token"}',
        writable: true
      });

      await likePost('post123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/likes'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          },
          body: JSON.stringify({ postId: 'post123' })
        })
      );
    });
  });

  describe('unlikePost', () => {
    it('should call the API with correct parameters', async () => {
      // Mock successful response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      // Mock cookie
      Object.defineProperty(document, 'cookie', {
        value: 'user={"id":"user123","token":"test-token"}',
        writable: true
      });

      await unlikePost('like123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/likes/like123'),
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer test-token'
          }
        })
      );
    });
  });
});