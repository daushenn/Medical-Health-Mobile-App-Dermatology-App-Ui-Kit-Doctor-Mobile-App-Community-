import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Messages: undefined;
  Profile: undefined;
  Schedule: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Doctor: { doctorId: string };
  Booking: { doctorId: string; date?: string };
  AppointmentDetails: { appointmentId: string };
  CancelAppointment: { appointmentId: string };
};