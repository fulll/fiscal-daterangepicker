import React from "react";
import styled from "styled-components";
import { string, bool, func } from "prop-types";
import Icon from "@material/react-material-icon";

const Container = styled.div`
  cursor: pointer;
  display: flex;
  color: ${({ focused }) => (focused ? "var(--mdc-theme-primary)" : "#ccc")};
`;

function DateRangeSelectorButton(props) {
  const { icon, focused, onClick } = props;

  return (
    <Container
      focused={focused}
      unselectable="on"
      className="no-user-select"
      onClick={() => onClick()}
    >
      <Icon icon={icon} />
    </Container>
  );
}

DateRangeSelectorButton.propTypes = {
  icon: string.isRequired,
  focused: bool,
  onClick: func
};

DateRangeSelectorButton.defaultProps = {
  focused: false,
  onClick: () => {}
};

export default DateRangeSelectorButton;
