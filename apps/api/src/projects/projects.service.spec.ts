import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectModel: Record<string, ReturnType<typeof vi.fn>>;

  const userId = 'user-123';

  const mockProject = {
    _id: 'project-id-1',
    userId,
    name: 'Test Startup',
    description: 'A test project',
    domain: 'test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockProjectModel = {
      find: vi.fn().mockReturnThis(),
      findOne: vi.fn().mockReturnThis(),
      findOneAndUpdate: vi.fn().mockReturnThis(),
      deleteOne: vi.fn(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: {
            ...mockProjectModel,
            new: vi.fn().mockImplementation((data) => ({
              ...data,
              save: vi.fn().mockResolvedValue({ ...mockProject, ...data }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('findAll', () => {
    it('should return all projects for a user sorted by createdAt', async () => {
      const projects = [mockProject, { ...mockProject, _id: 'project-2', name: 'Project 2' }];

      mockProjectModel.find.mockReturnThis();
      mockProjectModel.sort.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(projects);

      const result = await service.findAll(userId);

      expect(mockProjectModel.find).toHaveBeenCalledWith({ userId });
      expect(mockProjectModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(projects);
    });

    it('should return empty array when no projects exist', async () => {
      mockProjectModel.find.mockReturnThis();
      mockProjectModel.sort.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue([]);

      const result = await service.findAll('user-with-no-projects');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id and userId', async () => {
      mockProjectModel.findOne.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(mockProject);

      const result = await service.findOne(userId, 'project-id-1');

      expect(mockProjectModel.findOne).toHaveBeenCalledWith({
        _id: 'project-id-1',
        userId,
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when project not found', async () => {
      mockProjectModel.findOne.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(null);

      await expect(service.findOne(userId, 'non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should not return project belonging to different user', async () => {
      mockProjectModel.findOne.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(null);

      await expect(service.findOne('different-user', 'project-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedProject = { ...mockProject, ...updateDto };

      mockProjectModel.findOneAndUpdate.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(updatedProject);

      const result = await service.update(userId, 'project-id-1', updateDto);

      expect(mockProjectModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'project-id-1', userId },
        updateDto,
        { new: true },
      );
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      mockProjectModel.findOneAndUpdate.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue(null);

      await expect(service.update(userId, 'non-existent', { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      mockProjectModel.deleteOne.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue({ deletedCount: 1 });

      await service.remove(userId, 'project-id-1');

      expect(mockProjectModel.deleteOne).toHaveBeenCalledWith({
        _id: 'project-id-1',
        userId,
      });
    });

    it('should throw NotFoundException when deleting non-existent project', async () => {
      mockProjectModel.deleteOne.mockReturnThis();
      mockProjectModel.exec.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove(userId, 'non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
