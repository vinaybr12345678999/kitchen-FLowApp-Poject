// import mongoose, { Document, Schema } from "mongoose";

// export interface IMenuItem extends Document {
//     name: string;
//     category: string;
//     price: number;
//     isAvailable: boolean;
//     image: string;
// }

// const menuItemSchema = new Schema<IMenuItem>(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         category: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         price: {
//             type: Number,
//             required: true,
//             min: 0,
//         },

//         isAvailable: {
//             type: Boolean,
//             default: true,
//         },

//         image: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const MenuItem = mongoose.model<IMenuItem>(
//     "MenuItem",
//     menuItemSchema
// );

// export default MenuItem;
import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
    name: string;
    category: string;
    price: number;
    image: string;
    isAvailable: boolean;
}

const menuItemSchema = new Schema<IMenuItem>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
    type: String,
    required: true,
    trim: true,
},

        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model<IMenuItem>(
    "MenuItem",
    menuItemSchema
);

export default MenuItem;