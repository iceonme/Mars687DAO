import { http, createConfig } from '@wagmi/core'
import { base } from '@wagmi/core/chains'
export const ContractConfig = createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  })