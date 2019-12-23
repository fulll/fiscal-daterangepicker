import React from "react";
import styled from "styled-components";
import { oneOfType, arrayOf, node } from "prop-types";

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

function DateRangeContainer(props) {
  const { children } = props;

  return <Container>{children}</Container>;
}

DateRangeContainer.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired
};

export default DateRangeContainer;
