/**
 * Created by Overlord on 09/11/2017.
 */


(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define['amd']) {
        define(factory);
    } else if (typeof exports === 'object') {
        module['exports'] = factory();
    } else {
        root['SURVEY'] = factory();
    }
}(this, function () {

    "use strict";

    var survey = {};

    function Survey(){

        this.currentQuestion = -1;

        this.splash = null;

        this.answers = [];

        this.questions = new Questions();

        this.frame = new survey.Frame();

        this.page = null;

    }

    survey['Survey'] = Survey;

    Survey.prototype.add = function (id,question,type) {
        this.questions.add(id,question,type)
    };

    Survey.prototype.render = function () {
        for(var q = 0 ; q < this.questions.len() ; q++){
            $('<div>'+this.questions.get(q)['question']+'</div>').appendTo(this.frame);
        }
    };

    Survey.prototype.start = function () {
      this.page = new Splash(this.frame,(function(){
        this.currentQuestion++;
        this.addAnswer();
      }).bind(this),true);
    };

    Survey.prototype.addAnswer = function (answer) {

        // for going back i suppose? Not sure why this is here
        if(this.answers.length < this.currentQuestion){
            this.answers.push(answer);
        } else {
            this.answers[this.currentQuestion] = answer;
        }

        // clearing page
        this.page.reset();

        // increment current question
        this.currentQuestion++;

        // no more questions
        if(this.currentQuestion === this.questions.len()){
            this.page = new Splash(this.frame,(function(){}),false);
            this.submitAnswers();
        } else {
            this.page = new Page(this.frame,this.questions.get(this.currentQuestion),this.addAnswer.bind(this))
        }


    };

    Survey.prototype.submitAnswers = function () {

        console.log(this.answers);
        // $.post("./submitAnswers.php",this.answers,(function(){console.log("DataSent")}));

        $.ajax({
            type: "POST",
            url:  "./submitAnswers.php",
            data: {Survey_Answers : JSON.stringify(this.answers)},
            success: function(msg){
                console.log(msg)
            },
            error: function () {
                console.log("failed to send")
            }
        });

    };

    function Answers(){

    }

    survey['Answers'] = Answers;

    function Questions(){
        this.questions = [];
    }

    survey['Questions'] = Questions;

    Questions.prototype.add = function (id,question,type) {
        this.questions.push(
            {
                "id":id,
                "question":question,
                "type":type
            }
        )
    };

    Questions.prototype.get = function(index){
        return this.questions[index];
    };

    Questions.prototype.len = function(index){
        return this.questions.length
    };

    function Frame(){

        this.frame = $('<div></div>').appendTo('body');
        this.frame.css({"background-color":Colors.get('SAPHIRE'),"width":"100%","height":"100%","padding":"5%","position":"absolute"});

        this.frameInner = $('<div></div>').appendTo(this.frame);
        this.frameInner.css({"background-color":Colors.get('CLOUD'),"width":"100%","height":"100%","position":"relative"});
        return this.frameInner;
    }

    survey['Frame'] = Frame;

    function Splash(parent,callback,start = true){

      this.parent = parent;

      this.userid = "0".repeat(4-userID.toString().length)+(userID+1)

      this.start = start;

      if(this.start){

        this.title = "Welcome Test Subject : "+ this.userid;

        this.date = "Start Date : " + new Date().toDateString();

        this.body = "The purpose of this survey is to gauge user experience in a non-demographic "+
                    "sense to understand whether the NPC ai represented in this game improved" +
                    "the general sense of enjoyment and immersion while playing. A non-demographic" +
                    "survey simply means that details about the player such as gender age or race" +
                    "will not be recorded at any point and will not be taken into consideration during" +
                    "the analysis of survey responses<br><br>" +
                    "The survey will provide you with an ID that you can use to request your contribution" +
                    "be <b>redacted</b> from the final stufy or any time after that. The questions in this" +
                    "survey ask you to elicit personal experiences of the game in such a way that no personal" +
                    "identity could be derived when analysing the responses.<br><br>" +
                    "If you agree to the above, please select the green below, if not thank you for playing!";
      } else {

        this.title = "Thank You Test Subject : "+ this.userid;

        this.date = "Submission Date : " + new Date().toDateString();

        this.body = "<br><H3>Well Played!</H3><br>Thank you for playing and completing the survey, <b>your answers</b> have been <b>recorded!</b>"+
                    " Dont forget you can email me at <b>psydj2@nottingham.ac.uk</b> with your user id to remove your answers"+
                    " if you wish!<br><br>Feel free to play again!";
      }


      this.callback = callback;

      this.splash = $('<div></div>')
          .appendTo(this.parent)
          .css({"padding":"5%"});

      this.build();

    }

    Splash.prototype.build = function () {

      this.head = $('<div class="page-splash-head"></div>')
        .appendTo(this.splash);

      $('<div class="splash-head-title" ><a>'+this.title+'</a></div>')
        .appendTo(this.head);

      $('<div class="splash-head-date" ><a>'+this.date+'</a></div>')
        .appendTo(this.head);

      this.body = $('<hr><div class="page-splash-body"><a>'+this.body+'</a><br><br><hr></div>')
        .appendTo(this.splash);

      this.input = $('<div class="page-splash-input"></div>')
        .appendTo(this.splash);

      if(this.start){
        this.button = $('<div class="page-button page-button-true"><a class="h2 text-center">CONFIRM</a></div>')
          .appendTo(this.input)
          .css({"position":"relative","width":"20%","height":"10%","margin-left":"0%","padding-top":"50px","padding-bottom":"50px"})
          .on('click',(function(){
              this.callback(true);
          }).bind(this));
      }

    };

    Splash.prototype.reset = function () {
        this.parent.empty();
    };

    // interactable DOM question
    function Page(parent,question,answercallback){

        this.parent = parent;

        this.question = question;

        this.callback = answercallback;

        this.answer = null;

        this.page = $('<div></div>')
            .appendTo(this.parent)
            .css({"padding":"5%"});


        this.questionBox = null;
        this.answerBox = null;

        this.render();
    }

    survey['Page'] = Page;

    Page.prototype.reset = function () {
        this.parent.empty();
    };

    Page.prototype.render = function () {

        switch(this.question['type']){
            case  0: this.renderYesNo();  break;
            case  1: this.renderRange();  break;
            case  2: break;
            case  3: break;
            case  4: break;
        }
    };

    Page.prototype.renderPageFrame = function () {

        this.questionBox = $('<div><h2 class="text-center">'+this.question['question']+'</h2></div><div class="divider"></div>')
            .appendTo(this.page)
            .css({"margin":"5%"});

        this.answerBox = $('<div></div>')
            .appendTo(this.page)
            .css({"position":"relative","padding":"0%"});

    };

    Page.prototype.renderYesNo = function () {

        this.renderPageFrame();

        $('<div class="page-button page-button-true"><a class="h2 text-center">TRUE</a></div>')
            .appendTo(this.answerBox)
            .click((function() {
                this.answer = {"answer":1,"type":this.question['type'],"id":this.question['id']}
                this.callback(this.answer);
            }).bind(this))
            .css({"position":"relative","width":"40%","float":"left","padding-top":"10%","padding-bottom":"10%"});

        $('<div class="page-button page-button-false"><a class="h2 text-center">FALSE</a></div>')
            .appendTo(this.answerBox)
            .click((function() {
                this.answer = {"answer":0,"type":this.question['type'],"id":this.question['id']}
                this.callback(this.answer);
            }).bind(this))
            .css({"position":"relative","width":"40%","float":"right","padding-top":"10%","padding-bottom":"10%"});

    };

    Page.prototype.renderRange = function () {

        var max = 5.0;

        this.renderPageFrame();

        for(var option = 0 ; option < max ; option++){
            $('<div class="page-button page-button-'+(option+1)+'"><a class="h2 text-center">'+(option+1)+'</a></div>')
                .appendTo(this.answerBox)
                .click({value:option+1},(function(event) {
                    this.answer = {"answer":event.data.value,"type":this.question['type'],"id":this.question['id']}
                    this.callback(this.answer);
                }).bind(this))
                .css({"z-index":option,"width":""+((100.0-max)/max)-1+"%","margin":"1%","float":"left","padding-top":"10%","padding-bottom":"10%","background-color":" rgb("+(255/max)*option+","+150+","+255-((255/max)*option)+")"});

        }

    };

    var Colors = (function(){

    var colors = {
        'ILLIOS':'#3498db',
        'SAPHIRE':'#0e76bd',
        'RIVER':'#2980b9',
        'GREENSEA':'#16a085',
        'EMERALD':'#2ecc71',
        'LEAF':'#27ae60',
        'SUNFLOWER':'#f1c40f',
        'CLEMENTINE':'#f39c12',
        'CARROT':'#e67e22',
        'PUMPKIN':'#d35400',
        'RACING':'#e74c3c',
        'RUBY':'#c0392b',
        'LAVENDER':'#9b59b6',
        'VIOLET':'#8e44ad',
        'CHARCOAL':'#36454F',
        'ASPHALT':'#34495e',
        'MIDNIGHT':'#2c3e50',
        'CONCRETE':'#95a5a6',
        'STEEL':'#7f8c8d',
        'SILVER':'#bdc3c7',
        'CLOUD':'#ecf0f1'
    };

    function printAll() {
        console.info(JSON.stringify(colors, null, "\t"));
    }

    function getAll() {
        return colors;
    }

    function get(key) {

        if (colors.hasOwnProperty(key)) {
            return colors[key];
        } else {
            console.error("GET - Color Name: " + key + " does not exist - Returning default Color.");
            return colors['CHARCOAL'];
        }
    }

    return {
        printAll:printAll,
        getAll:getAll,
        get:get
    }

    })();

    function OBJECT(params) {
        this.OBJECTATTRIBUTE = PARAM
    }

    // // adding function object to public function set
    // survey['CLASS NAME'] = OBJECT;
    //
    // // defining sub method to be added function object array
    // OBJECT.prototype.OBJECT_METHOD = function(params) {
    //     return params;
    // };

    // returning object containing references to function objects
 return survey;
}));
