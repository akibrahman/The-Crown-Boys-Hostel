import MonthlyBillEmail from "@/Components/MonthlyBillEmail/MonthlyBillEmail";
import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import ManagerBill from "@/models/managerBillModel";
import Market from "@/models/marketModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

await dbConfig();

export const GET = async (req) => {
  try {
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 400 }
      );
    }
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    //!!!!!!!!!!!!!!!!!!!!
    const isLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      // const currentHour = today.getUTCHours();
      // const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      console.log(lastDayOfMonth);
      return {
        isLastDay:
          today.getUTCDate() === lastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === lastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === lastDayOfMonth.getUTCFullYear(),
      };
    };
    //!!!!!!!!!!!!!!!!!!!!
    const isSecondLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      // const currentHour = today.getUTCHours();
      // const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const secondLastDayOfMonth = new Date(lastDayOfMonth);
      secondLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 1);
      console.log(secondLastDayOfMonth);
      return {
        isSecondLastDay:
          today.getUTCDate() === secondLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === secondLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === secondLastDayOfMonth.getUTCFullYear(),
      };
    };
    const test = true;
    const aboutSecondLastDayOfCurrentMonth =
      isSecondLastDayOfCurrentMonthInBangladesh();
    const aboutLastDayOfCurrentMonth = isLastDayOfCurrentMonthInBangladesh();

    if (test) {
      console.log("-------------------> Started");
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentMonth = new Date().toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });
      const currentYear = new Date().toLocaleDateString("en-BD", {
        year: "numeric",
        timeZone: "Asia/Dhaka",
      });
      const mailOptions = {
        // from: "checker@hostelplates.com",
        to: "akibrahman5200@gmail.com",
        subject: "Manager Expo - Test Date & Time",
        html: `<div>
        <p><b>Current Month : ${currentMonth}</b></p>
        <p><b>Current Year : ${currentYear}</b></p>
        <p><b>Date & Time : ${currentDate}</b></p>
        </div>`,
      };

      await transport.sendMail(mailOptions);
    }
    //! Last day of any month------------------------------
    if (aboutLastDayOfCurrentMonth.isLastDay) {
      //! <---------->User Bill Creation Start <---------->
      const bills = await Bill.find({});
      for (let m = 0; m < bills.length; m++) {
        const bill = await Bill.findById(bills[m]._id);
        const userId = bill.userId;
        const user = await User.findById(userId);
        const month = bill.month;
        const year = bill.year;
        const orders = await Order.find({ userId, month, year });
        const breakfast = orders.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.breakfast ? 1 : 0),
          0
        );
        const extraBreakfast = orders
          .filter((d) => d.isGuestMeal && d.guestBreakfastCount > 0)
          .reduce(
            (accumulator, currentValue) =>
              accumulator + parseInt(currentValue.guestBreakfastCount),
            0
          );
        const lunch = orders.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.lunch ? 1 : 0),
          0
        );
        const extraLunch = orders
          .filter((d) => d.isGuestMeal && d.guestLunchCount > 0)
          .reduce(
            (accumulator, currentValue) =>
              accumulator + parseInt(currentValue.guestLunchCount),
            0
          );
        const dinner = orders.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.dinner ? 1 : 0),
          0
        );
        const extraDinner = orders
          .filter((d) => d.isGuestMeal && d.guestDinnerCount > 0)
          .reduce(
            (accumulator, currentValue) =>
              accumulator + parseInt(currentValue.guestDinnerCount),
            0
          );
        const totalBreakfast = breakfast + extraBreakfast;
        const totalLunch = lunch + extraLunch;
        const totalDinner = dinner + extraDinner;
        //! bill.totalBreakfast = totalBreakfast;
        //! bill.totalLunch = totalLunch;
        //! bill.totalDinner = totalDinner;
        //! bill.totalBillInBDT =
        //!   totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500;
        //! bill.status = "calculated";
        //! await bill.save();

        const emailHtml = render(
          MonthlyBillEmail({
            name: user.username,
            email: user.email,
            month: month,
            date: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Dhaka",
            }),
            billId: bill._id.toString(),
            userId: user._id.toString(),
            totalBreakfast: totalBreakfast,
            totalLunch: totalLunch,
            totalDinner: totalDinner,
            totalDeposit: bill.paidBillInBDT,
            totalBill:
              totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500,
          })
        );
        const mailOptions = {
          from: "checker@hostelplates.com",
          to: user.email,
          subject: "Manager Expo - Test Monthly Bill",
          // html: "<b>Test Bill E-mail from Manager Expo</b>",
          html: emailHtml,
        };

        await transport.sendMail(mailOptions);
      }
      //! <---------->User Bill Creation End <---------->

      //! <---------->Manager Bill Creation Start <---------->
      const allManagers = await User.find({
        isManager: true,
        isManagerVerified: true,
        isVerified: true,
      });
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentMonthNumber = new Date(currentDate).getMonth();
      const currentYear = new Date(currentDate).getFullYear();
      const currentMonth = new Date(
        currentYear,
        currentMonthNumber,
        1
      ).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });
      for (let n = 0; n < allManagers.length; n++) {
        const market = await Market.findOne({
          managerId: allManagers[n]._id,
          month: currentMonth,
          year: currentYear,
        });
        const orders = await Order.find({
          managerId: allManagers[n]._id,
          month: currentMonth,
          year: currentYear,
        });
        const managerBill = new ManagerBill({
          managerId: allManagers[n]._id,
          marketId: market._id,
          month: currentMonth,
          year: currentYear,
          totalMarketAmountInBDT: market.data.reduce(
            (accumulator, currentValue) => accumulator + currentValue.amount,
            0
          ),
          totalMeal:
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator + (currentValue.breakfast ? 0.5 : 0),
              0
            ) +
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator +
                (currentValue.isGuestMeal &&
                currentValue.guestBreakfastCount > 0
                  ? currentValue.guestBreakfastCount / 2
                  : 0),
              0
            ) +
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator + (currentValue.lunch ? 1 : 0),
              0
            ) +
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator +
                (currentValue.isGuestMeal && currentValue.guestLunchCount > 0
                  ? currentValue.guestLunchCount
                  : 0),
              0
            ) +
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator + (currentValue.dinner ? 1 : 0),
              0
            ) +
            orders.reduce(
              (accumulator, currentValue) =>
                accumulator +
                (currentValue.isGuestMeal && currentValue.guestDinnerCount > 0
                  ? currentValue.guestDinnerCount
                  : 0),
              0
            ),
          mealRate: (
            market.data.reduce(
              (accumulator, currentValue) => accumulator + currentValue.amount,
              0
            ) /
            (orders.reduce(
              (accumulator, currentValue) =>
                accumulator + (currentValue.breakfast ? 0.5 : 0),
              0
            ) +
              orders.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal &&
                  currentValue.guestBreakfastCount > 0
                    ? currentValue.guestBreakfastCount / 2
                    : 0),
                0
              ) +
              orders.reduce(
                (accumulator, currentValue) =>
                  accumulator + (currentValue.lunch ? 1 : 0),
                0
              ) +
              orders.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal && currentValue.guestLunchCount > 0
                    ? currentValue.guestLunchCount
                    : 0),
                0
              ) +
              orders.reduce(
                (accumulator, currentValue) =>
                  accumulator + (currentValue.dinner ? 1 : 0),
                0
              ) +
              orders.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.isGuestMeal && currentValue.guestDinnerCount > 0
                    ? currentValue.guestDinnerCount
                    : 0),
                0
              ))
          ).toFixed(2),
        });
        await managerBill.save();
      }
      //! <---------->Manager Bill Creation End <---------->
    }
    //! Second Last day of any month------------------------------
    if (aboutSecondLastDayOfCurrentMonth.isSecondLastDay) {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentMonth = new Date(currentDate).getMonth();
      const nextMonthNumber = new Date(currentDate).getMonth() + 1;
      const nextNextMonthNumber = new Date(currentDate).getMonth() + 2;
      const currentYear = new Date(currentDate).getFullYear();
      const nextMonth = new Date(
        currentYear,
        currentMonth + 1,
        1
      ).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });
      const dayCountOfNextMonth = parseInt(
        new Date(currentYear, nextNextMonthNumber, 0).getDate()
      );
      //! <---------->Order creation for all verified users Start <---------->
      const allUsers = await User.find({
        isClient: true,
        isClientVerified: true,
        isVerified: true,
      });
      for (let j = 0; j < allUsers.length; j++) {
        for (let i = 1; i <= dayCountOfNextMonth; i++) {
          const newOrder = new Order({
            userId: allUsers[j]._id,
            managerId: allUsers[j].manager,
            month: nextMonth,
            year: currentYear,
            date: new Date(currentYear, nextMonthNumber, i).toLocaleDateString(
              "en-BD",
              {
                timeZone: "Asia/Dhaka",
              }
            ),
            breakfast: false,
            lunch: false,
            dinner: false,
          });
          await newOrder.save();
        }
        const newBill = new Bill({
          userId: allUsers[j]._id,
          month: nextMonth,
          year: currentYear,
        });
        await newBill.save();
      }
      const allManagers = await User.find({
        isManager: true,
        isManagerVerified: true,
        isVerified: true,
      });
      //! <---------->Order creation for all verified users End <---------->

      //! <---------->Market Data creation for all verified managers Start <---------->
      let dataOfMarket = [];
      for (let k = 0; k < allManagers.length; k++) {
        for (let l = 1; l <= dayCountOfNextMonth; l++) {
          dataOfMarket.push({
            date: new Date(currentYear, nextMonthNumber, l).toLocaleDateString(
              "en-BD",
              {
                timeZone: "Asia/Dhaka",
              }
            ),
            amount: 0,
          });
        }
        const newMarket = new Market({
          managerId: allManagers[k]._id,
          month: nextMonth,
          year: currentYear,
          data: dataOfMarket,
        });
        await newMarket.save();
        dataOfMarket = [];
      }
      //! <---------->Market Data creation for all verified managers End <---------->

      const mailOptions = {
        from: "cron-job@hostelplates.com",
        to: "akibrahman5200@gmail.com",
        subject: "Cron Job",
        html: `<div>
          <p>Is Last Day:${aboutSecondLastDayOfCurrentMonth.isSecondLastDay}</p>
          <p>Next Month :${nextMonth}</p>
          <p>Current Year :${currentYear}</p>
          <p>Date :${new Date(
            currentYear,
            nextMonthNumber,
            dayCountOfNextMonth
          ).toLocaleDateString("en-BD", {
            timeZone: "Asia/Dhaka",
          })}</p>
          <p>Day Count of Next Month :${dayCountOfNextMonth}</p>
          </div>`,
      };
      await transport.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, msg: "Runned successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
