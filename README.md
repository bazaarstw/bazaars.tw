# bazaars.tw

# Installation

## Database Configuration
```
$ cp ctrl/models/_Base.php ctrl/models/Base.php
$ vi ctrl/models/Base.php
========
    $this->dbh = new PDO("mysql:host=localhost;dbname=test","test","test",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
========
```

# Develop

## Git
```
$ git push --set-upstream origin develop
```

## Gulp
```
$ sudo npm install --global gulp
```

## Bower
```
$ bower install
```
