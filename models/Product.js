import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, 
    title: String,
    description: String,
    items : { type : Array , "default" : [] },
},
{ timestamps: true}
)

const Product = mongoose.model("Product", ProductSchema);
export default Product;