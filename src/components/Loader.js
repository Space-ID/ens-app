import React from 'react'
import AnimationSpin from 'components/AnimationSpin/index'

const Loader = (props) => {
  return (
    <div
      className={
        props.fullScreenLoading
          ? "bg-[url('assets/images/home-bg.png')] bg-cover relative min-h-[100vh] flex items-center justify-center"
          : ''
      }
    >
      <AnimationSpin size={40} />
    </div>
  )
}

export default Loader
