const timestampPlugin = (schema, options) => {
  schema.add({ created: Date, updated: Date });

  schema.pre('save', function (next) {
    this.updated = new Date();
    if (!this.created) this.created = new Date();
    next();
  });

  if (options && options.index) {
    schema.path('created').index(options.index);
  }
};

export default timestampPlugin;
