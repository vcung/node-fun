Node Fun
=======

Play Frogger [here](http://fun.viviancung.me)

___

This is a reimplementation of an [old assignment](https://github.com/vcung/comp20-vcung/tree/master/frogger) for Intro to Web Programming at Tufts University. 

I wanted to re-learn using NodeJS and MongoDB, as well as setting them up with Heroku (this is also hosted at [floating-taiga-9282.herokuapp.com](http://floating-taiga-9282.herokuapp.com)), so I decided to fix up my old Frogger game and integrate it with a hiscore center. 

___

Score Center API
----------------

At [floating-taiga-9282.herokuapp.com](http://floating-taiga-9282.herokuapp.com) or [fun.viviancung.me](http://fun.viviancung.me)

### GET /highscores/{name of a game}
Retrieve top 10 scores in JSON format
For example, a curl command to get the top 10 Frogger scores:
    
    curl fun.viviancung.me/highscores/frogger

### POST /submitscore
Save a score

Data must be sent as JSON and must include game_title, name, and score
___

In the future, I may make the movements of everything smoother and include bonus scores for completing a level within a time limit for Frogger. As for the API, I may allow for more options, such as allowing the user to specify the number of scores to return in the GET request. 

