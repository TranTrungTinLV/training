import { Injectable, NotFoundException } from '@nestjs/common';
import { TrademarksRepository } from './trademarks.repository';
import {
  deleteMulFile,
  renameFile,
  uploadMulFile,
} from '../../common/utils/transfer.util';
import { ImageConstant } from '../../common/constant/image.constant';
import { IQuery } from './interfaces/query.interface';
import {
  IFileImage,
  IFilesImage,
} from '../../common/interfaces/file.interface';
import { TrademarkDocument } from './schemas/trademark.schema';

@Injectable()
export class TrademarksService {
  constructor(private readonly trademarksRepo: TrademarksRepository) {}
  async findOneTrademark() {
    const tradeMark = await this.trademarksRepo.findOne();
    if (!tradeMark) {
      throw new NotFoundException('Trademark is empty!');
    }
    return tradeMark;
  }

  async updateLogo(image: IFileImage, query: IQuery) {
    const params = ['favicon', 'logo-icon', 'logo-word', 'logo'];
    if (!params.includes(query.type)) {
      throw new NotFoundException('Invalid Type');
    }
    const tradeMarkFound = await this.trademarksRepo.findOne();
    if (!tradeMarkFound) {
      await this.trademarksRepo.create();
    }
    if (!image) return tradeMarkFound;
    switch (query.type) {
      case 'logo': {
        renameFile(image.path, ImageConstant.logo_word_icon);
        break;
      }
      case 'favicon': {
        renameFile(image.path, ImageConstant.favicon);
        break;
      }
      case 'logo-icon': {
        renameFile(image.path, ImageConstant.logo_icon);
        break;
      }
      case 'logo-word': {
        renameFile(image.path, ImageConstant.logo_word);
        break;
      }
    }
    await this.updateElementInput(query.type, image.path, tradeMarkFound);
    return tradeMarkFound;
  }

  async updateLicense(images: IFilesImage, id: string, body) {
    let data = {};
    const tradeMark = await this.trademarksRepo.findOne();
    if (!tradeMark) {
      await this.trademarksRepo.create();
    }
    if (!images[0]) return tradeMark;

    const index = tradeMark.license.findIndex((i) => i._id.toString() === id);
    deleteMulFile(tradeMark.license[index].images, 'array');
    data = {
      text: body.text,
      images: uploadMulFile(images),
    };
    await this.trademarksRepo.updateOne(
      { _id: tradeMark._id, 'license._id': id },
      { $set: { 'license.$': data } },
      { new: true },
    );
    return tradeMark;
  }

  async createLicense(images: IFilesImage, body) {
    let data = {};
    const tradeMark = await this.trademarksRepo.findOne();
    if (!tradeMark) {
      await this.trademarksRepo.create();
    }
    data = {
      text: body.text,
      images: uploadMulFile(images),
    };
    await tradeMark.updateOne({ $push: { license: data } }, { new: true });
    return this.findOneTrademark();
  }

  async deleteLicense(id: string) {
    const tradeMark = await this.trademarksRepo.findOne();
    if (!tradeMark) {
      throw new NotFoundException('Not Found');
    }
    const index = tradeMark.license.findIndex((i) => i._id.toString() === id);
    deleteMulFile(tradeMark.license[index].images, 'array');
    await tradeMark.updateOne(
      { _id: tradeMark.id, 'license._id': id },
      { $pull: { license: { _id: id } } },
    );
    return this.findOneTrademark();
  }

  updateElementInput(element: string, value: string, doc: TrademarkDocument) {
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
    return doc.save();
  }
}
