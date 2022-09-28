import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { EffectCoverflow } from 'swiper'
import { GiftCardFaceValues } from 'constants/index'
import gift5 from 'assets/images/giftCard/gift-card-5.png'
import gift160 from 'assets/images/giftCard/gift-card-160.png'
import gift650 from 'assets/images/giftCard/gift-card-650.png'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import './index.css'
import { useState } from 'react'
import NumberInput from '../Input/NumberInput'
import ArrowIcon from '../Icons/ArrowIcon'

function GiftCardSwiperControl({
  max = 9999,
  value,
  onNumberChange,
  disabled,
}) {
  const swiper = useSwiper()
  return (
    <div className="flex space-x-9 justify-center mt-5">
      <button
        disabled={swiper.activeIndex <= 0 || disabled}
        className={swiper.activeIndex <= 0 ? 'invisible' : ''}
        onClick={() => swiper.slidePrev()}
      >
        <ArrowIcon direction="left" className="text-white" />
      </button>
      <NumberInput
        value={value}
        onChange={onNumberChange}
        step={1}
        max={max}
        disable={disabled}
      />
      <button
        disabled={swiper.activeIndex >= 2 || disabled}
        className={swiper.activeIndex >= 2 ? 'invisible' : ''}
        onClick={() => swiper.slideNext()}
      >
        <ArrowIcon direction="right" className="text-white" />
      </button>
    </div>
  )
}

const stretch = window.innerWidth >= 768 ? 240 : 180

export default function GiftCardSwiper({ value, onChange, disabled }) {
  const [index, setIndex] = useState(0)
  const onNumberChange = (v) => {
    const key = GiftCardFaceValues[index]
    const temp = value[key]
    temp.count = v
    onChange({ ...value, [key]: temp })
  }
  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      coverflowEffect={{
        rotate: 5,
        stretch,
        depth: 100,
        modifier: 1,
        slideShadows: false,
        scale: 0.875,
      }}
      modules={[EffectCoverflow]}
      onSlideChange={(v) => setIndex(v.activeIndex)}
    >
      <SwiperSlide
        itemID={GiftCardFaceValues[0]}
        className="w-fit"
        data-invisible={index >= 2}
      >
        <img src={gift5} alt="5" />
      </SwiperSlide>
      <SwiperSlide itemID={GiftCardFaceValues[1]} className="w-fit">
        <img src={gift160} alt="160" />
      </SwiperSlide>
      <SwiperSlide
        itemID={GiftCardFaceValues[2]}
        className="w-fit"
        data-invisible={index <= 0}
      >
        <img src={gift650} alt="650" />
      </SwiperSlide>
      <GiftCardSwiperControl
        max={value[GiftCardFaceValues[index]].total}
        onNumberChange={onNumberChange}
        value={value[GiftCardFaceValues[index]].count}
        disabled={disabled}
      />
    </Swiper>
  )
}
