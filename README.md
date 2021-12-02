# Northcoders News API

## Background

Northcoders API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

To visit the hosted site, please visit: https://gsinghg19-be-nc-news-app.herokuapp.com/api

### **prerequisites**

Node.js version 17.0.1
PostgreSQL version 14.0

#### The listed dependencies below are required

• express
• dotenv
• jest
• pg
• pg-format
• jest
• jest-sorted
• nodemon
• supertest

### **Cloning Code**

To clone this repository:

clone this repository

```
git clone  https://github.com/gsinghg19/be_nc_news.git
```

### **Installing Dependencies**

Once the git repo has been cloned, run:

```
npm install
```

This will install the required dependencies listed previously.

### **Creating .env files**

In order to use node-postgres to connect to different databases, we need to create two .env files in the root directory.
• .env.development, which contains:

```
PGDATABASE=nc_news
```

• .env.test, which contains:

```
PGDATABASE=nc_news_test
```

### **Seeding Local Database**

Next, to seed the database, run:

```
npm run setup-dbs
npm run seed
```

### **Running Tests**

The test files,located in the test folder, will seed the test data. To run the tests:

```
npm test or npm t
```
