import { connectDB } from "@/lib/Mongoose";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";

// GET: Lấy danh sách tất cả đơn hàng
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.product");
    return NextResponse.json(orders);
  } catch (err) {
    console.error("❌ Error in GET /api/orders:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Tạo đơn hàng mới
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("📦 API Received Order Body:", body);

    const newOrder = await Order.create({
      ...body,
      createdAt: new Date(),
      paid: false,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("❌ Error in POST /api/orders:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
