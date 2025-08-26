import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import supabase from "../../../utils/supabase/client";

type Workplace = {
  id: number;
  name: string;
  hourly_rate: number;
  color: string;
};

function CalendarBody() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

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

  function isToday(date: Date) {
    if (
      date.getFullYear() == currentYear &&
      date.getMonth() + 1 == currentMonth &&
      date.getDate() == currentDate
    ) {
      return true;
    }
    return false;
  }

  const [workplaceData, setWorkplaceData] = useState<Workplace[]>([]);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<string>("");

  useEffect(() => {
    const fetchWorkplaceDate = async () => {
      const { data } = await supabase.from("workplace").select();

      if (data) {
        console.log(data);
        setWorkplaceData(data);
      }
    };

    fetchWorkplaceDate();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkplaceId(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const timeRaw = formData.get("time");

    const time = Number(timeRaw);

    if (!Number.isFinite(time)) {
      console.error("Invalid form values", { time });
      return;
    }

    const { error } = await supabase
      .from("working_time")
      .insert([
        { workplace_id: selectedWorkplaceId, time, date: selectedDate },
      ]);

    if (error) {
      console.error("Failed to insert workplace", error);
      return;
    }

    form.reset();
    setOpen(false);
  };

  return (
    <>
      <tbody>
        {weeks.map((week, weekIdx) => {
          return (
            <tr key={`week-${weekIdx}`}>
              {week.map((date) => {
                return (
                  <td
                    key={`date-${date.toISOString()}`}
                    className="table-date"
                    style={{
                      opacity: date.getMonth() + 1 == currentMonth ? 1 : 0.5,
                      color: isToday(date) ? "hotpink" : "white",
                      fontWeight: isToday(date) ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleOpen();
                      setSelectedDate(date);
                    }}
                  >
                    {date.getDate()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>일한 시간 등록</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedDate.getFullYear()}.{selectedDate.getMonth() + 1}.
            {selectedDate.getDate()}
          </DialogContentText>
          <br />
          <form onSubmit={handleSubmit} id="subscription-form">
            <FormControl fullWidth>
              <InputLabel id="workplace-select-label">직장 정보</InputLabel>
              <Select
                labelId="workplace-select-label"
                id="workplace-select"
                label="Workplace"
                value={selectedWorkplaceId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {workplaceData &&
                  workplaceData.map((data) => (
                    <MenuItem key={data.id} value={data.id.toString()}>
                      {data.name}: {data.hourly_rate}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              required
              id="time"
              name="time"
              label="일한 시간(분)"
              fullWidth
              placeholder="ex) 120"
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CalendarBody;
