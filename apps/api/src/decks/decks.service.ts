import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { ProjectsService } from '../projects/projects.service';
import type { CreateDeckDto } from './dto/create-deck.dto';
import type { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck, type DeckDocument } from './schemas/deck.schema';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
    private projectsService: ProjectsService
  ) {}

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30);
    return `${base}-${nanoid(8)}`;
  }

  async create(userId: string, createDeckDto: CreateDeckDto): Promise<Deck> {
    // Verify user owns the project
    await this.projectsService.findOne(userId, createDeckDto.projectId);

    const deck = new this.deckModel({
      ...createDeckDto,
      projectId: new Types.ObjectId(createDeckDto.projectId),
      slug: this.generateSlug(createDeckDto.title),
      slides: createDeckDto.slides || [],
    });
    return deck.save();
  }

  async findAllByProject(userId: string, projectId: string): Promise<Deck[]> {
    // Verify user owns the project
    await this.projectsService.findOne(userId, projectId);

    return this.deckModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(userId: string, id: string): Promise<Deck> {
    const deck = await this.deckModel.findById(id).exec();
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }

    // Verify user owns the project
    await this.projectsService.findOne(userId, deck.projectId.toString());

    return deck;
  }

  async findBySlug(slug: string): Promise<Deck> {
    const deck = await this.deckModel.findOne({ slug }).exec();
    if (!deck) {
      throw new NotFoundException(`Deck not found`);
    }
    if (!deck.isPublic) {
      throw new ForbiddenException('This deck is not public');
    }
    return deck;
  }

  async update(userId: string, id: string, updateDeckDto: UpdateDeckDto): Promise<Deck> {
    // Verify ownership
    await this.findOne(userId, id);

    const deck = await this.deckModel.findByIdAndUpdate(id, updateDeckDto, { new: true }).exec();
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return deck;
  }

  async remove(userId: string, id: string): Promise<void> {
    // Verify ownership
    await this.findOne(userId, id);

    const result = await this.deckModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
  }
}
