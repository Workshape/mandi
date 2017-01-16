const PRESETS = {}

/**
 * Validator presets
 *
 * Exports presets used by Validator class across the app
 */

// Email address
PRESETS.email = {
  label : 'Email address',
  rules : {
    regex     : 'email',
    required  : true,
    type      : 'string',
    minLength : 4,
    maxLength : 100
  }
}

// URL
PRESETS.url = {
  label : 'URL',
  rules : {
    regex    : 'url',
    required : true,
    type     : 'string'
  }
}

// Flag (Boolean)
PRESETS.flag = {
  label : 'Flagged',
  rules : {
    required : false,
    type     : 'boolean'
  }
}

// URL
PRESETS.color = {
  label : 'Color',
  rules : {
    regex    : 'color',
    required : false,
    type     : 'string'
  }
}

// Password (6-10 characters)
PRESETS.password = {
  label : 'Password',
  rules : {
    required  : true,
    type      : 'string',
    minLength : 6,
    maxLength : 100
  }
}

// Name between 2-150 characters
PRESETS.name = {
  label : 'Name',
  rules : {
    required  : true,
    type      : 'string',
    minLength : 1,
    maxLength : 150
  }
}

// Title (2-150 characters)
PRESETS.title = {
  label : 'Title',
  rules : {
    required  : true,
    type      : 'string',
    minLength : 1,
    maxLength : 150
  }
}

// Text content (optional, max 1500 characters)
PRESETS.content = {
  label : 'Content',
  rules : {
    required  : false,
    type      : 'string',
    maxLength : 1500
  }
}

// Amount (number)
PRESETS.amount = {
  label : 'Amount',
  rules : {
    required : false,
    type     : 'number'
  }
}

// File (optional)
PRESETS.file = {
  label : 'File',
  rules : {}
}

// Image (optional)
PRESETS.image = {
  label : 'Image',
  rules : {}
}

module.exports = PRESETS