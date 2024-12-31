const Commission = require("../models/Commission");
const LevelPercentage = require("../models/LevelPercentage");
const Wallet = require("../models/Wallet");
const ReferralUser = require("../models/ReferralUser");

exports.calculateCommission = async (req, res) => {
  const { userId, price } = req.body;
  try {
    // Fetch the initial referral user
    const referralUser = await ReferralUser.findOne({ user: userId });
    if (!referralUser) {
      return res.status(404).json({ message: "Referral user not found" });
    }
    let count = 0;
    // Recursive function to calculate and save commissions
    async function calculateAndSaveCommission(referalUser) {
      if (count >= 6) {
        console.log("complete", count);
        return;
      }

      count += 1;
      const { pr: percentage, total: totalAmount } = await calculateDiscount(
        count,
        price
      );
      console.log({ percentage, totalAmount });
      const commission = new Commission({
        user: referalUser.parent,
        percentage: percentage,
        totalAmount,
      });

      await commission.save();

      const parentReferralUser = await ReferralUser.findOne({
        user: referalUser.parent,
      });

      if (parentReferralUser) {
        await calculateAndSaveCommission(parentReferralUser);
      }
    }

    // Start the commission calculation
    await calculateAndSaveCommission(referralUser);
    return res
      .status(200)
      .json({ message: "Commissions calculated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.calculateCommissionCheck = async (userId, price) => {
  try {
    console.log(userId, price)
    // Fetch the initial referral user
    const referralUser = await ReferralUser.findOne({ user: userId });
    if (!referralUser) {
      throw new Error("Referral user not found");
    }
    let count = 0;
    // Recursive function to calculate and save commissions
    async function calculateAndSaveCommission(referralUser) {
      if (count >= 6) {
        console.log("complete", count);
        return;
      }

      count += 1;
      const { pr: percentage, total: totalAmount } = await calculateDiscount(
        count,
        price
      );
      console.log({ percentage, totalAmount });
      const commission = new Commission({
        user: referralUser.parent,
        percentage,
        totalAmount,
      });

      const wallet = await Wallet.findOne({ userId: referralUser.parent });
      wallet.commission = wallet.commission + totalAmount;
      wallet.save();

      await commission.save();

      const parentReferralUser = await RexferralUser.findOne({
        user: referralUser.parent,
      });

      if (parentReferralUser) {
        await calculateAndSaveCommission(parentReferralUser);
      }
    }

    // Start the commission calculation
    await calculateAndSaveCommission(referralUser);
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

async function calculateDiscount(level, price) {
  // Fix the levelcopy assignment to ensure proper copying of level value
  let levelcopy = level === 0 ? 1 : level;

  try {
    let levelPercentage = await LevelPercentage.findOne({
      level: `level${levelcopy}`,
    });

    if (!levelPercentage) {
      console.error(`No percentage found for level${levelcopy}`);
      return { pr: 0, total: 0 }; // Return default values if no percentage is found
    }

    let pr = Number(levelPercentage.percentagePrice);
    let perce = pr / 100;
    let total = perce * price;

    console.log(`Level: ${levelcopy}, Percentage: ${pr}, Total: ${total}`);

    return { pr, total };
  } catch (error) {
    console.error("Error fetching level percentage:", error);
    return { pr: 0, total: 0 }; // Return default values in case of an error
  }
}
