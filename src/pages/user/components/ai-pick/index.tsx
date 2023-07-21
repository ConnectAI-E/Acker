import React from 'react';
import { Card } from '@douyinfe/semi-ui';
import ImageWithLoading from '@/components/image-with-loading';
import type { AiPickProps } from './AiPick';

const AiPick: React.FC<AiPickProps> = function AiPick(props) {
  const { onClick } = props;

  return (
    <div className="w-full flex justify-evenly items-center py-5">
      <div onClick={() => onClick('chatgpt')}>
        <Card shadows="hover" className="!bg-transparent">
          <ImageWithLoading
            className="w-[100px] h-[100px] rounded-md"
            src="https://sp-key.aios.chat/storage/v1/object/public/static/web/gpt3.5.png"
          />
          <div className="text-center mt-5">
            ChatGPT
          </div>
        </Card>
      </div>
      <div onClick={() => onClick('midjourney')}>
        <Card shadows="hover" className="!bg-transparent">
          <ImageWithLoading
            className="w-[100px] h-[100px] rounded-md"            
            src="https://sp-key.aios.chat/storage/v1/object/public/static/web/midjourney.webp"
          />
          <div className="text-center mt-5">
            MidJourney
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AiPick;
