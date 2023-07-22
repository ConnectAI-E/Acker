import React, { RefObject, useEffect, useRef, useState } from 'react';
import { List } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { PromptItem } from '@/components/auto-textarea/InspirationProps';

interface PromptListProps {
  onClickItem: (value: string) => void;
  onChangeNextTab: () => void;
  data: PromptItem[];
  ifActive: boolean;
  errorMsg?: string;
}

function PromptList(props: PromptListProps) {
  const {
    onClickItem, data, errorMsg, ifActive, onChangeNextTab
  } = props;
  const [hoverIndex, setHi] = useState(-1);
  const i = useRef(0);

  const changeIndex = (offset: number) => {
    const currentIndex = i.current;
    let index = currentIndex + offset;
    if (index < 0) {
      index = data.length - 1;
    }
    if (index >= data.length) {
      index = 0;
    }

    i.current = index;
    setHi(index);
  };

  useEffect(() => {
    if (!ifActive) {
      return;
    }
    const keydownHandler = (event: any) => {
      const key = event.keyCode;
      switch (key) {
        case 38: // KeyCode.UP
          event.preventDefault();
          changeIndex(-1);
          break;
        case 40: // KeyCode.DOWN
          event.preventDefault();
          changeIndex(1);
          break;
          // key code left
        case 37:
          event.preventDefault();
          onChangeNextTab();
          break;
        case 39: // key code right
          event.preventDefault();
          onChangeNextTab();
          break;
        default:
          break;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        onClickItem(data[i.current]?.value?.trim());
      }
    };
    window.addEventListener('keydown', keydownHandler);
    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [ifActive]);
  const selectedRef = useRef(null) as RefObject<HTMLDivElement>;
  // Function to scroll the parent container to the selected item
  // Function to scroll to the selected item
  const scrollToSelected = () => {
    if (selectedRef.current) {
      setTimeout(() => {
        selectedRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Adding a slight delay (100ms) to ensure the item is available in the DOM
    }
  };
  useEffect(() => {
    scrollToSelected(); // Automatically scroll to the selected item whenever it changes
  }, [hoverIndex]);

  return (
    <div id="listContainer">
      <List
        dataSource={data}
        emptyContent={(
          <div
            className="h-full"
          >
            { errorMsg || 'No data' }
          </div>
        )}
        renderItem={(item, index) => (
          <List.Item
            className={classNames('cursor-pointer hover:bg-[var(--semi-color-fill-0)]', { '!bg-[var(--semi-color-fill-0)]': index === hoverIndex })}
            onClick={() => onClickItem(item?.value?.trim())}
          >
            <div
              ref={index === hoverIndex ? selectedRef : null}
              className="w-full text-overflow-l2"
            >
              { item?.label || item?.value || '' }
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

PromptList.defaultProps = { errorMsg: '' };
export default PromptList;
