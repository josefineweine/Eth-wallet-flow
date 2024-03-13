import HttpClient from "./http.js";
import { refreshPage } from "./refresh.js";

const getBalanceInput = document.querySelector('#getBalance');
const checkBalanceButton = document.querySelector('#balanceButton');
const showMyBalance = document.querySelector('#walletBalance');
const sendAmountInput = document.querySelector('#amount');
const toAddressInput = document.querySelector('#toWallet');
const sendTrxButton = document.querySelector('#sendTrxButton');
const showEveryTransactionInput = document.querySelector('#showAllTransactions');
const showEverythingButton = document.querySelector('#showEverythingButton');
const resetPageButton = document.querySelector('.header');

const apiKey = 'UEVD894TAHT8V6H8P2AVX26ITZ6R1D6XRM';
const httpClient = new HttpClient(apiKey);

let account;

function initApp() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    });
}

const fetchBalance = async () => {
    if (typeof ethereum !== undefined) {
        account = await ethereum.request({
            method: 'eth_requestAccounts'
        });
        const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [getBalanceInput.value, 'latest']
        });
        return Math.floor(parseInt(balance) / Math.pow(10, 15)) / 1000;
    } else {
        throw new Error("Ethereum not available");
    }
};

const updateDOMBalance = (balance) => {
    if (balance !== null) {
        showMyBalance.innerText = balance + ' Eth';
    }
};

const loadBalance = async () => {
    try {
        const balance = await fetchBalance();
        updateDOMBalance(balance);
    } catch (error) {
        console.error('Unable to fetch balance:', error.message);
    }
};

const sendTransaction = async () => {
    const toWallet = toAddressInput.value;
    const fromWallet = getBalanceInput.value;
    const amount = parseFloat(sendAmountInput.value) * Math.pow(10, 18);
    try {
        const gasPrice = await ethereum.request({
            method: 'eth_gasPrice'
        });
        const sendTransaction = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: fromWallet,
                to: toWallet,
                value: Number(amount).toString(16),
                gasPrice: gasPrice
            }]
        });
        refreshPage();
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};

const showAllTransactions = async () => {
    const address = showEveryTransactionInput.value;
    try {
        const transactions = await httpClient.getTransactions(address);
        const container = document.querySelector('#containerTransactions');
        container.innerHTML = '';
        transactions.forEach(transaction => {
            const ethLogo = document.createElement('i');
            ethLogo.classList.add('fab', 'fa-ethereum');
            const parsedValue = Math.floor(parseInt(transaction.value) / Math.pow(10, 15)) / 1000;
            const transactionInfo = `Tx Hash: ${transaction.hash}, Block Number: ${transaction.blockNumber}, Transaction value: ${parsedValue} Eth`;
            const span = document.createElement('span');
            span.textContent = transactionInfo;
            span.appendChild(ethLogo);
            const section = document.createElement('section');
            section.classList.add('transactions');
            section.appendChild(span);
            container.appendChild(section);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

resetPageButton.addEventListener('click', refreshPage);
showEverythingButton.addEventListener('click', showAllTransactions);
checkBalanceButton.addEventListener('click', loadBalance);
sendTrxButton.addEventListener('click', sendTransaction);
document.addEventListener('DOMContentLoaded', initApp);
