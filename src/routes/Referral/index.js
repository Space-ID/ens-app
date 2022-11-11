import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import { TwitterShareButton } from 'react-share'
import Info from 'components/Icons/Info'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  QUERY_IS_PARTNER,
  QUERY_PARTNER_REFERRAL_LEVEL_DETAILS,
  QUERY_REFERRAL_DETAILS,
  QUERY_REFERRAL_LEVEL_DETAILS,
} from 'graphql/queries'
import './index.css'
import ReferralQrModal from './ReferralQrModal'
import { TwitterIcon } from '../../components/Icons'
import QrIcon from '../../components/Icons/QrIcon'
import Tooltip from '../../components/Tooltip'
import LevelProgress from './LevelProgress'
import InviteProgress from './InviteProgress'
import ReferralAddress from './ReferralAddress'
import { useAccount } from '../../components/QueryAccount'
import icon1 from 'assets/images/referral/referral-icon1.svg'
import icon2 from 'assets/images/referral/referral-icon2.svg'
import icon3 from 'assets/images/referral/referral-icon3.svg'
import icon4 from 'assets/images/referral/referral-icon4.svg'
import iconPartner from 'assets/images/referral/referral-icon-partner.svg'
import { useSelector } from 'react-redux'
import ReferralLink from './ReferralLink'
import ReferralStatDes from './ReferralStatDes'
import Withdraw from './Withdraw'
import LevelBadge from './LevelBadge'
import { ReferralLevelTitle } from './constants'

const PartnerReferralOpt = {
  key: 'level-p',
  title: 'VIP',
  icons: [iconPartner],
  rate: '-',
  limit: 0,
}
const ReferralOpts = [
  {
    key: 'none',
    icons: [],
    rate: '-',
    limit: 0,
  },
  {
    key: 'level1',
    icons: [icon1],
    rate: '-',
    limit: 0,
  },
  {
    key: 'level2',
    icons: [icon2],
    rate: '-',
    limit: 0,
  },
  {
    key: 'level3',
    icons: [icon3, icon3],
    rate: '-',
    limit: 0,
  },
  {
    key: 'level4',
    icons: [icon4, icon4, icon4],
    rate: '-',
    limit: 0,
  },
].map((v, i) => {
  v.title = ReferralLevelTitle[i]
  return v
})

