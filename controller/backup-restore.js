const fs = require('fs');
const os = require("os");
const Address = require('../models/address');
const Admin = require('../models/admin');
const Bazaar = require('../models/bazaar');
const Book = require('../models/book');
const Branch = require('../models/branch');
const Brand = require('../models/brand');

const Carousel = require('../models/carousel');
const Cart = require('../models/cart');
const Category = require('../models/category');
const Checkout = require('../models/checkout');
const ContactInfo = require('../models/contact-info');
const Coupon = require('../models/coupon');

const FilterCategory = require('../models/filter-category');
const FeaturedProduct = require('../models/featured-product');
const GiftInfo = require('../models/gift-info');
const Gallery = require('../models/gallery');
const ImageFolder = require('../models/image-folder');
const Menu = require('../models/menu');

const offerBanner = require('../models/offer-banner');
const offerBannerCard = require('../models/offer-banner-card');
const OfferPackage = require('../models/offer-package');
const OfferList = require('../models/offer-product');
const OrderPaymentInfo = require('../models/order-payment-info');
const OrderTemporary = require('../models/order-temporary');
const Order = require('../models/order');

const PageInfo = require('../models/page-info');
const ProductExtraData = require('../models/product-extra-data');
const Product = require('../models/product');

const ReviewOld = require('../models/review');
const Review = require('../models/review-control');
const Role = require('../models/role');

const ExtraData = require('../models/shippng-charge');
const SubCategory = require('../models/sub-category');
const Test = require('../models/test');
const TestProduct = require('../models/test-product');

const User = require('../models/user');

const Wishlist = require('../models/wishlist');


const STATIC_DIR = `./database/backup/`;
const STATIC_DIR_PATH = `/database/backup/`;

