import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import axios from "axios";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).send(user)
    } catch( error ) {
        res.status(404).json({message: error})
    }
}

export const getAuthUser = async (req, res) => {
    try {
        const id  = req.session.passport.user;
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch( error ) {
        res.status(404).json({message: error})
    }
}


export const getDashboardStats = async (req, res) => {
    try {
        const currentMonth = "November";
        const currentYear = 2021;
        const currentDay = "2021-11-15"
        console.log("HAI")

        // Recent Transactions
        const transactions = await Transaction.find().limit(50).sort({ createdAt: -1})

        //Overall Stats
        const overallStat = await OverallStat.find({year: currentYear});

        const {
            totalCustomers, 
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory 
        } = overallStat[0]

        const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => month === currentMonth)
        const todayStats = overallStat[0].dailyData.find(({ date }) => date === currentDay)

        res.status(200).json({ 
            totalCustomers, 
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            todayStats,
            transactions
        })

    } catch( error ) {
        res.status(404).json({message: error})
    }
}

export const getLocationAndLanguage = async(req, res) => {
    try {
        const url =
        "https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages"
    
        // const data = [
        //   {
        //     keywords: [JSON.parse(searchString).searchQuery],
        //     location_code: 2840,
        //     language_code: "en",
        //     include_serp_info: false,
        //   },
        // ];
    
        const config = {
          headers: {
            Authorization:
              "Basic bmF0aGFuLmFsdmVzQGVwaXRlY2guZXU6OWRhZDc4ZDFhODdkOGRhOQ==",
            "Content-Type": "application/json",
          },
        };
    
        const response = await axios.get(url,config);
        const countries = response.data.tasks[0].result
        res.status(200).json(countries)

    } catch (e) {
        res.status(404).json({message: error})
    }
}