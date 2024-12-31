const mongoose = require("mongoose");

const connectDB = async () => {
  //mongodb+srv://bachat:kn5om7atozIhkckW@cluster0.z6bfj7c.mongodb.net/
  //mongodb+srv://zeemarketing1992:Ylis5rQK3BPKuFJ9@bachatcard.urm7vcx.mongodb.net/bachat
  mongoose.connect(
    "mongodb+srv://zeemarketing1992:Ylis5rQK3BPKuFJ9@bachatcard.urm7vcx.mongodb.net/bachat",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );

  console.log(`MongoDB connected`);
};

module.exports = connectDB;
