import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebirdProvider } from './databse/firebird.provider';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ProductModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, FirebirdProvider],
})
export class AppModule {
}
