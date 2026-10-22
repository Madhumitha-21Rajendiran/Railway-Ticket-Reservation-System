const FormError = ({ error }) => {
  if (!error) return null;

  return <p className="mt-2 text-sm text-rose-400">{error}</p>;
};

export default FormError;