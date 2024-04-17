import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsRepository } from './news.repository';
import { CategoriesService } from '../categories/categories.service';
import { modeNewsEnum } from '../../common/enum';
import {
  deleteSingleFile,
  uploadSingleFile,
} from '../../common/utils/transfer.util';
import { formatSlug, isObjectId } from '../../common/utils';
import { New, NewDocument } from './schemas/new.schema';
import { IFileImage } from '../../common/interfaces/file.interface';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepo: NewsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createNew(file: IFileImage, body: CreateNewsDto) {
    const { title, summary, content, author, mode, tags, categories } = {
      ...body,
      tags: body.tags.split(',').filter(Boolean),
      categories: body.categories.split(',').filter(Boolean),
    };
    if (!file) {
      throw new BadRequestException('Required Image');
    }
    if (categories.length > 0) {
      for (const category of categories) {
        const isCategoryPresent = await this.categoriesService.findById(
          category,
        );
        if (!isCategoryPresent) {
          throw new NotFoundException('Not Found');
        }
      }
    }
    if (mode === modeNewsEnum.public) {
      body.time_public = new Date();
    }
    await this.newsRepo.create({
      title,
      summary,
      content,
      author,
      mode,
      tags,
      categories,
      time_public: body.time_public,
      image: uploadSingleFile(file),
      slug: formatSlug(title, { isEdit: false, oldSlug: null }),
    });
    return await this.getNews();
  }

  async updateNew(file: IFileImage, id: string, body: UpdateNewsDto) {
    const { title, summary, content, author, mode, tags, categories } = {
      ...body,
      tags: body.tags.split(',').filter(Boolean),
      categories: body.categories.split(',').filter(Boolean),
    };
    const post = await this.newsRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Not Found');
    }
    if (categories.length > 0) {
      for (const cate of categories) {
        const isCategoryPresent = await this.categoriesService.findById(cate);

        if (!isCategoryPresent) {
          throw new NotFoundException('Not Found');
        }
      }
    }

    if (mode === modeNewsEnum.public) {
      body.time_public = new Date();
    }

    const updatedPost = {
      title,
      summary,
      content,
      author,
      image: file ? uploadSingleFile(file) : post.image,
      mode,
      tags: tags.length > 0 ? tags : post.tags,
      categories: categories.length > 0 ? categories : post.categories,
      slug: formatSlug(title, { isEdit: true, oldSlug: post.slug }),
    };
    await this.newsRepo.findByIdAndUpdate(id, updatedPost, { new: true });
    return await this.getNews();
  }

  async deleteNew(id: string) {
    const post = await this.newsRepo.findById(id);
    if (!post) {
      throw new BadRequestException('Invalid params');
    }
    await post.deleteOne();
    deleteSingleFile(post.image);
    return post;
  }

  async getInfo(idOrSlug: string) {
    const post = isObjectId(idOrSlug)
      ? await this.newsRepo.findByIdAndPopulate(idOrSlug)
      : await this.newsRepo.findOneAndPopulate({ slug: idOrSlug });
    if (!post) {
      throw new NotFoundException('Not Found');
    }
    return post;
  }

  async getNews() {
    const postsPending = await this.newsRepo.find({
      mode: modeNewsEnum.pending,
    });
    const postsPublic = await this.newsRepo.find({ mode: modeNewsEnum.public });
    const postsHidden = await this.newsRepo.find({ mode: modeNewsEnum.hidden });
    const postsPrivate = await this.newsRepo.find({
      mode: modeNewsEnum.private,
    });
    const posts = {};
    posts['pending'] = postsPending;
    posts['public'] = postsPublic;
    posts['hidden'] = postsHidden;
    posts['private'] = postsPrivate;

    return posts;
  }

  async findAllNews(): Promise<NewDocument[]> {
    return this.newsRepo.find();
  }
}
