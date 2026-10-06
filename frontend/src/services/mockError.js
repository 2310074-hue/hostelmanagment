// Small helper to create Error objects that still look like an Axios error
// (i.e. have a `.response.data.message` shape), so the mock service layer
// can be swapped for the real Axios-based service without changing any
// calling code's error-handling logic.
export const mockError = (message) => {
  const err = new Error(message);
  err.response = { data: { message } };
  return err;
};
