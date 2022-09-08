import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import { getNamehash, emptyAddress } from 'ui'
import { formatsByCoinType } from '@siddomains/address-encoder'

import union from 'lodash/union'
import { Address } from 'components/Addresses'
import {
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_ADDRESSES,
  GET_TEXT_RECORDS,
} from 'graphql/queries'

import EmailImg from 'assets/images/profile/email.png'
import WebsiteImg from 'assets/images/profile/website.png'
import AvatarImg from 'assets/images/profile/avatar.png'
import DescriptionImg from 'assets/images/profile/description.png'
import TwitterImg from 'assets/images/profile/twitter.png'
import DiscordImg from 'assets/images/profile/discord.png'
import GithubImg from 'assets/images/profile/github.png'
import TelegramImg from 'assets/images/profile/telegram.png'

import { toggleEditMode } from 'app/slices/accountSlice'

import TEXT_PLACEHOLDER_RECORDS from 'constants/textRecords'

import EVMImg from 'assets/images/profile/evm.png'
import BTCImg from 'assets/images/profile/btc.png'
import LTCImg from 'assets/images/profile/ltc.png'
import { AddNewButton } from 'components/Button'

import COIN_LIST from 'constants/coinList'
import { convertToETHAddressDisplayFormat } from '../../../../utils/utils'

const haveAddresses = true
const haveProfile = true

const COIN_PLACEHOLDER_RECORDS = ['ETH', ...COIN_LIST.slice(0, 3)]

const profileData = [
  {
    id: 1,
    title: 'Email',
    description: 'example@email.com',
    imageUrl: EmailImg,
    bgColorClass: 'bg-[rgba(50,126,164,0.6)]',
  },
  {
    id: 2,
    title: 'Website',
    description: 'example.example',
    imageUrl: WebsiteImg,
    bgColorClass: 'bg-[rgba(49,133,114,0.6)]',
  },
  {
    id: 3,
    title: 'Avatar',
    description: 'example.example',
    imageUrl: AvatarImg,
    bgColorClass: 'bg-[rgba(19,124,120,0.6)]',
  },
  {
    id: 4,
    title: 'Description',
    description: 'pepe is legendary',
    imageUrl: DescriptionImg,
    bgColorClass: 'bg-[rgba(204,252,255,0.2)]',
  },
  {
    id: 5,
    title: 'Twitter',
    description: 'pepefrog',
    imageUrl: TwitterImg,
    bgColorClass: 'bg-[rgba(65,152,208,0.6)]',
  },
  {
    id: 6,
    title: 'Discord',
    description: 'pepefrog#1234',
    imageUrl: DiscordImg,
    bgColorClass: 'bg-[rgba(88,98,192,0.6)]',
  },
  {
    id: 7,
    title: 'Github',
    description: 'example.example',
    imageUrl: GithubImg,
    bgColorClass: 'bg-[rgba(93,111,126,0.6)]',
  },
  {
    id: 8,
    title: 'Telegram',
    description: 'pepefrog',
    imageUrl: TelegramImg,
    bgColorClass: 'bg-[rgba(62,137,173,0.6)]',
  },
]

const addressesData = [
  {
    id: 1,
    title: 'EVM',
    description: '0x0000......000000',
    imageUrl: EVMImg,
    bgColorClass: 'bg-[rgba(89,128,201,0.6)]',
  },
  {
    id: 1,
    title: 'BTC',
    description: '3FZbgi......tktZc5',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(167,129,80,0.6)]',
  },
  {
    id: 1,
    title: 'LTC',
    description: 'MGxNPP......2465zN',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(99,124,165,0.6)]',
  },
]

function isContentHashEmpty(hash) {
  return hash?.startsWith('undefined') || parseInt(hash, 16) === 0
}

const useGetRecords = (domain) => {
  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name + '.bnb'),
    },
  })

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes
      .map((c) => {
        return formatsByCoinType[c] && formatsByCoinType[c].name
      })
      .filter((c) => c)

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: {
        name: domain.name + '.bnb',
        keys: union(coinList, COIN_PLACEHOLDER_RECORDS),
      },
      fetchPolicy: 'network-only',
    }
  )

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name + 'bnb',
        keys: union(resolver && resolver.texts, TEXT_PLACEHOLDER_RECORDS),
      },
      fetchPolicy: 'network-only',
    }
  )
  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading,
  }
}

