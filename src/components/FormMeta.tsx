"use client";

import { useEffect, useState } from "react";

export default function FormMeta() {
  const [ts, setTs] = useState("");
  useEffect(() => setTs(String(Date.now())), []);
  return <input type="hidden" name="startedAt" value={ts} />;
}
