function download(url?: string, name?: string) {
  if (!url) return;
  fetch(url).then(async (response) => response.blob()).then((blob) => {
    const blobUrl = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = blobUrl;
    // 后续需要修改一下
    link.download = name || 'aios-screenshot.png';
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }).catch((err) => err);
}

export default download;
