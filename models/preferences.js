const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    sessionID: {
        type: String,
    },
    numOfElements: {
        type: Number,
    },
})


preferencesSchema.statics.findPreferences =  async function(sessionID) {
    const foundPref = await this.findOne({ sessionID });
    return foundPref;   
}

module.exports = mongoose.model('Preferences', preferencesSchema);
 