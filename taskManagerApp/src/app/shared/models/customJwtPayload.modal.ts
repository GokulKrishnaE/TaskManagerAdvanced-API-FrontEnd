import { jwtDecode,JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
    role?: string;
    username?: string;
    fullName?: string;
}
  