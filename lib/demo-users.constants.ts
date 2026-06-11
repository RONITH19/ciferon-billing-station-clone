/** Default password for all demo accounts */
export const DEMO_PASSWORD = 'password';

export interface DemoLoginUser {
  email: string;
  name: string;
  role: 'Owner' | 'Manager' | 'Cashier' | 'Steward';
  mobile: string;
  designation: string;
}

/** Pre-seeded accounts for local development and demos */
export const DEMO_LOGIN_USERS: DemoLoginUser[] = [
  {
    email: 'admin@sobos.com',
    name: 'Admin User',
    role: 'Owner',
    mobile: '9112230001',
    designation: 'Owner',
  },
  {
    email: 'manager@sobos.com',
    name: 'Ravi Kumar',
    role: 'Manager',
    mobile: '9112230002',
    designation: 'Manager',
  },
  {
    email: 'cashier@sobos.com',
    name: 'Meera Joshi',
    role: 'Cashier',
    mobile: '9112230003',
    designation: 'Cashier',
  },
  {
    email: 'steward@sobos.com',
    name: 'Kiran Desai',
    role: 'Steward',
    mobile: '9112230005',
    designation: 'Steward',
  },
];
