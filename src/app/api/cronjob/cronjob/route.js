import MonthlyBillEmail from "@/Components/MonthlyBillEmail/MonthlyBillEmail";
import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import ManagerBill from "@/models/managerBillModel";
import Market from "@/models/marketModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { render } from "@react-email/render";
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
    //! Second Last day of any month-----------------------
    if (aboutSecondLastDayOfCurrentMonth.isSecondLastDay) {
      // if (true) {
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
      //Order creation for all verified users Start
      const allUsersF = await User.find({
        isClient: true,
        isClientVerified: true,
        isVerified: true,
      });
      const allUsers = allUsersF.filter((a) => {
        if (a.blockDate) {
          if (
            moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "month"
            ) &&
            moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "year"
            )
          ) {
            return false;
          } else if (
            !moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "month"
            ) &&
            !moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "year"
            )
          ) {
            if (
              moment(a.blockDate).isBefore(
                moment(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                  }),
                  "M/D/YYYY, h:mm:ss A"
                )
              )
            ) {
              return false;
            } else {
              return true;
            }
          } else if (
            moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "month"
            ) &&
            !moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "year"
            )
          ) {
            if (
              moment(a.blockDate).isBefore(
                moment(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                  }),
                  "M/D/YYYY, h:mm:ss A"
                ),
                "year"
              )
            ) {
              return false;
            } else {
              return true;
            }
          } else if (
            moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "year"
            ) &&
            !moment(a.blockDate).isSame(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "month"
            )
          ) {
            if (
              moment(a.blockDate).isBefore(
                moment(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                  }),
                  "M/D/YYYY, h:mm:ss A"
                ),
                "month"
              )
            ) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      });
      const orderPromises = [];
      const billPromises = [];
      allUsers.forEach((user) => {
        for (let i = 1; i <= dayCountOfNextMonth; i++) {
          const newOrder = new Order({
            userId: user._id,
            managerId: user.manager,
            month: nextMonth,
            year: currentYear,
            date: new Date(currentYear, nextMonthNumber, i).toLocaleDateString(
              "en-BD",
              { timeZone: "Asia/Dhaka" }
            ),
            breakfast: true,
            lunch: true,
            dinner: true,
          });
          orderPromises.push(newOrder.save());
        }
        const newBill = new Bill({
          userId: user._id,
          month: nextMonth,
          year: currentYear,
        });
        billPromises.push(newBill.save());
      });
      await Promise.all(orderPromises);
      await Promise.all(billPromises);
      // Order creation for all verified users End
      // Market Data creation for all verified managers Start
      const allManagers = await User.find({
        isManager: true,
        isManagerVerified: true,
        isVerified: true,
      });
      const marketPromises = [];
      allManagers.forEach((manager) => {
        const dataOfMarket = [];
        for (let l = 1; l <= dayCountOfNextMonth; l++) {
          dataOfMarket.push({
            date: new Date(currentYear, nextMonthNumber, l).toLocaleDateString(
              "en-BD",
              { timeZone: "Asia/Dhaka" }
            ),
            amount: 0,
            details: [],
          });
        }
        const newMarket = new Market({
          managerId: manager._id,
          month: nextMonth,
          year: currentYear,
          data: dataOfMarket,
        });
        marketPromises.push(newMarket.save());
      });
      await Promise.all(marketPromises);
      // Market Data creation for all verified managers End
    }
    //! Last day of any month------------------------------
    if (aboutLastDayOfCurrentMonth.isLastDay) {
      // if (true) {
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
      // User Bill Creation Start
      const bills = await Bill.find({
        year: currentYear,
        month: currentMonth,
        status: "initiated",
      });
      const allEmails = [];
      const allNumbers = [];
      const userPromises = bills.map(async (bill) => {
        const user = await User.findById(bill.userId);
        const orders = await Order.find({
          userId: bill.userId,
          month: bill.month,
          year: bill.year,
        });
        const calculateMeals = (type) =>
          orders.reduce(
            (accumulator, currentValue) =>
              accumulator +
              (currentValue[type] ? 1 : 0) +
              (currentValue.isGuestMeal
                ? parseInt(
                    currentValue[
                      `guest${
                        type.charAt(0).toUpperCase() + type.slice(1)
                      }Count`
                    ]
                  ) || 0
                : 0),
            0
          );
        const totalBreakfast = calculateMeals("breakfast");
        const totalLunch = calculateMeals("lunch");
        const totalDinner = calculateMeals("dinner");
        const totalMealBillInBDT =
          totalBreakfast * 32 + totalLunch * 64 + totalDinner * 64 + 500;
        const totalUserCharges =
          user.charges?.reduce((a, b) => a + parseInt(b.amount), 0) || 0;
        const totalBillInBDT = totalMealBillInBDT + totalUserCharges;
        bill.charges = user.charges;
        bill.totalBreakfast = totalBreakfast;
        bill.totalLunch = totalLunch;
        bill.totalDinner = totalDinner;
        bill.totalBillInBDT = totalBillInBDT;
        if (totalBillInBDT < bill.paidBillInBDT) {
          let restDeposite = bill.paidBillInBDT - totalBillInBDT;
          bill.paidBillInBDT = totalBillInBDT;
          bill.status = "calculated";
          const nextBill = await Bill.findOne({
            userId: bill.userId,
            year: nextYear,
            month: nextMonth,
          });
          if (nextBill) {
            nextBill.paidBillInBDT += restDeposite;
            await nextBill.save();
          } else {
            // Taka Return from Office, SMS
          }
        }
        allNumbers.push(user.contactNumber);
        allEmails.push(user.email);
        bill.status = "calculated";
        await bill.save();
      });
      await Promise.all(userPromises);
      // User Bill Creation End
      // Manager Bill Creation Start
      const managers = await User.find({
        isManager: true,
        isManagerVerified: true,
        isVerified: true,
      });
      const managerPromises = managers.map(async (manager) => {
        const market = await Market.findOne({
          managerId: manager._id,
          month: currentMonth,
          year: currentYear,
        });

        const orders = await Order.find({
          managerId: manager._id,
          month: currentMonth,
          year: currentYear,
        });

        const totalMeal = orders.reduce((acc, curr) => {
          const breakfast = curr.breakfast ? 0.5 : 0;
          const lunch = curr.lunch ? 1 : 0;
          const dinner = curr.dinner ? 1 : 0;
          const guestBreakfast = curr.isGuestMeal
            ? curr.guestBreakfastCount / 2 || 0
            : 0;
          const guestLunch = curr.isGuestMeal ? curr.guestLunchCount || 0 : 0;
          const guestDinner = curr.isGuestMeal ? curr.guestDinnerCount || 0 : 0;
          return (
            acc +
            breakfast +
            lunch +
            dinner +
            guestBreakfast +
            guestLunch +
            guestDinner
          );
        }, 0);

        const totalMarketAmountInBDT = market.data.reduce((a, c) => {
          return (
            a +
            c.details.reduce(
              (total, market) => total + Object.values(market)[0],
              0
            )
          );
        }, 0);

        const mealRate = (totalMarketAmountInBDT / totalMeal).toFixed(2);

        const managerBill = new ManagerBill({
          managerId: manager._id,
          marketId: market._id,
          month: currentMonth,
          year: currentYear,
          totalMarketAmountInBDT,
          totalMeal,
          mealRate,
        });
        await managerBill.save();
        // Manager Meal Rate Creation SMS
      });
      await Promise.all(managerPromises);
      // Manager Bill Creation End
      // SMS and E-mails sent Start
      const mailOptions = {
        from: "thecrownboyshostel@gmail.com",
        to: allEmails.join(","),
        subject: "Monthly Bill - The Crown Boys hostel",
        html: `<div><p>Hello, Your Montly Bill has been Created</p><p>Please visit: <a href="http://localhost:3000/dashboard?displayData=myBills">http://localhost:3000/dashboard?displayData=myBills</a></p></div>`,
      };
      transport.sendMail(mailOptions);
      // SMS and E-mails sent End
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
