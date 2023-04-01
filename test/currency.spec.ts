import { Currency, CurrencyExchange } from "src/models/currencies.interface";
import { cryptoConverter, getPrices } from "../src/utils";
import { DEFAULT_CURRENCY } from "../src/constants";

let prices: Array<Currency> = [];

const findCurrency = (currencies: Array<Currency>, currency: string): Currency => currencies.find((crc) => crc.key === currency);

const FROM = "ethereum"
const TO = "vvs-finance"
const AMOUNT = 2

describe('Currency exchange test', () => {
  beforeAll(async () => {
    prices = await getPrices();
  });

  it('Process top 100', () => {
    prices.slice(0, 100).forEach((coin: Currency) => {
      const conversion: CurrencyExchange = cryptoConverter(prices, { from: coin.key, amount: AMOUNT })
      
      const targetCurrency: Currency = findCurrency(prices, DEFAULT_CURRENCY);
      const sourceCurrency: Currency = findCurrency(prices, coin.key);
      const original: number = conversion.result * targetCurrency.price;

      expect(conversion.from).toBe(coin.key)
      expect(conversion.to).toBe(DEFAULT_CURRENCY)
      expect(conversion.result).not.toBe(null);
      expect(conversion.result).not.toBe(Infinity);

      expect(original).toBeCloseTo(sourceCurrency.price * AMOUNT);   
    })
  })

  it('Float amounts', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: FROM, to: TO, amount: 0.1234567 })
    
    expect(conversion.from).toBe(FROM)
    expect(conversion.to).toBe(TO)
    expect(conversion.result).not.toBe(null);
    expect(conversion.result).not.toBe(Infinity);
  });

  it('Self conversion', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: FROM, to: FROM, amount: 1 })
    expect(conversion.result).toBe(1);
  });

  it('Not found from', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: "no_coin", to: TO, amount: 1 })
    expect(conversion).toBe(null)
  })

  it('Not found to', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: FROM, to: "no_coin", amount: 1 });
    expect(conversion).toBe(null)
  });

  it('Incorrect amount', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: FROM, to: TO, amount: -1 })
    expect(conversion).toBe(null)
  })
})