# Robin Technical Assessment (API)

## Install (Requires HomeBrew)
1. Install NPM `brew install npm`
2. Install MongoDB `brew tap mongodb/brew; brew install mongodb-community@4.4`
3. Start MongoDB `mongod --config /usr/local/etc/mongod.conf`
4. Install Node.js Packages `npm install`
5. Start Server `node server.js`

Run Unit Tests
`./node_modules/.bin/mocha tests --exit`

## Example Requests

### Availability Service
GET Availability
```
curl --location --request GET 'localhost:3000/availability' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userIds": ["5f6370cd77407e7bc3957bfb","5f6370dc77407e7bc3957bfe"],
    "start": "2020-10-10T01:00:00+00:00",
    "end": "2020-10-10T20:00:00+00:00",
    "workHoursOnly": true
} '
```
```
{
    "results": {
        "availableHours": [
            "2020-10-10 11:00:00",
            "2020-10-10 12:00:00",
            "2020-10-10 13:00:00",
            "2020-10-10 14:00:00",
            "2020-10-10 15:00:00"
        ],
        "userData": [
            {
                "doc": {
                    "_id": "5f6370cd77407e7bc3957bfb",
                    "firstName": "Sam",
                    "lastName": "Jones",
                    "timezone": "America/Chicago",
                    "workStart": "9",
                    "workStop": "17",
                    "events": [
                        {
                            "_id": "5f6370cd77407e7bc3957bfc",
                            "name": "Daily Standup",
                            "timezone": "America/Chicago",
                            "start": "2020-10-10T06:00:00+00:00",
                            "end": "2020-10-10T08:00:00+00:00"
                        },
                        {
                            "_id": "5f6370cd77407e7bc3957bfd",
                            "name": "Morning Commute",
                            "timezone": "America/Chicago",
                            "start": "2020-10-10T03:00:00+00:00",
                            "end": "2020-10-10T04:00:00+00:00"
                        }
                    ],
                    "__v": 0
                },
                "busy": [
                    "2020-10-10 06:00:00",
                    "2020-10-10 07:00:00",
                    "2020-10-10 03:00:00"
                ]
            },
            {
                "doc": {
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
                },
                "busy": [
                    "2020-10-10 16:00:00",
                    "2020-10-10 17:00:00",
                    "2020-10-10 04:00:00"
                ]
            }
        ]
    }
}
```

### Users
GET User
```
curl --location --request GET 'localhost:3000/user/5f6370dc77407e7bc3957bfe'
```
```
{
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
```

GET All Users
```
curl --location --request GET 'localhost:3000/user'
```

POST User
```
curl --location --request POST 'localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Lauren",
    "lastName": "Ritter",
    "timezone": "America/Chicago",
    "workStart": 10,
    "workStop": 18,
    "events": [
        {
            "name": "Daily Standup",
            "timezone": "America/Chicago",
            "start": "2020-10-10T16:00:00+00:00",
            "end": "2020-10-10T18:00:00+00:00"
        },
        {
            "name": "Morning Commute",
            "timezone": "America/Chicago",
            "start": "2020-10-10T04:00:00+00:00",
            "end": "2020-10-10T05:00:00+00:00"
        }
    ]
}'
```
```
{
    "_id": "5f63824d1c015d880808357b",
    "firstName": "Lauren",
    "lastName": "Ritter",
    "timezone": "America/Chicago",
    "workStart": "10",
    "workStop": "18",
    "events": [
        {
            "_id": "5f63824d1c015d880808357c",
            "name": "Daily Standup",
            "timezone": "America/Chicago",
            "start": "2020-10-10T16:00:00+00:00",
            "end": "2020-10-10T18:00:00+00:00"
        },
        {
            "_id": "5f63824d1c015d880808357d",
            "name": "Morning Commute",
            "timezone": "America/Chicago",
            "start": "2020-10-10T04:00:00+00:00",
            "end": "2020-10-10T05:00:00+00:00"
        }
    ],
    "__v": 0
}
```
```
curl --location --request POST 'localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Sam",
    "lastName": "Jones",
    "timezone": "America/Chicago",
    "workStart": 9,
    "workStop": 17,
    "events": [
        {
            "name": "Daily Standup",
            "timezone": "America/Chicago",
            "start": "2020-10-10T06:00:00+00:00",
            "end": "2020-10-10T08:00:00+00:00"
        },
        {
            "name": "Morning Commute",
            "timezone": "America/Chicago",
            "start": "2020-10-10T03:00:00+00:00",
            "end": "2020-10-10T04:00:00+00:00"
        }
    ]
} '
```
```
{
    "_id": "5f6382751c015d880808357e",
    "firstName": "Sam",
    "lastName": "Jones",
    "timezone": "America/Chicago",
    "workStart": "9",
    "workStop": "17",
    "events": [
        {
            "_id": "5f6382751c015d880808357f",
            "name": "Daily Standup",
            "timezone": "America/Chicago",
            "start": "2020-10-10T06:00:00+00:00",
            "end": "2020-10-10T08:00:00+00:00"
        },
        {
            "_id": "5f6382751c015d8808083580",
            "name": "Morning Commute",
            "timezone": "America/Chicago",
            "start": "2020-10-10T03:00:00+00:00",
            "end": "2020-10-10T04:00:00+00:00"
        }
    ],
    "__v": 0
}
```

DELETE User
```
curl --location --request DELETE 'localhost:3000/user/5f6382751c015d880808357e' 
```
