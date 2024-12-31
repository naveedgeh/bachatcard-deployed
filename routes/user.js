const express = require("express");
const router = express.Router();
// (path = require("path")), (fs = require("fs")), (multer = require("multer"));
const {
  userLogin,
  userSignup,
  brandSignup,
  getSingleUser,
  forgetPassword,
  VerifyJWTToken,
  updateUser,
  getSingleUserById,
  deleteUser,
  deactivateUser,
  activateUser,
  getAllUsers,
  getAllBrands,
  userTopup,
  resetPassword,
  userSwap,
  getAllRequests,
  getRefferalUser,
  countActiveAndInactiveUsers,
  getRefferalUserByParentId,
  saveRequest,
  acceptRequest,
  declineRequest,
  saveWithdrawal,
  getAllWithdrawal,
  acceptWithdrawal,
  declineWithdrawal,
  getAllNotifications,
  fcm_token,
  pkrTopup,
  nonWorking
} = require("../controllers/user.controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/userlogin", userLogin);
router.post("/usersignup", userSignup);
router.post("/fcm_token", fcm_token);
router.post("/brandsignup", brandSignup);
router.get("/getallrefferaluser/:referralid", getRefferalUser);
router.get("/userinfo/:userid", countActiveAndInactiveUsers);
router.get("/getallusers", getAllUsers);
router.get("/getallnotifications/:id", getAllNotifications);
router.get("/getallbrands", getAllBrands);
router.patch("/updateuser", checkAuth, updateUser);
router.post("/getsingleuserbyid", getSingleUserById);
router.post("/deleteuser", deleteUser);
router.post("/wallet/swap", userSwap);
router.post("/wallet/non-working", nonWorking);
router.post("/wallet/topup", userTopup);
router.post("/wallet/pkr-topup", pkrTopup);
router.get("/wallet/requests", getAllRequests);
router.post("/wallet/request", saveRequest);
router.post("/wallet/request/accept", acceptRequest);
router.post("/wallet/request/decline", declineRequest);
router.get("/wallet/withdrawal", getAllWithdrawal);
router.post("/wallet/withdrawal", saveWithdrawal);
router.post("/wallet/withdrawal/accept", acceptWithdrawal);
router.post("/wallet/withdrawal/decline", declineWithdrawal);
router.post("/deactivateuser", deactivateUser);
router.post("/activateuser", activateUser);
router.patch("/forgetpassword", forgetPassword);
router.patch("/resetpassword", resetPassword);
router.patch("/verifyjwttoken", VerifyJWTToken);
router.get("/referraldetails/:id", getRefferalUserByParentId);
module.exports = router;
