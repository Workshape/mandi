# Beatle CMS

A lightweight, configurable CMS build using [Koa](http://koajs.com/), [MongoDB](https://www.mongodb.com/), [Pug](https://pugjs.org/), [Vue.js](https://vuejs.org/) and [Stylus](http://stylus-lang.com/).

Setting up and configuring this application will provide you with a simple interface to manage (create, edit, delete, ..) data entries based on a custom JSON schema.

Nimda can be cloned or be installed as an npm module and integrated with a pre-existing node application or HttpServer.

Requirements
---

- Node.js (v7.0.0+)
- MongoDB (v3.2.0+)

Set-up
---

You can use Nimda in 2 diffent ways:

#### Method 1 - clone the repo

To set-up this codebase on your development environment please follow these steps:

```
git clone https://www.github.com/tancredi/nimda
cd nimda
npm install
npm run build
```

Before running the app, you still have to

* Confgure the app (Basic configuration)
* Setup the CMS JSON schema (JSON configuration)

#### Method 2 - integrate in your node server

You can install nimda using npm:

```
npm install --save nimda
```

Then create an instance and integrate it onto your pre-existing http node server:

```
const Nimda = require('../lib/Nimda')
const http = require('http')

/**
 * Examples > HTTP server
 *
 * Mount a Nimda instance on a HTTPServer using the `middleware()` method
 */

// Create a simple configuration
let config = {
  mongo     : { url: 'mongodb://localhost/nimda-cms' },
  basePath  : '/admin',
  publicUrl : 'http://localhost:8000/admin'
}
let schema = {
  title: 'My simple blog',
  types: {
    posts: {
      label: 'Post',
      schema: {
        cover: { extends: 'image', label: 'Cover' },
        name: { extends: 'name' },
        content: { extends : 'content' }
      }
    }
  },
  statics: {
    title: { extends: 'title', label   : 'Website title' },
    description: { extend: 'content', label: 'Website description' }
  }
}

// Instanciate Nimda
let nimda = new Nimda(config, schema)

// Instanciate a HTTPServer using Nimda's middleware function
let server = http.createServer(nimda.middleware())

// Start server on port 8000
server.listen(8000)

// The Nimda interface should now be available at localhost:8000/admin
nimda.util.log.info('Running Nimda on', 'http://localhost:8000/admin')
```

The Nimda class takes two arguments: **config** (the application configuration, including MongoDB credentials, port, path to be started on, etc..) and **schema** (which specifies the data structure and configuration of the cms itself)


Basic configuration
---

Before starting, you need to amend the basic website configuration - you can create a `development.json` / `production.json` / `staging.json` files that match the current environment name (defined throught the environment variable `NODE_ENV`) or by writing a `local.json` which will override on any environment - these files are added to the `.gitignore`

This configuration is then loaded by the [config](https://www.npmjs.com/package/config) module - and you can override the following properties:

* `publicUrl` (Env. `PUBLIC_URL`) The base URL the CMS will be served at (without trailing slash)
* `basePath` The base path the CMS will be served at (useful if mounting an instance of Nimda on a pre-existing HttpServer)
* `secret` (Env. `SECRET`) A secret used to hash passwords
* `port` (Env. `PORT`) The port the website is gonna be served at by Node.js
* `mongo.url` (Env `MONGO_URL`) The URL of the mongo database (by default `mongodb://localhost/nimda
* `aws.key` (Env. `AWS_KEY`) Your Amazon Web Services key (optional - AWS configuration is used for S3 file uploads, but will fall back on local file system if not setup)
* `aws.secret` (Env. `AWS_SECRET`) Your Amazon Web Services secret
* `aws.bucket` (Env. `AWS_S3_BUCKET`) Your Amazon Web Services S3 Bucket name
* `aws.region` (Env. `AWS_REGION`) Your Amazon Web Services S3 Bucket region (defaults to `us-standard`)
* `uploadsDir` (Env. `UPLOADS_DIR`) Absoute path used to customise the uploads directory

JSON schema configuration
---

All data types that will be managable through the CMS are defined in a simple JSON schema that can be created by the user.

This schema needs to be created under the `website.json` filename in the root directory - and it will extend the default configuration file `website.default.json`

The default file contains an example of a basic `posts` type that can be used - for example - creating a blogging system

You can use this file as a refence for your `website.json` file

### Website.json properties:

You can override the following properties in the Object exported by `website.json`:

* `title` **String** - *The admin website's title as it will be displayed in the interface*
* `types` **Object** - *The value under each key of this Object contains the JSON schema assigned to the DB collection named with its key*

Defining types
---

Types are basically validation schemas that will determine the UI the CMS generates to administer the various of data entries that will be managed through the CMS

Here's the type you can find in the default CMS configuration `website.default.json`:

```json
{ "types": {

  "posts": {
    "label": "Post",
    "schema": {

      "cover": {
        "extends" : "image",
        "label"   : "Cover"
      },

      "name": {
        "extends" : "name"
      },

      "content": {
        "extends" : "content"
      }

    }
  }

} }
```

Each type contains the following properties:

* `label` The display name for an individual entry of this type
* `schema` An Object containing the validation schema for given type

Each field in the schema should extend from a basic `validator-preset` - you can set the `extends` property to do so, and every other field is gonna extend the schema it refers to

To learn more about the properties you can override you can look at how the base type presets are defined in `common/util/validator-presets.js`

Types presets
---

When defining the CMS types, you can chose to extend from the following presets (defined in `common/util/validator-presets.js`

* `email` A required 4-100 characters long valid email String
* `url` A required valid url String
* `password` A required 6-100 characters long valid String
* `name` A required 1-100 characters long valid String
* `title` A required 1-150 characters long valid String
* `content` A 0-1500 characters long valid String
* `file` Any file
* `image` A file of mime type matching one of `image/jpeg`, `image/png` or `image/gif`

Running the CMS interface
---

Now that you configured the app and the JSON schema, you need to start the CMS - run

`npm start`

The interface should now be running on [localhost:4000](http://localhost:4000)

By default, a overlord user will be created with the following credentials:

**Username**: `admin`<br>
**Password**: `foobar`

When logged in you will be able to change your password

Development
---

The following npm tasks are available to support development workflow:

* `npm run watch-server` Watch for changes on the server-side codebase and restart server when necessary
* `npm run watch` Watch for changes in the client-side codebase and rebuild what's been changed
* `npm run build` Re-build the codebase
* `npm run dev` Run `watch-server` and `watch` together

Licence
---

Copyright (c) 2017 WorkShape.io Ltd. - Released under the [MIT license](https://github.com/tancredi/nimda/blob/master/LICENSE)