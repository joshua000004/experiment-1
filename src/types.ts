export interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  hire_date: string;
  phone: string;
  status: string;
}

export interface User {
  id: number;
  username: string;
}

export type Department = 'Cardiology' | 'Neurology' | 'Pediatrics' | 'Surgery' | 'Emergency' | 'Administration' | 'Radiology' | 'Nursing';
export type Role = 'Doctor' | 'Nurse' | 'Technician' | 'Administrator' | 'Surgeon' | 'Receptionist';

export const DEPARTMENTS: Department[] = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Surgery', 'Emergency', 'Administration', 'Radiology', 'Nursing'
];

export const ROLES: Role[] = [
  'Doctor', 'Nurse', 'Technician', 'Administrator', 'Surgeon', 'Receptionist'
];
