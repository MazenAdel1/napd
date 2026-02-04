import type { Appointment } from "../appointments";

export type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  appointment: Appointment;
};

export type TimeSlotCardBaseProps = {
  slot: Slot;
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
  footer?: React.ReactNode;
};

export type TimeSlotCardProps = {
  slot: Slot;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};

export type TimeSlotsListProps = {
  date: Date;
  header?: React.ReactNode;
  renderSlot: (
    slot: Slot,
    setSlots: React.Dispatch<React.SetStateAction<Slot[]>>,
  ) => React.ReactNode;
};

export type TimeSlotsCalendarProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  header?: React.ReactNode;
};

export type Status = "choose_date" | "slots";

export type TimeSlotsProps = {
  date: Date;
  setStep: React.Dispatch<React.SetStateAction<Status>>;
};
