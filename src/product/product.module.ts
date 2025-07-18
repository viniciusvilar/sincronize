import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FirebirdProvider } from 'src/databse/firebird.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ProductController],
  providers: [ProductService, FirebirdProvider],
})
export class ProductModule {}
