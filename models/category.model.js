import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        validate: {
            validator: function(value) {
                // userId is required only if isSystem is false
                return this.isSystem === true || (value != null);
            },
            message: 'userId is required for non-system categories'
        }
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    icon: {
        type: String,
        default: "default",
    },
    color: {
        type: String,
        default: "#000000",
    },
}, { timestamps: true });

categorySchema.index(
    { userId: 1, name: 1, type: 1 },
    { unique: true, partialFilterExpression: { isSystem: false } }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;