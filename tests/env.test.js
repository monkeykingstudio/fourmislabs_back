require('dotenv').config()


describe('testing environment variables', () => {

    it('RAW_MONGO_URI is present ?', () => {
        expect(process.env.RAW_MONGO_URI).toBeTruthy()
    })

    it('MONGO_DB_PASSWORD is present ?', () => {
        expect(process.env.MONGO_DB_PASSWORD).toBeTruthy()
    })

    it('JWT_KEY is present ?', () => {
        expect(process.env.JWT_KEY).toBeTruthy()
    })

    it('MONGO_DB_NAME is present ?', () => {
        expect(process.env.MONGO_DB_NAME).toBeTruthy()
    })

    it('RAW_MONGO_URI is matching pattern',async () => {

        let isMatchingPattern = true;

        const patternListArray = ['mongodb+srv://', ':', '.mongodb.net/myFirstDatabase?retryWrites=true&w=majority']
        
        await patternListArray.forEach((item) => {
            if (!process.env.RAW_MONGO_URI.includes(item)) {
                isMatchingPattern = false
            }
        })

        expect(isMatchingPattern).toBeTruthy()
    })
})
