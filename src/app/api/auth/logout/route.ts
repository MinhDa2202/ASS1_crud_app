import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Đăng xuất thành công' });
  res.cookies.set('token', '', { maxAge: 0, path: '/' });
  return res;
}
