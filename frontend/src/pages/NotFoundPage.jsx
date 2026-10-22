import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="glass max-w-xl rounded-[2rem] p-10 text-center">
        <h1 className="mb-4 text-6xl font-extrabold text-cyan-300">404</h1>
        <h2 className="mb-4 text-3xl font-bold">Page Not Found</h2>
        <p className="mb-8 text-white/70">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="glow-btn rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
          >
            Go Home
          </Link>

          <Link
            to="/search"
            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white"
          >
            Search Trains
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;