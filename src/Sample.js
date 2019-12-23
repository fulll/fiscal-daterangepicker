import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import DateRangePickerContext from "./Datepicker/DateRangePickerContext";

function Sample() {
  const { start, end } = useContext(DateRangePickerContext);

  const dateStart = moment.utc(start);
  const dateEnd = moment.utc(end);

  const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 20px;
    div {
      margin: 10px 10px;
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
    }
  `;

  return (
    <Container>
      <div>
        <b>Start:</b> {dateStart.toLocaleString()}
      </div>
      <div>
        <b>End:</b> {dateEnd.toLocaleString()}
      </div>
    </Container>
  );
}

export default Sample;
