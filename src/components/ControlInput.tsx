import { ActionIcon } from '@ant-design/pro-editor';
import { ConfigProvider, InputRef, Space } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { Input, InputProps } from './Input';

export interface ControlInputProps extends Omit<InputProps, 'onChange' | 'value' | 'onAbort'> {
  onChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onValueChanging?: (value: string) => void;
  value?: string;
}

export const ControlInput = memo<ControlInputProps>(
  ({ value, onChange, onValueChanging, onChangeEnd, ...props }) => {
    const [input, setInput] = useState<string>(value || '');
    const inputRef = useRef<InputRef>(null);
    const isChineseInput = useRef(false);
    const isFocusing = useRef(false);

    const updateValue = useCallback(() => {
      onChange?.(input);
    }, [input]);

    useEffect(() => {
      if (typeof value !== 'undefined') setInput(value);
    }, [value]);

    return (
      <Input
        ref={inputRef}
        {...props}
        onBlur={() => {
          isFocusing.current = false;
          onChangeEnd?.(input);
        }}
        onChange={(e) => {
          setInput(e.target.value);
          onValueChanging?.(e.target.value);
        }}
        onCompositionEnd={() => {
          isChineseInput.current = false;
        }}
        onCompositionStart={() => {
          isChineseInput.current = true;
        }}
        onFocus={() => {
          isFocusing.current = true;
        }}
        onPressEnter={(e) => {
          if (!e.shiftKey && !isChineseInput.current) {
            e.preventDefault();
            updateValue();
            isFocusing.current = false;
            onChangeEnd?.(input);
          }
        }}
        suffix={
          value === input ? (
            <span />
          ) : (
            <ConfigProvider theme={{ token: { fontSize: 14 } }}>
              <Space size={2}>
                <ActionIcon
                  icon={<RotateCcw />}
                  onClick={() => {
                    setInput(value as string);
                  }}
                  // size="small"
                  title="Reset"
                />
                <ActionIcon
                  icon={<Save />}
                  onClick={updateValue}
                  // size="small"
                  title="✅ Save"
                />
              </Space>
            </ConfigProvider>
          )
        }
        value={input}
      />
    );
  },
);
