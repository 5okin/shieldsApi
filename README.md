# Shields.io API

This is a API that retrieves social media statistics from MongoDB. It is designed to work with [Shields.io](https://shields.io/) to generate dynamic badges for the [Mercury discord bot](https://github.com/5okin/MercuryBot) like the following: 

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=827564914733350942&permissions=534723885120&scope=bot">
    <img src="https://img.shields.io/endpoint?url=https://shieldsio-api-production.up.railway.app/api/stats/discordservers&style=for-the-badge&logo=discord&logoColor=%235865f2"></a>
  <a href="https://discord.com/api/oauth2/authorize?client_id=827564914733350942&permissions=534723885120&scope=bot">
    <img src="https://img.shields.io/endpoint?url=https://shieldsio-api-production.up.railway.app/api/stats/discordusers&style=for-the-badge&logo=discord&logoColor=%235865f2"></a>
  <a href="https://x.com/_MercuryBot_">
    <img src="https://img.shields.io/endpoint?url=https://shieldsio-api-production.up.railway.app/api/stats/twitter&style=for-the-badge&logo=x"></a>
  <a href="https://bsky.app/profile/mercurybot.bsky.social">
    <img src="https://img.shields.io/endpoint?url=https://shieldsio-api-production.up.railway.app/api/stats/bluesky&style=for-the-badge&logo=bluesky"></a>
</div>

note: It is only accesible from shields.io IPs 

## Setup

### Clone the Repository
```bash
shieldsApigit clone https://github.com/5okin/shieldsApi.git
cd social-stats-api
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
DB_NAME=your-database-name
DB_COLLECTION=your-collection-name
```

### Start the API
```bash
npm start
```

## API Endpoints
### **Get Social Media Stats**
```http
GET /api/stats/:platform
```
#### **Supported Platforms:**
- `discordservers`
- `discordusers`
- `discordusers`
- `blueSky`
- `twitter`

#### **Example Request:**
```bash
curl -X GET "https://your-api-url.com/api/stats/twitter"
```
#### **Example Response:**
```json
{
  "schemaVersion": 1,
  "label": "Followers on X",
  "message": "1000",
  "color": "#211f2d"
}
```