export default function ReferralPage() {
  const [referralOpt, setReferralOpt] = useState(ReferralOpts[0])
  const [referralNum, setReferralNum] = useState(0)
  const [referralLevel, setReferralLevel] = useState(0)
  const [referralLevelLimit, setReferralLevelLimit] = useState([0, 0, 0, 0])
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const [disabled, setDisabled] = useState(true)
  const [inviteUrl, setInviteUrl] = useState('-')
  const [openQrModal, setOpenQrModal] = useState(false)

  const account = useAccount()

  const { data: { isPartner = false } = {} } = useQuery(QUERY_IS_PARTNER, {
    variables: { domain: primaryDomain?.name },
    fetchPolicy: 'no-cache',
  })
  const { data: { getReferralLevelDetails = [] } = {} } = useQuery(
    QUERY_REFERRAL_LEVEL_DETAILS
  )
  const { data: { getPartnerReferralLevelDetails = [] } = {} } = useQuery(
    QUERY_PARTNER_REFERRAL_LEVEL_DETAILS,
    { variables: { domain: primaryDomain?.name } }
  )

  const [fetchReferralDetails, { data: { getReferralDetails = [] } = {} }] =
    useLazyQuery(QUERY_REFERRAL_DETAILS, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    if (isPartner && getPartnerReferralLevelDetails.length > 0) {
      PartnerReferralOpt.rate =
        getPartnerReferralLevelDetails[1].toNumber() + '%'
      setReferralOpt(PartnerReferralOpt)
    }
  }, [isPartner, getPartnerReferralLevelDetails])

  useEffect(() => {
    if (primaryDomain?.name && getReferralLevelDetails.length === 5) {
      fetchReferralDetails({ variables: { domain: primaryDomain?.name } })
    }
  }, [primaryDomain, getReferralLevelDetails])

  useEffect(() => {
    if (referralOpt.key === 'none') {
      setDisabled(true)
      setInviteUrl('-')
    } else {
      setDisabled(false)
      setInviteUrl(
        `https://${window.location.host}?inviter=${primaryDomain?.name}.bnb`
      )
    }
  }, [referralOpt.key, primaryDomain])
  useEffect(() => {
    if (getReferralDetails.length > 0) {
      const [referralNum, level] = getReferralDetails
      setReferralNum(referralNum.toNumber())
      if (isPartner) {
        setReferralOpt(PartnerReferralOpt)
      } else {
        const temp = Math.min(level.toNumber(), ReferralOpts.length - 1)
        setReferralOpt(ReferralOpts[temp])
        setReferralLevel(temp)
      }
    }
  }, [getReferralDetails, isPartner])
  useEffect(() => {
    if (getReferralLevelDetails.length === 5) {
      const newLimit = [0, 0, 0, 0]
      for (let i = 1; i < ReferralOpts.length; i++) {
        ReferralOpts[i].limit = getReferralLevelDetails[i][0].toNumber()
        ReferralOpts[i].rate = getReferralLevelDetails[i][1].toNumber() + '%'
        newLimit[i - 1] = ReferralOpts[i].limit
      }
      setReferralLevelLimit(newLimit)
    }
  }, [getReferralLevelDetails])
  return (
    <>
      <ReferralQrModal
        inviteUrl={inviteUrl}
        domain={primaryDomain?.name + '.bnb'}
        open={openQrModal}
        onOpenChange={(v) => setOpenQrModal(v)}
        referralOpt={referralOpt}
      ></ReferralQrModal>
      <div className="grid grid-cols-1 gap-6 font-semibold text-white referral my-[86px] px-7">
        {/*title*/}
        <div>
          <p className="text-primary text-6xl font-bold">
            Refer Friends and Earn Rewards
          </p>
          <p className="text-green-600 text-sm">
            Invite your friends to register for a .bnb domain via the referral
            link of your primary name, and get rewarded with BNB.{' '}
            <a
              href="https://docs.space.id/user-tutorials/join-space-id-referral-program"
              target="_blank"
              className="text-primary"
            >
              Referral program rules ↗
            </a>
          </p>
        </div>
        {/*content*/}
        <div
          className={cn(
            'rounded-3xl relative overflow-hidden',
            `referral-${referralOpt.key}`
          )}
        >
          <div className="referral-bg rounded-3xl"></div>
          <div className="flex items-stretch sm:flex-row flex-col p-6 backdrop-blur-[10px] rounded-3xl">
            <div className="sm:mr-6 overflow-hidden sm:mb-0 mb-9">
              <div className="flex flex-col justify-between p-5 referral-content sm:w-[560px] h-[308px]">
                <div className="mr-auto font-bold text-left w-full">
                  <p className="text-6xl font-bold referral-text">
                    {disabled ? (
                      <span className="text-3xl text-left inline-block sm:w-[325px] w-[220px] overflow-hidden whitespace-normal">
                        Set your primary name to join the referral program
                      </span>
                    ) : (
                      primaryDomain?.name + '.bnb'
                    )}
                    &nbsp;
                  </p>
                  <div className="flex items-center">
                    {disabled ? (
                      ''
                    ) : (
                      <div className="mr-2 flex items-center space-x-1">
                        {referralOpt.icons.map((v) => (
                          <img src={v} alt="" width={16} height={16} />
                        ))}
                      </div>
                    )}
                    {disabled ? (
                      <Link
                        to="/profile"
                        className="text-green-600 cursor-pointer font-semibold"
                      >
                        Back to account page ↗{' '}
                      </Link>
                    ) : (
                      <ReferralAddress
                        class="text-lg referral-text font-semibold"
                        address={account}
                      />
                    )}
                  </div>
                  {!disabled && !isPartner && (
                    <LevelBadge level={referralLevel} />
                  )}
                </div>
                <div className="flex items-center space-x-6 px-4 py-2 rounded-full bg-fill-2 text-sm mr-auto">
                  <span className="text-gray-600">Inviter’s earning</span>
                  <span>{referralOpt.rate}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-6">
                <p className="text-primary text-xl">Referral link</p>
                <div className="flex items-center sm:flex-row flex-col sm:space-x-2 sm:max-w-[560px]">
                  <ReferralLink inviteUrl={inviteUrl} />
                  <div className="grid sm:grid-cols-[max-content_max-content] grid-cols-2 gap-x-2 sm:mt-0 mt-2 sm:w-auto w-full">
                    <button
                      className="btn btn-primary px-4 py-2 rounded-full text-base"
                      onClick={() => setOpenQrModal(true)}
                      disabled={disabled}
                    >
                      <QrIcon />
                      <span className="ml-1">QR</span>
                    </button>
                    <TwitterShareButton
                      className="btn btn-secondary px-4 py-2 rounded-full text-base btn-twitter"
                      style={{ padding: '12px 8pxs', backgroundColor: 'unset' }}
                      disabled={disabled}
                      title={`🪪 Call me by my #Web3 .bnb name “${primaryDomain?.name}.bnb”! @SpaceIDProtocol \n Register yours: \n`}
                      url={inviteUrl}
                    >
                      <TwitterIcon className="text-white mr-1" />
                      Share
                    </TwitterShareButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="s-divider sm:h-auto h-[1px] sm:w-[1px] sm:m-0 -mx-6"></div>
            <div className="flex flex-col space-y-7 sm:ml-6 sm:p-0 py-6 flex-grow">
              <div className="text-primary text-xl flex items-center">
                <span className="mr-2">Referral stats</span>
                <Tooltip
                  color="#2980E8"
                  side="bottom"
                  contentClass="rounded-xl p-3"
                  offset={5}
                  title={<ReferralStatDes levelDetails={ReferralOpts} />}
                >
                  <Info />
                </Tooltip>
              </div>
              <InviteProgress
                current={referralNum}
                total={
                  ReferralOpts[referralLevel + 1]?.limit ??
                  ReferralOpts[4].limit
                }
                levelTitle={referralOpt.title}
                levelIcons={referralOpt.icons}
                isPartner={isPartner}
              />
              <LevelProgress
                current={referralNum}
                level={referralLevel}
                list={referralLevelLimit}
                isPartner={isPartner}
              />
            </div>
          </div>
        </div>
        {/*earnings*/}
        <Withdraw />
      </div>
    </>
  )
}
