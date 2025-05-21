export interface JwtResponse {
  token: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  degreeNumber?: string;
  specialization?: string;
}