import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReservationStore } from "@/hooks/useReservationStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addReservationDB, updateSeat } from "@/api/services";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const ReservationPage = () => {
  const { movie, showtime, seats, price, userReservation } =
    useReservationStore();
  const { toast } = useToast();

  const handleClick = async () => {
    await Promise.all([
      seats?.map((seat) =>
        addReservationDB({
          user_id: userReservation?.id,
          showtime_id: showtime?.id,
          seat: seat.id,
        })
      ),
    ]);

    await Promise.all([
      seats?.map((seat) =>
        updateSeat(seat.id, { ...seat, is_available: false })
      ),
    ]);

    toast({
      variant: "default",
      title: "Reservation Completed",
      description: "Your reservation has been completed successfully.",
    });
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        variants={itemVariants}
      >
        Reservation Confirmation
      </motion.h1>
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-white">
              Reservation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-bold text-white">
              <span className="text-gray-400">Movie:</span> {movie?.title}
            </p>
            <p className="font-bold text-white">
              <span className="text-gray-400">Date:</span> June 1, 2023
            </p>
            <p className="font-bold text-white">
              <span className="text-gray-400">Time:</span>{" "}
              {showtime?.start_time} - {showtime?.end_time}
            </p>
            <p className="font-bold text-white">
              <span className="text-gray-400">Seats:</span>{" "}
              {seats?.map((seat) => seat.seat_number).join(", ")}
            </p>
            <p className="text-xl font-bold text-white">
              <span className="text-gray-400">Total:</span> ${price}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleClick}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Complete Reservation
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};
