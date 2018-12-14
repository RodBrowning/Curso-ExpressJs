// Full Documentation - https://www.turbo360.co/docs
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const app = vertex.express() // initialize app


/*  
	Apps can also be initialized with config options as shown in the commented out example below. Options
	include setting views directory, static assets directory, and database settings. To see default config
	settings, view here: https://www.turbo360.co/docs 

const config = {
	views: 'views', 		// Set views directory 
	static: 'public', 		// Set static assets directory
	db: { 					// Database configuration. Remember to set env variables in .env file: MONGODB_URI, PROD_MONGODB_URI
		url: (process.env.TURBO_ENV == 'dev') ? process.env.MONGODB_URI : process.env.PROD_MONGODB_URI,
		type: 'mongo',
		onError: (err) => {
			console.log('DB Connection Failed!')
		},
		onSuccess: () => {
			console.log('DB Successfully Connected!')
		}
	}
}

const app = vertex.app(config) // initialize app with config options

*/


// import routes
const index = require('./routes/index')
const api = require('./routes/api')


// middleware

const timestamp = (req, res, next)=>{
	const timestamp = new Date()
	var day = timestamp.getUTCDate()
	var month = timestamp.getUTCMonth()+1
	var year = timestamp. getUTCFullYear()
	var fullTime = `${day}/${month}/${year}`
	req.timestamp = fullTime
	next()
}	

app.use(timestamp)

// set routes
app.use('/', index)
app.use('/api', api) // sample API Routes

// post routes

const postRoutes = require('./routes/postRoutes')
app.use('/posts', postRoutes)

app.listen(4000)
console.log("App is up and running at localhost:4000")


module.exports = app