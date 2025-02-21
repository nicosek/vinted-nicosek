const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema({}, { timestamps: true });

const baseSchemaOptions = { ...BaseSchema.obj, timestamps: true }; // 🔥 ✅ On inclut bien les timestamps !

module.exports = { BaseSchema, baseSchemaOptions };
