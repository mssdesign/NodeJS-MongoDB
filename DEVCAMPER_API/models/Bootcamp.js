const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Name can not be more than 500 characters'],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Use uma URL válida com HTTP ou HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'O número de telefone não deve ter mais que 20 números']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ]
    }
  },
  slug: String,
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
        type: String,
        enum: ['Point'],
        required: false
      },
      coordinates: {
        type: [Number],
        required: false,
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Avaliação deve ser pelo menos 1'],
    max: [10, 'A avaliação não pode ser maior que 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

//Example of Middleware: Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true })
  //O "this" acessa as keys do modelo BootcampSchema
  next()
})

//Example of Middleware: Geocode & create location field
BootcampSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  //Do not save address in DB
  this.address = undefined
  next()
}) 

//Cascade delete courses when a bootcamp is deleted
//next é usado para middleware
//O this._id abaixo acessa o objeto do bootcamp com a key "_id"
BootcampSchema.pre('remove', async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`)
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next()
})

//reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)