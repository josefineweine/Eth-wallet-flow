class HttpClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api-sepolia.etherscan.io/api';
    }

    async getTransactions(address) {
        try {
            if (!address) {
                throw new Error('No address provided');
            }

            const apiUrl = `${this.apiUrl}?module=account&action=txlist&address=${address}&apikey=${this.apiKey}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === '1') {
                return data.result;
            } else {
                throw new Error(`Error fetching transactions: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error.message);
            return [];
        }
    }
}

export default HttpClient;
