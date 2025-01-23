<template>
  <div class="min-h-screen bg-mars-dark bg-mars-gradient flex items-center justify-center p-4">
    <div class="w-full max-w-[420px] bg-mars-surface rounded-2xl border border-mars-red/20 shadow-lg shadow-mars-red/10 p-6 space-y-6">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-center text-mars-red">Martiancoin Private Sale Round</h1>
      <div class="text-sm text-center text-mars-accent mb-2">In Preparation</div>
      <div class="text-sm text-gray-400 text-center bg-mars-dark/30 rounded-lg py-2 border border-mars-red/20">
          <div class="text-white">Private Sale Ends: February 5, 2025</div>
        </div>
      <!-- Info Grid -->
      <div class="grid grid-cols-1 gap-2">
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-400 text-center bg-mars-dark/30 rounded-lg py-2 border border-mars-red/20">
            <div class="font-medium text-white mb-1">Round Supply</div>
            <div>{{ totalBalance }} MARC <br>(1% of Total)</div>
          </div>
          <div class="text-sm text-gray-400 text-center bg-mars-dark/30 rounded-lg py-2 border border-mars-red/20">
            <div class="font-medium text-white mb-1">Remaining</div>
            <div>{{ remainingBalance }} MARC <br>({{ remainingPresent }} of This Round)</div>
          </div>
        </div>
        
        <div class="text-sm text-gray-400 text-center bg-mars-dark/30 rounded-lg py-2 border border-mars-red/20">
          <div class="text-white">1 MARC = 0.02 USDT</div>
          <div class="flex items-center justify-center gap-2">
            <div class="text-white">1 ETH = {{ ethPrice }} USDT</div>
            <button @click="refreshEthPrice" class="text-mars-red hover:text-mars-accent">
              <svg class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
      
        </div>
      </div>
      
      <!-- From Section (ETH) -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <div class="text-sm font-medium text-gray-400">From (ETH)</div>
          <div v-if="account" class="text-sm text-gray-400">
            Balance: {{ formatBalance(ethBalance) }} ETH
          </div>
        </div>
        <div class="bg-mars-dark/50 rounded-xl p-4 border border-mars-red/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img 
                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
                alt="ETH"
                class="w-8 h-8"
              />
              <span class="font-medium text-white">ETH</span>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="number" 
                v-model="ethAmount"
                @input="handleEthInput"
                placeholder="0.0"
                class="w-32 text-right bg-transparent font-medium text-white placeholder-gray-500 focus:outline-none"
                step="0.001"
                min="0"
              />
              <button 
                v-if="account && ethBalance !== '0'"
                @click="setMaxAmount"
                class="text-mars-red text-sm hover:text-mars-accent"
              >
                MAX
              </button>
            </div>
          </div>
          <div v-if="ethUsdValue" class="text-right text-sm text-gray-400 mt-1">
            ≈ ${{ ethUsdValue }}
          </div>
        </div>
      </div>

      <!-- Arrow -->
      <div class="flex justify-center">
        <div class="w-10 h-10 bg-mars-surface rounded-full flex items-center justify-center border border-mars-red/20">
          <svg class="w-6 h-6 text-mars-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <!-- To Section (MARC) -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <div class="text-sm font-medium text-gray-400">To (MARC)</div>
          <div v-if="account" class="text-sm text-gray-400">
            Balance: {{ marcBalance }} MARC
          </div>
        </div>
        <div class="bg-mars-dark/50 rounded-xl p-4 border border-mars-red/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-mars-red rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <span class="font-medium text-white">MARC</span>
              <div class="text-xs text-gray-400 ml-2">
                {{ getCountdown() }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="number" 
                v-model="marcAmount"
                @input="handleMarcInput"
                placeholder="0.0"
                class="w-32 text-right bg-transparent font-medium text-white placeholder-gray-500 focus:outline-none"
                step="1"
                min="0"
              />
            </div>
          </div>
          <div class="text-right text-sm text-gray-400 mt-1">
            ≈ ${{ formatNumber(marcUsdValue) }}
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="space-y-3 pt-2">
        <div class="text-sm text-center text-mars-accent mb-2">Coming Soon - Stay Tuned for Purchase Opportunity</div>
        <button
          class="w-full bg-gray-500 text-white py-4 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
          disabled
        >
          <svg v-if="!account" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ account ? `Connected: ${formatAddress(account)}` : 'Connect Wallet' }}
        </button>
        
        <button
          @click="handlePurchase"
          class="w-full bg-mars-red text-white py-4 rounded-xl font-medium hover:bg-mars-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="!canPurchase"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Purchase MARC
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import {MarcABI} from './Contract/MarcAbi'
import {MarcAddress} from './Contract/Address'
import {
  createAppKit,useAppKit,useAppKitAccount
} from '@reown/appkit/vue'
import {wagmiAdapter , networks, projectId } from './Config/Index'
import { readContract,getBalance,writeContract } from '@wagmi/core'
import {ContractConfig} from './Contract/Config'
const MARC_USDT_RATE = 0.02 // USDT per MARC
const account = ref('')
const ethAmount = ref('0.1')  // 预填 0.1 ETH
const ethBalance = ref('0.00')
const ethPrice = ref('2000.00') // Default price before API call
const marcAmount = ref('10000.00') // Pre-filled based on default ETH amount and price
const isEthInput = ref(true) // Track which input was last modified
const isRefreshing = ref(false)
const marcBalance = ref('0.00')
const remainingBalance=ref("0.00".toLocaleString('en-US'))
const totalBalance=ref("2250000.00".toLocaleString('en-US'))
const remainingPresent=ref("0%")
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'Mars DAO',
    description: 'Mars DAO',
    url: '',
    icons: ['']
  },
  features:{
    email:false,
    emailShowWallets:false,
    socials:false
  }
})
const appKit = useAppKit();
const accountData=useAppKitAccount()
// Function to get MARC balance
const updateMarcBalance = async () => {
  if (!account.value) return
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const marcToken = new ethers.Contract(MarcAddress, MarcABI, provider)
    const balance = await marcToken.balanceOf(account.value)
    marcBalance.value = ethers.utils.formatUnits(balance, 18)
  } catch (error) {
    console.error('Error fetching MARC balance:', error)
  }
}

