import { connectDB } from "@/lib/Mongoose";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";

// GET: Lấy danh sách đơn hàng theo email
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const email = req.nextUrl.searchParams.get("email");
    const query = email ? { email } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.product");

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

// DELETE: Xoá đơn hàng theo orderId (truyền qua query)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error in DELETE /api/orders:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
