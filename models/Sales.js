import mongoose from "mongoose";

const MonthlySearchesSchema = new mongoose.Schema(
    {
      year: Number,
      month: Number,
      search_volume: Number,
    },
    { _id: false }
  );

const SalesSchema = new mongoose.Schema({
    search_item: String,
    competition: Number,
    cpc: Number,
    competitionLevel: String,
    monthlySearches: [MonthlySearchesSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, 
},
{ timestamps: true}
)

const Sales = mongoose.model("Sales", SalesSchema);
export default Sales;