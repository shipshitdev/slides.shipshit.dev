import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DecksService } from './decks.service';
import { Deck } from './schemas/deck.schema';
import { ProjectsService } from '../projects/projects.service';

describe('DecksService', () => {
  let service: DecksService;
  let mockDeckModel: Record<string, ReturnType<typeof vi.fn>>;
  let mockProjectsService: { findOne: ReturnType<typeof vi.fn> };

  const userId = 'user-123';
  const projectId = new Types.ObjectId().toString();

  const mockProject = {
    _id: projectId,
    userId,
    name: 'Test Project',
  };

  const mockDeck = {
    _id: 'deck-id-1',
    projectId: new Types.ObjectId(projectId),
    title: 'Investor Pitch',
    slug: 'investor-pitch-abc12345',
    audience: 'investor',
    slides: [],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockDeckModel = {
      find: vi.fn().mockReturnThis(),
      findOne: vi.fn().mockReturnThis(),
      findById: vi.fn().mockReturnThis(),
      findByIdAndUpdate: vi.fn().mockReturnThis(),
      deleteOne: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };

    mockProjectsService = {
      findOne: vi.fn().mockResolvedValue(mockProject),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecksService,
        {
          provide: getModelToken(Deck.name),
          useValue: {
            ...mockDeckModel,
            new: vi.fn().mockImplementation((data) => ({
              ...data,
              save: vi.fn().mockResolvedValue({ ...mockDeck, ...data }),
            })),
          },
        },
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    service = module.get<DecksService>(DecksService);
  });

  describe('findAllByProject', () => {
    it('should return all decks for a project', async () => {
      const decks = [mockDeck, { ...mockDeck, _id: 'deck-2', title: 'Sales Pitch' }];

      mockDeckModel.find.mockReturnThis();
      mockDeckModel.sort.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(decks);

      const result = await service.findAllByProject(userId, projectId);

      expect(mockProjectsService.findOne).toHaveBeenCalledWith(userId, projectId);
      expect(result).toHaveLength(2);
    });

    it('should verify project ownership before returning decks', async () => {
      mockProjectsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findAllByProject('wrong-user', projectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a deck by id', async () => {
      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(mockDeck);

      const result = await service.findOne(userId, 'deck-id-1');

      expect(mockDeckModel.findById).toHaveBeenCalledWith('deck-id-1');
      expect(mockProjectsService.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockDeck);
    });

    it('should throw NotFoundException when deck not found', async () => {
      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(null);

      await expect(service.findOne(userId, 'non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a public deck by slug', async () => {
      const publicDeck = { ...mockDeck, isPublic: true };
      mockDeckModel.findOne.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(publicDeck);

      const result = await service.findBySlug('investor-pitch-abc12345');

      expect(mockDeckModel.findOne).toHaveBeenCalledWith({ slug: 'investor-pitch-abc12345' });
      expect(result.isPublic).toBe(true);
    });

    it('should throw NotFoundException when deck not found', async () => {
      mockDeckModel.findOne.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when deck is not public', async () => {
      mockDeckModel.findOne.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(mockDeck); // isPublic: false

      await expect(service.findBySlug('investor-pitch-abc12345')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a deck', async () => {
      const updateDto = { title: 'Updated Pitch' };
      const updatedDeck = { ...mockDeck, ...updateDto };

      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValueOnce(mockDeck);
      mockDeckModel.findByIdAndUpdate.mockReturnThis();
      mockDeckModel.exec.mockResolvedValueOnce(updatedDeck);

      const result = await service.update(userId, 'deck-id-1', updateDto);

      expect(result.title).toBe('Updated Pitch');
    });

    it('should throw NotFoundException when updating non-existent deck', async () => {
      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(null);

      await expect(service.update(userId, 'non-existent', { title: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a deck', async () => {
      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValueOnce(mockDeck);
      mockDeckModel.deleteOne.mockReturnThis();
      mockDeckModel.exec.mockResolvedValueOnce({ deletedCount: 1 });

      await service.remove(userId, 'deck-id-1');

      expect(mockDeckModel.deleteOne).toHaveBeenCalledWith({ _id: 'deck-id-1' });
    });

    it('should throw NotFoundException when deleting non-existent deck', async () => {
      mockDeckModel.findById.mockReturnThis();
      mockDeckModel.exec.mockResolvedValue(null);

      await expect(service.remove(userId, 'non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
