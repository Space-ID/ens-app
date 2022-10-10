import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { EffectCoverflow } from 'swiper'
import { useState } from 'react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import './index.css'
import NumberInput from '../Input/NumberInput'
import ArrowIcon from '../Icons/ArrowIcon'

function GiftCardSwiperControl({
  max = 9999,
  value,
  onNumberChange,
  disabled,
  length,
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
        disabled={swiper.activeIndex >= length - 1 || disabled}
        className={swiper.activeIndex >= length - 1 ? 'invisible' : ''}
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
    const temp = value[index]
    temp.count = v
    const arr = [...value]
    arr[index] = temp
    onChange(arr)
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
      {value.map((v, i) => (
        <SwiperSlide
          key={v.faceValue}
          itemID={v.faceValue}
          className="w-fit"
          data-invisible={Math.abs(index - i) >= 2}
        >
          <img src={v.url} alt={v.faceValue} />
        </SwiperSlide>
      ))}
      <GiftCardSwiperControl
        max={value[index].total}
        onNumberChange={onNumberChange}
        value={value[index].count}
        disabled={disabled}
        length={value.length}
      />
    </Swiper>
  )
}
