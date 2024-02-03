// npm i swiper 해야함

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react'
import React, {DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren} from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// import required modules
import {Autoplay, Navigation, Virtual} from 'swiper/modules'

import {makeClassName} from '../textUtil'

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    preView?: number
}

// children으로 전달된 요소들을 React.Children.map을 사용하여 반복,
// children에 포함된 각 요소들을 배열로 변환

export const Slider: FC<PropsWithChildren<DivProps>> = ({
    children,
    className: _className,
    ...props
}) => {
    const className = makeClassName(
        'flex justify-center h-full border rounded-lg border--30',
        _className
    )
    const slides = React.Children.map(children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
    ))

    return (
        <div className={className}>
            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                {slides}
            </Swiper>
        </div>
    )
}

//메인 슬라이더
export const MainSlider: FC<PropsWithChildren<DivProps>> = ({
    children,
    className: _className,
    ...props
}) => {
    return (
        <>
            <Swiper
                className="w-full"
                modules={[Autoplay, Virtual, Navigation]}
                slidesPerView={props.preView}
                initialSlide={1}
                centeredSlides={true}
                spaceBetween={30}
                navigation={true}
                autoplay={{
                    delay: 10 * 1500,
                    disableOnInteraction: false
                }}
                virtual
                simulateTouch={false} // 마우스 드래그 시뮬레이션 비활성화
                allowTouchMove={false} // 슬라이더의 터치 움직임 비활성화
                grabCursor={false} // 그랩 커서 비활성화
            >
                {children}
            </Swiper>
        </>
    )
}
