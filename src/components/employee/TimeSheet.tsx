import {
  duration,
  formatDay,
  formatTime,
  type Timesheet,
} from "@/lib/employee/dashboard";

export default function TimeSheet({
  timesheet,
  timeZone,
}: {
  timesheet: Timesheet;
  timeZone: string;
}) {
  const shifts = [...timesheet.shifts].sort((a, b) =>
    a.clockIn.localeCompare(b.clockIn),
  );

  return (
    <div>
      <div className="my-6 flex flex-col gap-1 border-y border-border py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <p className="text-sm text-muted">Completed hours this week</p>

        <p className="font-heading text-2xl font-bold text-ink tabular-nums">
          {duration(timesheet.totalSeconds)}
        </p>
      </div>

      {shifts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          No shifts recorded for this week.
        </p>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {shifts.map((shift) => (
              <article
                key={shift.id}
                className="rounded-xl border border-border bg-cream/50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[1.4px] text-muted">
                      Shift date
                    </p>

                    <p className="mt-1 font-semibold text-ink">
                      {formatDay(shift.clockIn, timeZone)}
                    </p>
                  </div>

                  {shift.clockOut ? (
                    <p className="font-heading font-bold text-ink tabular-nums">
                      {duration(
                        (Date.parse(shift.clockOut) -
                          Date.parse(shift.clockIn)) /
                          1000,
                      )}
                    </p>
                  ) : (
                    <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                      In progress
                    </span>
                  )}
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <dt className="text-xs text-muted">Clock in</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {formatTime(shift.clockIn, timeZone)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted">Clock out</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {shift.clockOut
                        ? formatTime(shift.clockOut, timeZone)
                        : "—"}
                    </dd>

                    {shift.clockOut &&
                      formatDay(shift.clockOut, timeZone) !==
                        formatDay(shift.clockIn, timeZone) && (
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDay(shift.clockOut, timeZone)}
                        </p>
                      )}
                  </div>
                </dl>
              </article>
            ))}
          </div>

          {/* Tablet + Desktop */}
          <div className="hidden sm:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Your shifts for the week starting {timesheet.weekStart}. Dates
                use {timeZone}.
              </caption>

              <thead className="border-b border-border text-muted">
                <tr>
                  {["Shift date", "Clock in", "Clock out", "Duration"].map(
                    (label) => (
                      <th
                        key={label}
                        scope="col"
                        className="px-3 py-3 text-xs font-bold uppercase tracking-wide"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {shifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="px-3 py-4 font-semibold text-ink"
                    >
                      {formatDay(shift.clockIn, timeZone)}
                    </th>

                    <td className="px-3 py-4 text-text">
                      {formatTime(shift.clockIn, timeZone)}
                    </td>

                    <td className="px-3 py-4 text-text">
                      {shift.clockOut ? (
                        <span>
                          {formatTime(shift.clockOut, timeZone)}

                          {formatDay(shift.clockOut, timeZone) !==
                            formatDay(shift.clockIn, timeZone) && (
                            <small className="block text-muted">
                              {formatDay(shift.clockOut, timeZone)}
                            </small>
                          )}
                        </span>
                      ) : (
                        <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                          In progress
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-4 font-semibold text-ink tabular-nums">
                      {shift.clockOut
                        ? duration(
                            (Date.parse(shift.clockOut) -
                              Date.parse(shift.clockIn)) /
                              1000,
                          )
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-5 text-xs leading-5 text-muted">
        Open shifts are excluded from the total. Each shift belongs to the date
        it started.
      </p>
    </div>
  );
}