import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        className="h-14 w-14 rounded-full border-4 border-cyan-400 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;