const LoginPage = () => {
  const handlePassengerLogin = () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Madhumitha",
        role: "passenger",
      })
    );

    window.location.href = "/search";
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={handlePassengerLogin}
        className="rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-black"
      >
        Login as Passenger
      </button>
    </div>
  );
};

export default LoginPage;