const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

// This job will run at 8 AM in the morning every day
cron.schedule("0 8 * * *", async () => {
  //Send emails to all people who got requests the previous day

  try {
    const yesterday = subDays(new Date(), 1);

    const yesterDayStart = startOfDay(yesterday);
    const yesterDayEnd = endOfDay(yesterday);

    //if records are more, this query will also expensive, so we can use pagination in that case
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterDayStart,
        $lte: yesterDayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    // console.log(listOfEmails);

    //if data grows this loop, will cause performance issues (as it is sync) (in that case we can use AWS-BulkSendEmail or Queues(batch processing))
    for (const email of listOfEmails) {
      //send Emails
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are so many friend requests pending, please login to the portal and accept/reject the requests"
        );
        // console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
