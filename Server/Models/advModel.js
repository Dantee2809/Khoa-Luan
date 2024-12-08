import mongoose from "mongoose";
const advSchema = new mongoose.Schema({
  img: { type: String, required: true },
  ND: { type: String, required: true }, // Văn bản quảng cáo
});

const Adv = mongoose.model("Adv", advSchema);

export default Adv;
