import { Link } from 'react-router-dom'
import Menu from 'components/Icons/HamburgerIcon'
import { useState } from 'react'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import WholeLogoIcon from 'components/Icons/WholeLogoIcon'
import ArrowIcon from 'components/Icons/ArrowIcon'
import BNBChain from 'assets/vendors/bnb_chain.svg'
import Galaxy from 'assets/vendors/galaxy.svg'
import Stepn from 'assets/vendors/stepn.svg'
import TrustWallet from 'assets/vendors/trust_wallet.svg'
import ChainLink from 'assets/vendors/chain_link.svg'
import BinanceLabs from 'assets/vendors/binance_labs.svg'
import bnbBanner from 'assets/images/bnb_banner.png'
import bnbDesc from 'assets/images/bnb_desc.png'
import 'swiper/css'
import 'swiper/css/pagination'

const footerLinks = [
  {
    title: 'Get Started',
    subs: [
      // { href: '#', text: 'About Us' },
      { href: '/app', text: '.bnb Name Service' },
      { href: 'https://app.space.id/', text: 'Registration' },
    ],
  },
  {
    title: 'Resources',
    subs: [
      { href: 'https://docs.space.id/', text: 'Docs' },
      // { href: '#', text: 'Careers' },
      {
        href: 'https://www.figma.com/file/iV6u1LSOKn1umrrZxvbw6g/Space-ID-Media-Kit?node-id=0%3A1',
        text: 'Brand Kit',
      },
    ],
  },
  {
    title: 'Community',
    subs: [
      { href: 'https://medium.com/@SpaceID', text: 'Blog' },
      { href: 'https://twitter.com/SpaceIDProtocol', text: 'Twitter' },
      { href: 'http://discord.gg/spaceid', text: 'Discord' },
    ],
  },
]

const newList = [
  {
    id: 1,
    title:
      'Everything about .bnb Domain Public Registration & the 5-day Staging Launch',
    url: 'https://medium.com/@SpaceID/its-here-bnb-domain-pre-registration-snapshot-details-1683d36c17a5',
    publish_time: '1662379200000',
    description:
      'All eyes are on .bnb Domain! Our pre-registration has in total of over 23K domains registered, but can we get much higher?',
    image_url: 'https://miro.medium.com/max/720/1*XQQH8GXrt1HuvTQ6RIowwg.png',
  },
  {
    id: 2,
    title: 'SPACE ID Closed its Seed Round Led by Binance Labs',
    url: 'https://blog.space.id/space-id-closed-its-seed-round-led-by-binance-labs-414bab4e4ca',
    publish_time: '1662120000000',
    description:
      'We are excited to announce that SPACE ID has successfully closed its seed round fundraising led by Binance Labs. The investment will be dedicated to bringing their .bnb Domain Name Service to the next level, as well as the upcoming universal domain development.',
    image_url: 'https://miro.medium.com/max/1400/1*iU3wQzj6nWS1BT050PbIng.png',
  },
  {
    id: 3,
    title: 'It’s here! .bnb Domain Pre-registration & Snapshot Details',
    url: 'https://medium.com/@SpaceID/its-here-bnb-domain-pre-registration-snapshot-details-1683d36c17a5',
    publish_time: '1659420000000',
    description:
      'Enough said. We are excited to announce that the snapshot for the .bnb Whitelist Badge NFT and Neon Genesis NFT holders will be taken on August 8th 2AM ET, while the highly anticipated .bnb Domain Pre-registration round will be live on August 10th 2AM ET. This is not a drill. This is an open call for our strong community to grab their first-ever standard BNB Chain domain identifiers, which will soon be integrated with its whole ecosystem.',
    image_url: 'https://miro.medium.com/max/1400/1*XTjjwRfYCu-sq-GbB1N2Wg.png',
  },
  {
    id: 4,
    title:
      'We Are Holding an Auction: 10 .bnb Domain Names Now on Binance NFT!',
    url: 'https://medium.com/@SpaceID/we-are-holding-an-auction-10-bnb-domain-names-now-on-binance-nft-875b9568429',
    publish_time: '1658815200000',
    description:
      'Every epic story starts with the forging of the great “rings”, and so does our .bnb Domain journey.Excited to announce that SPACE ID is collaborating with the biggest marketplace in the BNB Chain ecosystem, Binance NFT, to auction 10 of the .bnb Domain Names.',
    image_url: 'https://miro.medium.com/max/1400/1*nXmBhSRKNayW3X-sC_EkvQ.png',
  },
]

