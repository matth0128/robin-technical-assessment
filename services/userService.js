const _ = require('lodash');
const moment = require('moment-timezone');
const userSchema = require('../models/user');
const eventSchema = require('../models/event');

class userService {
    constructor(mongoose){
        if (_.isNil(mongoose)) {
            throw new Error("Missing Mongoose Connection!");
        }
        this.mongoose = mongoose;

        this.workHours = {start: 1, stop: 23}; 
    }

    // Compare the Availability of Multiple Users
    async compareAvailability (userIds, start, end, workHoursOnly = false) {
        let mongoUserIds = [];
        _.forEach(userIds, (userId) => {
            mongoUserIds.push(this.mongoose.Types.ObjectId(userId));
        });
        
        // Load and Aggregate User Data
        let userData = [];
        const user = this.mongoose.model('User', userSchema);
        await user.find({'_id': { $in: mongoUserIds }}, (err, docs) => {
            if (err) {
                console.log("error", err);
            } else {
                _.forEach(docs, (doc) => {
                    const busy = this.hydrateBusyHours(doc);
                    userData.push({doc, busy});

                    // Get the maxmimum work start hour and minimum work stop hour for all users.
                    if (parseInt(doc.workStart) > this.workHours.start) {
                        this.workHours.start = parseInt(doc.workStart);
                    }

                    if (parseInt(doc.workStop) < this.workHours.stop) {
                        this.workHours.stop = parseInt(doc.workStop);
                    }
                });
            }
        });

        // Create Hourly Availabiliy array based on the start and end values of the requested time period.
        // Use this.workHours to limit the availableHours array to working hours only.
        let availableHours = [];
        if (workHoursOnly) {
            availableHours = this.hydrateAvailableHours(start, end, this.workHours);
        } else {
            availableHours = this.hydrateAvailableHours(start, end);
        }
        
        // Merge all busy hours in to one array.
        let busyHours = [];
        _.forEach(userData, (user) => {
            busyHours = _.concat(busyHours, user.busy);
        });
        
        // Remove busy hours from available hours.
        _.forEach(busyHours, (time) => {
            _.remove(availableHours, (item) => {
                return item === time;
            });
        });

        // Return remaing available hours.
        return {availableHours, userData};
    }

    // Create Array of Busy Hours
    hydrateBusyHours (user) {
        let busy = [];
        _.forEach(user.events, (event) => {
            const numHours = this.countHours(event.start, event.end);
            for (let i = 0; i < numHours; i++) {
                busy.push(moment(event.start).utcOffset('+0000').add(i, 'hours').format('YYYY-MM-DD HH:00:00'));
            }
        });
        return busy;
    }

    // Create Array of Available Hours
    hydrateAvailableHours (start, end, workHours = {}) {
        const numHours = this.countHours(start, end);
        let availability = [];
        for (let i = 0; i < numHours; i++) {
            const availHour = moment(start).utcOffset('+0000').add(i, 'hours').format('YYYY-MM-DD HH:00:00');
            if (!_.isEmpty(workHours)) {
                const startHour = parseInt(moment(availHour).format('H'));
                if (startHour > workHours.start && startHour < workHours.stop) {
                    availability.push(availHour);                
                }
            } else {
                availability.push(availHour);
            }
        }

        return availability;
    }

    // Count the Hours Between Two Dates
    countHours (start, end) {
        const date1 = moment(start);
        const date2 = moment(end);
        return Math.abs(date1.diff(date2, 'hours'));
    }
}

module.exports = userService;
