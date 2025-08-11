function CalendarBody() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const firstDate = new Date(currentYear, currentMonth - 1, 1);
  const dayOfFirstDate = firstDate.getDay();

  const lastDate = new Date(currentYear, currentMonth, 0);
  const dayOfLastDate = lastDate.getDay();

  const firstDateOfCal = new Date(
    currentYear,
    currentMonth - 1,
    1 - dayOfFirstDate + 1
  );
  const lastDateOfCal = new Date(
    currentYear,
    currentMonth,
    dayOfLastDate == 0 ? 0 : 7 - dayOfLastDate
  );

  const dateInCal: Date[] = [];
  for (
    let i = firstDateOfCal;
    i <= lastDateOfCal;
    i = new Date(i.getFullYear(), i.getMonth(), i.getDate() + 1)
  ) {
    dateInCal.push(new Date(i));
  }

  const weeks: Date[][] = [];
  for (let i = 0; i <= dateInCal.length; i += 7) {
    weeks.push(dateInCal.slice(i, i + 7));
  }

  return (
    <tbody>
      {weeks.map((week) => {
        return (
          <tr>
            {week.map((date) => {
              return <td>{date.getDate()}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default CalendarBody;
