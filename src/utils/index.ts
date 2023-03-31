import { Currency, CurrencyExchange } from "src/models/currencies.interface";
import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_AMOUNT } from '../constants';
import { get } from 'needle';

import * as dotenv from 'dotenv';

dotenv.config();

const CURRENCIES_API = process.env.CURRENCIES_API;

const cryptoConverter = (prices: Array<Currency>, data: CurrencyExchange): CurrencyExchange => {
    const { from, to, amount } = data;

    if (amount < 0) return null

    // Find source and target currency objects
    const currentCurrency: Currency = prices.find(price => price.key === from)
    const targetCurrency: Currency = prices.find(price => price.key === (to || DEFAULT_CURRENCY))
    
    if (!currentCurrency || !targetCurrency) return null
    
    // Calculate current total USD amount and calculate target price amount
    const currentPrice: number = currentCurrency.price * ( amount || DEFAULT_CURRENCY_AMOUNT );
    const result: number = parseFloat((currentPrice / targetCurrency.price).toFixed(10));
    
    return {
        from,
        to: to || DEFAULT_CURRENCY,
        amount: amount || DEFAULT_CURRENCY_AMOUNT,
        result
    }
}

const getPrices = async (): Promise<Array<Currency>> => {
    // Send request to currencies API
    return new Promise((resolve, reject) => {
        get(CURRENCIES_API, (error, response) => {
            if (error) reject(null)
            resolve(response.body.data)
        })
    })
}

export { cryptoConverter, getPrices }