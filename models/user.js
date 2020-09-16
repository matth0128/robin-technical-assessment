// Schema
const userSchema = {
    firstName: String,
    lastName: String,
    workStart: String,
    workStop: String,
    timezone: String,
    events: [{
        name: String,
        timezone: String,
        start: String,
        end: String
    }]
};

// Return model
module.exports = userSchema;
