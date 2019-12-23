export const PRESETS = [
  {
    type: "year",
    label: "fiscal year"
  },
  { type: "quarter", label: "quarter" },
  { type: "month", label: "month" },
  { type: "week", label: "week" },
  { type: "custom", label: "custom date" }
];

export const FISCAL_YEARS = [
  {
    code: "2017",
    dateStart: "2017-01-01",
    dateEnd: "2017-12-31",
    isClosed: false
  },
  {
    code: "2016",
    dateStart: "2016-01-01",
    dateEnd: "2016-12-31",
    isClosed: false
  },
  {
    code: "2015",
    dateStart: "2015-01-01",
    dateEnd: "2015-12-31",
    isClosed: true
  },
  {
    code: "2013 - 2014",
    dateStart: "2013-03-07",
    dateEnd: "2014-12-31",
    isClosed: true
  }
];
