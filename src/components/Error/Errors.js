import React from 'react'
import { Button } from 'react-daisyui'
import { useHistory } from 'react-router'

export default function Error404() {
  const backToHome = () => {
    window.location.href = process.env.REACT_APP_BACK_TO_HOME
  }

  return (
    <div className='min-h-[100vh] bg-[url("assets/images/home-bg.png")] flex items-center justify-center bg-no-repeat bg-cover'>
      <div className="relative space-y-12 text-center">
        <div className="text-[160px] font-bold left-[calc(50%-135px)] top-[80px] leading-[66px] absolute text-[rgba(204,252,255,0.2)]">
          404
        </div>
        <p className="font-bold text-[72px] text-green-100">Oops!</p>
        <p className="text-green-100 text-[32px] leading-[46px] font-bold font-urbanist">
          We can't find the page you're looking for...
        </p>
        <div>
          <Button
            onClick={() => backToHome()}
            className="text-green-100 border-green-100 border rounded-full font-bold text-[24px] leading-[24px] py-3 px-8 font-cocoSharp bg-transparent hover:bg-transparent hover:border-green-100"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
