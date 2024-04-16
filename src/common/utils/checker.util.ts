import mongoose from 'mongoose';

export function isEmail(email: string): boolean {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
}

export function isPhoneNumber(phoneNumber: string) {
  return /((^(\+84|84|0){1})(3|5|7|8|9))+([0-9]{8})$/.test(phoneNumber);
}

export function isObjectId(value: string) {
  return mongoose.isValidObjectId(value);
}

export const isCode = (value: string) => /^\d{6}$/.test(value);
