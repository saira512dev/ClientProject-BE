import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js"
import User from "../models/User.js"
import Transaction from "../models/Transaction.js"
// import Backlink from "../models/backlink.js"
import getCountryIso3 from "country-iso-2-to-3"
import axios from "axios";

export const getProducts = async (req, res) => {
    console.log("USERID", req.query.userId)
    try {
        const products = await Product.find({userId: req.query.userId});
        console.log(products)
        res.status(200).json(products)
    } catch( error ) {
        res.status(404).json({message: error})
    }
}

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({role: "user"}).select("-password");

        res.status(200).json(customers)
    } catch( error ) {
        res.status(404).json({message: error})
    }
}

export const getTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        //formatted sort should look like {userId: -1}
        const generateSort = () => {
            const sortedParsed = JSON.parse(sort)
            const sortFormatted = {
                [sortedParsed.field]: sortedParsed.sort = "asc" ? 1 : -1
            }

            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i")}},
                { userId: { $regex: new RegExp(search, "i")}}
            ],
        }).sort(sortFormatted).skip(page * pageSize).limit(pageSize);
        console.log("🚀 ~ file: client.js:63 ~ getTransactions ~ transactions", transactions)

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i"}
        })
        console.log("🚀 ~ file: client.js:68 ~ getTransactions ~ total", total)

        res.status(200).json({transactions, total})
    } catch( error ) {
        res.status(404).json({message: error})
    }
}



export const getGeography = async(req, res) => {
    try {
        const users = await User.find()

        const mappedLocations = users.reduce((acc,{ country }) => {
            const countryISO3 = getCountryIso3(country)

            if(!acc[countryISO3]) acc[countryISO3] = 1;
            else acc[countryISO3]++
            return acc
        },{});

        const formattedLocations = Object.entries(mappedLocations).map(([country, count]) => {
            return { id: country, value: count}
        })

        res.status(200).json(formattedLocations)
    } catch ( error ) {
        res.status(404).json({message: error})
    }
}