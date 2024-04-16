import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { SlidesRepository } from './schemas/slides.repository';
import { CreateSlideDto } from './dto/create-slide.dto';
import { IFileImage } from '../../common/interfaces';
import {
  deleteSingleFile,
  updateSingleFile,
  uploadSingleFile,
} from 'src/common/utils';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { SlidesShowService } from '../slides-show/slides-show.service';
import { IUserFromRequest } from '../../common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class SlidesService {
  constructor(
    private readonly slidesRepo: SlidesRepository,
    @Inject(forwardRef(() => SlidesShowService))
    private readonly slidesShowService: SlidesShowService,
    private readonly historiesService: HistoriesService,
  ) {}

  async getSliders() {
    return this.slidesShowService.getSlider();
  }

  async createSlide(
    file: IFileImage,
    body: CreateSlideDto,
    user: IUserFromRequest,
  ) {
    const { title, description, navigate } = body;

    const slideFound = await this.slidesRepo.findOne({ title });
    if (slideFound) {
      throw new BadRequestException(
        'Duplicate data, please provide difference value',
      );
    }
    if (!file) {
      throw new BadRequestException('Image file is missing');
    }

    const [newSlide, newHistoty] = await Promise.all([
      this.slidesRepo.create({
        title,
        description,
        navigate,
        image: uploadSingleFile(file),
      }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Add new slide ${title} at Slides`,
      }),
    ]);

    return newSlide;
  }

  async readSlide(id: string) {
    const slideFound = await this.slidesRepo.findById(id);
    if (!slideFound) {
      throw new NotFoundException('Slide not found');
    }

    return slideFound;
  }

  async updateSlide(
    file: IFileImage,
    id: string,
    body: UpdateSlideDto,
    user: IUserFromRequest,
  ) {
    const { title, description, navigate } = body;

    const slideFound = await this.slidesRepo.findById(id);
    if (!slideFound) {
      throw new NotFoundException(`Slide not found`);
    }

    const [slideUpdated, newHistoty] = await Promise.all([
      this.slidesRepo.findByIdAndUpdate(
        id,
        {
          title,
          description,
          navigate,
          image: file
            ? updateSingleFile(file, slideFound.image)
            : slideFound.image,
        },
        { new: true },
      ),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update slide ${slideFound._id} at Slides`,
      }),
    ]);

    return slideUpdated;
  }

  async deleteSlide(id: string, user: IUserFromRequest) {
    const slideFound = await this.slidesRepo.findById(id);

    if (!slideFound) {
      throw new NotFoundException(`Slide not found`);
    }

    deleteSingleFile(slideFound.image);

    await Promise.all([
      slideFound.deleteOne(),
      this.slidesShowService.updateManySlideShow({
        $pull: { slides: { $in: [id] } },
      }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete slide ${slideFound._id} at Slides`,
      }),
    ]);
  }

  async getAllSlides() {
    return this.slidesRepo.find();
  }

  async findSlidesById(id: string) {
    return this.slidesRepo.findById(id);
  }
}
