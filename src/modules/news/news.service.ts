import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './dto/index';
import { NewsRepository } from './news.repository';
import { CategoriesService } from '../categories/categories.service';
import {
  Pagination,
  deleteSingleFile,
  uploadSingleFile,
} from '../../common/utils/index';
import { formatSlug, isObjectId } from '../../common/utils/index';
import { NewDocument } from './schemas/new.schema';
import { IFileImage, IQuery } from '../../common/interfaces/index';
import { modeNewsEnum } from './schemas/enum/mode_news.enum';
import { FilterQuery, QueryWithHelpers } from 'mongoose';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepo: NewsRepository,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly historiesService: HistoriesService,
  ) {}

  async homeReadNews(queryOptions: IQuery) {
    const features = new Pagination(
      this.newsRepo.findQuery({
        $or: [
          { mode: modeNewsEnum.public },
          { time_public: { $lte: new Date() } },
        ],
      }),
      queryOptions,
    )
      .pagination()
      .searching()
      .sorting()
      .filtering();

    const featuresSearch = new Pagination(
      this.newsRepo.findQuery({
        $or: [
          { mode: modeNewsEnum.public },
          { time_public: { $lte: new Date() } },
        ],
      }),
      queryOptions,
    ).searching();

    const [posts, numbersPost] = await Promise.all([
      features.query,
      featuresSearch.query,
    ]);

    return { data: posts, numbers: numbersPost.length };
  }

  async readNews(queryOptions: IQuery) {
    const features = new Pagination(
      this.newsRepo.findQuery(queryOptions).populate('categories'),
      queryOptions,
    )
      .pagination()
      .sorting()
      .filtering()
      .searching();
    const posts = await features.query;
    const regex = new RegExp(queryOptions?.search || '', 'i');

    const countDocuments = await this.newsRepo.countDocuments({
      $or: [
        { title: { $regex: regex } },
        { summary: { $regex: regex } },
        { content: { $regex: regex } },
        {
          tags: { $regex: decodeURIComponent(queryOptions.search || '') },
        },
      ],
      ...queryOptions,
    });
    return {
      data: posts,
      countDocuments,
    };
  }

  async readNew(idOrSlug: string): Promise<NewDocument> {
    const post = isObjectId(idOrSlug)
      ? await this.newsRepo.findByIdAndPopulate(idOrSlug, [
          'mode',
          'categories',
        ])
      : await this.newsRepo.findOneAndPopulate({ slug: idOrSlug }, [
          'mode',
          'categories',
        ]);

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    await post.updateOne({ $inc: { views: 1 } }, { new: true });

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

  async getAllNews(): Promise<NewDocument[]> {
    const news = await this.newsRepo.find();
    if (news.length === 0) throw new NotFoundException('News are empty');

    return news;
  }

  async createNew(
    file: IFileImage,
    body: CreateNewsDto,
    user: IUserFromRequest,
  ): Promise<NewDocument> {
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
          throw new NotFoundException('Categories not found');
        }
      }
    }

    if (mode === modeNewsEnum.public) {
      body.time_public = new Date();
    }

    const [newPost, newHistory] = await Promise.all([
      this.newsRepo.create({
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
      }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Create new post ${title} at news`,
      }),
    ]);

    return newPost;
  }

  async updateNew(
    file: IFileImage,
    id: string,
    body: UpdateNewsDto,
    user: IUserFromRequest,
  ): Promise<NewDocument> {
    const { title, summary, content, author, mode, tags, categories } = {
      ...body,
      tags: body.tags.split(',').filter(Boolean),
      categories: body.categories.split(',').filter(Boolean),
    };

    const post = await this.newsRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Categories not found');
    }

    if (categories.length > 0) {
      for (const cate of categories) {
        const isCategoryPresent = await this.categoriesService.findById(cate);

        if (!isCategoryPresent) {
          throw new NotFoundException('Categories not found');
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
    const [postUpdated, newHistory] = await Promise.all([
      this.newsRepo.findByIdAndUpdate(id, updatedPost, {
        new: true,
      }),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Update post ${post.title}`,
      }),
    ]);

    return postUpdated;
  }

  async deleteNew(id: string, user: IUserFromRequest): Promise<void> {
    const post = await this.newsRepo.findById(id);

    if (!post) {
      throw new BadRequestException('Invalid params');
    }

    deleteSingleFile(post.image);
    await Promise.all([
      post.deleteOne(),
      this.historiesService.createHistory({
        _uid: user._id,
        time: new Date(),
        action: `Delete post ${post.title}`,
      }),
    ]);
  }

  async getInfo(idOrSlug: string): Promise<NewDocument> {
    const post = isObjectId(idOrSlug)
      ? await this.newsRepo.findByIdAndPopulate(idOrSlug, [
          'mode',
          'categories',
        ])
      : await this.newsRepo.findOneAndPopulate({ slug: idOrSlug }, [
          'mode',
          'categories',
        ]);

    if (!post) {
      throw new NotFoundException('Categories not found');
    }

    return post;
  }

  findQuery(
    filter?: FilterQuery<NewDocument>,
  ): QueryWithHelpers<Array<NewDocument>, NewDocument> {
    return this.newsRepo.findQuery(filter);
  }
}