const vendors = [
  { href: 'https://www.bnbchain.org/', icon: BNBChain },
  { href: 'https://galaxy.eco/', icon: Galaxy },
  { href: 'https://stepn.com/', icon: Stepn },
  { href: 'https://trustwallet.com/', icon: TrustWallet },
  { href: 'https://chain.link/', icon: ChainLink },
  { href: 'https://labs.binance.com/', icon: BinanceLabs },
]

const formatNewsTime = (num) =>
  isNaN(Number(num)) ? num : moment(Number(num)).format('MMM DD. YYYY')

const LandingPageHeader = () => {
  const [show, setShow] = useState(false)
  return (
    <>
      <div className="absolute z-10 w-full backdrop-blur-sm bg-[#213C3E] bg-opacity-5">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-20 flex items-center justify-between px-[20px] sm:px-[40px] md:px-[64px]">
            <Link to="/" className="md:block hidden">
              <WholeLogoIcon className="w-[220px] h-10 mr-10" />
            </Link>
            <div className="flex items-center justify-center gap-5 md:hidden">
              <div onClick={() => setShow((v) => !v)}>
                <Menu className="md:hidden text-primary" />
              </div>
              <Link to="/">
                <SmallLogoIcon className="md:hidden" />
              </Link>
            </div>
            <div className="md:flex hidden items-center gap-10 text-lg text-transparent text-primary">
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="flex items-center justify-center gap-2 m-1 cursor-pointer"
                >
                  <p className="text-primary">Learn</p>
                  <ArrowIcon
                    className="text-primary"
                    size={10}
                    direction="bottom"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu gap-1 h-[96px] min-w-[96px] p-2 bg-fill-2 backdrop-blur-sm rounded-[20px]"
                >
                  <li className="h-[38px] py-[7px] items-center px-3 hover:bg-[#438C88]/25 rounded-xl !text-base text-center !text-[#B1D6D3]">
                    <a
                      className="p-0 hover:bg-transparent"
                      href="https://docs.space.id/"
                      target="_blank"
                    >
                      Docs
                    </a>
                  </li>
                  <li className="h-[38px] py-[7px] items-center px-3 hover:bg-[#438C88]/25 rounded-xl !text-base text-center !text-[#B1D6D3]">
                    <a
                      className="p-0 hover:bg-transparent"
                      href="https://medium.com/@SpaceID"
                      target="_blank"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="flex items-center justify-center gap-2 m-1 cursor-pointer"
                >
                  <p className="text-primary">Community</p>
                  <ArrowIcon
                    className="text-primary"
                    size={10}
                    direction="bottom"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu gap-1 h-[96px] min-w-[96px] p-2 bg-fill-2 backdrop-blur-sm rounded-[20px]"
                >
                  <li className="h-[38px] py-[7px] items-center px-3 hover:bg-[#438C88]/25 rounded-xl !text-base text-center !text-[#B1D6D3]">
                    <a
                      className="p-0 hover:bg-transparent"
                      href="https://twitter.com/SpaceIDProtocol"
                      target="_blank"
                    >
                      Twitter
                    </a>
                  </li>
                  <li className="h-[38px] py-[7px] items-center px-3 hover:bg-[#438C88]/25 rounded-xl !text-base text-center !text-[#B1D6D3]">
                    <a
                      className="p-0 hover:bg-transparent"
                      href="http://discord.gg/spaceid"
                      target="_blank"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
              <Link
                to="/app"
                className="btn btn-primary items-center justify-center w-[140px] !min-h-[40px] rounded-2xl border-none font-bold !text-lg !text-black !hover:text-black !active:text-black !focus:text-black"
              >
                App
              </Link>
            </div>
            <Link
              to="/app"
              className="md:hidden btn btn-primary items-center justify-center w-[75px] !min-h-[40px] rounded-2xl border-none font-bold !text-lg !text-black !hover:text-black !active:text-black !focus:text-black"
            >
              App
            </Link>
          </div>
        </div>
      </div>
      {show && (
        <div className="fixed z-[555] h-screen h-full w-screen bg-black md:hidden">
          <div className="w-full h-20 flex items-center justify-between px-10">
            <div className="flex items-center justify-center gap-5 text-primary">
              <div onClick={() => setShow((v) => !v)}>
                <ArrowIcon className="text-primary" direction="left" />
              </div>
              <SmallLogoIcon className="text-primary" />
            </div>
            <Link
              to="/app"
              className="md:hidden btn btn-primary items-center justify-center w-[75px] !min-h-[40px] rounded-2xl border-none font-bold !text-lg !text-black !hover:text-black !active:text-black !focus:text-black"
            >
              App
            </Link>
          </div>
          <div className="mt-7 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2 text-2xl">
              <p className="text-primary">Learn</p>
              <ArrowIcon
                className="text-primary"
                size={10}
                direction="bottom"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 text-xl">
              <a
                className="text-[#B1D6D3]"
                href="https://docs.space.id/"
                target="_blank"
              >
                Docs
              </a>
              <a
                className="text-[#B1D6D3]"
                href="https://medium.com/@SpaceID"
                target="_blank"
              >
                Blog
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-2xl">
              <p className="text-primary">Community</p>
              <ArrowIcon
                className="text-primary"
                size={10}
                direction="bottom"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 text-[#B1D6D3] text-xl">
              <a
                className="text-[#B1D6D3]"
                href="https://twitter.com/SpaceIDProtocol"
                target="_blank"
              >
                Twitter
              </a>
              <a
                className="text-[#B1D6D3]"
                href="http://discord.gg/spaceid"
                target="_blank"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const LandingFooter = () => {
  return (
    <div className="sticky bottom-0 w-full md:mt-[100px] mt-8 md:py-20 py-10 bg-black">
      <div className="max-w-7xl m-auto flex items-center justify-between md:flex-row flex-col items-stretch md:gap-0 gap-16 px-7">
        <div>
          <WholeLogoIcon className="w-[220px] h-10" />
          <div className="max-w-[500px] mt-5 text-gray-600">
            SPACE ID is building a universal name service network that connects
            people, information, and assets across all blockchains and apps.
          </div>
        </div>
        <div className="flex md:justify-center justify-start items-start md:gap-10 gap-7 md:flex-nowrap flex-wrap">
          {footerLinks.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-col justify-center items-start gap-3"
              >
                <div className="text-gray-600 font-semibold md:text-xl text-base">
                  {item.title}
                </div>
                {item.subs.map((a) => {
                  return (
                    <div key={a.text}>
                      {a.href.startsWith('http') ? (
                        <a
                          href={a.href}
                          className="text-gray-800 text-sm"
                          target={
                            a.href.startsWith('http') ? '_blank' : '_self'
                          }
                        >
                          {a.text}
                        </a>
                      ) : (
                        <Link to={a.href} className="text-gray-800 text-sm">
                          {a.text}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <div className="hidden h-90px flex-center text-gray-primary text-lg font-400">
        Made by Bullet Labs © {new Date().getFullYear()} SPACE ID
      </div>
    </div>
  )
}

const News = ({ hiddenButton }) => {
  return (
    <div className="flex flex-col items-center justify-center md:py-[100px] py-12">
      <div className="landing-linear-secondary text-center font-bold text-[28px] leading-[40px] 2xs:text-[36px] 2xs:leading-[52px] md:text-[52px] md:leading-[56px]">
        <p>BNB Chain Native, BNB Chain Centric</p>
      </div>
      <div className="mt-[56px] max-w-[1407px] px-6 md:flex gap-8 hidden">
        {newList.map((item, index) => {
          return (
            <a
              key={item.title}
              className="flex-1 flex flex-col items-stretch rounded-3xl overflow-hidden bg-[#011E28] cursor-pointer"
              href={item.url}
              target="_blank"
            >
              <img src={item.image_url} alt="" className="object-cover" />
              <div className="p-5">
                <div className="text-[20px] text-gray-600 font-bold line-clamp-2">
                  {item.title}
                </div>
                <div className="mt-2 text-gray-800 line-clamp-3">
                  {item.description}
                </div>
                <div className="mt-5 text-gray-800">
                  {formatNewsTime(item.publish_time)}
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <Swiper
        pagination={true}
        slidesPerView={1.25}
        centeredSlides={true}
        spaceBetween={16}
        modules={[Pagination]}
        className="w-full mt-6 !pb-10 md:hidden"
      >
        {newList.map((item, index) => {
          return (
            <SwiperSlide key={item.title} itemID={item.title}>
              <a
                className="w-[282px] h-[400px] flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-[#011E28] cursor-pointer"
                href={item.url}
                target="_blank"
              >
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-[184px] object-cover"
                />
                <div className="p-5">
                  <div className="text-[20px] text-gray-600 font-bold line-clamp-2">
                    {item.title}
                  </div>
                  <div className="mt-2 text-gray-800 font-400 line-clamp-3">
                    {item.description}
                  </div>
                  <div className="mt-5 text-gray-800 font-400">
                    {formatNewsTime(item.publish_time)}
                  </div>
                </div>
              </a>
            </SwiperSlide>
          )
        })}
      </Swiper>
      {!hiddenButton && (
        <div className="mt-56px flex-center">
          <a href="https://medium.com/@SpaceID" target="_blank">
            <button className="min-w-200px h-16 rounded-3xl !bg-secondary text-28px !text-#000 font-bold lt-md:w-145px lt-md:h-12 lt-md:text-20px lt-md:rounded-20px">
              Read all
            </button>
          </a>
        </div>
      )}
    </div>
  )
}

const Vendors = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center 2xl:pb-[200px] md:py-[100px] pt-12 pb-24">
      <div className="landing-linear-secondary text-center font-bold text-[28px] leading-[40px] 2xs:text-[36px] 2xs:leading-[52px] md:text-[52px] md:leading-[56px]">
        {title}
      </div>
      <div className="mt-[84px] grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-9 gap-y-16 lg:gap-x-3 md:gap-x-16 text-[200px]">
        {vendors.map((item, index) => {
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              className="flex items-center justify-center"
            >
              <img src={item.icon} className="h-[50px] text-white" />
            </a>
          )
        })}
      </div>
      <a
        className="block mt-14"
        href="https://docs.space.id/overview/integration-partners"
        target="_blank"
      >
        <button className="md:w-[216px] md:h-[58px] w-[172px] h-12 md:rounded-3xl rounded-[20px] !bg-primary text-2xl !text-black font-bold">
          See all
        </button>
      </a>
    </div>
  )
}

const LandingPage = () => {
  return (
    <div className="landing-bg min-h-screen relative flex flex-col overflow-hidden bg-top-center bg-no-repeat bg-cover">
      <LandingPageHeader />
      <div className="flex-1 md:pt-[152px] pt-[110px]">
        <div className="flex flex-col items-center justify-center">
          <div className="landing-linear-secondary font-bold text-center md:text-[60px] md:leading-[56px] sm:text-[36px] sm:leading-[52px] text-[20px] leading-[28px]">
            BNB Chain Name Service
          </div>
          <div className="landing-title max-w-5xl mt-2 mx-7 md:text-[32px] md:leading-[46px] text-[16px] leading-[24px]">
            The first version of SPACE ID starts with .bnb name service
          </div>
          <img
            src={bnbBanner}
            alt=""
            className="mt-0 md:-mt-20 w-full max-w-[1052px] h-auto max-h-[862px]"
          />
          <div className="flex md:flex-row flex-col items-center justify-between md:py-[100px] py-12 md:-mt-20 mt-0 md:px-0 px-7">
            <div className="py-8 lg:px-9 md:px-4 px-0 flex flex-col items-center 2xl:flex-1 2xl:w-1/2 md:border-r border-[#CCFCFF] border-opacity-20 border-none">
              <div className="landing-linear-big font-bold xl:text-[40px] lg:text-[36px] lg:leading-[56px] md:text-[28px] md:leading-[40px] text-[20px] leading-[28px] text-center">
                Register .bnb Domain
              </div>
              <Link
                to="/app"
                className="mt-6 md:h-[72px] h-[52px] xl:w-[450px] lg:w-[405px] md:w-[300px] w-full max-w-80 flex items-center justify-center backdrop-blur-sm md:rounded-[28px] rounded-[20px] font-bold cursor-pointer text-[20px] leading-[28px] md:text-[28px] md:leading-[40px] text-black "
                style={{
                  backgroundImage:
                    'linear-gradient(270deg, #1EEFA4 -2.16%, #009ACB 99.83%)',
                }}
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img
            src={bnbDesc}
            className="-mt-[100px] md:-mb-[100px] -mb-12 w-full max-w-[992px] h-auto max-h-[1050px]"
            alt=""
          />
        </div>
        <News hiddenButton={true} />
        <Vendors title="Supported by BNB Chain Ecosystem" />
      </div>
      <LandingFooter />
    </div>
  )
}

export default LandingPage
