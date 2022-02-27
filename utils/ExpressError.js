class ExpressError extends Error{
    constructor(message, statusCode){
      super(); //* calling super so that it can call Error class Constructor.
      this.message = message;
      this.statusCode = statusCode;
    }
}

module.exports=ExpressError; //* here we are exporting and we need to require it.