exports.backupCollection = async (req, res, next) => {

    try {
        const collectionName = req.body.collectionName.trim();
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            const data = await model.find();

            if (!fs.existsSync(STATIC_DIR)) {
                fs.mkdir(STATIC_DIR, () => {
                    fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                });

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`
                });
            } else {
                fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`
                });
            }
        } else {
            res.status(200).json({
                success: false,
                message: `${collectionName} model has not exists`
            });
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


exports.restoreCollection = async (req, res, next) => {

    try {
        const collectionName = req.body.collectionName.trim();
        const force = req.body.force;
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            // Model Data
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            if (fs.existsSync(STATIC_DIR + fileName)) {
                const data = fs.readFileSync(STATIC_DIR + fileName);
                const docs = JSON.parse(data.toString());
                const backupLength = docs && docs.length ? docs.length : 0;
                const documentsLength = await model.countDocuments();

                if (!force) {
                    if (backupLength < documentsLength) {
                        res.status(200).json({
                            success: false,
                            message: `${collectionName} model length is ${documentsLength} but backup data length is ${backupLength}`
                        });
                    } else {
                        await model.deleteMany({});
                        await model.insertMany(docs);

                        res.status(200).json({
                            success: true,
                            message: `${collectionName} model restore successfully`
                        });
                    }
                } else {
                    await model.deleteMany({});
                    await model.insertMany(docs);

                    res.status(200).json({
                        success: true,
                        message: `${collectionName} model restore successfully`
                    });
                }

            } else {
                res.status(200).json({
                    success: false,
                    message: 'No Backup file found!'
                });
            }
        } else {
            res.status(200).json({
                success: false,
                data: `${collectionName} model has not exists`
            });
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

exports.getCollectionList = async (req, res, next) => {

    try {
        const collections = getModelWithFileData();

        res.status(200).json({
            success: true,
            data: collections
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


function getModelData(collectionName) {
    let model;
    let fileName;

    switch (collectionName) {

        case 'Admin': case 'admin':
            model = Admin;
            fileName = `admin.json`;
            break;
        case 'Address': case 'address':
            model = Address;
            fileName = `address.json`;
            break;
        case 'Bazaar': case 'bazaar':
            model = Bazaar;
            fileName = `bazaar.json`;
            break;
        case 'Book': case 'book':
            model = Book;
            fileName = `book.json`;
            break;
        case 'Branch': case 'branch':
            model = Branch;
            fileName = `branch.json`;
            break;
        case 'Brand': case 'brand':
            model = Brand;
            fileName = `brand.json`;
            break;


        case 'Carousel': case 'carousel':
            model = Carousel;
            fileName = `carousel.json`;
            break;
        case 'Cart': case 'cart':
            model = Cart;
            fileName = `cart.json`;
            break;
        case 'Category': case 'category':
            model = Category;
            fileName = `category.json`;
            break;
        case 'Checkout': case 'checkout':
            model = Checkout;
            fileName = `checkout.json`;
            break;
        case 'ContactInfo': case 'contact-info':
            model = ContactInfo;
            fileName = `contact-info.json`;
            break;
        case 'Coupon': case 'coupon':
            model = Coupon;
            fileName = `coupon.json`;
            break;

        case 'FilterCategory': case 'filter-category':
            model = FilterCategory;
            fileName = `filter-category.json`;
            break;
        case 'FeaturedProduct': case 'featured-product':
            model = FeaturedProduct;
            fileName = `featured-product.json`;
            break;
        case 'GiftInfo': case 'gift-info':
            model = GiftInfo;
            fileName = `gift-info.json`;
            break;
        case 'Gallery': case 'gallery':
            model = Gallery;
            fileName = `gallery.json`;
            break;

        case 'ImageFolder': case 'image-folder':
            model = ImageFolder;
            fileName = `image-folder.json`;
            break;

        case 'Menu': case 'menu':
            model = Menu;
            fileName = `menu.json`;
            break;

        case 'offerBanner': case 'offer-banner':
            model = offerBanner;
            fileName = `offer-banner.json`;
            break;
        case 'offerBannerCard': case 'offer-banner-card':
            model = offerBannerCard;
            fileName = `offer-banner-card.json`;
            break;
        case 'OfferPackage': case 'offer-package':
            model = OfferPackage;
            fileName = `offer-package.json`;
            break;
        case 'OfferList': case 'offer-product':
            model = OfferList;
            fileName = `offer-product.json`;
            break;
        case 'OrderPaymentInfo': case 'order-payment-info':
            model = OrderPaymentInfo;
            fileName = `order-payment-info.json`;
            break;
        case 'OrderTemporary': case 'order-temporary':
            model = OrderTemporary;
            fileName = `order-temporary.json`;
            break;
        case 'Order': case 'order':
            model = Order;
            fileName = `order.json`;
            break;

        case 'PageInfo': case 'page-info':
            model = PageInfo;
            fileName = `page-info.json`;
            break;
        case 'ProductExtraData': case 'product-extra-data':
            model = ProductExtraData;
            fileName = `product-extra-data.json`;
            break;
        case 'Product': case 'product':
            model = Product;
            fileName = `product.json`;
            break;


        case 'ReviewOld': case 'review':
            model = ReviewOld;
            fileName = `review.json`;
            break;
        case 'Review': case 'review-control':
            model = Review;
            fileName = `review-control.json`;
            break;
        case 'Role': case 'role':
            model = Role;
            fileName = `role.json`;
            break;
        case 'ExtraData': case 'shippng-charge':
            model = ExtraData;
            fileName = `shippng-charge.json`;
            break;
        case 'SubCategory': case 'sub-category':
            model = SubCategory;
            fileName = `sub-category.json`;
            break;
        case 'Test': case 'test':
            model = Test;
            fileName = `test.json`;
            break;
        case 'TestProduct': case 'test-product':
            model = TestProduct;
            fileName = `test-product.json`;
            break;

        case 'User': case 'user':
            model = User;
            fileName = `user.json`;
            break;

        case 'Wishlist': case 'wishlist':
            model = Wishlist;
            fileName = `wishlist.json`;
            break;
        default:
            console.log(`Sorry, we are out of ${collectionName}.`);
    }

    if (model && fileName) {
        return {model, fileName}
    } else {
        return null;
    }
}

function getModelWithFileData() {
    return [
        {
            name: 'Admin',
            size: fileInfo(STATIC_DIR + 'admin.json').size,
            lastModified: fileInfo(STATIC_DIR + 'admin.json').mtime
        },
        {
            name: 'Address',
            size: fileInfo(STATIC_DIR + 'address.json').size,
            lastModified: fileInfo(STATIC_DIR + 'address.json').mtime
        },
        {
            name: 'Bazaar',
            size: fileInfo(STATIC_DIR + 'bazaar.json').size,
            lastModified: fileInfo(STATIC_DIR + 'bazaar.json').mtime
        },
        {
            name: 'Book',
            size: fileInfo(STATIC_DIR + 'book.json').size,
            lastModified: fileInfo(STATIC_DIR + 'book.json').mtime
        },
        {
            name: 'Branch',
            size: fileInfo(STATIC_DIR + 'branch.json').size,
            lastModified: fileInfo(STATIC_DIR + 'branch.json').mtime
        },
        {
            name: 'Brand',
            size: fileInfo(STATIC_DIR + 'brand.json').size,
            lastModified: fileInfo(STATIC_DIR + 'brand.json').mtime
        },

        {
            name: 'Carousel',
            size: fileInfo(STATIC_DIR + 'carousel.json').size,
            lastModified: fileInfo(STATIC_DIR + 'carousel.json').mtime
        },
        {
            name: 'Cart',
            size: fileInfo(STATIC_DIR + 'cart.json').size,
            lastModified: fileInfo(STATIC_DIR + 'cart.json').mtime
        },
        {
            name: 'Category',
            size: fileInfo(STATIC_DIR + 'category.json').size,
            lastModified: fileInfo(STATIC_DIR + 'category.json').mtime
        },
        {
            name: 'Checkout',
            size: fileInfo(STATIC_DIR + 'checkout.json').size,
            lastModified: fileInfo(STATIC_DIR + 'checkout.json').mtime
        },
        {
            name: 'ContactInfo',
            size: fileInfo(STATIC_DIR + 'contact-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'contact-info.json').mtime
        },
        {
            name: 'Coupon',
            size: fileInfo(STATIC_DIR + 'coupon.json').size,
            lastModified: fileInfo(STATIC_DIR + 'coupon.json').mtime
        },

        {
            name: 'FilterCategory',
            size: fileInfo(STATIC_DIR + 'filter-category.json').size,
            lastModified: fileInfo(STATIC_DIR + 'filter-category.json').mtime
        },
        {
            name: 'FeaturedProduct',
            size: fileInfo(STATIC_DIR + 'featured-product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'featured-product.json').mtime
        },
        {
            name: 'GiftInfo',
            size: fileInfo(STATIC_DIR + 'gift-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'gift-info.json').mtime
        },
        {
            name: 'Gallery',
            size: fileInfo(STATIC_DIR + 'gallery.json').size,
            lastModified: fileInfo(STATIC_DIR + 'gallery.json').mtime
        },

        {
            name: 'ImageFolder',
            size: fileInfo(STATIC_DIR + 'image-folder.json').size,
            lastModified: fileInfo(STATIC_DIR + 'image-folder.json').mtime
        },
        {
            name: 'Menu',
            size: fileInfo(STATIC_DIR + 'menu.json').size,
            lastModified: fileInfo(STATIC_DIR + 'menu.json').mtime
        },
        {
            name: 'offerBanner',
            size: fileInfo(STATIC_DIR + 'offer-banner.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-banner.json').mtime
        },
        {
            name: 'offerBannerCard',
            size: fileInfo(STATIC_DIR + 'offer-banner-card.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-banner-card.json').mtime
        },
        {
            name: 'OfferPackage',
            size: fileInfo(STATIC_DIR + 'offer-package.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-package.json').mtime
        },
        {
            name: 'OfferList',
            size: fileInfo(STATIC_DIR + 'offer-product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-product.json').mtime
        },
        {
            name: 'OrderPaymentInfo',
            size: fileInfo(STATIC_DIR + 'order-payment-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order-payment-info.json').mtime
        },
        {
            name: 'OrderTemporary',
            size: fileInfo(STATIC_DIR + 'order-temporary.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order-temporary.json').mtime
        },
        {
            name: 'Order',
            size: fileInfo(STATIC_DIR + 'order.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order.json').mtime
        },

        {
            name: 'PageInfo',
            size: fileInfo(STATIC_DIR + 'page-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'page-info.json').mtime
        },
        {
            name: 'ProductExtraData',
            size: fileInfo(STATIC_DIR + 'product-extra-data.json').size,
            lastModified: fileInfo(STATIC_DIR + 'product-extra-data.json').mtime
        },
        {
            name: 'Product',
            size: fileInfo(STATIC_DIR + 'Product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'Product.json').mtime
        },
        
        {
            name: 'Review',
            size: fileInfo(STATIC_DIR + 'review-control.json').size,
            lastModified: fileInfo(STATIC_DIR + 'review-control.json').mtime
        },
        {
            name: 'ReviewOld',
            size: fileInfo(STATIC_DIR + 'review.json').size,
            lastModified: fileInfo(STATIC_DIR + 'review.json').mtime
        },
        {
            name: 'Role',
            size: fileInfo(STATIC_DIR + 'role.json').size,
            lastModified: fileInfo(STATIC_DIR + 'role.json').mtime
        },

        {
            name: 'ExtraData',
            size: fileInfo(STATIC_DIR + 'shippng-charge.json').size,
            lastModified: fileInfo(STATIC_DIR + 'shippng-charge.json').mtime
        },
        {
            name: 'SubCategory',
            size: fileInfo(STATIC_DIR + 'sub-category.json').size,
            lastModified: fileInfo(STATIC_DIR + 'sub-category.json').mtime
        },
        {
            name: 'Test',
            size: fileInfo(STATIC_DIR + 'test.json').size,
            lastModified: fileInfo(STATIC_DIR + 'test.json').mtime
        },
        {
            name: 'TestProduct',
            size: fileInfo(STATIC_DIR + 'test-product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'test-product.json').mtime
        },
        {
            name: 'User',
            size: fileInfo(STATIC_DIR + 'user.json').size,
            lastModified: fileInfo(STATIC_DIR + 'user.json').mtime
        },
        {
            name: 'Wishlist',
            size: fileInfo(STATIC_DIR + 'wishlist.json').size,
            lastModified: fileInfo(STATIC_DIR + 'wishlist.json').mtime
        },
    ];
}


function fileInfo (path) {
    if (fs.existsSync(path)) {
        const { size, mtime, ctime } = fs.statSync(path)
        return {mtime, size, ctime}
    } else {
        return {mtime: null, size: null, ctime: null}
    }
}

function downloadUrl(req, path, fileName) {
    if (fs.existsSync(path)) {
        const baseurl = req.protocol + `${process.env.PRODUCTION_BUILD === 'true' ? 's://' : '://'}` + req.get("host");
        return baseurl + STATIC_DIR_PATH + fileName;
    } else {
        return null;
    }
}




