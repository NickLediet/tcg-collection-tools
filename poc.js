const { readFile }= require('fs').promises

/**
 * ===========================
 * API CODE
 * ===========================
 */
const API_ROOT = 'https://api.scryfall.com'
const ENDPOINTS = {
    getByTcgPlayerId: {
        url: getUrl('cards/tcgplayer')
    }
}

function getUrl(path) {
    return `${API_ROOT}/${path}`
}

class ApiCache {
    queries = {}

    constructor() {}

    get(key) {
        return this.queries[key]
    }

    set(key, value) {
        this.queries[key] = value
    }

    hasKey(key) {
        return !!this.queries[key]
    }
}

class ApiClient {
    constructor(apiCache) {
        this.endpoints = ENDPOINTS
        this.cache = apiCache
    }

    async getByTcgPlayerId(tcgPlayerId) {
        const url = this.endpoints.getByTcgPlayerId.url
        const requestUrl =`${url}/${tcgPlayerId}` 

        if(this.cache.hasKey(requestUrl)) return this.cache[requestUrl]
        const cardData = await (await fetch(requestUrl)).json()

        this.cache[requestUrl] = cardData
        return cardData
    }
}
const apiClinet = new ApiClient(new ApiCache())

async function getScryfallDataByTcgPlayerId(tcgPlayerId) {
    return apiClinet.getByTcgPlayerId(tcgPlayerId)
}

/**
 * ===========================
 * UTILS
 * ===========================
 */

async function importFile(filePath) {
   return await readFile(filePath, 'UTF-8')
}

function toCamelCase(string) {
    return string.split(' ').reduce((result, currentWord, index) => {
        const [first, ...rest] = currentWord.split('')
        const end = rest.join('').toLowerCase()
        if(index === 0) return first.toLowerCase() + end
        // make the first letter uppser case
        return result + first.toUpperCase() + end
    }, '')
}

function parseTcgPlayerCsv(rawCsvSourceString) {
    const separatorRegex = /(?<=\S),(?=\S)/gm
    const rows = rawCsvSourceString.split('\n')
    const [header, ...dataRows] = rows
    const properties = header.split(separatorRegex).map(toCamelCase)
    
    return dataRows.map(row => {
        const cols = row.split(separatorRegex)
        return cols.reduce((result, current, index) => {
            result[properties[index]] = current
            return result
        }, {})
    })
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncSleep(fn, time) {
    await timeout(time);
    return fn();
}

/**
 * ==========================
 * IMPORT PARSER
 * ==========================
 */
const API_REQUEST_DELAY_MS = 500

class ImportManager {
    importData = []
    csvData = []

    constructor() {}

    async loadFile(filePath) {
        if(!filePath) throw Error('Unable able to load the input file.  Please provide a valid file path')
        this.fileData = await importFile(filePath)
        this.csvData = parseTcgPlayerCsv(this.fileData)
            .filter(({ productId }) => productId)
    }

    async getImportData() {
        // Every 200ms send a request to the scrfally api
        const cards = []
        console.log(this.csvData)
        const testData = this.csvData
            .map(({ productId, set, simpleName }) => ({ productId, set, simpleName })) 
            .filter(({ productId }) => !/\d+/.test(productId))
            .filter(({ simpleName }) => /,/gm.test(simpleName))
            // .map(({ productId }) => ({ productId }))
            // .filter(({ productId }) => !productId)
        console.log(testData)
        for (const importData of this.csvData) {
            const { productId } = importData
            const data = await asyncSleep(
                () => getScryfallDataByTcgPlayerId(productId), API_REQUEST_DELAY_MS
            )
            cards.push({
                scryfallData: data,
                ...importData 
            })
        }
        this.importData = cards
        return this.importData
    }
}

/**
 * ==========================
 * MAIN LOGIC/APP
 * ==========================
 */

;(async () => {
    try {
        const filePath = process.argv[2]
        const importManager = new ImportManager()
        await importManager.loadFile(filePath)
        const cardImportData = await importManager.getImportData()
        console.log(cardImportData)
        // @todo: make this more dynamic/support a param
        // new 



            // const responseData = csvData.map(async ({ productId }) => {
            //     const response = await asyncSleep(
            //         () => getScryfallDataByTcgPlayerId(productId), API_REQUEST_DELAY_MS
            //     )
            //     return await response.json()
            // })

            // console.log(responseData)
            // In the ApiClient setup caching for requests already done
        // old
        // const getScryfallDataByTcgPlayerIdDebounced = debounce(getScryfallDataByTcgPlayerId, 1000)
        // const promises = csvData.map((data) => {
        //     return getScryfallDataByTcgPlayerIdDebounced(data.productId)
        // })

        // const results = await Promise.all(promises)
        // const scryfallData = results.map(async res => await res.json())
        // console.log(scryfallData)
    } catch(err) {
        console.error(err)
        process.exit(0)
    }
})()

