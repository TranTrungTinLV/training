export const genRandomChar = () => {
  const chars =
    '!@#$%^&*_+~`:?/-=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

export const genCode = (length: number) =>
  '0'
    .repeat(length)
    .split('')
    .map(() => Math.floor(Math.random() * 10))
    .join('');
