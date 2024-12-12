import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  //searching query by this:
  const query = request.nextUrl.searchParams.get("query");

  const uri =
    "mongodb+srv://inventorysystem:system1234@cluster0.usjmz.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("medical");
    const inventory = database.collection("inventory");
    // Query for a movie that has the title 'Back to the Future'
    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [{ slug: { $regex: query, $options: "i" } }],
          },
        },
      ])
      .toArray();
    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }
    return NextResponse.json({ success: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
