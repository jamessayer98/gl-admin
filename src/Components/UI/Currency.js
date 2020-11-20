import React from "react";
import NumberFormat from "react-number-format";

export default function Currency(props) {
  const _props = {
    displayType: "text",
    prefix: "$",
    decimalScale: 2,
    fixedDecimalScale: true,
    ...props,
  };

  return <NumberFormat {..._props} />;
}
