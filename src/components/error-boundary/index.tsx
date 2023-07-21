import React from 'react';
import { Button, Empty } from '@douyinfe/semi-ui';

const ErrorBoundary: React.FC = function ErrorBoundary() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Empty
      className="w-full h-full !justify-center"
      title="It seems that there is a slight problem with the network."
      image="https://sp-key.aios.chat/storage/v1/object/public/static/web/empty/server-error.png"
      imageStyle={{ width: '500px', height: '400px', maxWidth: '100%', maxHeight: '100%' }}
      description="Click the button below to reload the page."
    >
      <div className="text-center" onClick={handleReload}>
        <Button type="secondary">Reload</Button>
      </div>
    </Empty>
  );
};

export default ErrorBoundary;
