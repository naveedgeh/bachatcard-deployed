const ErrorResponse = require("../utils/errorResponse");
const LuckyDraw = require("../models/LuckyDraw");
const User = require('../models/User');

exports.getLuckyDraws = async (req, res, next) => {
  try {
    let luckyDraws = await LuckyDraw.find().populate("winners");
    if (luckyDraws.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Lucky draws found",
        data: luckyDraws,
      });
    }
    return res.status(404).json({
      success: true,
      message: "No lucky draws found",
      data: [],
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.createLuckyDraw = async (req, res, next) => {
  try {
    const { duration, type, items } = req.body;

    // Create a new lucky draw
    const luckyDraw = await LuckyDraw.create({ timeframe: { duration, type }, items });

    const scheduledDate = new Date();
    if (type === 'month') {
      scheduledDate.setMonth(scheduledDate.getMonth() + duration);
    } else if (type === 'day') {
      scheduledDate.setDate(scheduledDate.getDate() + duration);
    } else {
      throw new Error('Invalid timeframe type');
    }

    // Calculate the delay in milliseconds
    let delayInMilliseconds = scheduledDate - new Date();
    console.log(`Calculated delay: ${delayInMilliseconds} milliseconds`);

    // Function to execute the task
    const executeTask = async () => {
      try {
        const winners = await selectWinners(items.length); // Select winners
        luckyDraw.winners = winners.map(winner => winner._id); // Store winner IDs in the lucky draw document
        luckyDraw.expired = true;
        await luckyDraw.save(); // Save the lucky draw with winner IDs
        console.log('Lucky draw executed successfully');
      } catch (err) {
        console.error('Error selecting winners:', err);
      }
    };

    // Function to schedule the task with consideration of the max timeout
    const scheduleTask = (delay) => {
      if (delay > 2147483647) {
        setTimeout(() => {
          scheduleTask(delay - 2147483647);
        }, 2147483647);
      } else {
        setTimeout(executeTask, delay);
      }
    };

    // Schedule the task
    scheduleTask(delayInMilliseconds);

    return res.status(201).json({
      success: true,
      message: "Lucky draw created successfully",
      data: luckyDraw,
    });
  } catch (err) {
    console.error('Error creating lucky draw:', err);
    return next(new ErrorResponse(err.message, 400));
  }
};

exports.deleteLuckyDraw = async (req, res, next) => {
  try {
    const deletedLuckyDraw = await LuckyDraw.deleteMany({ _id: { $in: req.body.ids } });
    if (!deletedLuckyDraw) {
      return res.status(400).json({ success: false, message: "Lucky draw delete failed!" });
    }
    const luckyDraws = await LuckyDraw.find({});
    if (luckyDraws.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Lucky draws deleted successfully!",
        data: luckyDraws,
      });
    }
    return res.status(404).json({ success: true, message: "No lucky draws found", data: [] });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

// Function to select winners
async function selectWinners(numWinners) {
  try {
    // Fetch all users
    const users = await User.find({ 'creditCard.paid': true });
    
    // Shuffle the users array
    const shuffledUsers = shuffle(users);
    
    // Select the first 'numWinners' users as winners
    const winners = shuffledUsers.slice(0, numWinners);
    
    return winners;
  } catch (err) {
    throw new Error('Error selecting winners');
  }
}

// Function to shuffle array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}