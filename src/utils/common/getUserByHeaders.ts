import { headers } from 'next/headers';

export const getUserFromHeaders = async () => {
  const headersList = await headers();
  const user = headersList.get('x-user');
  return user;
};
