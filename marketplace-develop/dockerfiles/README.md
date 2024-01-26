# IMPORTANT NOTE

**It's important for all Dockerfile to be held in one place**.

To future-proof the codebase, it's important for us to maintain a source of truth to our docker builds. As the platform requirements change, so as well as the base-image and app-image.

### Base Image
As its name stands,  is  the container image that we'll use to  build the app-image. Managing base-image might differ in every project/repository. But commonly, a base-image comes from an official build, that could come from Alpine Linux, Ubuntu Linux or Debian Linux.

> Typically, base images are only built once and only has to be rebuild if a library in the base-image has to be updated or added. Nonetheless, using the existing base-image build in the AWS ECR should work.

Updating the base image:
- Make sure the official build you'll be using doesn't have any know CVE. Double check the release notes from the Alpine Linux website.
- Make sure the libraries you're installing doesn't have any known CVE. Double check the package release notes from NodeJs and Yarn.

Naming a base image build:
- Naming convention is as follow: base-<package>-<version>

```
ie. marketplace:base-nodejs-16.9.1
```

### App Image
Contains the [Dockerfile](../app-image/Dockerfile) that we are using to build the production app-image.

The app-image is dependent to the base-image. The app-image's Dockerfile will always call the base-image  (see `FROM` section).

Naming an app image build:
- Naming convention is as follow:
develop-<commit-hash>

```
ie. marketplace:develop-8e832f9d
```

### Building container images

- Make sure you're in the root folder ie. `/path/to/your/local/clone/marketplace`
- Check the `.dockerignore` file and make sure it contains the correct list of files to be ignored during the build. We're heavy capitalizing on this mechanism.
- Run the command:

```
$ docker build -f dockerfiles/base-image/Dockerfile -t <image_name>:<version>
$ docker build -f dockerfiles/app-image/Dockerfile -t <image_name>:<version>
```
