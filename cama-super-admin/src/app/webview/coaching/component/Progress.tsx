import { motion } from "framer-motion";

export default function Progress(props: any) {
  const { progress = "0", text } = props;
  return (
    <>
      <div className="flex  justify-start mb-1 items-center">
        {text ? (
          text
        ) : (
          <span className="text-sm font-semibold text-green-600">
            {progress}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2 }}
        />
      </div>
    </>
  );
}
