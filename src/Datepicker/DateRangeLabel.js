import React from "react";
import styled from "styled-components";
import { string, bool, func } from "prop-types";

const Container = styled.div`
  ${({ active, focused }) => `
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 3px;
    margin: 5px;

    opacity: ${active ? 1 : 0.5};
    pointer-events: ${active ? 1 : 0.5};
    cursor: ${active ? "pointer" : "normal"};
    background-color: ${focused ? "var(--mdc-theme-primary)" : "transparent"};
    color: ${focused ? "white" : "black"};
    outline: ${focused ? "none" : "1px solid $eee"};
  `};
`;

const Label = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 1rem;
`;

const Description = styled.div`
  ${({ focused }) => `
  font-size: 0.7rem;
  color: ${focused ? "white" : "#aaa"};
  `};
`;

function DateRangeLabel(props) {
  const {
    label,
    active,
    value,
    focused,
    className,
    onClick,
    description
  } = props;

  const elevation = focused ? "elevation-2" : "";

  return (
    <Container
      className={`${className} ${elevation}`}
      role="button"
      active={active}
      focused={focused}
      onClick={onClick}
    >
      <Label> {label}</Label>
      <Value> {value} </Value>
      {description && (
        <Description focused={focused}> {description} </Description>
      )}
    </Container>
  );
}

DateRangeLabel.propTypes = {
  label: string,
  description: string,
  className: string,
  active: bool.isRequired,
  value: string.isRequired,
  focused: bool,
  onClick: func
};

DateRangeLabel.defaultProps = {
  label: "",
  description: undefined,
  className: "",
  focused: false,
  onClick: () => true
};

export default DateRangeLabel;
