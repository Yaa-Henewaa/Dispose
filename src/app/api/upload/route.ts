import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "dispose-products",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error("Upload failed"));
                return;
              }
              resolve({ secure_url: result.secure_url });
            },
          )
          .end(buffer);
      },
    );

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json(
      { error: "Cloudinary upload failed" },
      { status: 500 },
    );
  }
}
