const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    email: {
        type: String,
        required: function() {
            return !this.twitterId;  
        },
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    twitterId: { 
        type: String, 
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    images: { 
        type: [String],
        required: false
    },
    product: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    }]
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const saltRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
})
module.exports = mongoose.model('User', userSchema);



