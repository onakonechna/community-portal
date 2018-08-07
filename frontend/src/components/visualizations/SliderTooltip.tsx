import * as React from 'react';
import { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';

const SliderTooltip = (props: any) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export default SliderTooltip;
