# Natours

## Usage
- **Server setup**
```bash
# 1. clone this repo

# 2. cd into it
~ cd Natours
# 3. install dependencies
~ npm install
```
- **Database setup**
- If you like to use local DB just create a database named ```natours``` and replace ```DB``` with ```process.env.DATABASE_LOCAL``` in ```server.js```
```js
mongoose.connect(DB, {...})
```
- To use MongoDB Compass
  1. make sure you have an account there
  2. create a project named ```natours``` as well as a cluster
  3. Rename ```example.config.env``` to ```config.env```
  4. Replace ```<USERNAME>``` with your username in ```DATABASE=...://<USERNAME>:``` and ```<PASSWORD>``` with your DB password in ```DATABASE_PASSWORD=```