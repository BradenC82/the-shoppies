import { useState, useCallback } from "react";
import { Autocomplete } from "@shopify/polaris";
import { Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

function AutocompleteExample() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [options, setOptions] = useState([]);

  return <div style={{ height: "225px" }}></div>;
}

export default AutocompleteExample;
