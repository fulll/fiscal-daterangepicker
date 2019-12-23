/* eslint-disable indent */
import moment from "moment";

const ERROR_PREVIOUS_FISCAL_YEAR_NA =
  "The previous fiscal year is not available.";
const ERROR_NEXT_FISCAL_YEAR_NA = "The next fiscal year is not available.";

const ERROR_PREVIOUS_QUARTER_NA = "The previous quarter is not available.";
const ERROR_NEXT_QUARTER_NA = "The next quarter is not available.";

const ERROR_PREVIOUS_WEEK_NA = "The previous week is not available.";
const ERROR_NEXT_WEEK_NA = "The next week is not available.";

const ERROR_PREVIOUS_MONTH_NA = "The previous month is not available.";
const ERROR_NEXT_MONTH_NA = "The next month is not available.";

let LOCALE = "en";

export const setLocale = locale => {
  LOCALE = locale;
};

export const mostRecentFiscalYear = fiscalYears =>
  fiscalYears &&
  fiscalYears.reduce((prev, current) =>
    moment(prev.dateEnd).isAfter(moment(current.dateEnd)) ? prev : current
  );

export function formatDate() {
  switch (LOCALE) {
    case "fr":
      return "DD/MM/YYYY";
    case "en":
      return "MM/DD/YYYY";
    default:
      return "DD/MM/YYYY";
  }
}

export function formatStateDate(dateStr) {
  return moment(dateStr).format(formatDate());
}

export const getIndexOfFiscalYearSelected = (
  fiscalYears,
  currentSelectYear
) => {
  const index = fiscalYears.findIndex(
    item => item && parseInt(item.code, 10) === currentSelectYear
  );
  return index;
};

const emptyFiscalYear = {
  code: "",
  dateStart: "",
  dateEnd: ""
};

const isBeforeDate = (date1, date2) => moment(date1).isBefore(moment(date2));
const isAfterDate = (date1, date2) => moment(date1).isAfter(moment(date2));
const isSameDate = (date1, date2) => moment(date1).isSame(moment(date2));

const updateQuarter = (quarterRange, newDate) => {
  // eslint-disable-next-line array-callback-return
  const dateRangeSelectedInQuarter = quarterRange.filter(
    item =>
      (isAfterDate(newDate.startDate, item.start) ||
        isSameDate(newDate.startDate, item.start)) &&
      (isBeforeDate(newDate.endDate, item.end) ||
        isSameDate(newDate.endDate, item.end))
  );

  const dateRangeSelectedStartBeforeQuarter = quarterRange.filter(
    item =>
      isBeforeDate(newDate.startDate, item.start) &&
      (isAfterDate(newDate.endDate, item.start) ||
        isSameDate(newDate.endDate, item.start)) &&
      (isBeforeDate(newDate.endDate, item.end) ||
        isSameDate(newDate.endDate, item.end))
  );

  const dateRangeSelectedEndAfterQuarter = quarterRange.filter(
    item =>
      (isAfterDate(newDate.startDate, item.start) ||
        isSameDate(newDate.startDate, item.start)) &&
      isAfterDate(newDate.endDate, item.start)
  );

  const quarterRangeSelected =
    (dateRangeSelectedInQuarter.length > 0 && dateRangeSelectedInQuarter) ||
    (dateRangeSelectedStartBeforeQuarter.length > 0 &&
      dateRangeSelectedStartBeforeQuarter) ||
    (dateRangeSelectedEndAfterQuarter.length > 0 &&
      dateRangeSelectedEndAfterQuarter) ||
    [];

  const startDate = moment(quarterRangeSelected[0].start);
  const endDate = moment(quarterRangeSelected[0].end);

  const text = `${startDate.format("MMM")} - ${endDate.format("MMM")}`;
  const description = endDate.format("YYYY");

  return quarterRangeSelected.length > 0
    ? {
        // eslint-disable-next-line indent
        text,
        description,
        start: moment(quarterRangeSelected[0].start),
        end: moment(quarterRangeSelected[0].end)
      }
    : {};
};

