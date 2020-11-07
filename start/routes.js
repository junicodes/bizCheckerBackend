'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.post('auth/sign-up', 'AuthenticateController.register').validator('Register').formats(['json']); //Twitter Generate Auth Url

Route.post('auth/login', 'AuthenticateController.login').validator('Login').formats(['json']); //Twitter Generate Auth Url

Route.get('verify/bizness/:cacPermitCode', 'CacVerifyController.routeVerify').formats(['json']); 

Route.get('my/bizness/:page', 'BiznessAcquiredController.myBizNess').middleware(['auth:jwt']).formats(['json']); 