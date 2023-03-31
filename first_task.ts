const coinsAvailability = (coins: any, request: Array<string>) => {
    const SPLITTER: string = '/';

    // Find out how many combined requests we have
    const mixedAmount: number = request.reduce((acc, val) => acc += val.indexOf(SPLITTER) >= 0 ? 1 : 0, 0)

    let counter: number = 0;
    let combination: string = "";
    const combinations: Array<Array<number>> = [];

    // Find variations of combined coins -> binary numbers, f.e [[0,0], [0,1], [1,0] etc... ]
    while (combination.length <= mixedAmount) {
        combination = (counter >>> 0).toString(2).padStart(mixedAmount, '0')
        combination.length <= mixedAmount && combinations.push(combination.split('').map(c => parseInt(c)))
        counter += 1
    }

    const availableCombinations: Array<Array<string>> = []
    combinations.forEach(cmb => {
        let variation_index: number = 0;
        const requestVariation: Array<string> = request.map(coin => {
            // If we have combination of coins then pick by variation
            if (coin.indexOf(SPLITTER) >= 0) {
                coin = coin.split(SPLITTER)[cmb[variation_index]]
                variation_index = variation_index + 1
            }
            return coin
        });

        let combinationAvailable: boolean = true;

        // Count the amount of coins is array and check if such amount acceptable
        Object.keys(coins).forEach(coin_name => {
            var re: RegExp = new RegExp(coin_name, 'g');
            // @ts-ignore
            if (requestVariation.join(' ').match(re)?.length > coins[coin_name] ) {
                combinationAvailable = false
            }
        })
        combinationAvailable && availableCombinations.push(requestVariation)
    })

    return availableCombinations.length > 0 ? availableCombinations[0] : null;
    // Or if we want to return all available combinations
    // return availableCombinations
}

const coins = { ETH: 3, TRON: 2, MATIC: 1 }
const request: Array<string> = ["ETH", "ETH", "TRON/ETH", "MATIC/ETH", "TRON", "MATIC"]

console.log(coinsAvailability(coins, request))