function updateYear(year) {
  const { dateStart, dateEnd, code } = year;
  const text = `${code}`;
  const description = `${moment(dateStart).format(formatDate())} - ${moment(
    dateEnd
  ).format(formatDate())}`;

  return {
    ...year,
    start: moment(dateStart),
    end: moment(dateEnd),
    text,
    description
  };
}

export const updateMonth = newDate => {
  const { endDate } = newDate;
  const text = endDate.format("MMMM");
  const description = endDate.format("YYYY");

  return {
    text,
    description,
    start: moment(endDate).startOf("month"),
    end: moment(endDate).endOf("month")
  };
};

function updateWeek(newDate) {
  const { endDate } = newDate;

  const text = `${endDate.isoWeek()}`;
  const startOfWeek = moment(endDate).startOf("isoWeek");
  const endOfWeek = moment(endDate).endOf("isoWeek");

  return {
    text,
    description: `${startOfWeek.format(formatDate())} - ${endOfWeek.format(
      formatDate()
    )}`,
    start: startOfWeek,
    end: endOfWeek
  };
}

const updateQuarterRange = fiscalYear => {
  const { dateStart, dateEnd } = fiscalYear;
  const quarterRange = [];

  let beginQuarter = moment(dateStart).startOf("month");
  do {
    const start = moment(beginQuarter)
      .startOf("month")
      .format("YYYY-MM-DD");
    const end = moment(start)
      .add(3, "months")
      .subtract(1, "days")
      .format("YYYY-MM-DD");

    quarterRange.push({
      start,
      end
    });

    beginQuarter = moment(end)
      .add(1, "days")
      .format("YYYY-MM-DD");
  } while (moment(beginQuarter).isBefore(moment(dateEnd)));

  return quarterRange;
};

export function initDateRange(fiscalYears, maxDate) {
  const fiscalYear = fiscalYears.length > 0 ? fiscalYears[0] : emptyFiscalYear;

  const year = fiscalYear ? updateYear(fiscalYear) : {};

  const startDate = moment(year.dateStart);
  let endDate = moment(year.dateEnd);

  if (endDate.isAfter(maxDate)) {
    endDate = maxDate;
  }

  const quarterRange = updateQuarterRange(year);

  const newDate = {
    startDate,
    endDate
  };

  return {
    year: updateYear(year),
    quarter: updateQuarter(quarterRange, newDate),
    month: updateMonth(newDate),
    week: updateWeek(newDate),
    quarterRange
  };
}

export function updateYearPicker(
  state,
  way,
  currentIndexFiscalYear,
  fiscalYears,
  fullPeriod
) {
  let newIndex = currentIndexFiscalYear;
  if (way) {
    newIndex += way === "left" ? 1 : -1;
  }

  if (newIndex < 0 || newIndex >= fiscalYears.length) {
    throw new Error(
      way === "left" ? ERROR_PREVIOUS_FISCAL_YEAR_NA : ERROR_NEXT_FISCAL_YEAR_NA
    );
  }

  const year = fiscalYears[newIndex];
  const startDate = moment(year.dateStart);
  let endDate = moment(year.dateEnd);

  const { maxDate } = fullPeriod;

  if (endDate.isAfter(maxDate)) {
    endDate = maxDate;
  }

  const quarterRange = updateQuarterRange(year);

  const newDate = {
    startDate,
    endDate
  };

  const newState = {
    ...state,

    selectedDate: {
      year: updateYear(year),
      quarter: updateQuarter(quarterRange, newDate),
      month: updateMonth(newDate),
      week: updateWeek(newDate),
      quarterRange
    },
    ...newDate
  };

  return newState;
}

export function fiscalYearForDate(fiscalYears, date) {
  return fiscalYears.find(item => {
    const { dateStart, dateEnd } = item;
    return date.isBetween(moment(dateStart), moment(dateEnd), "months", "[]");
  });
}