// Function to refresh ETH price
const refreshEthPrice = async () => {
  isRefreshing.value = true
  await fetchEthPrice()
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

// Fetch ETH price from CoinGecko API
const fetchEthPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    ethPrice.value = data.ethereum.usd.toFixed(2)
    // Update MARC amount after getting ETH price
    if (isEthInput.value) {
      updateMarcAmount()
    }
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    ethPrice.value = '2000.00' // Fallback price if API fails
    updateMarcAmount()
  }
}

// Calculate initial MARC amount
const calculateInitialMarc = () => {
  const ethInUsdt = 0.1 * Number(ethPrice.value) // 0.1 is the default ETH amount
  return (ethInUsdt / MARC_USDT_RATE).toFixed(6)
}

// Update MARC amount based on ETH input
const updateMarcAmount = () => {
  if (isEthInput.value) {
    const ethInUsdt = Number(ethAmount.value) * Number(ethPrice.value)
    marcAmount.value = (ethInUsdt / MARC_USDT_RATE).toFixed(6)
  }
}

// Update ETH amount based on MARC input
const updateEthAmount = () => {
  if (!isEthInput.value) {
    const usdAmount = Number(marcAmount.value) * MARC_USDT_RATE
    ethAmount.value = (usdAmount / Number(ethPrice.value)).toFixed(6)
  }
}

// Computed values
const ethUsdValue = computed(() => {
  if (!ethAmount.value || isNaN(ethAmount.value) || !ethPrice.value) return null
  return formatNumber(Number(ethAmount.value) * Number(ethPrice.value))
})

const marcUsdValue = computed(() => {
  return Number(marcAmount.value) * MARC_USDT_RATE
})

const canPurchase = computed(() => {
  return account.value && 
         Number(ethAmount.value) > 0 && 
         Number(ethAmount.value) <= Number(ethBalance.value)
})

