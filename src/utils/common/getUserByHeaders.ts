import { headers } from 'next/headers';

export const getUserFromHeaders = () => {
  const headersList = headers();
  const user = headersList.get('x-user');
  return user;
};
