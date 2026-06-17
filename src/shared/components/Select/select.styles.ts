import type {
  StylesConfig,
  ControlProps,
  OptionProps,
  GroupBase,
} from "react-select";

type OptionType = {
  label: string;
  value: string;
};

const FIELD_HEIGHT = "40px";
const FIELD_PADDING = "8px";

export const selectStyles: StylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
> = {
  control: (base, state: ControlProps<OptionType, boolean>) => ({
    ...base,
    height: FIELD_HEIGHT,
    minHeight: FIELD_HEIGHT,
    padding: 0,
    borderRadius: "4px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderColor: state.isFocused ? "var(--primary)" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px var(--primary)" : "none",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  }),

  valueContainer: (base) => ({
    ...base,
    height: FIELD_HEIGHT,
    padding: `0 ${FIELD_PADDING}`,
    display: "flex",
    alignItems: "center",
    lineHeight: FIELD_HEIGHT,
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    lineHeight: FIELD_HEIGHT,
  }),

  singleValue: (base) => ({
    ...base,
    margin: 0,
    lineHeight: FIELD_HEIGHT,
  }),

  placeholder: (base) => ({
    ...base,
    margin: 0,
    lineHeight: FIELD_HEIGHT,
    color: "#9ca3af",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: FIELD_HEIGHT,
    display: "flex",
    alignItems: "center",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--primary-soft)",
    borderRadius: "6px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--text)",
  }),

  multiValueRemove: (base) => ({
    ...base,
    ":hover": {
      backgroundColor: "var(--primary-hover)",
      color: "black",
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "6px",
    overflow: "hidden",
    marginTop: "4px",
    zIndex: 50,
  }),

  option: (base, state: OptionProps<OptionType, boolean>) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? "var(--primary-soft)"
        : "white",
    color: state.isSelected ? "#000" : "var(--text)",
    cursor: "pointer",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "var(--primary)" : "#666",
    "&:hover": {
      color: "var(--primary)",
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};
