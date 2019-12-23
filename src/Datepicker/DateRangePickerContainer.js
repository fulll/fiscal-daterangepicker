import React, { useEffect, useRef } from "react";
import { func, bool, node, oneOfType, arrayOf } from "prop-types";
import styled from "styled-components";

const DatePickerContainer = styled.div`
  box-sizing: border-box;
  .DateRangePickerInput {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .DateRangePickerInput input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .DateRangePickerInput > * {
    display: block;
    width: auto;
  }
  div[role="application"].DayPicker.DayPicker_1.DayPicker__horizontal {
    width: auto !important;
    .CalendarDay__selected_span,
    .CalendarDay__hovered_span {
      background-color: var(--mdc-theme-primary);
      color: white;
      border: none;
    }

    .CalendarDay__selected:active,
    .CalendarDay__selected:hover {
      background-color: var(--mdc-theme-secondary);
    }

    .CalendarDay__selected_start,
    .CalendarDay__selected_end {
      background-color: var(--mdc-theme-secondary);
      color: white;
      border: none;
      outline: 1px solid white;
    }
    > div {
      display: flex;
      width: auto !important;
      flex-direction: row-reverse;
    }
  }
  ${({ toggleCalendar }) =>
    !toggleCalendar &&
    `
    div[role="application"].DayPicker.DayPicker_1.DayPicker__horizontal {
      > div {
        > div:first-child {
        visibility: hidden;
        width: 0 !important;
        }
      }
    } 
   
  `};
`;

function DateRangePickerContainer(props) {
  const { toggleCalendar, children, open, onClickOutside } = props;
  const DatePickerContainerElement = useRef();

  useEffect(() => {
    const clickOutside = e => {
      if (!DatePickerContainerElement || !DatePickerContainerElement.current) {
        return;
      }

      const { current } = DatePickerContainerElement;
      if (!current.contains(e.target) && open) {
        onClickOutside();
      }
    };

    document.addEventListener("click", clickOutside, true);
    return () => {
      document.removeEventListener("click", clickOutside, true);
    };
  });

  return (
    <div ref={DatePickerContainerElement}>
      <DatePickerContainer toggleCalendar={toggleCalendar}>
        {children}
      </DatePickerContainer>
    </div>
  );
}

DateRangePickerContainer.propTypes = {
  onClickOutside: func,
  toggleCalendar: bool,
  open: bool.isRequired,
  children: oneOfType([node, arrayOf(node)])
};

DateRangePickerContainer.defaultProps = {
  onClickOutside: () => {},
  toggleCalendar: true,
  children: []
};

export default DateRangePickerContainer;
