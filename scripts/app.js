import HttpClient from "./http.js"
import { refreshPage } from "./refresh.js"

const getBalance = document.querySelector('#getBalance')
const checkBalanceButton = document.querySelector('#balanceButton')
const showMyBalance = document.querySelector('#walletBalance')
const sendAmount = document.querySelector('#amount')
const toAdress = document.querySelector('#toWallet')
const sendTrxButton = document.querySelector('#sendTrxButton')
const showEveryTransaction = document.querySelector('#showAllTransactions')
const showEverythingButton = document.querySelector('#showEverythingButton')
const resetPage = document.querySelector('.header')


const apiKey = 'UEVD894TAHT8V6H8P2AVX26ITZ6R1D6XRM'
const httpClient = new HttpClient(apiKey)

let account

function initApp() {
    const forms = document.querySelectorAll('form');
    forms.forEach(forms => {
        forms.addEventListener('submit', function (e) {
            e.preventDefault();
        })
    })
}
export const fetchBalance = async () => {
    if (typeof ethereum !== undefined) {
        account = await ethereum.request({
            method: 'eth_requestAccounts'
        })
        const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [getBalance.value, 'latest']
        })
        return Math.floor(parseInt(balance) / Math.pow(10, 15)) / 1000
    } else {
        throw new Error("Eth not available")
    }
}

export const updateDOMBalance = (balance) => {
    if (balance !== null) {
        showMyBalance.innerText = balance + ' Eth';
    }
};

export const loadBalance = async () => {
    try {
        const balance = await fetchBalance();
        updateDOMBalance(balance);
    } catch (error) {
        console.error('Cant fecth balance:', error.message)
    }
};

export const sendTrx = async () => {
    const toWallet = toAdress.value;
    const fromWallet = getBalance.value;
    const amount = parseFloat(sendAmount.value) * Math.pow(10, 18)
    try {
        const gasPrice = await ethereum.request({
            method: 'eth_gasPrice',
        })
        const sendTransaction = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: fromWallet,
                to: toWallet,
                value: Number(amount).toString(16),
                gasPrice: gasPrice
            }]
        });
        refreshPage()
    } catch (error) {
        console.error('Something went wrong with the transaction:', error);
    }
};


const showAllTransactions = async () => {
    const address = showEveryTransaction.value

    try {
        const transactions = await httpClient.getTransactions(address)
        const container = document.querySelector('#containerTransactions')
        const section = document.createElement('section')

        container.innerHTML = '';
        transactions.forEach(transaction => {
            const span = document.createElement('span')
            const ethLogo = document.createElement('i')
            ethLogo.classList.add('fab', 'fa-ethereum');
            section.classList.add('transactions')
            const parsedValue = Math.floor(parseInt(transaction.value) / Math.pow(10, 15)) / 1000
            span.textContent = `Tx Hash: ${transaction.hash}, Block Number: ${transaction.blockNumber}, Transaction value: ${parsedValue} Eth`
            span.appendChild(ethLogo)
            section.appendChild(span)
            container.appendChild(section)
        })
    } catch (error) {
        console.error('Error:', error)
    }
}

resetPage.addEventListener('click', refreshPage)
showEverythingButton.addEventListener('click', showAllTransactions)
checkBalanceButton.addEventListener('click', loadBalance)
sendTrxButton.addEventListener('click', sendTrx)
document.addEventListener('DOMContentLoaded', initApp)
