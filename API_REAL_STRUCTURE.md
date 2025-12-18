# API Response Structure - Real Backend Data

## Events Endpoint

### GET /events

**Request:**
```
GET https://un1t-back-end-development.up.railway.app/events
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "pageSize": 10
  },
  "data": [
    {
      "_id": "6944293129baa264a95f9170",
      "creator": "693abdaf3048e04eaea2ffc9",
      "studio": "6941cdabdbfd3569f7ece976",
      "schedule": "6941cdabdbfd3569f7ece978",
      "status": "active",
      "title": "Event #002",
      "description": "Test",
      "startTime": "2025-12-19T16:00:00.000Z",
      "endTime": "2025-12-19T18:00:00.000Z",
      "coach": "694428f829baa264a95f9157",
      "workout": "693ac0181ad3f6e808059b5d",
      "timerTemplate": "693b3f0adbc8dd7e1f285cac",
      "timer": "6944293129baa264a95f9172",
      "bookings": [],
      "createdAt": "2025-12-18T16:17:53.172Z",
      "updatedAt": "2025-12-18T16:17:53.172Z",
      "__v": 0
    }
  ]
}
```

### GET /events/:id

**Request:**
```
GET https://un1t-back-end-development.up.railway.app/events/6944293129baa264a95f9170
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6944293129baa264a95f9170",
    "creator": "693abdaf3048e04eaea2ffc9",
    "studio": "6941cdabdbfd3569f7ece976",
    "schedule": "6941cdabdbfd3569f7ece978",
    "status": "active",
    "title": "Event #002",
    "description": "Test",
    "startTime": "2025-12-19T16:00:00.000Z",
    "endTime": "2025-12-19T18:00:00.000Z",
    "coach": "694428f829baa264a95f9157",
    "workout": "693ac0181ad3f6e808059b5d",
    "timerTemplate": "693b3f0adbc8dd7e1f285cac",
    "timer": "6944293129baa264a95f9172",
    "bookings": [],
    "createdAt": "2025-12-18T16:17:53.172Z",
    "updatedAt": "2025-12-18T16:17:53.172Z",
    "__v": 0
  }
}
```

## Field Mapping

### What Backend Sends → What Frontend Expected

| Backend Field | Frontend Field | Type | Notes |
|--------------|----------------|------|-------|
| `title` | `name` | string | ✅ Normalized |
| `startTime` | `start_time` | string (ISO) | ✅ Normalized |
| `endTime` | `end_time` | string (ISO) | ✅ Normalized |
| `coach` | `instructor` | ID or Object | ⚠️ Backend sends just ID |
| `studio` | `location` | ID or Object | ⚠️ Backend sends just ID |
| ❌ (missing) | `duration` | number | 🔧 Calculated from start/end |
| ❌ (missing) | `tags` | string[] | ⚠️ Not in backend yet |
| ❌ (missing) | `credit_cost` | number | ⚠️ Not in backend yet |

## Studios Endpoint

### GET /studios

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6941cdabdbfd3569f7ece976",
      "creator": "...",
      "owner": "...",
      "status": "active",
      "title": "Studio Name",
      "email": "studio@example.com",
      "phone": "+123456789",
      "avatar": "...",
      "country": "ES",
      "city": "València",
      "address": "...",
      "language": "en",
      "timezone": "Europe/Madrid",
      "coaches": [],
      "clients": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Users Endpoint

### GET /users/me

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "_id": "694207d7f2ac5ca38955ba94",
    "role": "client",
    "status": "active",
    "firstName": "Nazar",
    "lastName": "Moroz",
    "email": "nazar.m@gimmir.com",
    "phone": "+380 (63) 201 19 52",
    "birthday": "1997-10-26T00:00:00.000Z",
    "country": "ES",
    "city": "València",
    "address": "...",
    "timezone": "Europe/London",
    "language": "uk",
    "studio": "6941cdabdbfd3569f7ece976",
    "schedule": "694207d7f2ac5ca38955ba96",
    "ownedStudios": [],
    "nextOfKin": {
      "firstName": "...",
      "lastName": "...",
      "phone": "..."
    },
    "createdAt": "2025-12-17T01:31:03.759Z",
    "updatedAt": "2025-12-17T01:31:03.798Z"
  }
}
```

## Issues Found

### ✅ Fixed
- Field naming mismatch (camelCase vs snake_case)
- Missing `name` field (normalized from `title`)
- Missing `start_time`/`end_time` fields (normalized from `startTime`/`endTime`)

### ⚠️ Needs Backend Update
- `coach` field is just an ID, not a populated object with `first_name`, `last_name`, `image_url`
- `studio` field is just an ID, frontend needs `location` with `name`
- Missing fields: `tags`, `credit_cost`, `duration`

### 🔧 Workarounds Implemented
- `duration` - calculated from `startTime` and `endTime`
- `instructor` - creates placeholder object with ID
- `location` - creates placeholder object with ID
- `tags` - returns empty array
- `credit_cost` - returns 0

## Testing

Run the test script to see current API responses:

```bash
./test-api.sh
```

This will create JSON files:
- `events-response.json` - All events
- `event-detail-response.json` - Single event detail
- `studios-response.json` - All studios
- `user-response.json` - Current user profile

## Recommendations

### Option 1: Backend Populates Related Data
Ask backend to populate `coach` and `studio` fields:

```javascript
// Backend should do:
Event.find().populate('coach').populate('studio')
```

This would return:
```json
{
  "coach": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "..."
  },
  "studio": {
    "_id": "...",
    "title": "Main Studio",
    "address": "..."
  }
}
```

### Option 2: Frontend Fetches Related Data
Frontend makes separate requests to get coach and studio details.

### Option 3: Current Solution
Use placeholders and populate from cache/separate calls (current implementation).
