import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';
import { DecksModule } from './decks/decks.module';
import { BrandingModule } from './branding/branding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/pitchdecks'),
    ProjectsModule,
    DecksModule,
    BrandingModule,
  ],
})
export class AppModule {}
