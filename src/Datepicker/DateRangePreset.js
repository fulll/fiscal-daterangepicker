import React from "react";
import { shape } from "prop-types";

import DateRangeContainer from "./DateRangeContainer";
import DateRangeSelectorButton from "./DateRangeSelectorButton";
import DateRangeLabel from "./DateRangeLabel";

function DateRangePreset(props) {
  const {
    preset: { label, description, value, focused, action, previous, next }
  } = props;

  return (
    <DateRangeContainer>
      {previous && (
        <DateRangeSelectorButton
          onClick={() => previous()}
          icon="chevron_left"
          focused={focused}
        />
      )}
      <DateRangeLabel
        role="button"
        label={label}
        value={`${value}`}
        description={description}
        onKeyDown={() => {}}
        onClick={() => action()}
        focused={focused}
        tabIndex="-1"
        active
      />
      {next && (
        <DateRangeSelectorButton
          onClick={() => next()}
          icon="chevron_right"
          focused={focused}
        />
      )}
    </DateRangeContainer>
  );
}

DateRangePreset.propTypes = {
  preset: shape({}).isRequired
};

export default DateRangePreset;