export const updateMonthPicker = (
  state,
  way,
  fiscalYears,
  currentMonthSelected,
  fullPeriod
) => {
  const { maxDate } = fullPeriod;

  let newMonth = moment(currentMonthSelected.start);

  if (way === "left") {
    newMonth = newMonth.subtract(1, "months");
  } else if (way === "right") {
    newMonth = newMonth.add(1, "months");
  }

  if (newMonth.isSameOrAfter(maxDate)) {
    throw new Error(
      way === "left" ? ERROR_PREVIOUS_MONTH_NA : ERROR_NEXT_MONTH_NA
    );
  }

  const startDate = moment(newMonth).startOf("month");
  const endDate = moment(newMonth).endOf("month");

  const year = fiscalYearForDate(fiscalYears, startDate);

  if (!year) {
    throw new Error(
      way === "left" ? ERROR_PREVIOUS_MONTH_NA : ERROR_NEXT_MONTH_NA
    );
  }

  const quarterRange = updateQuarterRange(year);

  const newDate = {
    startDate,
    endDate
  };

  return {
    ...state,

    selectedDate: {
      ...state.selectedDate,
      year: updateYear(year),
      quarter: updateQuarter(quarterRange, newDate),
      month: updateMonth(newDate),
      week: updateWeek(newDate),
      quarterRange
    },
    ...newDate
  };
};

const updateWeekPicker = (state, way, fiscalYears, week, fullPeriod) => {
  const { minDate, maxDate } = fullPeriod;

  let newWeek = moment(week.start);

  if (way === "left") {
    newWeek = newWeek.subtract(1, "weeks");
  } else if (way === "right") {
    newWeek = newWeek.add(1, "weeks");
  }

  const startOfWeek = moment(newWeek).startOf("isoWeek");
  const endOfWeek = moment(newWeek).endOf("isoWeek");

  let startDate = startOfWeek;
  let endDate = endOfWeek;

  const year = fiscalYearForDate(fiscalYears, startDate);

  if (startDate.isBefore(minDate)) {
    startDate = moment(minDate);
  } else if (endDate.isAfter(maxDate)) {
    endDate = moment(maxDate);
  }

  const newDate = {
    startDate,
    endDate
  };

  if (!year) {
    throw new Error(
      way === "left" ? ERROR_PREVIOUS_WEEK_NA : ERROR_NEXT_WEEK_NA
    );
  }

  const quarterRange = updateQuarterRange(year);

  return {
    ...state,
    selectedDate: {
      ...state.selectedDate,
      quarter: updateQuarter(quarterRange, newDate),
      month: updateMonth(newDate),
      week: updateWeek(newDate)
    },
    ...newDate
  };
};

const currentQuarterBasedOnQuarterRange = (quarterRange, quarterSelected) =>
  quarterRange.findIndex(
    item =>
      isSameDate(quarterSelected.start, item.start) ||
      (isAfterDate(quarterSelected.start, item.start) &&
        isSameDate(quarterSelected.end, item.end)) ||
      isBeforeDate(quarterSelected.end, item.end)
  );

function selectPreviousQuarter(currentQuarterRange, fiscalYears) {
  const quarter = currentQuarterRange[0];
  const { start } = quarter;
  let date = moment(start, "YYYY-MM-DD");
  date = date.subtract(1, "days");

  const fiscalYear = fiscalYearForDate(fiscalYears, date);
  if (!fiscalYear) {
    return [];
  }
  return [updateQuarterRange(fiscalYear), fiscalYear];
}

function selectNextQuarter(currentQuarterRange, fiscalYears) {
  const quarter = currentQuarterRange[currentQuarterRange.length - 1];
  const { end } = quarter;
  const newDate = moment(end).add(1, "days");
  const fiscalYear = fiscalYearForDate(fiscalYears, newDate);
  if (!fiscalYear) {
    return [];
  }
  return [updateQuarterRange(fiscalYear), fiscalYear];
}

