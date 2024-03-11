class HttpClient {
    constructor(api) {
        this.apiKey = this.apiKey;
        this.apiUrl = 'https://api-sepolia.etherscan.io/api'
    }

    async getTransactions(address) {
        const apiUrl = `${this.apiUrl}?module=account&action=txlist&address=${address}&apikey=${this.apiKey}`;

        try {
            const response = await fetch(apiUrl)
            const data = await response.json();

            if (data.status === '1') {
                return data.result
            } else {
                console.error('Error fetching transactions:', data.message)
                return [];
            }
        } catch (error) {
            console.error('Error fetching transactions:', error)
            return []
        }

    }
}   
export default HttpClient