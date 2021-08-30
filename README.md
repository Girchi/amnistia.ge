Default configuration
1. configure .env file for your application like example.env
2. change client_id and client_secret configured on drupal's Ouath module
3. we need to have configured: JSON:API, Simple Oauth and Token, Simple Oauth Facebook Connect and Social Auth Facebook modules in drupal side


For FB authorization
1. if you don't already have a FB application, create at https://developers.facebook.com/
2. change the FB_APP_ID variable with your application ID at:
```ruby
  assets/js/authorization.js
```

NOTE: Make sure project uses HTTPS protocol, Facebook only allows domains that use HTTPS.


Documents with user cards are generating automatically when loading:
```ruby
  /cards-download
```


