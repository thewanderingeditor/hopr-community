import {
  Box,
  Heading,
  Text,
  Tag,
  Link,
  useColorMode,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useBlockNumber, useEthers } from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import { DarkModeSwitch } from '../components/DarkModeSwitch'

import Layout from '../components/layout/Layout'
import { NFTQuery } from '../components/NFTQuery'
import { StakeXHoprTokens } from '../components/StakeXHoprTokens'
import {
  emptyContractAddresses,
  emptyFromBlockNumbers,
  getBlockNumberFromDeploymentTransactionHashReceipt,
  getContractAddresses,
  IContractAddress,
  IContractFromBlockNumbers,
} from '../lib/addresses'
import { XHoprBalance } from '../components/XHoprBalance'
import { bgColor, color } from '../lib/helpers'

function HomeIndex(): JSX.Element {
  const { chainId } = useEthers()
  const { colorMode } = useColorMode()
  const block = useBlockNumber()

  const [contractAddresses, setContractAddresses] = useState<IContractAddress>(
    emptyContractAddresses
  )
  const [fromBlockNumbers, setFromBlockNumbers] =
    useState<IContractFromBlockNumbers>(emptyFromBlockNumbers)

  useEffect(() => {
    const loadContracts = async () => {
      const contractAddresses = await getContractAddresses(chainId)
      const fromBlockNumbers =
        await getBlockNumberFromDeploymentTransactionHashReceipt(chainId)
      setContractAddresses(contractAddresses)
      setFromBlockNumbers(fromBlockNumbers)
    }
    loadContracts()
  }, [chainId, block])

  const PROGRAM_END = 1642424400 * 1000 // From smart contract
  const timeDiff = PROGRAM_END - new Date().getTime()
  const daysUntilProgramEnd = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  return (
    <Layout>
      <Box d="flex" mb="8" justifyContent="space-between" alignItems="center">
        <Heading as="h1">HOPR Staking</Heading>
        <Box d="flex" alignItems="center">
          <Text mr="10px" fontWeight="600">Available Rewards{'  '}</Text>
          <Tag mr="20px" colorScheme="green" fontFamily="mono">
            
            <XHoprBalance
              xHOPRContractAddress={contractAddresses.wxHOPR}
              givenAccount={contractAddresses.HoprStake}
            />{' '}
            wxHOPR
          </Tag>
          <Text mr="10px" fontWeight="600">Total Staked{'  '}</Text>
          <Tag ml="10px" colorScheme="blue" fontFamily="mono">
            <XHoprBalance
              xHOPRContractAddress={contractAddresses.xHOPR}
              givenAccount={contractAddresses.HoprStake}
            /> xHOPR
          </Tag>
        </Box>
      </Box>

      <Text mt="8" fontSize="xl">
        Stake{' '}
        <Link
          px="1"
          href={`https://blockscout.com/xdai/mainnet/address/${contractAddresses.xHOPR}/transactions`}
          isExternal
        >
          xHOPR <ExternalLinkIcon />
        </Link>{' '}
        tokens to earn a base APR of <Text d="inline" fontWeight="700" color="blue.600">18.25%</Text><b> (18.25% + <Text d="inline" fontWeight="700" color="green.600">0.00%</Text>)</b>. Starting{' '}
        <b>July 27th 2021</b>, rewards can be claimed on each block. All rewards
        will be returned as{' '}
        <Link
          px="1"
          href={`https://blockscout.com/xdai/mainnet/address/${contractAddresses.wxHOPR}/transactions`}
          isExternal
        >
          wxHOPR <ExternalLinkIcon />
        </Link>{' '}
        tokens. xHOPR staked today will be locked for{' '}
        <b>{daysUntilProgramEnd} days</b>.
      </Text>
      <Text mt="2" fontSize="xl">
        Increase your APR by redeeming NFTs to your account. HOPR NFTs can be
        earned by participating in HOPR testnets and activities.
      </Text>
      <Text mt="2" fontSize="xl">
        You can swap xHOPR tokens via
        <Link
          px="1"
          href={`https://app.honeyswap.org/#/swap?inputCurrency=0xd057604a14982fe8d88c5fc25aac3267ea142a08&chainId=100`}
          isExternal
        >
          HoneySwap <ExternalLinkIcon />
        </Link>{' '}
        or
        <Link
          px="1"
          href={`https://ascendex.com/en/cashtrade-spottrading/usdt/hopr`}
          isExternal
        >
          AscendEX <ExternalLinkIcon />
        </Link>
        , and buy xDAI (needed for transactions) via{' '}
        <Link px="1" href={`https://buy.ramp.network/`} isExternal>
          Ramp <ExternalLinkIcon />
        </Link>{' '}
        or
        <Link
          px="1"
          href={`https://ascendex.com/en/cashtrade-spottrading/usdt/xdai`}
          isExternal
        >
          AscendEX <ExternalLinkIcon />
        </Link>
        . Unwrap wxHOPR rewards to xHOPR for restaking via{' '}
        <Link px="1" href={`https://wrapper.hoprnet.org/`} isExternal>
          our token wrapper <ExternalLinkIcon />
        </Link>
        . Follow our{' '}
        <Link href="https://twitter.com/hoprnet">
          Twitter <ExternalLinkIcon />
        </Link>{' '}
        to learn about new events.
      </Text>
      <Text mt="2" fontSize="xl"></Text>
      <Box
        maxWidth="container.l"
        p="8"
        mt="8"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <StakeXHoprTokens
          XHOPRContractAddress={contractAddresses.xHOPR}
          HoprStakeContractAddress={contractAddresses.HoprStake}
        />
      </Box>
      <NFTQuery
        HoprBoostContractAddress={contractAddresses.HoprBoost}
        HoprStakeContractAddress={contractAddresses.HoprStake}
        fromBlock={fromBlockNumbers.HoprBoost}
      />
      <DarkModeSwitch />
    </Layout>
  )
}

export default HomeIndex
