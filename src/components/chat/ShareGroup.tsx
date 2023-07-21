import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { IconDoubleChevronLeft, IconDoubleChevronRight, IconExternalOpenStroked, IconImage } from '@douyinfe/semi-icons';
import {
  Button, ButtonGroup, Notification, Spin, Toast, Typography
} from '@douyinfe/semi-ui';
import { PhotoSlider } from 'react-photo-view';
import CopyToClipboard from 'react-copy-to-clipboard';
import renderToolbar from '@/components/midjourney-chat/Toolbar';
import useHtmltoCanvas from '@/hooks/useHtmltoCanvas';
import useCurrentChat from '@/hooks/useCurrentChat';
import useSupabase from '@/hooks/useSupabase';

const defaultAvatar = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/default.png';

const ShareGroup: React.FC = function ShareGroup() {
  const { url, loading, setUrl, onTranstoCanvas } = useHtmltoCanvas<HTMLDivElement>(2000, 'chat-content');

  const { chat, checkFlag } = useCurrentChat();

  const { standardUpload, session } = useSupabase();

  const [t] = useTranslation();

  const [show, setShow] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);

  const userid = session?.user.id;
  const userAvatar = session?.user?.user_metadata.avatar_url;

  const handleShare = useCallback(() => {
    const chatId = uuid();
    if (chat) {
      const uploadJson = JSON.parse(JSON.stringify(chat));
      if (uploadJson.assistant) {
        Object.assign(uploadJson.assistant, { avatar: defaultAvatar });
      }
      if (uploadJson.user) {
        Object.assign(uploadJson.user, { avatar: userAvatar });
      } else {
        Object.assign(uploadJson, { user: { avatar: userAvatar } });
      }
      const file = new Blob([JSON.stringify(uploadJson)], { type: 'application/json' });
      setShareLoading(true);
      standardUpload(file, `${chatId}.json`, () => {}, undefined, 'share/private').then(() => {
        const shareUrl = userid ? `${window.location.origin}/share-page/${userid}/${chatId}` : t('userid not found');
        Notification.success({
          title: t('share.success'),
          duration: 2000,
          content: (
            <div className="flex flex-col">
              <Typography.Text
                link
                className="max-w-full w-[400px] my-3"
                ellipsis={{ showTooltip: false, pos: 'middle' }}
              >
                {shareUrl}
              </Typography.Text>
              <div>
                <CopyToClipboard text={shareUrl} onCopy={() => Toast.success(t('copy.success'))}>
                  <Typography.Text link>{t('Copy')}</Typography.Text>
                </CopyToClipboard>
              </div>
            </div>
          )
        });
      }).catch(() => {}).finally(() => {
        setShareLoading(false);
      });
    }
  }, [chat, userid, t, userAvatar, standardUpload]);

  return (
    <div
      className={classNames(
        'absolute top-10 right-0 rounded-l-full shadow overflow-hidden transition-transform',
        'border-[2px] border-[var(--semi-color-border)] bg-white dark:bg-[#15171a] html2canvas-ignore',
        { 'translate-x-[calc(100%-40px)]': !show }
      )}
    >
      {!checkFlag && (
        <Spin spinning={shareLoading || loading}>
          <ButtonGroup>
            <Button
              className="!w-[40px]"
              type="tertiary"
              icon={show ? <IconDoubleChevronRight /> : <IconDoubleChevronLeft />}
              onClick={() => setShow((pre) => !pre)}
            />
            <Button type="tertiary" icon={<IconExternalOpenStroked />} onClick={handleShare} />
            <Button type="tertiary" icon={<IconImage />} onClick={onTranstoCanvas} />
          </ButtonGroup>
        </Spin>
      )}
      <PhotoSlider
        images={[{ key: 0, src: url }]}
        visible={!!url}
        onClose={() => setUrl('')}
        toolbarRender={renderToolbar}
      />
    </div>
  );
};

export default React.memo(ShareGroup);
