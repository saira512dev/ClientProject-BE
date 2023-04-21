import Sales from "../models/Sales.js";
import axios from "axios";

export const getSales = async (req, res) => {
  try {
    let data = await Sales.findOne({userId: req.session.passport.user})
    console.log(data)
    res.status(200).json({data});
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const searchSales = async (req, res) => {
  try {
    const { searchString } = req.query;
    console.log(JSON.parse(searchString).searchQuery);
    const url =
      "https://api.dataforseo.com/v3/dataforseo_labs/google/historical_search_volume/live";

    const data = [
      {
        keywords: [JSON.parse(searchString).searchQuery],
        location_code: 2840,
        language_code: "en",
        include_serp_info: false,
      },
    ];

    const config = {
      headers: {
        Authorization:
          "Basic bmF0aGFuLmFsdmVzQGVwaXRlY2guZXU6OWRhZDc4ZDFhODdkOGRhOQ==",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(url, data, config);
    const items = response.data.tasks[0].result[0].items;
    // console.log(items)
    const results = items.map((item) => ({
      monthlySearches: item.keyword_info.monthly_searches,
      competition: item.keyword_info.competition,
      competitionLevel: item.keyword_info.competition_level,
      cpc: item.keyword_info.cpc,
    }));
    console.log(results[0].monthlySearches);
    console.log(req.session.passport.user);
    //If there are results from search then store the results in the db
    //also check if the user already has a search store. If yes, delete it.
    if (results) {
        Sales.findOneAndDelete({ userId: req.session.passport.user }, function (err, deletedDoc) {
            if (err) {
              console.log(err);
            } else if (!deletedDoc) {
              console.log("Document not found.");
            } else {
              console.log("Deleted document: ", deletedDoc);
            }
        });
      let search = new Sales({
        search_item: JSON.parse(searchString).searchQuery,
        userId: req.session.passport.user,
        competition: results[0].competition,
        competitionLevel: results[0].competitionLevel,
        cpc: results[0].cpc,
        monthlySearches: results[0].monthlySearches,
      });
      console.log("search");
      console.log(search);
      search.save();
    }
    console.log(results);
    //    const res = ""
    // console.log("REQUEST HERE")
    res.status(200).json(results);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
