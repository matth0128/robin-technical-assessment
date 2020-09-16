const assert = require('assert');

describe('Testing userService.js', () => {
    // MongoDB
    const mongoose = require('mongoose'); 
    mongoose.connect('mongodb://localhost/robin-rest-api');
    const userSchema = require('../models/user');
    const userDB = mongoose.Schema(userSchema); 
    
    // Load userService()
    const userServ = require('../services/userService.js');
    const userService = new userServ(mongoose);

    it('Function countHours() counts hours correctly.', () => {
        const hours = userService.countHours('2020-10-10T01:00:00+00:00', '2020-10-10T20:00:00+00:00');
        assert.equal(hours, 19);
    });

    it('Function hydrateBusyHours() hydrates busy hours correctly.', () => {
        const mockUser = {
            "_id": "5f6370dc77407e7bc3957bfe",
            "firstName": "Lauren",
            "lastName": "Ritter",
            "timezone": "America/Chicago",
            "workStart": "10",
            "workStop": "18",
            "events": [
                {
                    "_id": "5f6370dc77407e7bc3957bff",
                    "name": "Daily Standup",
                    "timezone": "America/Chicago",
                    "start": "2020-10-10T16:00:00+00:00",
                    "end": "2020-10-10T18:00:00+00:00"
                },
                {
                    "_id": "5f6370dc77407e7bc3957c00",
                    "name": "Morning Commute",
                    "timezone": "America/Chicago",
                    "start": "2020-10-10T04:00:00+00:00",
                    "end": "2020-10-10T05:00:00+00:00"
                }
            ],
            "__v": 0
        }

        const busyHours = userService.hydrateBusyHours(mockUser);
        assert.deepEqual(busyHours, ['2020-10-10 16:00:00', '2020-10-10 17:00:00', '2020-10-10 04:00:00']);
    });

    it('Function hydrateAvailableHours() hydrates availability hours (Non-Working Hours) correctly.', () => {
        const nonWorkingHoursAvailability = [
            '2020-10-10 01:00:00', '2020-10-10 02:00:00', '2020-10-10 03:00:00', '2020-10-10 04:00:00',
            '2020-10-10 05:00:00', '2020-10-10 06:00:00', '2020-10-10 07:00:00', '2020-10-10 08:00:00',
            '2020-10-10 09:00:00', '2020-10-10 10:00:00', '2020-10-10 11:00:00', '2020-10-10 12:00:00',
            '2020-10-10 13:00:00', '2020-10-10 14:00:00', '2020-10-10 15:00:00', '2020-10-10 16:00:00',
            '2020-10-10 17:00:00', '2020-10-10 18:00:00', '2020-10-10 19:00:00'
        ];

        const availability = userService.hydrateAvailableHours('2020-10-10T01:00:00+00:00', '2020-10-10T20:00:00+00:00');
        assert.deepEqual(availability, nonWorkingHoursAvailability);
             
    });

    it('Function hydrateAvailableHours() hydrates availability hours (Working Hours Only) correctly.', () => {
        const workingHoursAvailability = [
            "2020-10-10 11:00:00", "2020-10-10 12:00:00", "2020-10-10 13:00:00", "2020-10-10 14:00:00",
            "2020-10-10 15:00:00","2020-10-10 16:00:00"
        ];

        const availability = userService.hydrateAvailableHours(
            '2020-10-10T01:00:00+00:00',
            '2020-10-10T20:00:00+00:00',
            { 'start': 10, 'stop': 17 }
        );
        assert.deepEqual(availability, workingHoursAvailability);
             
    });
});

