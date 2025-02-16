import { PulseLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <PulseLoader color="#4F46E5" size={10} />
    </div>
  );
} 