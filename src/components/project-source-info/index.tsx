import React, { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Image, Typography } from '@douyinfe/semi-ui';

const { Text } = Typography;

const LOGO = import.meta.env.VITE_LOGO_URL;
const INFO = import.meta.env.VITE_INFO;

const ProjectSourceInfo: React.FC = function ProjectSourceInfo() {
  const [t] = useTranslation();

  const info = useMemo(() => {
    if (INFO) return INFO;
    return (
      <Trans
        t={t}
        i18nKey="chat page info"
        components={{ click: <Text className="mx-1 text-xl" link={{ href: 'https://github.com/AIOS-club', target: '_blank' }} /> }}
      />
    );
  }, [t]);

  return (
    <div className="h-[calc(100%-12rem)] flex flex-col items-center justify-center bg-white dark:bg-[#17191f]">
      <Typography className="font-medium m-8 text-xl">
        {info}
      </Typography>
    </div>
  );
};

export default ProjectSourceInfo;
