import { describe, it, expect } from 'vitest';
import { TagSchema, CreateTagSchema } from '../schemas';

/**
 * Tests for the shared Zod schemas.
 */
describe('Shared Schemas', () => {
  /**
   * Tests for the TagSchema.
   */
  describe('TagSchema', () => {
    it('validates a correct tag', () => {
      const validTag = { id: 1, name: 'Work', color: '#ff0000' };
      const result = TagSchema.safeParse(validTag);
      expect(result.success).toBe(true);
    });

    it('fails if name is empty', () => {
      const invalidTag = { id: 1, name: '', color: '#ff0000' };
      const result = TagSchema.safeParse(invalidTag);
      expect(result.success).toBe(false);
    });
  });

  /**
   * Tests for the CreateTagSchema.
   */
  describe('CreateTagSchema', () => {
    it('validates a correct create tag request', () => {
      const validRequest = { name: 'Urgent', color: '#00ff00' };
      const result = CreateTagSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('fails if color is missing', () => {
      const invalidRequest = { name: 'Urgent' };
      const result = CreateTagSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});
