import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommonDto, UpdateCommonDto } from './dto/index';
import { CommonsRepository } from './commons.repository';
import {
  deleteSingleFile,
  updateSingleFile,
  uploadSingleFile,
} from '../../common/utils/index';
import { IFileImage, IQuery } from '../../common/interfaces/index';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';
import { CommonDocument } from './schemas/common.schema';

@Injectable()
export class CommonsService {
  constructor(
    private readonly commonsRepo: CommonsRepository,
    private readonly historiesService: HistoriesService,
  ) {}

  async createCommon(
    file: IFileImage,
    body: CreateCommonDto,
    user: IUserFromRequest,
  ): Promise<CommonDocument[]> {
    const { title, description } = body;

    const commonFound = await this.commonsRepo.findOne({ title });

    if (commonFound) {
      throw new BadRequestException('Duplicate data');
    }
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const image = uploadSingleFile(file);
    await Promise.all([
      this.commonsRepo.create({ title, description, image }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Create new common has title is ${title}`,
      }),
    ]);

    return this.findAllCommons();
  }

  async readCommon(query?: IQuery): Promise<CommonDocument[] | CommonDocument> {
    if (!query) {
      return this.commonsRepo.find();
    }

    const { destination } = query;

    const common = await this.commonsRepo.findOne({ title: destination });
    if (!common) {
      throw new NotFoundException('Common not found');
    }

    return common;
  }

  async updateCommon(
    file: IFileImage,
    id: string,
    body: UpdateCommonDto,
    user: IUserFromRequest,
  ): Promise<CommonDocument> {
    const { title, description } = body;

    const commonFound = await this.findByIdCommon(id);
    if (!commonFound) {
      throw new NotFoundException('Common not found');
    }

    const image = updateSingleFile(file, commonFound.image);
    await Promise.all([
      commonFound.updateOne({ title, description, image }, { new: true }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update a common ${commonFound._id} successfully`,
      }),
    ]);

    return this.findByIdCommon(id);
  }

  async deleteCommon(title: string, user: IUserFromRequest): Promise<void> {
    const commonFound = await this.commonsRepo.findOne({ title });
    if (!commonFound) {
      throw new NotFoundException('Common not found');
    }

    deleteSingleFile(commonFound.image);

    await Promise.all([
      commonFound.deleteOne(),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete a common ${commonFound._id} successfully`,
      }),
    ]);
  }

  async findByIdCommon(id: string): Promise<CommonDocument> {
    return this.commonsRepo.findById(id);
  }

  findAllCommons(): Promise<CommonDocument[]> {
    return this.commonsRepo.find();
  }
}
