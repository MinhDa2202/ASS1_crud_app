// src/app/api/auth/login/route.ts
import { connectDB } from '@/lib/Mongoose';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();

  const user = await User.findOne({ username });
  if (!user) return NextResponse.json({ message: 'Không tồn tại user' }, { status: 404 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ message: 'Sai mật khẩu' }, { status: 401 });

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });

  const res = NextResponse.json({ message: 'Đăng nhập thành công' });
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 3600 });

  return res;
}
