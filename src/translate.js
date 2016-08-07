(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name translate
     * 
     * @description 
     * # MUTANT-NG-TRANSLATE 
     * ## General 
     * 
     * Internationalization library for Angular applications.  
     * 
     * For quick start look to official {@link https://github.com/accetone/mutant-ng-translate readme file}.  
     * Also you can find simple demo {@link http://accetone.github.io/mutant-ng-translate-docs/demo/ here}.  
     * 
     * **Our key features**
     * - native parts mechanism: load your locale files using complex url templates like `/locale-{part}-{lang}.json`  
     * - parallel asynchronous loading: translations from part will be available and showed as soon as loaded  
     * - built-in caching of loaded translations and choosed language using browser localstorage, 
     * so next time user will see translations imidiatelly  
     * - configurable preload that load languages after primary language loaded,
     * so you can make switch of language more gentle  
     * 
     * ## Config options
     * 
     * **Required options**  
     * 
     * Url template and default language are only required.
     * Other options are optional.
     * 
     * ```javascript
     * $translate.config({
     *      defaultLang: 'en',
     *      urlTemplate: '/locale-{part}-{lang}.json'
     * });
     * ```
     * 
     * **One file per language**
     * 
     * Url template should contain at least `{lang}` pattern. 
     * So if you have only one file per language, you can specify required template.
     * 
     * ```javascript
     * $translate.config({
     *      defaultLang: 'en',
     *      urlTemplate: '/locale/{lang}.json'
     * });
     * 
     * $translate.addPart('');
     * ```
     * 
     * **Complex JSON file**
     *
     * If your locale file not plain key-value file, you can use built-in `complexDataTransformation` or pass your
     * own `dataTransformation` function with options.
     *
     * In case you want to use built-in function, see how it works {@link translate.utils here} (see `complexDataTransformation`).
     * 
     * Your own should transfrom you data to plain key-value object (hashmap).
     * You can find signature {@link translate.utils here} (see `directDataTransformation`).
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      dataTranformation: funciton (data) {
     *          return data.translations;       
     *      }
     * });
     * ```
     * 
     * **Custom non existing translations**
     * 
     * By default you will see `key` if translation for this `key` not exist for current language.
     * If you want to change this behaviour you can pass `keyResolver` function with options.
     * This function should receive `key` and return default translation.
     * You can find signature {@link translate.utils here} (see `directKeyResolver`). 
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      keyResolver: funciton (key) {
     *          return '';     
     *      }
     * });
     * ```
     * 
     * **Disable cache**
     * 
     * If you want to disable cache of translations or preferred language in client localstorage
     * you can pass `cache` object with options.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      cache: {          
     *          lang: false,
     * 
     *          // not required to write, default value already true
     *          translations: true
     *      }
     * });
     * ```
     * 
     * **Preload**
     * 
     * You can pass list of languages that will be loaded after first language 
     * (in most times it would be default or preferred). 
     * This feature can make swithing of languages more smooth.
     * Don't worry, already loaded languages will not load twice.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      preload: {
     *          langs: ['en', 'fr', 'de']
     *      }
     * });
     * ```
     * 
     * Also you can configure preload delay - 
     * time after first language loaded and start loading preload languages.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      preload: {
     *          langs: ['en', 'fr', 'de'],
     * 
     *          // in milliseconds
     *          delay: 10000
     *      }
     * });
     * ```
     * 
     * **Events**  
     * 
     * If you want you can subscribe to library events.
     * More information you can find {@link translate.events here}
     * 
     */
    angular
        .module('mutant-ng-translate', []);
})();
