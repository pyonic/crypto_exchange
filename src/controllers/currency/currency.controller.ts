import {
  Controller,
  Get,
  NotFoundException,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CurrencyService } from '../../services/currency.service';
import {
  ConvertQuery,
  CurrencyExchange,
} from 'src/models/currencies.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/convert')
  @ApiTags('Currency')
  @ApiResponse({ status: 200, description: 'Returns exchanged data' })
  async currencyExchange(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    data: ConvertQuery,
  ): Promise<ConvertQuery> {
    const exchange: CurrencyExchange =
      await this.currencyService.exchangeCurrency(data);
    if (!exchange) throw new NotFoundException('Coin not found');
    return exchange;
  }
}
