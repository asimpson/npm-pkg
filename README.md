This lambda provides a way to build npm packages that need to be built in a [lambda to run correctly](https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/).

You can copy this code and run it in your own lambda instance, simply pass in the package name via the `event` object, `{pkg: PACKAGE_NAME}`.

I've also setup an API Gateway in front of this lambda. You can `curl` the URL: `https://ybtuwnhhtg.execute-api.us-east-1.amazonaws.com/prod/PACKAGE_NAME` and it will return a `tar` file for you.
