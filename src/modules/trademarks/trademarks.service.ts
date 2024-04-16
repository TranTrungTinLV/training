import { Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TrademarksRepository } from './trademarks.repository';
import {
  deleteMulFile,
  renameFile,
  uploadMulFile,
} from '../../common/utils/index';
import { ImageConstant } from '../../common/constant/index';
import { IQueryTrademark } from './interfaces/index';
import { IFileImage, IFilesImage } from '../../common/interfaces/index';
import { TrademarkDocument } from './schemas/trademark.schema';
import { CreateLicenseDto, UpdateLicenseDto } from './dto/index';
import { HistoriesService } from '../histories/histories.service';
import { IUserFromRequest } from '../../common/interfaces/user-from-request.interface';

@Injectable()
export class TrademarksService {
  constructor(
    private readonly trademarksRepo: TrademarksRepository,
    private readonly historiesService: HistoriesService,
  ) {}
  async getTrademark(): Promise<TrademarkDocument> {
    const tradeMark = await this.trademarksRepo.findOne();
    return tradeMark;
  }

  async updateLogo(
    file: IFileImage,
    query: IQueryTrademark,
    user: IUserFromRequest,
  ): Promise<TrademarkDocument> {
    const params = ['favicon', 'logo-icon', 'logo-word', 'logo'];

    if (!params.includes(query.type)) {
      throw new NotFoundException('Invalid Type');
    }
    const tradeMarkFound = await this.trademarksRepo.findOne();
    if (!tradeMarkFound) {
      await this.trademarksRepo.create();
    }
    if (!file) return tradeMarkFound;

    switch (query.type) {
      case 'logo': {
        renameFile(file.path, ImageConstant.logo_word_icon);
        break;
      }
      case 'favicon': {
        renameFile(file.path, ImageConstant.favicon);
        break;
      }
      case 'logo-icon': {
        renameFile(file.path, ImageConstant.logo_icon);
        break;
      }
      case 'logo-word': {
        renameFile(file.path, ImageConstant.logo_word);
        break;
      }
    }

    await Promise.all([
      this.updateElementInput(query.type, file.path, tradeMarkFound),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Cập nhật ${query.type} ở phần About`,
      }),
    ]);
    return tradeMarkFound;
  }

  async updateLicense(
    files: IFilesImage,
    id: string,
    body: UpdateLicenseDto,
    user: IUserFromRequest,
  ): Promise<TrademarkDocument> {
    const { text } = body;

    const tradeMark = await this.trademarksRepo.findOne();

    if (!tradeMark) {
      await this.trademarksRepo.create();
    }
    if (!files[0]) return tradeMark;

    const index = tradeMark.license.findIndex((i) => i._id.toString() === id);
    deleteMulFile(tradeMark.license[index].images, 'array');

    const [trademarkUpdated, historiesCreated] = await Promise.all([
      await this.trademarksRepo.findOneAndUpdate(
        { 'license._id': id },
        {
          $set: {
            'license.$.text': text,
            'license.$.images': uploadMulFile(files),
          },
        },
        { new: true },
      ),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: 'upload license',
      }),
    ]);

    return trademarkUpdated;
  }

  async createLicense(
    files: IFilesImage,
    body: CreateLicenseDto,
    user: IUserFromRequest,
  ): Promise<TrademarkDocument> {
    const tradeMark = await this.trademarksRepo.findOne();

    if (!tradeMark) {
      await this.trademarksRepo.create();
    }

    await Promise.all([
      tradeMark.updateOne(
        {
          $push: {
            license: {
              _id: new Types.ObjectId(),
              text: body.text,
              images: uploadMulFile(files),
            },
          },
        },
        { new: true },
      ),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Thêm mới license (${body.text}) ở phần About`,
      }),
    ]);

    return await this.getTrademark();
  }

  async deleteLicense(
    id: string,
    user: IUserFromRequest,
  ): Promise<TrademarkDocument> {
    const tradeMark = await this.trademarksRepo.findOne();

    if (!tradeMark) {
      throw new NotFoundException('Trademark not found');
    }

    const index = tradeMark.license.findIndex((i) => i._id.toString() === id);

    deleteMulFile(tradeMark.license[index].images, 'array');
    await Promise.all([
      tradeMark.updateOne({ $pull: { license: { _id: id } } }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Xóa license (${tradeMark.license[index].text}) ở phần About`,
      }),
    ]);

    return this.getTrademark();
  }

  async updateElementInput(
    element: string,
    value: string,
    doc: TrademarkDocument,
  ): Promise<TrademarkDocument> {
    switch (element) {
      case 'favicon': {
        doc.favicon = value;
        break;
      }
      case 'logo-icon': {
        doc.logoIcon = value;
        break;
      }
      case 'logo-word': {
        doc.logoWord = value;
        break;
      }
      case 'logo': {
        doc.logo = value;
        break;
      }
      case 'copyright': {
        doc.copyRight = value;
        break;
      }
      default: {
        break;
      }
    }

    return await doc.save();
  }
}
