// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const User = require('../models/user');
const Address = require('../models/address');
const mongoose = require('mongoose');


/**
 * User Registration
 * User Login
 */

exports.userFacebookAuth = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const user = new User(bodyData);
        let token;


        const userExists = await User.findOne({ username: bodyData.username}).lean();

        if (userExists) {
            // When User Already Exists
            token = jwt.sign({
                    username: userExists.username,
                    userId: userExists._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        } else {
            // When User Not Exists
            const newUser = await user.save();

            token = jwt.sign({
                    username: newUser.username,
                    userId: newUser._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.userRegistrationDefault = async (req, res, next) => {
    const errors = validationResult(req);
    // Check Input validation Error with Error Handler..
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const bodyData = req.body;
        let query;
        let token;

        if (bodyData.phoneNo) {
            query = {username: bodyData.phoneNo}
        } else {
            query = {username: bodyData.email}
        }

        const userExists = await User.findOne(query).lean();

        if (userExists) {
            const error = new Error(`A user with this ${bodyData.phoneNo ? 'Phone' : 'Email'} no already registered!`);
            error.statusCode = 406;
            next(error);
        } else {
            const password = bodyData.password;
            const hashedPass = bcrypt.hashSync(password, 8);
            const registrationData = {...bodyData, ...{password: hashedPass}}
            const user = new User(registrationData);

            const newUser = await user.save();

            token = jwt.sign({
                    username: newUser.username,
                    userId: newUser._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


// Login User..
exports.userLoginDefault = async (req, res, next) => {

    try {
        const username = req.body.username;
        const password = req.body.password;

        let loadedUser;
        let token;
        const user = await User.findOne({username: username})

        if (!user) {
            const error = new Error('A User with this phone or email no could not be found!');
            error.statusCode = 401;
            next(error)
        } else if (user.hasAccess === false) {
            const error = new Error('Ban! Your account has been banned');
            error.statusCode = 401;
            next(error);
        } else {
            loadedUser = user;
            const isEqual = await bcrypt.compareSync(password, user.password);
            if (!isEqual) {
                const error = new Error('You entered a wrong password!');
                error.statusCode = 401;
                next(error)
            } else {
                token = jwt.sign({
                        username: loadedUser.username,
                        userId: loadedUser._id
                    },
                    process.env.JWT_PRIVATE_KEY, {
                        expiresIn: '24h'
                    }
                );
                res.status(200).json({
                    token: token,
                    expiredIn: 86400
                })
            }

        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getLoginUserInfo = async (req, res, next) => {
    try {
        const loginUserId = req.userData.userId;
        const selectString = req.query.select;

        let user;

        if (selectString) {
            user = User.findById(loginUserId).select(selectString)
        } else {
            user = User.findById(loginUserId).select('-password')
        }
        const data = await user;

        res.status(200).json({
            data: data,
            message: 'Successfully Get user info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editLoginUserInfo = async (req, res, next) => {
    try {
        const loginUserId = req.userData.userId;
        await User.findOneAndUpdate(
            {_id: loginUserId},
            {$set: req.body}
        );

        res.status(200).json({
            message: 'Successfully Updated user info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.checkUserByPhone = async (req, res, next) => {

    const phoneNo = req.params.phoneNo;

    try {

        if (await User.findOne({username: phoneNo})) {
            res.status(200).json({
                data: true,
                message: 'Check Your Phone & Enter OTP Below!'
            });
        } else {
            res.status(200).json({
                data: false,
                message: 'No Account Exists With This Phone Number!'
            });
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * USER CONTROL BY ADMIN
 */
exports.getUserLists = async (req, res, next) => {
    try {
        const users = await User.find().select('-password -carts -checkouts')

        res.status(200).json({
            data: users,
            message: 'Successfully all user list.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * ADDRESS
 */

/**
 * ADDRESS
 */

exports.addAddress = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const data = req.body;
        const final = {...data, ...{user: userId}}
        const newAddress = new Address(final);
        const address = await newAddress.save();

        await User.findOneAndUpdate({ _id: userId }, { $push: { addresses: address._id } });

        res.status(200).json({
            message: 'Successfully added address.'
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editAddress = async (req, res, next) => {

    try {
        const data = req.body;

        await Address.findOneAndUpdate({_id: data._id}, {$set: data})

        res.status(200).json({
            message: 'Successfully added address.'
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAddresses = async (req, res, next) => {

    try {
        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let queryData;
        let data;


        if (pageSize && currentPage) {
            console.log(currentPage)
            queryData = User.findOne({_id: userId})
                .select('addresses -_id')
                .populate({
                    path: 'addresses',
                    // select: 'addresses',
                    model:'Address',
                    options: {
                        sort:{createdAt: -1},
                        skip: Number(pageSize) * (Number(currentPage) - 1),
                        limit : Number(pageSize)
                    }
                })
        } else {
            queryData = User.findOne({_id: userId})
                .select('addresses -_id')
                .populate({
                    path: 'addresses',
                    // select: 'addresses',
                    model:'Address'
                })
        }

        data = await queryData;

        // COUNT IN POPULATE ARRAY
        const id = mongoose.Types.ObjectId(userId);
        const dataCount = await User.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {$project: { count: { $size: "$addresses" }}}
        ])

        res.status(200).json({
            data: data.addresses ? data.addresses : null,
            count: dataCount && dataCount.length > 0 ? dataCount[0].count : 0,
            message: 'Order get Successfully!'
        });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.deleteUserAddress = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const id = req.params.id;

        await Address.deleteOne({_id: id});

        await User.findByIdAndUpdate({_id: userId}, {$pull: {addresses: id}});

        res.status(200).json({
            message: 'Address deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.editUserAccess = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const userId = req.params.id;

        await User.updateOne(
            {_id: userId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'User Access updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
