import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import FiscalYearDateTimePicker from "./Datepicker";
import DateTimepickerContext from "./Datepicker/DateRangePickerContext";
import { FISCAL_YEARS, PRESETS } from "./contants";

import "react-dates/lib/css/_datepicker.css";
import "@material/react-text-field/dist/text-field.css";
import "@material/react-button/dist/button.css";
import "./styles.css";
import "./Datepicker/elevation.scss";

function App() {
  const [contextValue, setContextValue] = useState({
    start: "2017-01-01",
    end: "2017-12-31",
    datetype: "year"
  });

  useEffect(() => {
    setContextValue(oldState => {
      return {
        ...oldState,
        updateValues: setContextValue
      };
    });
  }, []);

  const minDate = moment.utc().subtract(8, "years");
  const maxDate = moment.utc().endOf("year");

  return (
    <div className="App">
      <DateTimepickerContext.Provider value={contextValue}>
        <FiscalYearDateTimePicker
          startDateLabel="start date"
          endDateLabel="end date"
          minDate={minDate}
          maxDate={maxDate}
          fiscalYears={FISCAL_YEARS}
          presets={PRESETS}
        />
      </DateTimepickerContext.Provider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