const getCountdown = () => {
  const endDate = new Date('2025-02-05T00:00:00Z');
  const now = new Date();
  const diff = endDate - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}d ${hours}h left`;
}
// Watch for ETH amount changes
watch(ethAmount, (newValue) => {
  if (!isNaN(newValue) && newValue !== '' && isEthInput.value) {
    updateMarcAmount()
  }
})
watch(accountData,(newValue)=>{
  if(newValue&&newValue.isConnected){
    account.value=newValue.address
    getTotalBalance();
  }
})
// Watch for MARC amount changes
watch(marcAmount, (newValue) => {
  if (!isNaN(newValue) && newValue !== '' && !isEthInput.value) {
    updateEthAmount()
  }
})

// Utility functions
const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(num)
}

const formatBalance = (balance) => {
  return Number(balance).toFixed(4)
}

const handleEthInput = (event) => {
  isEthInput.value = true
  const value = event.target.value
  if (value === '' || isNaN(value)) {
    ethAmount.value = '0'
    return
  }
  // Limit to 18 decimals (ETH precision)
  const parts = value.split('.')
  if (parts[1] && parts[1].length > 18) {
    ethAmount.value = `${parts[0]}.${parts[1].slice(0, 18)}`
  }
}

const handleMarcInput = (event) => {
  isEthInput.value = false
  const value = event.target.value
  if (value === '' || isNaN(value)) {
    marcAmount.value = '0'
    return
  }
}

const setMaxAmount = () => {
  isEthInput.value = true
  // Leave some ETH for gas
  const maxAmount = Number(ethBalance.value) - 0.01
  ethAmount.value = maxAmount > 0 ? maxAmount.toString() : '0'
}
const getTotalBalance=async ()=>{
  const balance = await getBalance(ContractConfig, {
  address: account.value,
})
ethBalance.value = ethers.utils.formatEther(balance.value)
await updateMarcBalance()
}
// Connect wallet function
const connectWallet = async () => {
  console.log(accountData)
  if(!accountData||!accountData.value.isConnected){
    appKit.open()
  } else{
    account.value=accountData.value.address
    await getTotalBalance();
 
  }
  
  // if (window.ethereum) {
  //   try {
  //     const accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts'
  //     })
  //     account.value = accounts[0]
      
  //     // Get ETH balance
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const balance = await provider.getBalance(account.value)
  //     ethBalance.value = ethers.utils.formatEther(balance)      
  //     // Listen for account changes
  //     window.ethereum.on('accountsChanged', async (accounts) => {
  //       if (accounts.length === 0) {
  //         account.value = ''
  //         ethBalance.value = '0.00'
  //         marcBalance.value = '0.00'
  //       } else {
  //         account.value = accounts[0]
  //         await provider.getBalance(accounts[0]).then(balance => {
  //           ethBalance.value = ethers.utils.formatEther(balance)
  //         })
  //         await updateMarcBalance()
  //       }
  //     })
      
  //     // Get initial MARC balance
  //     await updateMarcBalance()
  //   } catch (error) {
  //     console.error('Error connecting wallet:', error)
  //     alert('Failed to connect wallet')
  //   }
  // } else {
  //   alert('Please install MetaMask!')
  // }
}

// Handle purchase function
const handlePurchase = async () => {
  if (!account.value) {
    alert('Please connect your wallet first')
    return
  }
  
  if (!ethAmount.value || Number(ethAmount.value) <= 0) {
    alert('Please enter a valid ETH amount')
    return
  }

  if (Number(ethAmount.value) > Number(ethBalance.value)) {
    alert('Insufficient ETH balance')
    return
  }

  try {
    const ethValue=ethAmount.value.toString();
    const tokenAmountOutMin = ethers.utils.parseUnits(marcAmount.value, 18);
    const buyResult = await writeContract(ContractConfig, {
      abi:MarcABI,
      address: MarcAddress,
      functionName: 'buyAndLock',
      args:[tokenAmountOutMin],
      value:ethers.utils.parseUnits(ethValue,18)
    })
    console.log(buyResult)
    alert(`Successfully purchased ${formatNumber(marcAmount.value)} MARC tokens for ${ethAmount.value} ETH`)
  } catch (error) {
    console.error('Purchase error:', error)
    alert('Failed to complete purchase')
  }
}
const getContractBalance=async ()=>{
  const contractBalance = await getBalance(ContractConfig, {
    address:MarcAddress,
    token: MarcAddress,
  })
  const contractBalanceValue=ethers.utils.formatUnits(contractBalance.value, 18)
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  // const marcToken=new ethers.Contract(MarcAddress,MarcABI,provider);
  // const signer = provider.getSigner();
  // const contractWithSigner = marcToken.connect(signer);
  // const contractBalance = await marcToken.balanceOf(contractWithSigner.address);
  const totalSupply = await readContract(ContractConfig, {
      abi:MarcABI,
      address: MarcAddress,
      functionName: 'totalSupply',
    })
  const totalSupplyValue=ethers.utils.formatUnits(totalSupply, 18);
  remainingPresent.value=toFixedNoRound(contractBalanceValue/totalSupplyValue*100,2)+"%";
  remainingBalance.value=contractBalanceValue.toLocaleString("en-US");
}
const toFixedNoRound=(num, digits)=>{
  const factor = 10n ** BigInt(digits);
  const bigNum = BigInt(Math.floor(num * Number(factor)));
  return Number(bigNum) / Number(factor);
}
// Initialize component
onMounted(() => {
  // Set initial MARC amount based on default ETH amount and price
  marcAmount.value = calculateInitialMarc()
  getContractBalance()
  // Fetch real ETH price
  fetchEthPrice()
  // Update price every 30 seconds
  setInterval(fetchEthPrice, 30000)
  
})
</script>

<style>
body {
  background-color: #1A0F0F;
}
</style>