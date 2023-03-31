import { Injectable } from '@nestjs/common';
import { Currency, CurrencyExchange } from 'src/models/currencies.interface';

import { cryptoConverter, getPrices } from 'src/utils';

@Injectable()
export class CurrencyService {
  async exchangeCurrency(data: CurrencyExchange): Promise<CurrencyExchange> {
    const prices: Array<Currency> = await getPrices();
    const exchange: CurrencyExchange = cryptoConverter(prices, data);
    return exchange;
  }
}
