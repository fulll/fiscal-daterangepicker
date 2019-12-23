import "react-dates/initialize";
import React, { useContext, useState, useEffect } from "react";
import { DateRangePicker } from "react-dates";
import { shape, arrayOf, string } from "prop-types";
import moment from "moment";

import DateRangePickerContext from "./DateRangePickerContext";

import DateRangePickerContainer from "./DateRangePickerContainer";
import DateRangePresetContainer from "./DateRangePresetContainer";
import {
  formatDate,
  updateDatePickerInput,
  initDateRange,
  setLocale,
  buildPresets
} from "./computeDatePresets";

function Display(props) {
  const {
    minDate,
    maxDate,
    fiscalYears,
    startDateLabel,
    endDateLabel,
    locale,
    presets
  } = props;

  setLocale(locale);

  const { start, end, datetype, updateValues, resetContext } = useContext(
    DateRangePickerContext
  );

  const selectedDate = initDateRange(fiscalYears, maxDate);
  const { year: yearDate } = selectedDate;

  const startDate = start ? moment(start) : yearDate.start;
  const endDate = end ? moment(end) : yearDate.end;

  const [state, setState] = useState({
    startDate,
    endDate,
    minDate,
    maxDate,
    focusedDateType: datetype || "year",
    toggleCalendar: false,
    selectedDate,
    focusedInput: undefined,
    restoreInput: undefined
  });

  const updateValuesForState = state => {
    const { startDate, endDate, focusedDateType } = state;
    // const { start, end } = selectedDate[focusedDateType]
    if (startDate && endDate && focusedDateType) {
      updateValues(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        focusedDateType
      );
    }
  };

  const updateState = (values, updateValues = false) => {
    setState(old => {
      const newState = { ...old, ...values };

      if (updateValues) {
        setTimeout(() => updateValuesForState(newState), 0);
      }

      return newState;
    });
  };

  useEffect(() => {
    if (!datetype) {
      updateValuesForState(state);
    }

    return () => resetContext();
  }, []);

  const applySelectedDates = () => {
    updateState({ focusedInput: null }, true);
  };

  const onDatesChange = dates => {
    updateState(dates);
  };

  const onClose = () => {
    updateState({ focusedInput: null }, true);
  };

  const refreshVisibleCalendar = newState => {
    const { focusedInput } = state;
    updateState({
      ...newState,
      focusedInput: null,
      restoreInput: focusedInput
    });
  };

  useEffect(() => {
    const { restoreInput } = state;
    if (restoreInput) {
      updateState({ restoreInput: undefined, focusedInput: restoreInput });
    }
  }, [state.restoreInput]);

  const changeDatePicker = (type, way) => {
    const { fiscalYears } = props;

    const { minDate, maxDate } = state;
    const fullPeriod = {
      minDate,
      maxDate
    };

    return updateDatePickerInput({
      fiscalYears,
      state: { ...state },
      type,
      way,
      fullPeriod
    });
  };

  const renderPresets = presets => {
    const onClick = (preset, way) => {
      const { type } = preset;
      const toggleCalendar = type === "custom";
      try {
        const newState = {
          ...changeDatePicker(type, way),
          error: undefined,
          toggleCalendar,
          focusedDateType: type
        };

        if (type === "custom") {
          refreshVisibleCalendar(newState);
        } else {
          updateState(newState);
        }
      } catch (err) {
        updateState({
          toggleCalendar,
          focusedDateType: type,
          error: err.message
        });
      }
    };

    const builtPresets = buildPresets(
      presets,
      state.selectedDate,
      state.startDate,
      state.endDate,
      state.focusedDateType,
      onClick
    );

    return (
      <DateRangePresetContainer
        error={state.error}
        presets={builtPresets}
        apply={() => applySelectedDates()}
      />
    );
  };

  return (
    <DateRangePickerContainer
      toggleCalendar={state.toggleCalendar}
      onClickOutside={onClose}
      open={!!state.focusedInput}
    >
      <DateRangePicker
        startDateId="startDate"
        endDateId="endDate"
        customArrowIcon="→"
        startDatePlaceholderText={startDateLabel}
        endDatePlaceholderText={endDateLabel}
        isDayBlocked={() => false}
        isDayHighlighted={() => false}
        isOutsideRange={date =>
          date.isBefore(state.minDate) || date.isAfter(state.maxDate)
        }
        startDate={state.startDate}
        endDate={state.endDate}
        initialVisibleMonth={() => {
          const { startDate } = state;
          return startDate;
        }}
        onDatesChange={onDatesChange}
        numberOfMonths={2}
        focusedInput={state.focusedInput}
        onFocusChange={focusedInput => {
          if (!focusedInput) return;
          updateState({ focusedInput });
        }}
        displayFormat={formatDate}
        renderCalendarInfo={() => renderPresets(presets)}
      />
    </DateRangePickerContainer>
  );
}

Display.defaultProps = {
  fiscalYears: [],
  startDateLabel: "start date",
  endDateLabel: "end date",
  locale: "en",
  presets: [],
  minDate: undefined,
  maxDate: undefined
};

Display.propTypes = {
  fiscalYears: arrayOf(shape({})),
  startDateLabel: string,
  endDateLabel: string,
  minDate: shape({}),
  maxDate: shape({}),
  locale: string,
  presets: arrayOf(
    shape({
      type: string,
      label: string
    })
  )
};

export default Display;
