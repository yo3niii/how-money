import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../../utils/supabase/client";

function WorkplaceCreateModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const hourlyRateRaw = formData.get("hourly_rate");
    const color = String(formData.get("color") || "").trim();

    const hourly_rate = Number(hourlyRateRaw);

    if (!name || !Number.isFinite(hourly_rate) || !color) {
      console.error("Invalid form values", { name, hourly_rate, color });
      return;
    }

    const { error } = await supabase
      .from("workplace")
      .insert([{ name, hourly_rate, color }]);

    if (error) {
      console.error("Failed to insert workplace", error);
      return;
    }

    form.reset();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>create WorkPlace</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>직장 정보 등록</DialogTitle>
        <DialogContent>
          <DialogContentText>
            '직장의 이름', '시급', '설정할 색상'의 정보를 등록해주세용
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              required
              id="workplace-name"
              name="name"
              label="직장 이름"
              fullWidth
              placeholder="ex) 여냥수학학원"
              variant="standard"
            />
            <TextField
              required
              id="hourly-rate"
              name="hourly_rate"
              label="시급"
              type="number"
              fullWidth
              placeholder="ex) 18000"
              variant="standard"
            />
            <TextField
              required
              id="color"
              name="color"
              type="color"
              label="색상"
              fullWidth
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

export default WorkplaceCreateModal;
