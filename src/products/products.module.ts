import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
