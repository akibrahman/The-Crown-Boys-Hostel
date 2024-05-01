const ManagerMealRate = ({ user, managerCalanderData, ordersForTheMonth }) => {
  return (
    user.role == "manager" &&
    user.isVerified &&
    user.isManagerVerified && (
      <div className="py-5 md:py-0 md:p-10 md:mt-20 mx-auto">
        <p className="flex items-center gap-2 mb-5">
          Current Meal Rate:{" "}
          <span className="text-blue-500 font-extralight text-4xl">
            {" "}
            {(
              managerCalanderData.data
                .filter(
                  (d) =>
                    parseInt(d.date.split("/")[1]) <=
                    parseInt(
                      new Date().toLocaleDateString("en-BD", {
                        day: "numeric",
                        timeZone: "Asia/Dhaka",
                      })
                    )
                )
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.amount,
                  0
                ) /
              (ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator + (currentValue.breakfast ? 0.5 : 0),
                0
              ) +
                ordersForTheMonth.reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    (currentValue.isGuestMeal &&
                    currentValue.guestBreakfastCount > 0
                      ? currentValue.guestBreakfastCount / 2
                      : 0),
                  0
                ) +
                ordersForTheMonth.reduce(
                  (accumulator, currentValue) =>
                    accumulator + (currentValue.lunch ? 1 : 0),
                  0
                ) +
                ordersForTheMonth.reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    (currentValue.isGuestMeal &&
                    currentValue.guestLunchCount > 0
                      ? currentValue.guestLunchCount
                      : 0),
                  0
                ) +
                ordersForTheMonth.reduce(
                  (accumulator, currentValue) =>
                    accumulator + (currentValue.dinner ? 1 : 0),
                  0
                ) +
                ordersForTheMonth.reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    (currentValue.isGuestMeal &&
                    currentValue.guestDinnerCount > 0
                      ? currentValue.guestDinnerCount
                      : 0),
                  0
                ))
            ).toFixed(2)}
          </span>
        </p>
        <p>
          Total Market:{" "}
          <span className="text-blue-500 font-bold text-2xl">
            {managerCalanderData.data
              .filter(
                (d) =>
                  parseInt(d.date.split("/")[1]) <=
                  parseInt(
                    new Date().toLocaleDateString("en-BD", {
                      day: "numeric",
                      timeZone: "Asia/Dhaka",
                    })
                  )
              )
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.amount,
                0
              )}
          </span>{" "}
          BDT
        </p>
        <p>
          Total meal count:
          <span className="text-blue-500 font-bold text-2xl">
            {" "}
            {ordersForTheMonth.reduce(
              (accumulator, currentValue) =>
                accumulator + (currentValue.breakfast ? 0.5 : 0),
              0
            ) +
              ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal &&
                  currentValue.guestBreakfastCount > 0
                    ? currentValue.guestBreakfastCount / 2
                    : 0),
                0
              ) +
              ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator + (currentValue.lunch ? 1 : 0),
                0
              ) +
              ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal && currentValue.guestLunchCount > 0
                    ? currentValue.guestLunchCount
                    : 0),
                0
              ) +
              ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator + (currentValue.dinner ? 1 : 0),
                0
              ) +
              ordersForTheMonth.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal && currentValue.guestDinnerCount > 0
                    ? currentValue.guestDinnerCount
                    : 0),
                0
              )}
          </span>
        </p>
      </div>
    )
  );
};

export default ManagerMealRate;