const updateQuarterPicker = (
  state,
  way,
  fiscalYears,
  currentFiscalYear,
  currentQuarterSelected,
  fullPeriod
) => {
  const { selectedDate } = state;

  let { quarterRange } = selectedDate;

  const { minDate, maxDate } = fullPeriod;

  const indexQuarterInQuarterRange = currentQuarterBasedOnQuarterRange(
    quarterRange,
    currentQuarterSelected
  );

  let newIndex = indexQuarterInQuarterRange;

  if (way) {
    newIndex += way === "left" ? -1 : 1;
  }

  let year = currentFiscalYear;
  if (newIndex < 0) {
    const [newRange, newYear] = selectPreviousQuarter(
      quarterRange,
      fiscalYears
    );
    quarterRange = newRange;
    year = newYear;
    newIndex = quarterRange ? quarterRange.length - 1 : -1;
  } else if (newIndex >= quarterRange.length) {
    const [newRange, newYear] = selectNextQuarter(quarterRange, fiscalYears);
    quarterRange = newRange;
    year = newYear;
    newIndex = quarterRange ? 0 : -1;
  }

  if (!quarterRange || newIndex < 0 || newIndex >= quarterRange.length) {
    throw new Error(
      way === "left" ? ERROR_PREVIOUS_QUARTER_NA : ERROR_NEXT_QUARTER_NA
    );
  }

  const newQuarter = quarterRange[newIndex];

  const { start, end } = newQuarter;
  let startDate = moment(start);
  let endDate = moment(end);

  if (endDate.isAfter(maxDate)) {
    endDate = maxDate;
  }

  if (startDate.isBefore(minDate)) {
    startDate = minDate;
  }

  const newDate = {
    startDate,
    endDate
  };

  return {
    ...state,
    selectedDate: {
      ...state.selectedDate,
      year: updateYear(year),
      quarter: updateQuarter(quarterRange, newDate),
      month: updateMonth(newDate),
      week: updateWeek(newDate),
      quarterRange
    },
    ...newDate
  };
};

// eslint-disable-next-line object-curly-newline
export const updateDatePickerInput = ({
  fiscalYears,
  state,
  type,
  way,
  fullPeriod
}) => {
  const {
    // eslint-disable-next-line object-curly-newline
    selectedDate: { year, quarter, month, week }
  } = state;

  const currentIndexFiscalYear = getIndexOfFiscalYearSelected(
    fiscalYears,
    parseInt(year.text, 10)
  );
  if (type === "year") {
    return updateYearPicker(
      state,
      way,
      currentIndexFiscalYear,
      fiscalYears,
      fullPeriod
    );
  }
  if (type === "month") {
    return updateMonthPicker(state, way, fiscalYears, month, fullPeriod);
  }
  if (type === "quarter") {
    return updateQuarterPicker(
      state,
      way,
      fiscalYears,
      fiscalYears[currentIndexFiscalYear],
      quarter,
      fullPeriod
    );
  }
  if (type === "week") {
    return updateWeekPicker(state, way, fiscalYears, week, fullPeriod);
  }

  return state;
};

export function buildPresets(
  presetsArray,
  selectedDate,
  startDate,
  endDate,
  focusedDateType,
  onClickAction
) {
  return presetsArray.map(preset => {
    const { type, label } = preset;
    const focused = focusedDateType === type;

    let dateInfo;
    if (type === "custom") {
      dateInfo = {
        text: `${formatStateDate(startDate)} - ${formatStateDate(endDate)}`
      };
    } else {
      dateInfo = selectedDate[type];
    }
    const action = () => onClickAction(preset);
    let previous;
    let next;

    if (type !== "custom") {
      previous = () => onClickAction(preset, "left");
      next = () => onClickAction(preset, "right");
    }

    return {
      ...preset,
      action,
      previous,
      next,
      label,
      value: dateInfo.text,
      description: dateInfo.description,
      focused
    };
  });
}
