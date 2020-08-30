# Natours

## Usage
- **Server setup**
```bash
# 1. clone this repo
~ git clone https://github.com/oussamabouchikhi/Natours.git
# 2. cd into it
~ cd Natours
# 3. install dependencies
~ npm install
# 4. run server
# (development)
~ npm start
# (production)
~ npm run start:prod

```
- **Database setup**
- If you like to use local DB just create a database named ```natours``` and replace ```DB``` with ```process.env.DATABASE_LOCAL``` in ```server.js```
```js
mongoose.connect(DB, {...})
```
- To use MongoDB Atlas
  1. make sure you have an account there
  2. create a project named ```natours``` as well as a cluster
  3. Rename ```example.config.env``` to ```config.env```
  4. Replace ```<USERNAME>``` with your username in ```DATABASE=...://<USERNAME>:``` and ```<PASSWORD>``` with your DB password in ```DATABASE_PASSWORD=```

- **Insert Dummy data into DB**
> Make sure to comment pre save middlewares in userModel.js to disable validation & password hashing temporarely when executing these commands. Don't dorget to uncomment them after that!

```bash
# Insert data into DB
~ node dev-data/data/import-dev-data --insert
# Delete data from DB
~ node dev-data/data/import-dev-data --delete
```
