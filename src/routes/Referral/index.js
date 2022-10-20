import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import { TwitterShareButton } from 'react-share'
import Info from 'components/Icons/Info'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
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
import { useSelector } from 'react-redux'
import ReferralLink from './ReferralLink'
import ReferralStatDes from './ReferralStatDes'
import Withdraw from './Withdraw'
import LevelBadge from './LevelBadge'
import { ReferralLevelTitle } from './constants'

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
const ReferralLevelLimit = [0, 0, 0, 0]

export default function ReferralPage() {
  const [referralOpt, setReferralOpt] = useState(ReferralOpts[0])
  const [referralNum, setReferralNum] = useState(0)
  const [referralLevel, setReferralLevel] = useState(0)
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const [disabled, setDisabled] = useState(true)
  const [inviteUrl, setInviteUrl] = useState('-')
  const [openQrModal, setOpenQrModal] = useState(false)

  const account = useAccount()

  const { data: { getReferralLevelDetails = [] } = {} } = useQuery(
    QUERY_REFERRAL_LEVEL_DETAILS
  )
  const [fetchReferralDetails, { data: { getReferralDetails = [] } = {} }] =
    useLazyQuery(QUERY_REFERRAL_DETAILS, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    if (primaryDomain?.name) {
      fetchReferralDetails({ variables: { domain: primaryDomain?.name } })
    }
  }, [primaryDomain])

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
    if (getReferralDetails.length <= 0) {
    } else {
      const [referralNum, level] = getReferralDetails
      const temp = Math.min(level.toNumber(), ReferralOpts.length - 1)
      setReferralOpt(ReferralOpts[temp])
      setReferralNum(referralNum.toNumber())
      setReferralLevel(temp)
    }
  }, [getReferralDetails])
  useEffect(() => {
    if (getReferralLevelDetails.length === 5) {
      for (let i = 1; i < ReferralOpts.length; i++) {
        ReferralOpts[i].limit = getReferralLevelDetails[i][0].toNumber()
        ReferralOpts[i].rate = getReferralLevelDetails[i][1].toNumber() + '%'
        ReferralLevelLimit[i - 1] = ReferralOpts[i].limit
      }
    }
  }, [getReferralLevelDetails])
  return (
    <>
      <ReferralQrModal
        inviteUrl={inviteUrl}
        open={openQrModal}
        onOpenChange={(v) => setOpenQrModal(v)}
      ></ReferralQrModal>
      <div className="grid grid-cols-1 gap-6 font-semibold text-white referral">
        {/*title*/}
        <div>
          <p className="text-primary text-6xl font-bold">
            Refer Friends and Earn Reward
          </p>
          <p className="text-green-600 text-sm">
            Invite your friends to register for .bnb domain via the referral
            link of your primary name, and get rewarded with BNB.{' '}
            <a href="" target="_blank" className="text-primary">
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
          <div className="referral-bg"></div>
          <div className="flex items-stretch p-6 backdrop-blur-[10px]">
            <div className="mr-6 overflow-hidden">
              <div className="flex flex-col justify-between p-5 referral-content">
                <div className="mr-auto font-bold text-left">
                  <p className="text-6xl font-bold referral-text">
                    {disabled ? (
                      <span className="text-3xl text-left inline-block w-[263px]">
                        Set primary name to join referral program
                      </span>
                    ) : (
                      primaryDomain?.name
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
                  {!disabled && <LevelBadge level={referralLevel} />}
                </div>
                <div className="flex items-center space-x-6 px-4 py-2 rounded-full bg-fill-2 text-sm mr-auto">
                  <span className="text-gray-600">Inviter’s earning</span>
                  <span>{referralOpt.rate}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-6">
                <p className="text-primary text-xl">Referral link</p>
                <div className="flex items-center space-x-2 max-w-[560px]">
                  <ReferralLink inviteUrl={inviteUrl} />
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
                    title="space id"
                    url={inviteUrl}
                  >
                    <TwitterIcon className="text-white mr-1" />
                    Share
                  </TwitterShareButton>
                </div>
              </div>
            </div>
            <div className="s-divider w-[1px]"></div>
            <div className="flex flex-col space-y-7 ml-6 flex-grow">
              <div className="text-primary text-xl flex items-center">
                <span className="mr-2">Referral stats</span>
                <Tooltip
                  color="#2980E8"
                  side="bottom"
                  contentClass="rounded-xl p-3"
                  offset={5}
                  title={<ReferralStatDes />}
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
              />
              <LevelProgress
                current={referralNum}
                level={referralLevel}
                list={ReferralLevelLimit}
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
