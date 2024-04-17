import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { CommonsRepository } from './commons.repository';
import {
  deleteSingleFile,
  updateSingleFile,
  uploadSingleFile,
} from '../../common/utils/transfer.util';
import { IFileImage } from '../../common/interfaces/file.interface';

@Injectable()
export class CommonsService {
  constructor(private readonly commonsRepo: CommonsRepository) {}
  async createCommon(file: IFileImage, body: CreateCommonDto) {
    const { title, description } = body;
    const commonFound = await this.commonsRepo.findOne({ title });
    if (commonFound) {
      throw new BadRequestException('Duplicate data');
    }
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    const image = uploadSingleFile(file);
    await this.commonsRepo.create({ title, description, image });
    return this.findAllCommons();
  }

  async readCommon(query) {
    const { destination } = query;
    const common = await this.commonsRepo.findOne({ title: destination });
    if (!common) {
      throw new NotFoundException('Not Found Common');
    }
    return common;
  }

  async findByIdCommon(id: string) {
    return this.commonsRepo.findById(id);
  }

  findAllCommons() {
    return this.commonsRepo.find();
  }

  async updateCommon(file: IFileImage, id: string, body: UpdateCommonDto) {
    const { title, description } = body;
    const commonFound = await this.findByIdCommon(id);
    if (!commonFound) {
      throw new NotFoundException('Not found common');
    }
    const image = updateSingleFile(file, commonFound.image);
    await commonFound.updateOne({ title, description, image }, { new: true });
    return this.findByIdCommon(id);
  }

  async deleteCommon(title: string) {
    const commonFound = await this.commonsRepo.findOne({ title });
    if (!commonFound) {
      throw new NotFoundException('Not found common');
    }
    commonFound.deleteOne();
    deleteSingleFile(commonFound.image);
    return this.findAllCommons();
  }
}
