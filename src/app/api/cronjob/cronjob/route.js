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
    // MIM SMS
    // Alpha Net BD
    //!!!!!!!!!!!!!!!!!!!!
    const isLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
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
    const aboutSecondLastDayOfCurrentMonth =
      isSecondLastDayOfCurrentMonthInBangladesh();
    const aboutLastDayOfCurrentMonth = isLastDayOfCurrentMonthInBangladesh();
    async function delay(s) {
      await new Promise((resolve) => setTimeout(resolve, s * 1000));
      console.log("Delayed function executed!!!!");
    }
    //! Last day of any month------------------------------
    if (aboutLastDayOfCurrentMonth.isLastDay) {
      let currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      let currentYear = new Date(currentDate).getFullYear();
      let currentMonthNumber = new Date(currentDate).getMonth();
      let currentMonth = new Date(
        currentYear,
        currentMonthNumber,
        1
      ).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });
      let nextMonth;
      let nextYear;
      if (currentMonthNumber < 11) {
        nextMonth = new Date(
          currentYear,
          currentMonthNumber + 1,
          1
        ).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        });
        nextYear = currentYear;
      } else {
        nextMonth = new Date(currentYear + 1, 0, 1).toLocaleDateString(
          "en-BD",
          {
            month: "long",
            timeZone: "Asia/Dhaka",
          }
        );
        nextYear = currentYear + 1;
      }
      //! <---------->User Bill Creation Start <---------->
      const bills = await Bill.find({
        year: currentYear,
        month: currentMonth,
        status: "initiated",
      });
      for (let m = 0; m < bills.length; m++) {
        const bill = await Bill.findById(bills[m]._id);
        const userId = bill.userId;
        const user = await User.findById(userId);
        const userCharges = user?.charges ? user.charges : [];
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
        let totalMealBillInBDT =
          totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500;
        bill.charges = userCharges;
        let totalBillInBDT =
          totalMealBillInBDT +
          userCharges.reduce((a, b) => a + parseInt(b.amount), 0);
        let emailHtml;
        if (totalBillInBDT >= bill.paidBillInBDT) {
          bill.totalBreakfast = totalBreakfast;
          bill.totalLunch = totalLunch;
          bill.totalDinner = totalDinner;
          bill.totalBillInBDT = totalBillInBDT;
          // totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500;
          bill.status = "calculated";
          await bill.save();
          emailHtml = render(
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
              totalBill: totalBillInBDT,
              isRestDeposite: false,
              charges: userCharges,
            })
          );
        } else {
          let restDeposite = bill.paidBillInBDT - totalBillInBDT;
          bill.totalBreakfast = totalBreakfast;
          bill.totalLunch = totalLunch;
          bill.totalDinner = totalDinner;
          bill.totalBillInBDT = totalBillInBDT;
          bill.paidBillInBDT = totalBillInBDT;
          // totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500;
          bill.status = "calculated";
          await bill.save();
          const nextBill = await Bill.findOne({
            userId,
            year: nextYear,
            month: nextMonth,
          });
          nextBill.paidBillInBDT += restDeposite;
          await nextBill.save();

          emailHtml = render(
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
              totalDeposit: totalBillInBDT,
              totalBill: totalBillInBDT,
              isRestDeposite: true,
              charges: userCharges,
            })
          );
        }
        //! SMS
        const url = "http://bulksmsbd.net/api/smsapi";
        const apiKey = process.env.SMS_API_KEY;
        const senderId = "8809617618230";
        const numbers = user.contactNumber;
        const message = `Hi, Mr. ${user.username}\nYour monthly bill has been created\nPlease check your E-mail properly with spam box to get details.\n\nThe Crown Boys Hostel`;
        const smsClientData = {
          api_key: apiKey,
          senderid: senderId,
          number: numbers,
          message: message,
        };
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(smsClientData),
        });
        //! SMS
        const mailOptions = {
          from: "checker@hostelplates.com",
          to: user.email,
          subject: "Monthly Bill - The Crown boys Hostel",
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
        const totalMeal =
          orders.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue.breakfast ? 0.5 : 0),
            0
          ) +
          orders.reduce(
            (accumulator, currentValue) =>
              accumulator +
              (currentValue.isGuestMeal && currentValue.guestBreakfastCount > 0
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
          );
        const managerBill = new ManagerBill({
          managerId: allManagers[n]._id,
          marketId: market._id,
          month: currentMonth,
          year: currentYear,
          totalMarketAmountInBDT: market.data.reduce(
            (accumulator, currentValue) => accumulator + currentValue.amount,
            0
          ),
          totalMeal,
          mealRate: (
            market.data.reduce(
              (accumulator, currentValue) => accumulator + currentValue.amount,
              0
            ) / totalMeal
          ).toFixed(2),
        });
        await managerBill.save();
        //! SMS
        const url = "http://bulksmsbd.net/api/smsapi";
        const apiKey = process.env.SMS_API_KEY;
        const senderId = "8809617618230";
        const numbers = allManagers[n].contactNumber;
        const message = `Hi, Mr. ${allManagers[n].username}\nYour monthly market bill with meal count and meal rate has been created. Check it from your profile.\n\nThe Crown Boys Hostel Inc.`;
        const smsManagerData = {
          api_key: apiKey,
          senderid: senderId,
          number: numbers,
          message: message,
        };
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(smsManagerData),
        });
        //! SMS
      }
      //! <---------->Manager Bill Creation End <---------->
      const mailOptions2 = {
        from: "cron-job@hostelplates.com",
        to: "akibrahman5200@gmail.com",
        subject: "Cron Job - Last Day Executed",
        html: `<div>
          <p>Last Day exe - Successfull</p>
          <p>Next Month :${nextMonth}</p>
          <p>Current Year :${currentYear}</p>
          </div>`,
      };
      await transport.sendMail(mailOptions2);
    }
    //! Second Last day of any month-----------------------
    if (aboutSecondLastDayOfCurrentMonth.isSecondLastDay) {
      let currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      let currentMonthNumber = new Date(currentDate).getMonth();
      let nextMonthNumber;
      let nextNextMonthNumber;
      let currentYear;
      let nextMonth;
      let dayCountOfNextMonth;
      if (currentMonthNumber < 11) {
        nextMonthNumber = new Date(currentDate).getMonth() + 1;
        nextNextMonthNumber = new Date(currentDate).getMonth() + 2;
        currentYear = new Date(currentDate).getFullYear();
        nextMonth = new Date(
          currentYear,
          nextMonthNumber,
          1
        ).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        });
        dayCountOfNextMonth = parseInt(
          new Date(currentYear, nextNextMonthNumber, 0).getDate()
        );
      } else {
        nextMonthNumber = 0;
        nextNextMonthNumber = 1;
        currentYear = new Date(currentDate).getFullYear() + 1;
        nextMonth = new Date(
          currentYear,
          nextMonthNumber,
          1
        ).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        });
        dayCountOfNextMonth = parseInt(
          new Date(currentYear, nextNextMonthNumber, 0).getDate()
        );
      }
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
            breakfast: true,
            lunch: true,
            dinner: true,
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
      //! <---------->Order creation for all verified users End <---------->

      //! <---------->Market Data creation for all verified managers Start <---------->
      const allManagers = await User.find({
        isManager: true,
        isManagerVerified: true,
        isVerified: true,
      });
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
        to: "akibrahman5200@gmail.com",
        subject: "Cron Job - Second Last Day Executed",
        html: `<div>
          <p>Second Last Day exe - Successfull</p>
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
    console.log("Runned successfully");
    return NextResponse.json({ success: true, msg: "Runned successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
