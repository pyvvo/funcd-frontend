const fieldRegex = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  password:
    /(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$-/:-?{-~!"^_`[\]])\S{10,}/,
  dateISO:
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/
};

export default fieldRegex;
