import { Currency, CurrencyExchange } from "src/models/currencies.interface";
import { cryptoConverter, getPrices } from "../src/utils";

let prices: Array<Currency> = [];

const findCurrency = (currencies: Array<Currency>, currency: string) => currencies.find((crc) => crc.key === currency);

const FROM = "ethereum"
const TO = "vvs-finance"
const AMOUNT = 2

describe('Currency exchange test', () => {
  beforeAll(async () => {
    prices = await getPrices();
  });

  it('Process normal data', () => {
    const conversion: CurrencyExchange = cryptoConverter(prices, { from: FROM, to: TO, amount: AMOUNT })
    
    const targetCurrency: Currency = findCurrency(prices, TO);
    const sourceCurrency: Currency = findCurrency(prices, FROM);
    const original: number = conversion.result * targetCurrency.price;

    expect(conversion.from).toBe(FROM)
    expect(conversion.to).toBe(TO)
    expect(conversion.result).not.toBe(null);
    expect(conversion.result).not.toBe(Infinity);

    expect(original).toStrictEqual(sourceCurrency.price * AMOUNT)
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