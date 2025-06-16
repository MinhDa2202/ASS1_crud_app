import { connectDB } from '@/lib/Mongoose';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email đã được đăng ký.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi server.' }, { status: 500 });
  }
}
