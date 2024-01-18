"use server";

import fs from "fs";
import { text } from "stream/consumers";

export default async function readFileContent(filePath: any) {
  let content = "";
  try {
    const readStream = fs.createReadStream(filePath, {
      start: 0,
      end: 1048575, // 1 MB
    });

    content = await text(readStream);
  } catch (err) {
    console.error("Error reading file:", err);
    return "Error reading file";
  }
  return content;
}
