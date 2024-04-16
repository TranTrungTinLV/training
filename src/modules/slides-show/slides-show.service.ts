import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateSlidesShowDto } from './dto/create-slides-show.dto';
import { UpdateSlidesShowDto } from './dto/update-slides-show.dto';
import { SlidesShowRepository } from './slides-show.repository';
import * as _ from 'lodash';
import { SlidesService } from '../slides/slides.service';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';
import { SlideShowDocument } from './schemas/slides-show.schema';
import { UpdateAggregationStage, UpdateQuery } from 'mongoose';

@Injectable()
export class SlidesShowService {
  constructor(
    private readonly slidesShowRepo: SlidesShowRepository,
    @Inject(forwardRef(() => SlidesService))
    private readonly slidesService: SlidesService,
    private readonly historiesService: HistoriesService,
  ) {}
  async createSlideShow(
    body: CreateSlidesShowDto,
    user: IUserFromRequest,
  ): Promise<SlideShowDocument> {
    const { name, slides, effect } = body;

    const slidesShowFound = await this.slidesShowRepo.findOne({ name });
    if (slidesShowFound) {
      throw new BadRequestException(
        'Duplicate data, please provide difference value',
      );
    }

    for (const slide of slides) {
      const slideFound = await this.slidesService.findSlidesById(slide);
      if (!slideFound) {
        throw new NotFoundException(
          `Slide id ${slide} not found, please provide a valid ID that exist in Slide`,
        );
      }
    }

    const newSlidesShow = await this.slidesShowRepo.create({
      name,
      slides,
      effect,
      display: false,
    });

    await this.historiesService.createHistory({
      _uid: user._id,
      time: new Date(),
      action: `Create new slide show ${name} at Slides show`,
    });

    return newSlidesShow;
  }

  async getAllSlidesShow(): Promise<SlideShowDocument[]> {
    return this.slidesShowRepo.find();
  }

  async getSlideShow(id: string): Promise<SlideShowDocument> {
    const slideShowFound = (await this.slidesShowRepo.findById(id)).populate(
      'slides',
    );
    if (!slideShowFound) {
      throw new NotFoundException('Slide show not found');
    }

    return slideShowFound;
  }

  async getSlider(): Promise<SlideShowDocument> {
    const slideShowFound = await this.slidesShowRepo.findOneAndPopulate(
      { display: true },
      'slides',
    );

    if (!slideShowFound) {
      throw new NotFoundException('Slide shows not found');
    }

    return slideShowFound;
  }

  async updateSlideShow(
    id: string,
    body: UpdateSlidesShowDto,
    user: IUserFromRequest,
  ): Promise<SlideShowDocument> {
    const { name, effect, display, slides } = body;

    const slidesShowFound = await this.slidesShowRepo.find();
    if (_.some(slidesShowFound, { name, slides, effect })) {
      throw new BadRequestException(
        'Duplicate data, please provide difference value',
      );
    }

    for (const slide of slides) {
      const slideFound = await this.slidesService.findSlidesById(slide);
      if (!slideFound) {
        throw new NotFoundException(
          'Slide id not found, please provide a valid ID that exist in Slide',
        );
      }
    }

    const slideShowUpdated = await this.slidesShowRepo.findByIdAndUpdate(
      id,
      {
        name,
        effect,
        display,
        slides,
      },
      { new: true },
    );

    if (!slideShowUpdated) {
      throw new NotFoundException('Slide show not found');
    }

    await Promise.all([
      this.slidesShowRepo.updateMany(
        { _id: { $ne: id } },
        { $set: { display: false } },
        { new: true },
      ),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update slide show ${slideShowUpdated._id} at Slides show`,
      }),
    ]);

    return slideShowUpdated;
  }

  async deleteSlideShow(id: string, user: IUserFromRequest): Promise<void> {
    const slideShowFound = await this.slidesShowRepo.findById(id);

    if (!slideShowFound) {
      throw new NotFoundException('Slide shows not found');
    }

    await Promise.all([
      slideShowFound.deleteOne(),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete slide show ${slideShowFound._id} at Slides show`,
      }),
    ]);
  }

  async updateManySlideShow(updated: UpdateQuery<SlideShowDocument>) {
    return this.slidesShowRepo.updateMany({}, updated);
  }
}
