import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Swiper from 'light-swiper';
import throttle from 'lodash/throttle';
import useWindowResize from '@/hooks/useWindowResize';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import useChatList from '@/hooks/useChatList';
import type { Assistant } from '@/global';
import type { CardsProps } from './Card';
import { useWelcomeData } from './api';
import { MdSkeleton, SmSkeleton } from './Skeleton';
import Card from './Item';

const Cards: React.FC<CardsProps> = function Cards (props) {
  const { style = {}, className = '' } = props;

  const navigate = useNavigate();

  const { handleNewChat } = useChatList();

  const { data, isLoading } = useWelcomeData();

  const swiperRef = useRef<any>();

  const isMobile = useResponsiveMobile();

  const swiperInit = useMemo(() => throttle((width?: number) => {
    const swiperElement = document.querySelector('.light-swiper');
    if (swiperRef.current && typeof swiperRef.current.kill === 'function') {
      swiperRef.current.kill();
      swiperRef.current = null;
    }
    if (!isLoading && swiperElement && !swiperRef.current) {
      swiperRef.current = new Swiper(swiperElement, {
        auto: 5000,
        speed: 400,
        // offset: -100,
        width: width && width > 100 ? (width - 100) : 0,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 500, { trailing: true, leading: false }), [isLoading, isMobile]);

  useEffect(() => {
    const width = document.getElementsByTagName('body')?.[0]?.clientWidth;
    swiperInit(width);
  }, [swiperInit]);

  useWindowResize(swiperInit);

  const handleClick = (assistant: Assistant) => {
    const { prompt, id } = assistant;
    handleNewChat({ systemMessage: prompt, assistantId: id, assistant }, true);
    navigate('/chat/chat-page');
  };

  const renderSwiper = () => {
    if (isLoading) return <SmSkeleton />;
    return (
      <div className="light-swiper overflow-hidden relative h-[148px] flex-shrink-0">
        <div className="swiper-wrap overflow-hidden relative h-full">
          {data.map((assistant: Assistant) => (
            <div
              key={assistant?.id}
              className="h-full swipe-item float-left relative px-4"
              onClick={() => handleClick(assistant)}
            >
              <Card data={assistant} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={classNames(
          'w-full md:h-[148px] px-2 hidden md:flex flex-shrink-0 whitespace-nowrap overflow-hidden flex-wrap md:justify-center',
          className,
        )}
        style={style}
      >
        {isLoading ? <MdSkeleton /> : data.map((assistant: Assistant) => (
          <div
            key={assistant?.id}
            onClick={() => handleClick(assistant)}
            className="h-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 min-[2160px]:w-1/6 min-[2560px]:w-[12.5%] px-2 mb-4"
          >
            <Card data={assistant} />
          </div>
        ))}
      </div>
      {isMobile && renderSwiper()}
    </>
  );
};

export default Cards;
