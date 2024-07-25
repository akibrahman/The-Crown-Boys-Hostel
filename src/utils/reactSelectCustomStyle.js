export const customStylesForReactSelect = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#44403C",
    borderColor: "#44403C",
    color: "white",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#44403C",
    },
    "&:focus-visible": {
      borderColor: "#44403C",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#44403C",
    color: "white",
  }),
  singleValue: (provided) => ({
    ...provided,
    backgroundColor: "#44403C",
    color: "white",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#0EA5E9" : "#44403C",
    color: "white",
    "&:hover": {
      backgroundColor: "grey",
      cursor: "pointer",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "white", // Placeholder text color
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
};
