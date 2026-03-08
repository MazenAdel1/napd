export {
  cancelAppointment,
  confirmAppointment,
  getAppointmentBySlotId,
  getClientsAppointments,
} from "./appointments.controller";

export {
  createNotification,
  getAllNotifications,
  markNotificationsAsRead,
} from "./notifications.controller";

export {
  addReport,
  deleteReport,
  getReports,
  updateReport,
} from "./reports.controller";

export {
  addMultipleTimeSlots,
  addTimeSlot,
  getTimeSlotsByDate,
  bookTimeSlot,
  deleteTimeSlot,
} from "./timeSlots.controller";

export {
  deleteUser,
  getAllClients,
  getUserByToken,
  login,
  logout,
  registerAdmin,
  updateUser,
  httpUpdateUser,
  registerClient,
} from "./users.controller";
