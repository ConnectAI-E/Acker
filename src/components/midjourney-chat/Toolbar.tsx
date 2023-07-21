import type { OverlayRenderProps } from 'react-photo-view/dist/types';
import { IconDownload, IconMinus, IconPlus, IconRefresh } from '@douyinfe/semi-icons';
import download from '@/utils/download';

function renderToolbar(props: OverlayRenderProps) {
  const {
    onScale, onRotate, scale, rotate, images, index 
  } = props;

  return (
    <>
      <IconPlus className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} />
      <IconMinus className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)} />
      <IconRefresh className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)} />
      <IconDownload className="PhotoView-Slider__toolbarIcon" onClick={() => download(images[index].src)} />
    </>
  );
}

export default renderToolbar;
