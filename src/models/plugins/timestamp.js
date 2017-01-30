const timestampPlugin = (schema, options) => {
  // add timestamp fields
  schema.add({ created: Date, updated: Date });

  // set timestamp values before saving document.
  schema.pre('save', function (next) {
    this.updated = new Date();
    if (!this.created) this.created = new Date();
    return next();
  });

  if (options && options.index) {
    schema.path('created').index(options.index);
  }
};

export default timestampPlugin;
