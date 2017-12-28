var crypto = require('crypto');
var uid = require('uid2');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      required: 'Email address is required',
    },

    accessToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    hashedPassword: { type: String, default: '' },
    salt: { type: String, default: '' },

    isAdmin: { type: Boolean, default: false, require: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        delete ret.hashedPassword;
        delete ret.salt;

        ret.uid = ret.email;
      },
    },
  }
);

/**
 * Virtuals
 */
userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.constructor.generateSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema
  .virtual('passwordConfirmation')
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  })
  .get(function() {
    return this._passwordConfirmation;
  });

userSchema.path('hashedPassword').validate(function() {
  if (this._password || this._passwordConfirmation) {
    if (typeof this._password === 'string' && this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }
    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'must match password.');
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
});

/**
 * Hooks
 */
userSchema.pre('validate', function(next) {
  if (typeof this.accessToken !== 'string' || this.accessToken.length < 10) {
    this.updateAccessToken();
  }

  next();
});

/**
 * Methods
 */
userSchema.methods = {
  authenticate: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },

  encryptPassword: function(password) {
    return this.constructor.encryptPasswordWithSalt(password, this.salt);
  },

  updateAccessToken: function() {
    this.accessToken = uid(256);
  },

  signOut: function() {
    this.updateAccessToken();

    return this.save().then(function() {
      return null;
    });
  },
};

/**
 * Statics
 */
userSchema.statics = {
  signUp: function(email, password, passwordConfirmation) {
    const User = this;

    const newUser = new User({ email, password, passwordConfirmation });

    return newUser.save();
  },

  signIn: function(email, password) {
    const User = this;

    return User.load({
      criteria: { email },
    }).then(function(user) {
      if (!user) {
        return Promise.reject(
          new Error({ email: { WrongEmail: 'wrong email address' } })
        );
      }
      if (!user.authenticate(password)) {
        return Promise.reject(
          new Error({ password: { WrongPassword: 'incorrect password' } })
        );
      }

      user.updateAccessToken();

      return user.save();
    });
  },

  authorize: function(accessToken) {
    const User = this;

    if (typeof accessToken !== 'string' || accessToken.length < 10) {
      return Promise.resolve(null);
    }

    return User.load({
      criteria: { accessToken },
    });
  },

  encryptPasswordWithSalt: function(password, salt) {
    if (!password) {
      return '';
    }

    try {
      return crypto
        .createHmac('sha1', salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  generateSalt: function() {
    return `${Math.round(new Date().valueOf() * Math.random())}`;
  },

  load: function(options) {
    options = options || {};

    return this.findOne(options.criteria)
      .select(options.select)
      .exec();
  },
};

module.exports = mongoose.model('User', userSchema);