const processRecords = (records, placeholder) => {
  const nonDuplicatePlaceholderRecords = placeholder.filter(
    (record) => !records.find((r) => record === r.key)
  )

  const recordsSansEmpty = records.map((record) => {
    if (record.value === emptyAddress) {
      return { ...record, value: '' }
    }
    return record
  })

  return [
    ...recordsSansEmpty,
    ...nonDuplicatePlaceholderRecords.map((record) => ({
      key: record,
      value: '',
    })),
  ]
}

const getInitialTextRecords = (dataTextRecords, domain) => {
  const textRecords =
    dataTextRecords && dataTextRecords.getTextRecords
      ? processRecords(dataTextRecords.getTextRecords, TEXT_PLACEHOLDER_RECORDS)
      : processRecords([], TEXT_PLACEHOLDER_RECORDS)

  return textRecords?.map((textRecord) => ({
    contractFn: 'setText',
    ...textRecord,
  }))
}

const getInitialCoins = (dataAddresses) => {
  const addresses =
    dataAddresses && dataAddresses.getAddresses
      ? processRecords(dataAddresses.getAddresses, COIN_PLACEHOLDER_RECORDS)
      : processRecords([], COIN_PLACEHOLDER_RECORDS)

  return addresses?.map((address) => ({
    contractFn: 'setAddr(bytes32,uint256,bytes)',
    ...address,
  }))
}

const getInitialContent = (domain) => {
  return {
    contractFn: 'setContenthash',
    key: 'CONTENT',
    value: isContentHashEmpty(domain.content) ? '' : domain.content,
  }
}

const getInitialRecords = (domain, dataAddresses, dataTextRecords) => {
  const initialTextRecords = getInitialTextRecords(dataTextRecords, domain)
  var initialCoins = getInitialCoins(dataAddresses)

  initialCoins[0].key = 'EVM'
  const initialContent = getInitialContent(domain)

  return [...initialTextRecords, ...initialCoins, initialContent]
}

const useInitRecords = (
  domain,
  dataAddresses,
  dataTextRecords,
  setInitialRecords
) => {
  useEffect(() => {
    setInitialRecords(getInitialRecords(domain, dataAddresses, dataTextRecords))
  }, [domain, dataAddresses, dataTextRecords])
}

export default function Mainboard({ selectedDomain }) {
  const editOn = useSelector((state) => state.account.profileEditMode)

  const { dataAddresses, dataTextRecords, recordsLoading } =
    useGetRecords(selectedDomain)

  const [initialRecords, setInitialRecords] = useState([])

  useInitRecords(
    selectedDomain,
    dataAddresses,
    dataTextRecords,
    setInitialRecords
  )

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] xl:h-[calc(100%-200px)] mt-[14px] py-4 px-[22px]">
      {/* Addresses panel */}
      <div id="address">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist mb-3">
          Addresses
        </p>
        {haveAddresses ? (
          <div className="grid grid-cols-2 1200px:grid-cols-3 gap-x-4 gap-y-3">
            {/* {addressesData.map((data, index) => (
              <Address
                title={data.title}
                description={data.description}
                imageUrl={data.imageUrl}
                bgColorClass={data.bgColorClass}
                canEdit={editOn}
              />
            ))} */}
            {initialRecords
              .filter(
                (item) => item.contractFn === 'setAddr(bytes32,uint256,bytes)'
              )
              .map((item, index) => (
                <Address
                  title={item.key}
                  description={convertToETHAddressDisplayFormat(item.value)}
                  imageUrl={EVMImg}
                  bgColorClass="bg-[rgba(50,126,164,0.6)]"
                  canEdit={editOn}
                />
              ))}
            {editOn && <AddNewButton />}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-[4]">
            <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-base">
              Nothing here:(
            </div>
          </div>
        )}
      </div>
      {/* Profile panel */}
      <div id="profile" className="mt-3">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist mb-3">
          Profile
        </p>
        {haveProfile ? (
          <div className="grid grid-cols-2 1200px:grid-cols-3 gap-x-4 gap-y-3">
            {profileData.map((data, index) => (
              <Address
                title={data.title}
                description={data.description}
                imageUrl={EVMImg}
                bgColorClass={data.bgColorClass}
                canEdit={editOn}
              />
            ))}
            {editOn && <AddNewButton />}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-[4]">
            <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-base">
              Nothing here:(
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
