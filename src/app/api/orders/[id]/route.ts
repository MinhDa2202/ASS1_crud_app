import { connectDB } from "@/lib/Mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Order.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Đã hủy đơn hàng" });
  } catch (error) {
    console.error("❌ Error in DELETE /api/orders/[id]:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
