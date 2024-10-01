import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import moment from "moment";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const PUT = async (req) => {
  try {
    const {
      blockDate,
      clearBlockDate,
      _id,
      fromDate,
      fromDay,
      fcm,
      changedData,
    } = await req.json();
    if (!_id) return NextResponse.json({ success: false, msg: "Missing _id" });

    // About Block date
    if (blockDate && fromDate && fromDay) {
      const currentDateInBD = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const dateInBD = new Date(currentDateInBD);
      const year = dateInBD.getFullYear();
      const month = dateInBD.getMonth();
      const nextMonth = new Date(year, month + 1, 1);
      const lastDayOfCurrentMonth = new Date(nextMonth - 1);
      let toDay = lastDayOfCurrentMonth.getDate();

      const currentMonth = new Date().toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });

      const currentYear = parseInt(
        new Date().toLocaleDateString("en-BD", {
          year: "numeric",
          timeZone: "Asia/Dhaka",
        })
      );
      if (blockDate) {
        if (
          moment(blockDate).isBefore(
            moment(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
              "M/D/YYYY, h:mm:ss A"
            ),
            "day"
          )
        )
          return NextResponse.json({
            success: false,
            msg: "Past date can not be Block date",
          });

        if (
          new Date(blockDate).toLocaleDateString("en-BD", {
            month: "long",
            timeZone: "Asia/Dhaka",
          }) !== currentMonth ||
          parseInt(
            new Date(blockDate).toLocaleDateString("en-BD", {
              year: "numeric",
              timeZone: "Asia/Dhaka",
            })
          ) !== currentYear
        )
          return NextResponse.json({
            success: false,
            msg: "Only current month can be selected",
          });

        for (
          let i = fromDay == toDay ? fromDay : fromDay + 1;
          i <= toDay;
          i++
        ) {
          const order = await Order.findOne({
            userId: _id,
            date:
              fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2],
          });
          console.log(
            "Order: ",
            order,
            fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2]
          );
          if (!order) continue;
          order.breakfast = false;
          order.lunch = false;
          order.dinner = false;
          await order.save();
        }
        const user = await User.findByIdAndUpdate(_id, {
          blockDate,
        });
        await sendSMS(
          user.contactNumber,
          `Dear ${
            user.username
          },\nYour account has been blocked as of ${new Date(
            blockDate
          ).toDateString()}, and all meal orders beyond this date have been canceled. For any questions, please contact us.\n\nBest regards,\nThe Crown Boys Hostel Management Team`
        );
      }
    } else if (clearBlockDate && clearBlockDate === "YES") {
      const user = await User.findById(_id);
      const isOrderExists = await Order.find({
        month: new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          })
        ).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        }),
        userId: _id,
      });
      if (!isOrderExists || isOrderExists.length <= 0) {
        console.log("Creating Orders For This User");
        let currentDate = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        });
        const currentMonthForOrder = new Date(currentDate).toLocaleDateString(
          "en-BD",
          {
            month: "long",
            timeZone: "Asia/Dhaka",
          }
        );
        const currentYearForOrder = new Date(currentDate).getFullYear();
        let currentMonthNumber = new Date(currentDate).getMonth();
        let nextMonthNumber;
        let currentYear;
        let dayCountOfCurrentMonth;
        if (currentMonthNumber < 11) {
          nextMonthNumber = new Date(currentDate).getMonth() + 1;
          currentYear = new Date(currentDate).getFullYear();
          dayCountOfCurrentMonth = parseInt(
            new Date(currentYear, nextMonthNumber, 0).getDate()
          );
        } else {
          nextMonthNumber = 0;
          currentYear = new Date(currentDate).getFullYear() + 1;
          dayCountOfCurrentMonth = parseInt(
            new Date(currentYear, nextMonthNumber, 0).getDate()
          );
        }
        for (let i = 1; i <= dayCountOfCurrentMonth; i++) {
          await new Order({
            userId: user._id,
            managerId: user.manager,
            month: currentMonthForOrder,
            year: currentYearForOrder,
            date: new Date(
              currentYearForOrder,
              currentMonthNumber,
              i
            ).toLocaleDateString("en-BD", { timeZone: "Asia/Dhaka" }),
            breakfast: true,
            lunch: true,
            dinner: true,
          }).save();
        }
      }
      const isBillExists = await Bill.findOne({
        month: new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          })
        ).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        }),
        userId: _id,
      });
      if (!isBillExists) {
        await new Bill({
          userId: user._id,
          month: new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "Asia/Dhaka",
            })
          ).toLocaleDateString("en-BD", {
            month: "long",
            timeZone: "Asia/Dhaka",
          }),
          year: new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "Asia/Dhaka",
            })
          ).getFullYear(),
        }).save();
      }
      await User.findByIdAndUpdate(_id, {
        blockDate: "",
      });
      await sendSMS(
        user.contactNumber,
        `Dear ${user.username},\nYour account has been unblocked following a recent block. Please check your order status for the current month by visiting the following link: https://thecrownboyshostel.com/dashboard?displayData=currentMonth\nFor any questions, please contact us.\n\nBest regards,\nThe Crown Boys Hostel Management Team`
      );
    }
    // Abou FCM Token
    if (fcm) {
      await User.updateMany({ fcm }, { fcm: "" });
      await User.findByIdAndUpdate(_id, { fcm });
    }
    if (changedData) {
      await User.findByIdAndUpdate(_id, changedData);
    }
    return NextResponse.json({ success: true, msg: "User Updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { id } = await req.json();
    const user = await User.findById(id);
    user.charges = [...user.charges, { wifi: 200 }];
    await user.save();
    return NextResponse.json({ success: true, msg: "Test success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
