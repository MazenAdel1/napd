import type { DataWrapper, Report, User } from "@/types";
import type { Slot } from "../timeSlots";

export type Appointment = {
  id: string;
  user: User;
  userId: User["id"];
  timeSlot: Slot;
  timeSlotId: Slot["id"];
  status: "PENDING" | "CONFIRMED";
  report: Report;
};

export type AppointmentCardProps = {
  appointment: Appointment;
};

export type AppointmentsListProps = DataWrapper & {
  header?: React.ReactNode;
  userId?: string;
  isAdmin?: boolean;
  renderAppointment: (appointment: Appointment) => React.ReactNode;
  link: string;
};

export type AppointmentActionProps = {
  emitEvent: string;
  appointmentId: Appointment["id"];
  setIsSubmitting: (value: boolean) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
};

export type AppointmentCardBaseProps = {
  appointment: Appointment;
  actions?: React.ReactNode;
};
