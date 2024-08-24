import MonthlyBillEmail from "@/Components/MonthlyBillEmail/MonthlyBillEmail";
import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import ManagerBill from "@/models/managerBillModel";
import Market from "@/models/marketModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { render } from "@react-email/render";
import axios from "axios";
import moment from "moment";
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
    console.log("Full Cronjob started");
    // Test --------------------------------------------
    if (true) {
      console.log("Test Run Started");
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
      //============================== Test Run Goes Here=========

      //============================== Test Run Goes Here=========
      console.log("Test Run Finished");
    }

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

    //! Last day of any month------------------------------
    if (aboutLastDayOfCurrentMonth.isLastDay) {
      console.log("Last Day Run Started");
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
      console.log("User bill creation started");
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
          bill.status = "calculated";
          await bill.save();
          const nextBill = await Bill.findOne({
            userId,
            year: nextYear,
            month: nextMonth,
          });
          if (nextBill) {
            nextBill.paidBillInBDT += restDeposite;
            await nextBill.save();
          } else {
            try {
              const sms = new URLSearchParams();
              sms.append("token", process.env.SMS_TOKEN);
              sms.append("to", user.contactNumber);
              sms.append(
                "message",
                `আপনার অ্যাকাউন্ট পর্যালোচনা করার পর, আমরা নির্ধারণ করেছি যে আপনি BDT ${restDeposite}/- পাওয়ার অধিকারী। আমাদের সিস্টেমে আপনি ব্লক হওয়ার কারণে, আপনাকে সরাসরি আমাদের অফিস থেকে উক্ত টাকা সংগ্রহ করতে হবে।\n\nThe Crown Boys Hostel`
              );
              await axios.post("https://api.bdbulksms.net/api.php", sms);
            } catch (error) {
              console.log(error);
            }
          }
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
        try {
          const sms = new URLSearchParams();
          sms.append("token", process.env.SMS_TOKEN);
          sms.append("to", user.contactNumber);
          sms.append(
            "message",
            `আপনার মাসিক বিল তৈরি হয়েছে\nবিবরণ পেতে দয়া করে স্প্যাম বক্স সহ আপনার ই-মেইলটি সঠিকভাবে চেক করুন।\n\nThe Crown Boys Hostel`
          );
          await axios.post("https://api.bdbulksms.net/api.php", sms);
        } catch (error) {
          console.log(error);
        }
        const mailOptions = {
          from: "checker@hostelplates.com",
          to: user.email,
          subject: "Monthly Bill - The Crown boys Hostel",
          html: emailHtml,
        };
        await transport.sendMail(mailOptions);
        bill.status = "calculated";
        await bill.save();
        console.log(`User bill created of ${user?.username}`);
        // return;
      }
      console.log("User bill creation finished");
      //! <---------->User Bill Creation End <---------->
      //! <---------->Manager Bill Creation Start <---------->
      console.log("Manager bill creation started");
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
          totalMarketAmountInBDT: market.data.reduce((a, c) => {
            return (
              a +
              c.details.reduce((total, market) => {
                let value = Object.values(market)[0];
                return total + value;
              }, 0)
            );
          }, 0),
          totalMeal,
          mealRate: (
            market.data.reduce((a, c) => {
              return (
                a +
                c.details.reduce((total, market) => {
                  let value = Object.values(market)[0];
                  return total + value;
                }, 0)
              );
            }, 0) / totalMeal
          ).toFixed(2),
        });
        await managerBill.save();
        try {
          const sms = new URLSearchParams();
          sms.append("token", process.env.SMS_TOKEN);
          sms.append("to", allManagers[n].contactNumber);
          sms.append(
            "message",
            `আপনার মাসিক বাজার বিল (খাবারের সংখ্যা এবং খাবারের রেট) তৈরি করা হয়েছে। আপনার প্রোফাইল থেকে এটি চেক করুন\n\nThe Crown Boys Hostel`
          );
          await axios.post("https://api.bdbulksms.net/api.php", sms);
        } catch (error) {
          console.log(error);
        }
      }
      console.log("manager bill creation finished");
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
      console.log("Last Day Run Finished");
    }
    //! Second Last day of any month-----------------------
    if (aboutSecondLastDayOfCurrentMonth.isSecondLastDay) {
      console.log("Second Last Day Run Started");
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
      console.log("User next month meal creation started");
      const allUsersF = await User.find({
        isClient: true,
        isClientVerified: true,
        isVerified: true,
      });
      const allUsers = allUsersF.filter((a) => {
        if (a.blockDate) {
          if (
            moment(a.blockDate).isSame(moment.now(), "month") &&
            moment(a.blockDate).isSame(moment.now(), "year")
          ) {
            return false;
          } else if (
            !moment(a.blockDate).isSame(moment.now(), "month") &&
            !moment(a.blockDate).isSame(moment.now(), "year")
          ) {
            if (moment(a.blockDate).isBefore(moment.now())) {
              return false;
            } else {
              return true;
            }
          } else if (
            moment(a.blockDate).isSame(moment.now(), "month") &&
            !moment(a.blockDate).isSame(moment.now(), "year")
          ) {
            if (moment(a.blockDate).isBefore(moment.now(), "year")) {
              return false;
            } else {
              return true;
            }
          } else if (
            moment(a.blockDate).isSame(moment.now(), "year") &&
            !moment(a.blockDate).isSame(moment.now(), "month")
          ) {
            if (moment(a.blockDate).isBefore(moment.now(), "month")) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
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
      console.log("User next month meal creation finished");
      //! <---------->Order creation for all verified users End <---------->

      //! <---------->Market Data creation for all verified managers Start <---------->
      console.log("Mnger next month market creation started");
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
            details: [],
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
      console.log("Mnger next month market creation finished");
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
      console.log("Second Last Day Run Finished");
    }

    console.log("Full cronjob finished successfully");
    return NextResponse.json({ success: true, msg: "Runned successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
