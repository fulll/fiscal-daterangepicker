import React from "react";
import styled from "styled-components";
import Button from "@material/react-button";
import { arrayOf, shape, string, func } from "prop-types";
import DateRangePreset from "./DateRangePreset";

export const PresetContainer = styled.div`
  background-color: #fff;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const DateRangeContainer = styled.div`
  display: flex;
  padding: 20px 0 0 0;
  width: 200px;
  font-size: 14px;
  justify-content: space-around;
  > div:nth-child(2) {
    ${({ focused }) => focused && "background: #12A1E0;color: #FFF;"};
  }
  > div.button {
    border: 1px solid #eee;
    border-radius: 3px;
    align-self: center;
    cursor: pointer;
    padding: 5px 7px;
    i {
      vertical-align: middle;
      opacity: 0.5;
    }
  }
`;

const Apply = styled(Button)`
  margin-top: 15px;
  width: 80%;
`;

const Error = styled.div`
  font-size: 0.75em;
  color: red;
  height: 20px;
`;

function DateRangePresetContainer(props) {
  const { presets, error, apply } = props;

  return (
    <PresetContainer>
      {error && <Error>{error}</Error>}
      {presets.map(preset => (
        <DateRangePreset key={preset.type} preset={preset} />
      ))}
      <Apply onClick={() => apply()}>Apply</Apply>
    </PresetContainer>
  );
}

DateRangePresetContainer.propTypes = {
  presets: arrayOf(shape({})),
  error: string,
  apply: func
};

DateRangePresetContainer.defaultProps = {
  presets: [],
  error: undefined,
  apply: () => {}
};

export default DateRangePresetContainer;
