const express = require("express");
const { addReview, getSingleReview, getAllReviewsOfABook, deleteReview, deleteReviewByAdmin, getReviewsOfUser} = require("../controller/review");

const router = express.Router({ mergeParams: true });
const checkAuth = require('../middileware/check-user-auth');

const checkAdminAuth = require('../middileware/check-admin-auth');


/**
 * /api/reviews
 * http://localhost:3000/api/reviews
 */


// Review and rating
// feature added by
// Al Mahmud
// Powered by Soft-lab-It

// GET
// get All reviews of a book
// api/reviews/getAllreviews
router.get("/getAllReviews/:bookId",getAllReviewsOfABook);

// GET
// get single reviews
// api/reviews/:reviewId
router.get('/get-single-review/:reviewId',getSingleReview)

//GET
// get all reviews of a user
// api/reviews/get-reviews-of-user

router.get('/get-reviews-user',checkAuth,getReviewsOfUser);

//POST
//ADD A review
//api/reviews/:bookId
router.post("/add-review/:id",checkAuth,addReview);

// DELETE
// Delete a review by the user
// /api/reviews/:reviewId
router.delete("/delete-review-by-user/:bookId/:reviewId",checkAuth,deleteReview);

// DELETE
//Delete a review by the admin
//api/review/delete-review-by-admin/:reviewId
router.delete("/delete-review-by-admin/:bookId/:reviewId",checkAdminAuth,deleteReviewByAdmin);





module.exports=router;
