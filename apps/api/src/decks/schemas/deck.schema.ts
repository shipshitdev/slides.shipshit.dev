import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Types } from 'mongoose';

export type DeckDocument = Deck & Document;

export type AudienceType = 'cold_leads' | 'customers' | 'investors' | 'custom';

export interface SlideContent {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

@Schema({ timestamps: true })
export class Deck {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, enum: ['cold_leads', 'customers', 'investors', 'custom'] })
  audienceType: AudienceType;

  @Prop({ type: Array, default: [] })
  slides: SlideContent[];

  @Prop({ type: Object })
  theme: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };

  @Prop({ default: false })
  isPublic: boolean;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
