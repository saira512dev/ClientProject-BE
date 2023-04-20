import OverallStat from "../models/OverallStat.js";
import axios from "axios"

export const getSales = async(req, res) => {
    try {
        // const overallStats = await OverallStat.find();

        // res.status(200).json(overallStats[0])
        res.status(200).json({"lll":"sss"})

    } catch ( error ) {
        res.status(404).json({message: error})
    }
}

export const searchSales = async(req, res) => {
    try {
        // const overallStats = await OverallStat.find();
        const { searchString } = req.query;
        axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_search_volume/live',
            auth: {
              username: 'login',
              password: 'password'
            },
            data: JSON.parse(searchString),
            headers: {
              'content-type': 'application/json'
            }
          }).then(function (response) {
            var result = response['data']['tasks'];
            // Result data
            console.log(result);
          }).catch(function (error) {
            console.log(error);
          });
        // console.log("REQUEST HERE")
        // res.status(200).json(JSON.parse(searchString))

    } catch ( error ) {
        res.status(404).json({message: error})
    }
}