import React from "react";
import { Button } from "@shopify/polaris";

export default function Result({ title, year }) {
  return (
    <li>
      <p>{title}</p>
      <Button onClick={() => alert("Button clicked!")}>Nominate</Button>
    </li>
  );
}
