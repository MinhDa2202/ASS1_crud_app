import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/Mongoose';
import Order from '@/models/Order';

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  const id = context.params.id;

  await connectDB();

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return new Response(JSON.stringify({ message: 'Order not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Order deleted' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
