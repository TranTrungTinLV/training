import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  AuthModule,
  UsersModule,
  AdminsModule,
  CategoriesModule,
  CommonsModule,
  ContactsModule,
  CoursesModule,
  EmailsModule,
  StudentsModule,
  HistoriesModule,
  LocationsModule,
  NewsModule,
  RolesModule,
  SlidesModule,
  TeamGroupsModule,
  TeamPositionsModule,
  TeamsModule,
  TypeEffectsModule,
  TypeSlidesModule,
  TrademarksModule,
} from './modules/index';
//** App module chứa tất cả các module khác */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    AdminsModule,
    CategoriesModule,
    CommonsModule,
    ContactsModule,
    CoursesModule,
    EmailsModule,
    StudentsModule,
    HistoriesModule,
    LocationsModule,
    NewsModule,
    RolesModule,
    SlidesModule,
    TeamGroupsModule,
    TeamPositionsModule,
    TeamsModule,
    TypeEffectsModule,
    TypeSlidesModule,
    TrademarksModule,
    TrademarksModule,
  ],
})
export class AppModule {}
