import { useCallback, useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function useHtmltoCanvas<T extends HTMLElement>(maxWidth?: number, targetId?: string) {
  const targetRef = useRef<T>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [previewSrc, setPreviewSrc] = useState<string>('');

  const transHtmltoCanvas = useCallback(async () => {
    const targetElementById = targetId ? document.getElementById(targetId) : null;
    const element = targetRef.current || targetElementById; // 优先取ref上的
    if (!element || loading) return;
    setLoading(true);
    await html2canvas(element, {
      scale: 2, // 缩放比例高一点, 让图片更清晰一点
      useCORS: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      ignoreElements: (_element) => _element.className?.includes?.('html2canvas-ignore'),
    }).then((_canvas) => {
      let canvas = _canvas;
      if (maxWidth && typeof maxWidth === 'number' && canvas.width > maxWidth) {
        // 新建Canvas对象
        const newCanvas = document.createElement('canvas');
        const ctx = newCanvas.getContext('2d');
        // 设置新Canvas的宽高
        const newWidth = 2000; // 设置新Canvas的宽度
        const newHeight = canvas.height; // 新Canvas的高度与原Canvas相同
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        // 计算需要截取的中间部分的起始位置
        const startX = (canvas.width - newWidth) / 2;
        if (ctx) {
          // 在新Canvas中绘制裁剪后的图像
          ctx.drawImage(canvas, startX, 0, newWidth, newHeight, 0, 0, newWidth, newHeight);
          canvas = newCanvas;
        }
      }
      const dataURL = canvas.toDataURL('image/png');
      setPreviewSrc(dataURL);
    }).finally(() => {
      setLoading(false);
    });
  }, [maxWidth, targetId, loading]);

  return {
    targetRef,
    url: previewSrc,
    setUrl: setPreviewSrc,
    loading,
    onTranstoCanvas: transHtmltoCanvas
  };
}

export default useHtmltoCanvas;
