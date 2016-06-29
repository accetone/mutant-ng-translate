## ANGULAR TRANSLATE / mutant-ng-translate
![Travis CI build info](https://travis-ci.org/accetone/mutant-ng-translate.svg?branch=master)
[![npm](https://img.shields.io/badge/npm-v.1.1.0-blue.svg)](https://www.npmjs.com/package/mutant-ng-translate)
![bower](https://img.shields.io/badge/bower-v.1.1.0-blue.svg)
![license](https://img.shields.io/badge/license-MIT-orange.svg)  

Internationalization library for Angular applications.  

**Our key features**  
- native parts mechanism: load your locale files using complex url templates like `/locale-{part}-{lang}.json`  
- parallel asynchronous loading: translations from part will be available and showed as soon as loaded  
- built-in caching of loaded translations and choosed language using browser localstorage, 
so next time user will see translations imidiatelly  
- configurable preload that load languages after primary language loaded,
so you can make switch of language more gentle  

### Usage

##### 01 Install

Make sure that angular is already included in your project.
Then install `mutant-ng-translate`:

```
npm install mutant-ng-translate
```

or

```
bower install mutant-ng-translate
```

##### 02 Embeding
Embed script to your HTML document:

```html
<script src="path/to/mutant-ng-translate.js"></script>
```

##### 03 Configuration

You can configure translate in angular configuration block: 

```javascript
angular
    .module('MyApp', ['mutant-ng-translate'])
    .config(['$translateProvider', function ($translateProvider) {
        var $translate = $translateProvider.$get();

        $translate.config({
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json'
        });

        $translate.addParts('first', 'second');
    }]);
```

You can add parts when you need them in any point of your angular application.  

If you want to test library without configuring your backend server you can register translations manually:

```javascript
angular
    .module('MyApp', ['mutant-ng-translate'])
    .config(['$translateProvider', function ($translateProvider) {
        var $translate = $translateProvider.$get();

        $translate.config({
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json'
        });
        
        var translations = {
            "HELLO-FOO": "Hello, Foo!"
        };

        $translate.translations('en', translations);
    }]);
```

##### 04 Use filter or directive

In your HTML files when you require translation you can use filter or directive attribute:
```javascript
{{ "TRANSLATION-KEY" | translate }}

<div ng-translate="TRANSLATION-KEY"></div>
```

##### 05 Change language

You can change current language with `use` method:

```javascript
$translate.use('fr');
```

### Documentation
You can find detailed docs [here](http://accetone.github.io/mutant-ng-translate-docs/#/api/translate).


### Contribution

If you find error or want improve something, feel free to create issues and pull requests.

### Tests

Install all dependenies with `npm install` and `bower install`. Then you can run tests with `gulp tests`.

### License

Licensed under MIT.
