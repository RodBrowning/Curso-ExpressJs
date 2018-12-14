const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const path = require('path')

var multer  = require('multer')

const profiles = {

	sjobs : {
		name: "Steve Jobs",
		company: "apple",
		languages: ["c", "java", "swift"],
		image: '/images/sjobs.jpg'
	},
	musk : {
		name: "elow musk",
		company: "tesla",
		languages: ["swift", "python", "kotlin"],
		image: "/images/musk.jpg"
	},
	mark : {
		name: "mark zuckerberg",
		company: "facebook",
		languages: ["php", "pava", "c"],
		image: '/images/mark.jpg'
	}
}

router.get('/:profile', (req, res)=>{
		var nameProfile = req.params.profile
		var profile = profiles[nameProfile]		

		if(profile == null){			
			res.json({
				confirmation: "Fail",
				message: "Something went bad",
				error: "The profile with name " + nameProfile + " does not exist"
			})
		}else{
			var data = {
				name: profile.name,
				company: profile.company,
				languages: profile.languages,
				image: profile.image,
				names: Object.keys(profiles)
			}
			res.render('index',data)	
		}
		
	})


var storage = multer.diskStorage({ 
	destination: 'public/images/', 
  filename: function (req, file, cb) {
  	var nameOfImage = file.fieldname + '-' + Date.now().toString() + path.extname(file.originalname)
  	req.body.image = nameOfImage
    cb(null, nameOfImage) 
  }
})

const upload = multer({ storage: storage }).single('image')

router.post('/register', (req, res)=>{	
upload(req, res, (err)=>{
		if(err){
			err.send(err)
		}else{	
			var body = req.body
			if(	body.name == '' ||
				body.company == '' ||
				body.languages == '' ||
				body.image == ''
				)
			{
				res.json({
						confirmation: "Fail",
						message: "Form empty"
					})
			}

			body.languages = body.languages.split(', ')		
			var data = {
				name: body.name,
				company: body.company,
				languages: body.languages,
				image: '/images/' + body.image
			}
			profiles[body.name] = data
			//res.json(body)
			res.redirect('/posts/'+body.name)
		}
	})
})

router.get('/reset/app', (req, res)=>{
			var keysArray = Object.keys(profiles)
			if(keysArray.length>3){				
				for(let i = 3; i<keysArray.length; i++){
					delete profiles[keysArray[i]]
				}
			}
			res.redirect('/')
})

module.exports = router
