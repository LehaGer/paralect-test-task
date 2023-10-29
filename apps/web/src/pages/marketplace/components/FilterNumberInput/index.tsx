import React, { FC } from 'react';
import { NumberInput } from '@mantine/core';

interface IFilterNumberInput {
  state?: number,
  setState: (val: number | '') => void,
  minVal: number,
  maxVal?: number,
  icon: string | React.ReactElement,
  iconWidth?: number | string,
  className?: string;
}
const FilterNumberInput: FC<IFilterNumberInput> = ({
  state,
  setState,
  maxVal,
  minVal,
  icon,
  iconWidth,
  className,
}) => (
  <NumberInput
    value={state ?? ''}
    onChange={setState}
    icon={icon}
    iconWidth={iconWidth}
    min={minVal}
    max={maxVal}
    hideControls
    parser={(value) => {
      const valueWithoutCurrency = value.replace(/\$\s?|(,*)/g, '');
      const slicedValue = `${state}` === valueWithoutCurrency
        ? valueWithoutCurrency.slice(0, valueWithoutCurrency.length - 1)
        : valueWithoutCurrency;
      const valueWithoutSymbols = slicedValue.replace(/[a-zA-Z]/g, '');
      if (valueWithoutSymbols === '') setState('');

      return valueWithoutSymbols;
    }}
    formatter={(value) => (!Number.isNaN(parseFloat(value)) ? `${value}$` : '')}
    className={className}
  />
);

export default FilterNumberInput;
