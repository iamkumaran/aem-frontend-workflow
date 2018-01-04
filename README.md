# aem-frontend-workflow

AEM Frontend Workflow using gulp. This workflow helps to push HTML, CSS, SASS, JavaScript files to AEM instance without using Maven (mvn clean install).

## Getting Started

The workflow to sling HTML, CSS, JS and Images to AEM without Maven build. It is painful to run "mvn clean install" everytime when we changes the files. This workflow has watcher which will automatically push the files to AEM instance whenever they are modified.

### Prerequisites

What things you need to install the software and how to install them

```
Install NodeJS
```

Install Gulp

Open cmd or terminal and run the following command to install gulp,

```
npm install gulp-cli -g
```

### Installing

Download or Clone this repo and move "package.json" and "gulpfile.js" to your project directory.

Open "gulpfile.js" and update local AEM environment if required,

```
var config = {
  host: 'localhost',
  port: 4502,
  username: 'admin',
  password: 'admin'
}
```

Update the project path below and verify js/css/html/images paths are correct,

```
var mainPath        = 'aem-codebase/ui.apps/src/main/content/jcr_root/';
    // HTML or JSP templates
    componentsPath  = mainPath + 'apps/aem-codebase/components/',
    // Styles
    cssPath         = mainPath + 'etc/clientlibs/aem-codebase/css/',
    sassPath        = mainPath + 'etc/clientlibs/aem-codebase/scss/',
    // Scripts
    jsPath          = mainPath + 'etc/clientlibs/aem-codebase/js/',
    // Images
    imgPath         = mainPath + 'etc/clientlibs/aem-codebase/images/';

```

Open cmd/terminal from that location and install npm packages,

```
npm install
```

### How To Run

Use following command to run,

```
gulp watch
```


## License

This project is licensed under the Unlicense - see the [LICENSE.md](LICENSE.md) file for details
