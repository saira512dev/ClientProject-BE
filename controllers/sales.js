import Sales from "../models/Sales.js";
import Product from "../models/Product.js";
import axios from "axios";

export const getSales = async (req, res) => {
  try {
    let data = await Sales.findOne({userId: req.session.passport.user})
    console.log(data, "HERE", req.session.passport.user)
    res.status(200).json({data});
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const searchSales = async (req, res) => {
  try {
    const { searchString } = req.query;
    // console.log(JSON.parse(searchString).searchQuery);
    // console.log(JSON.parse(searchString).searchQuery)
    // res.status(404).json("end");
    // return;
    const url =
      "https://api.dataforseo.com/v3/dataforseo_labs/google/historical_search_volume/live";

    const data = [
      {
        keywords: [JSON.parse(searchString).searchQuery.query],
        location_code: JSON.parse(searchString).searchQuery.country || 2840,
        language_code: JSON.parse(searchString).searchQuery.language || "en",
        include_serp_info: false,
      },
    ];
     console.log(data)
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
    // console.log(results[0].monthlySearches);
    // console.log(req.session.passport.user);
    //If there are results from search then store the results in the db
    //also check if the user already has a search store. If yes, delete it.
    if (results) {
        Sales.findOneAndDelete({ userId: req.session.passport.user }, function (err, deletedDoc) {
            if (err) {
              console.log(err);
            } else if (!deletedDoc) {
              console.log("Document not found.");
            } else {
              console.log("Deleted document: ");
            }
        });
      let search = new Sales({
        search_item: JSON.parse(searchString).searchQuery.query,
        userId: req.session.passport.user,
        competition: results[0].competition,
        competitionLevel: results[0].competitionLevel,
        cpc: results[0].cpc,
        monthlySearches: results[0].monthlySearches,
      });
      console.log("search");
      // console.log(search);
      search.save();
    }
    // console.log(results);
    //    const res = ""
    // console.log("REQUEST HERE")
    res.status(200).json(results);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const { searchString } = req.query;
    // console.log(JSON.parse(searchString).searchQuery);
    console.log(JSON.parse(searchString).searchQuery)
    // res.status(404).json("end");
    // return;
    const TaskUrl =
    "https://api.dataforseo.com/v3/merchant/google/products/task_post"

    const taskData = [
      {
        location_code: JSON.parse(searchString).searchQuery.country || 2840,
        language_code: JSON.parse(searchString).searchQuery.language || "en",
        keyword: encodeURI(JSON.parse(searchString).searchQuery.query),
        priority: 2,
        search_param: "adtest=on"
      },
    ];
    //  console.log(taskData)
    const config = {
      headers: {
        Authorization:
          "Basic bmF0aGFuLmFsdmVzQGVwaXRlY2guZXU6OWRhZDc4ZDFhODdkOGRhOQ==",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(TaskUrl, taskData, config);
    await new Promise(resolve => setTimeout(resolve, 60000));
    const taskId = response.data.tasks[0].id;
    console.log(taskId)

    const searchUrl =
    "https://api.dataforseo.com/v3/merchant/google/products/task_get/advanced/"+taskId;
    
    const searchResponse = await axios.get(searchUrl, config);
    const searchResults = searchResponse.data.tasks[0].result[0].items;
    
    //If there are results from search then store the results in the db
    //also check if the user already has a search store. If yes, delete it.
    if (!searchResults[0].title.includes("Undefined")) {
        Product.findOneAndDelete({ userId: req.session.passport.user }, function (err, deletedDoc) {
            if (err) {
              console.log(err);
            } else if (!deletedDoc) {
              console.log("Document not found.");
            } else {
              console.log("Deleted document: ");
            }
        });
      let updatedProduct = new Product({
        userId: req.session.passport.user,
        description: searchResults[0].description,
      title: searchResults[0].title,
      items : searchResults[0].items,
      });
      console.log("search");
      //console.log(updatedProduct);
      updatedProduct.save();
    }
    else {
      res.status(404).json("NO RESULTS")
      return
    }
     
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
