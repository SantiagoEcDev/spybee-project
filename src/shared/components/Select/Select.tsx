"use client";

import ReactSelect, { Props } from "react-select";
import { selectStyles } from "./select.styles";

type Option = {
  value: string;
  label: string;
};

export default function Select<IsMulti extends boolean = false>(
  props: Props<Option, IsMulti>,
) {
  return <ReactSelect {...props} styles={selectStyles} classNamePrefix="rs" />;
}
