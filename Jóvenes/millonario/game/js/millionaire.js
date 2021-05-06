/**
 * Copyright eLearning Brothers LLC 2012 All Rights Reserved
 */
var game = new function () {
    var SUBMIT_REGISTRATION_TO = null; //Set to empty to turn registration form off


    liveFastClick('div.game #registerbutton', function(e){
        $('div.game #registerForm .error').html("");
        $.post(SUBMIT_REGISTRATION_TO, {
           name: $('div.game #registerForm input[name=name]').val(),
           email: $('div.game #registerForm input[name=email]').val()
        }, function(result) {
            var result = $.parseJSON(result);
            $('div.game #register .error').html(result.message);
            if(result.success) {
                $('div.game #register').fadeOut();
            }
        });

    } );
    var designFile = "design.ini";
    var questionsFile = "questions.ini";
    var soundsFile = "sounds.ini";

    if (!empty(GAMEPREFIX)) {
        soundsFile = GAMEPREFIX + "-sounds.ini";
        questionsFile = GAMEPREFIX + "-questions.ini";
        designFile = GAMEPREFIX + "-design.ini";
    }

    var questions;
    var questionCount = 0;
    var design;
    var sounds;
    var validity = -3;
    var instance = this;
    var score = 0;
    var answers = {};
    var prize = 0;
    var questionIndex = 0;
    var timerOn = false;
    var timerPrev = null;
    var timerCount = 0;
    var angle = 0;
    var gameScore = 0;
    var gameTime = 0;
    var timeout = 0; /* NO TIMEOUT */
    var gameFee = 0;
    var questionTime = 0;
    var correctAnsweredCount = 0;
    var statistic = {};
    var start_time;
    var current_time;
    //var error = 0;
    var letter = ['A', 'B', 'C', 'D']
    var currentQuestionSound = null;

    /* -----------------------  LOADING ------------------------- */

    this.reloadStyles = function () {
        $.get("config/" + designFile, function (iniData) {
            design = parseIni(iniData);
            loadStyles();
        });
    }

    this.readConfig = function () {
        $.get("config/" + questionsFile, function (iniData) {
            iniData+=prepareIni(iniData,standartQuestionPattern);
            questions = parseIni(iniData);
            setOriginalQuestions(questions); defaultQuestionPostProcesor(questions);
            validity++;
            if (validity == 0) {
                $(document).trigger('gameLoaded');
            }
        });
        $.get("config/" + designFile, function (iniData) {
            design = parseIni(iniData);
            validity++;
            if (validity == 0) {
                $(document).trigger('gameLoaded');
            }
        });
        $.get("config/" + soundsFile, function (iniData) {
            sounds = parseIni(iniData, function (val) {
                var media = createSound(val);
                return media;
            });
            validity++;
            if (validity == 0) {
                $(document).trigger('gameLoaded');
            }
        });

    };

    var loadStyles = function () {
        instance.loadStyles();
    };
    var bindSounds = function () {
        instance.loadSounds();
    };
    var fillData = function () {
        instance.loadData();
    };

    $(document).bind('gameLoaded', function () {
        loadStyles();
        bindSounds();
        fillData();

        $('div.game').addClass('step-1');

        //instance.onGameLoaded();

        setInterval(function () {
            if (timerOn) {
                var newTime = new Date().getTime();
                instance.onTimePassed((newTime - timerPrev));
                timerPrev = newTime;
            }
        }, 100);

    });


    /* -----------------------  FUNCTIONS ------------------------- */


    function recalculateScore() {
        var answeredCount = 0;
        correctAnsweredCount = 0;
        var answeredScore = 0;

        for (var k in answers) {
            answeredCount++;
            answeredScore += answers[k];
            if(answers[k]>0)
                correctAnsweredCount++;
        }
        gameScore = answeredScore - gameFee;
        
        instance.onUpdateScore(gameScore);
        instance.updateQuizPercent(correctAnsweredCount);
        instance.updateProgressText();
    }

	/* MODIFICADA POR FJLG PARA QUE COMO RESULTADO EL PREMIO EN VEZ DEL PORCENTAJE */
    this.updateQuizPercent = function(count) {
        //statistic.game_percent = (100*statistic.correct_answers/(statistic.incorrect_answers+statistic.correct_answers)).toFixed(0);
        //statistic.game_percent = (100*count/ (questionCount) ).toFixed(2);
        //alert(correctAnsweredCount);
		var resultado = '';
		var numero=0;
		if (count == 0){
			$('div.game .quiz-percent-value').html("Lo siento pero no has conseguido ningun premio.");
		} else {
			numero = 11-count;
			resultado = $('.dollars-block p:nth-child('+numero+')').html();		
			resultado = resultado.replace('<img src="config/images/left_star.png" border="0">', '');
			resultado = resultado.replace('<img src="config/images/right_star.png" border="0">', '');
			$('div.game .quiz-percent-value').html(resultado + " puntos.");
		}
	    //$('.quiz-percent-value').html("$"+prize);
    };
    this.updateProgressText = function() {
        $('div.game .progress-text').html(questionIndex+" of "+questionCount);
    };

    function startTimer() {
        timerPrev = new Date().getTime();
        timerOn = true;
    }

    function stopTimer() {
        timerOn = false;
    }

    /* -----------------------  GAME FLOW START ------------------------- */

    /* -----------------------  STEP-0 game start, reset all ------------------------- */
    this.start = function () {
        if (onlyOneSound){
            $('#game').css({opacity: 1});
        }
        if(!(empty(SUBMIT_REGISTRATION_TO))) {
            $('div.game #register').css('display','block');
        }else{
            $('div.game #register').css('display','none');
        }
        $('div.game .hint-border').removeClass('animate-out').removeClass('animate-in');
        questions = getOriginalQuestions(); defaultQuestionPostProcesor(questions);
        instance.loadData();
        tRewind(sounds.finish);
        tRewind(sounds.conclusion);
        if (!onlyOneSound) {
            setTimeout(function () {
                tRewind(sounds.start);
                tPlay(sounds.start, PRIORITY_NORMAL);
            }, 10);
        }

        statistic.correct_answers=0;    //every correct answer
        statistic.incorrect_answers=0;  //every incorrect attempt
        statistic.fail_answers=0;       //when all attempts was incorrect
        statistic.questions_time={};
        statistic.questions_answers={};

        answers = {};
        questionIndex = 0;
        timerCount = 0;

        gameTime = 0;
        gameScore = 0;
        gameFee = 0;


        stopTimer();


        $('div.game div.score').html(0);
        $('div.game div.time').html("");


        
        $('div.game .dollars-block').hide();
        $('div.game .current_rate').css({top: 450+'px'});
        $('div.game .lot_of_money').removeClass('animate-in');
  		$('div.game .shadow_money').removeClass('animate-in');
        $('div.game .hint').removeClass('invisible-hint').addClass('visible');

        $('div.game .lot_of_money').eq(0).css({left:-219});
        $('div.game .lot_of_money').eq(1).css({left:-310});
        $('div.game .lot_of_money').eq(2).css({left:-400});
        $('div.game .lot_of_money').eq(3).css({left:-500});
        $('div.game .lot_of_money').eq(4).css({left:-610});

        $('#game').removeClass('step-0').addClass('step-1');
        setTimeout(function(){$('div.game .dollar').addClass('animate_in');},1000)
        $(document).trigger('gameStarted');
    };

    /*this.onGameLoaded = function () {
        instance.prepareAnimationFrame();
    }*/

    /* -----------------------  STEP-1 Logo, Splash screen ------------------------- */

    liveFastClick('div.game a.button-game-start-1', function () {
        $('#game').removeClass('step-1').addClass('step-2');
        if (onlyOneSound) {
            tRewind(sounds.start);
            if (web_audio_api_player.init()){
                if (sounds.introduction!=null){
                    tPlay(sounds.start, PRIORITY_NORMAL);
                    if ($('#game').hasClass('step-2')){
                        tRewind(sounds.start, 3, 1);
                        tPlay(sounds.introduction, PRIORITY_NORMAL,4);
                    }
                }
                else {tPlay(sounds.start, PRIORITY_NORMAL);}
            }
            else {
                if (sounds.introduction!=null){
                    tPlay(sounds.introduction, PRIORITY_NORMAL);
                }
                else {tPlay(sounds.start, PRIORITY_NORMAL);}
            }
        } else {
            tRewind(sounds.start);
            if (sounds.introduction!=null){
                tPlay(sounds.introduction, PRIORITY_NORMAL);
            }
        }
    });

    /* -----------------------  STEP-2 Intro to game, it's description ------------------------- */

    liveFastClick('div.game #step2continuebutton', function() {
        tRewind(sounds.start);
        tRewind(sounds.introduction);
        $('#game').removeClass('step-2');        
        $('div.game #animation').show();
        start_time= new Date().getTime();
        questionIndex = 0;
        instance.onQuestionChooseRequired();
    });
    
    this.onQuestionChooseRequired = function() {
        questionIndex++;
        onQuestionIndexApplied();
    };
    /* -----------------------  STEP-3 Questions choosing board ------------------------- */

    /**
     * New question index is set, show it and start timers
      */
    function onQuestionIndexApplied() {
        if (!empty(questions['q' + questionIndex])) {
            startTimer();
            //gameTime=0;
            $('#game').removeClass('step-3');
            questionShow(questionIndex);
            $('div.game .dollars-block').show();
        } else {
        
            finishGame(true);
        }
    }

    /**
     * On animation end
     */
    $(document).bind('endDraw', function () {
        questionIndex++;
        $('#game').addClass('step-3');
    });

    /**
     * On pressing continue button on question board screen
     */
    liveFastClick('div.game #step3continuebutton', function () {
        onQuestionIndexApplied();
    });
    

    /**
     * No more questions available, go to finish screen, send score to SCROM
     */
    function finishGame(win) {

	    stopTimer();
        $('div.game .hint').removeClass('inactive');


    
        $('#game').removeClass('step-3').removeClass('step-4').addClass('step-5');
        if (onlyOneSound){
            $('#game').css({opacity: 0.99});
        }

        if ($('div.game div.step-4').is('.correct')) {
            $('div.game div.result-block div.description').html("" + value(questions.conclusion_text));
            flashBackground('start');
        } else {
            $('div.game div.result-block div.description').html("" + value(questions.conclusion_lost_text));
        }

        if(win){
            if (sounds.conclusion!=null){tPlay(sounds.conclusion, PRIORITY_NORMAL);}
            else {tPlay(sounds.finish, PRIORITY_NORMAL);}
			$('#game').addClass('win');
        } else {
            if (sounds.conclusion_lost != null){tPlay(sounds.conclusion_lost, PRIORITY_NORMAL);}
            else {tPlay(sounds.incorrect, PRIORITY_NORMAL);}
        }

        try {
            SCOSetValue("time", gameTime);
            SCOSetValue("score", 100);
            SCOSetValue("completed", 1);
            SCOCommit();
        } catch (e) {
            console.error("Scorm failed -", e);
        }
        if('undefined' !==  typeof gameloader ){
            gameloader.send_results(statistic);
        }
        $(document).trigger('gameFinished',[statistic]);
        if(!empty(SUBMIT_REGISTRATION_TO)) {
            $.post(SUBMIT_REGISTRATION_TO, {
                score: score
            }, function(result) {

            });
        }

    }


    /* -----------------------  STEP-4 Answers ------------------------- */

    /**
     * Show question board for index i
     * @param i
     */
    function questionShow(i) {
        questionTime = 0;
        $('#game').addClass('step-4');
        var question = questions['q' + i];

        var score = nvl(question.score,1); /* Question score is optional, default 1 per question */
        current_time= (new Date().getTime());
        if (statistic.questions_answers['q' + i] != 0) statistic.questions_time['q' + i] = 0;//reset question time on start/correct/fail (don't reset on incorrect)
        $('#game').data('question', question).data('score', score);

        $('div.game .step-4').removeClass("type-multiple");
        //conditionalShow($('.question-block h1'),question.title);
        $('div.game .question-block div').html(value(question.text));
        $('div.game .question-choose').html("");

        var correct = value(question.correct_answer).split(',');

        var i = 1;
        var order = [];

        // optionally include eli animbutton and clickalert state when specified by ini settings
        var eliAnimButtonDivOpen = (design.eli_anim_button_enabled) ? "<div class='eli-button'>" : "";
        var eliAnimButtonDivClose = (design.eli_anim_button_enabled) ? "</div>" : "";
        var eliAnimClickAlertDiv = (design.eli_anim_clickalert_enabled) ? "<div class='eli-clickalert'></div>" : "";

        while (!empty(value(question['answer_' + i]))) {
            var variant = $("<div class='variant respuesta"+i+"'>" + eliAnimButtonDivOpen + "<div class='table'><div>" + value(question['answer_' + i]) + "</div></div>" + eliAnimClickAlertDiv + eliAnimButtonDivClose + "</div>");
            variant.data({'correct': false, 'number': i});
            for (var k in correct) {
                if (i == correct[k].trim()) {
                    variant.data('correct', true);
                }
            }
            order[order.length] = variant;
            i++;
        }
        if (questions.randomize_answer_order) {
            order.sort(function () {
                return 0.5 - Math.random()
            });
        }

        for (var k in order) {
            $('div.game .question-choose').append(order[k]);
            //$('.question-choose .variant').eq(k).find('div').prepend(letter[k]+'. ')
        }

        if (!empty(question.type)) {
            $('div.game .step-4').addClass("type-" + value(question.type));
        }
        if(!empty(question.audio)) {
            currentQuestionSound = createSound(value(question.audio), true);
            tPlay(currentQuestionSound, PRIORITY_HI);
        } else {
            currentQuestionSound = null;
        }
        removeBackgroundApply($('div.game .question-block-wrapper'), question);
        if (!empty(question.image)) {
            $('div.game .question-block-wrapper').removeClass('transparent');
            var image = value(question.image);

        }
        $('div.game .question-block-wrapper').css({opacity:0}).animate({opacity:1}, 'slow');

        $('#game .step-4').removeClass('answered').addClass('unanswered').removeClass('correct').removeClass('incorrect');

        // call core helper to init eli sprite anims
        initEliSpriteAnims(design);
    }

    function questionHide(i) {
        instance.onQuestionHide(i);
    }

    /**
     * Question is hidden, do custom actions
     */
    this.onQuestionHide = function(questionI) {
        onQuestionIndexApplied();
    };

    liveFastClick('div.game div.question-choose .variant', function () {
        $(this).toggleClass('choosed');
        answerChanged();
    });


     /**
     * Answer is changed
     */
    var answerChanged = function () {
        if (!$('div.game div.step-4').hasClass('type-multiple')) {
            answerConfirmed();
        }
    };


    liveFastClick('div.game a.button-question-confirm', function () {
        answerConfirmed();
    });


    /**
     * Answer is confirmed
     */
    var hintText = function (numberHint) {
        var question = $('#game').data('question');
        $('div.game .hint-box').addClass('animate-in');
        $('div.game .hint-border').removeClass('animate-out').removeClass('animate-in');
        $('div.game .scoreboard .hint').eq(numberHint).addClass('invisible-hint').removeClass('visible');
        $('#game .step-4').removeClass('answered').addClass('unanswered');

        /*if (numberHint == 0){
 	        //$('.hint-box h1').html(value(question.hint_title_1));
            $('.hint-box div').html(value(question.hint_text_1));
        } else 
        if (numberHint == 1){        
 	        //$('.hint-box h1').html(value(question.hint_title_2));
            $('.hint-box div').html(value(question.hint_text_2));
        } else 
        if (numberHint == 2){        
 	        //$('.hint-box h1').html(value(question.hint_title_3));
            $('.hint-box div').html(value(question.hint_text_3));
        } */
        $('div.game .hint-box div div').html(value(question.hint_text));
    };

    /**
     * Answer is confirmed
     */
    var answerConfirmed = function () {

        if(currentQuestionSound) {tRewind(currentQuestionSound);}
        var question = $('#game').data('question');
        var lscore = $('#game').data('score');
        var answerIndex = -1;
        var answerNumber = 0;
        statistic.questions_time['q'+questionIndex]+= (new Date().getTime())-current_time;
       // console.log('confirm',question );
        var allCorrectRequired = $('div.game div.step-4').hasClass('type-multiple');
        var correct = allCorrectRequired;
        
         $('div.game .hint-box').removeClass('animate-in');

        $('div.game div.question-choose').find('.variant').each(function () {

            /* If required all correct answers to be choosed */
            if (allCorrectRequired && $(this).hasClass('choosed') != $(this).data('correct')) {
                correct = false;
            }

            /* If required one correct answers to be choosed */
            if (!allCorrectRequired && $(this).hasClass('choosed') && $(this).data('correct')) {
                correct = true;
            }

            if($(this).hasClass('choosed')) {
                answerIndex=$(this).index();
                answerNumber=$(this).data('number');
            }
        });

        stopTimer();

        if (correct) {
            $('div.game .hint').addClass('inactive');

            tRewind(sounds.correct);
            tPlay(sounds.correct, PRIORITY_NORMAL);
            
            $('div.game .hint-border').removeClass('animate-out').removeClass('animate-in');

            answers[questionIndex] = parseInt(lscore);
            score = parseInt($('div.game div.score').html()) + parseInt(lscore);
            statistic.questions_answers['q' + questionIndex] = 1;
            statistic.correct_answers++;

            /*if(score%5 == 0)
                prize = moneys[score-1]; //устанавливаем несгораемую сумму

            console.log(prize);*/

            $('div.game .question-answered-block div').html((allCorrectRequired) ? value(question.correct_feedback_text) : value(question['answer_' + answerNumber].feedback_text));

            $('#game .step-4').addClass('correct');
            $('div.game #step4continuebutton').show();

            $('#game .step-4').removeClass('unanswered').addClass('answered');

            instance.onAnswerConfirmed(correct, answerIndex);
            instance.setupAnimationForQuestion();

            //if ($('.dollars-block p').eq(15-questionIndex).is('.white')) {
	        	//var eq = (15-questionIndex)/5;
               // console.log ("in question",questionIndex  );
                switch (questionIndex){
                    case Math.round( questionCount/3):
    	    	        $('div.game .lot_of_money').eq(0).addClass('animate-in').css({top:390});
        		        $('div.game .shadow_money').addClass('animate-in');
                     break;
                    case Math.round( questionCount/3*2):
                        $('div.game .lot_of_money').eq(1).addClass('animate-in').css({top:400});
                        $('div.game .lot_of_money').eq(2).addClass('animate-in').css({top:390});
                     break;
                    case  questionCount:
                        $('div.game .lot_of_money').eq(3).addClass('animate-in').css({top:400});
                        $('div.game .lot_of_money').eq(4).addClass('animate-in').css({top:390});
                     break;
                }


        	//}
            
        } else {

            $('div.game .question-answered-block div').html((allCorrectRequired) ? value(question.incorrect_feedback_text) : value(question['answer_' + answerNumber].feedback_text));

            $('#game .step-4').addClass('incorrect');
           	$('#game .step-4').removeClass('unanswered').addClass('answered');            
           	$('div.game #step4continuebutton').hide();
		
            tRewind(sounds.incorrect);

            recalculateScore();
            answers[questionIndex] = 0;
            if ($('.scoreboard .hint').is('.visible') && !$('.hint').hasClass('inactive')) {
                tPlay(sounds.incorrect, PRIORITY_NORMAL);
            	$('div.game .hint-border').addClass('animate-in');
            	setInterval(function(){
            		if ($('div.game .hint-border').is('.animate-out')){ $('.hint-border').addClass('animate-in').removeClass('animate-out');} else
            		if ($('div.game .hint-border').is('.animate-in')) {$('.hint-border').addClass('animate-out').removeClass('animate-in');}
            	},1000);
            } else {
            	finishGame(false);
            }
            
            //error++;
            //if (error == 3) finishGame();
           
            if(gameScore-parseInt(questions.incorrect_question_fee)>=0) {
                gameFee+=parseInt(questions.incorrect_question_fee);
            }
            statistic.questions_answers['q' + questionIndex] = 0;
            statistic.incorrect_answers++;
//            statistic.fail_answers++;
            recalculateScore();
            /*$('#error').show().css({top: 150, left: 350, width: 250, height: 250, opacity: 0.5}).animate({top: 50, left: 250, width: 450, height: 450, opacity: 0.0}, 200, function() {
               $(this).hide();
            });*/
            $('div.game div.question-choose .variant').removeClass('choosed');
        }

    };

    /**
     * Answer is confirmed, run custom actions like animations
     * @param correct
     * @param answerIndex
     */
    this.onAnswerConfirmed = function(correct, answerIndex) {
        //this.runAnimationToQuestion(questionIndex, {correct: correct, answer: answerIndex});
        $('div.game div.progressbar div:eq('+(questionIndex-1)+')').addClass('answered');

        if(correct) {
            $('div.game div.progressbar div:eq('+(questionIndex-1)+')').addClass('correct').removeClass('incorrect');
        } else {
            $('div.game div.progressbar div:eq('+(questionIndex-1)+')').addClass('incorrect');
        }
    }

    liveFastClick('div.game a.button-question-continue', function () {
        var ans_div=$('div.game .step-4');
            questionIndex++;
            questionHide(questionIndex);
            recalculateScore();
        $('div.game .hint').removeClass('inactive');
    });

     /**
     * hint button
     */
    liveFastClick('div.game .scoreboard .hint', function () {
       if (!$('div.game .hint-box').is('.animate-in') && !$('div.step-4').is('.correct') && $(this).hasClass('visible') && !$(this).hasClass('inactive')){
           tPlay(sounds.select, PRIORITY_LOW);
           $('div.game .hint').addClass('inactive');
        var eq = $(this).index();
	        hintText(eq);
           questionTime =0;
           startTimer();
        }
    });

    /* -----------------------  STEP-5 Results ------------------------- */

    liveFastClick('div.game a.button-result-continue', function () {
        tRewind(sounds.finish);
        tRewind(sounds.conclusion);
        tRewind(sounds.conclusion_lost);
        $('#game').removeClass('step-5');
        game.resetAnimation();
        flashBackground('stop');
        game.start();
    });

    /* ----------------- ANIMATIONS ----------------- */

    /**
     * Init canvas
     */
  /*  this.prepareAnimationFrame = function () {
        $('#animation').hide();
        $('#animation .finish').hide();
    }*/

    /**
     * Prepare frame for animation
     */
    this.setupAnimationForQuestion = function () {
    	var l = parseInt( 440/questionCount );
    	//var l = parseInt($('.dollars-block p').css('line-height'));
		//if (questionIndex < 15) $('.current_rate').css({top: (15*l-(questionIndex*l))+'px'});
        //if (questionIndex < questionCount)
            $('div.game .current_rate').css({top: (440-(questionIndex*l))+'px'});
    }
    /**
     * Run animation
     */
    /*this.runAnimationToQuestion = function (i, data) {

        var before = 200;
        var after = 300;

        var data = typeof(data)==='undefined'?{}:data;
        var x=0;
        var y=0;
        var leaveBall=false;
        var man_image = "0 -1496px";;
        var fadeOut = 1.0;
        var targetDim = 30;
        var shift1 = 100;
        var shift2 = 150;
        var zIndex = 4;

        data.answer = data.answer + 1;
        if(data.answer == 1) {
            shift1 = -100;
            shift2 = -150;
            x=50;
            y=30;
            man_image = "0 -748px";
            fadeOut = 0.0;
        }
        if(data.answer == 2) {

            x=550;
            y=30;
            man_image = "0 -1122px";
            fadeOut = 0.0;
        }
        if(data.answer == 3) {
            shift1 = -100;
            shift2 = -150;
            leaveBall = true;
            x=50;
            y=250;
            if(!data.correct) man_image ="0 -1870px";
        }
        if(data.answer == 4) {
            leaveBall = true;
            x=550;
            y=250;
            if(!data.correct) man_image = "0 -374px";
        }
        var middleX = (300+x)/2;
        var middleY = (350+y)/2;
        if(data.correct) {
            zIndex = 2;
        } else {
            fadeOut = 0.0;
            targetDim = 200;
        }
        //alert(data.answer);
        $('#animation .ball').css('z-index',3).animate({left: middleX, top: middleY}, before, function() {$(this).css('z-index',zIndex)}).animate({left: x, top: y, width: targetDim, height: targetDim, opacity: fadeOut}, after);
        $('#animation .man').animate({marginLeft: shift1}, before, function() {$(this).css('background-position',man_image)}).animate({marginLeft: shift2}, after);

    }*/

    this.resetAnimation = function () {
        //this.runAnimationToQuestion(0);
        $('div.game .hint-box').removeClass('animate-in');
        $('div.game #animation').fadeOut();
        $('div.game div.progressbar div').removeClass('answered').removeClass('correct').removeClass('incorrect');
    }

    /* ----------------- TIMER ------------------- */
    this.onTimePassed = function (deltaTime) {
        gameTime+=deltaTime;
        questionTime+=deltaTime;
       // console.log("gameTime ",gameTime,"questionTime",questionTime);
        if (timeout != 0) {
            $('div.game div.time').html((timeout / 1000 - parseFloat(questionTime) / 1000).toFixed(0));
            if (timeout && questionTime > timeout) {
                this.onTimeOut(correctAnsweredCount);
            }
        }
       /* gameTime-=deltaTime;
        $('div.time').html((parseFloat(gameTime)/1000).toFixed(0));
        if(gameTime<0) {
            this.onTimeOut();
        }*/
    };

    this.onTimeOut = function (count) {
        /* PUT TIMEOUT CODE HERE IF ANY */
       	//var p = (100*count/questionCount).toFixed(2);
        //$("div.game .quiz-percent-value").html( p+"%" );
		
		numero = 11-count;
		resultado = $('.dollars-block p:nth-child('+numero+')').html();		
		resultado = resultado.replace('<img src="config/images/left_star.png" border="0">', '');
		resultado = resultado.replace('<img src="config/images/right_star.png" border="0">', '');
		$('div.game .quiz-percent-value').html(resultado + " puntos.");

        stopTimer();

        finishGame();

    }

    /* ----------------- SCORE ------------------- */
    this.onUpdateScore = function(score) {
        $('div.game div.score').html(score);
    }

    /* -----------------------  GAME FLOW END ------------------------- */



    /* ----------------- GAME SPECIFIC LOADERS ------------------- */
    this.loadStyles = function () {
        applyDefaultStyles(design);

        /* eli sprite anims */
        loadEliSpriteAnimStyles(dynamicCssInstance, design);

        if (!hoverDisable) {
            dynamicCssInstance.addCompiled("div.game .question-choose .variant:hover", design.question_button_over);
            dynamicCssInstance.addCompiled("div.game a.button:hover", design.button_over);
        }

        dynamicCssInstance.addRule("div.game .question-vertical-shift", design['margin_top_for_questions_screen'], "height: $vpx");
        dynamicCssInstance.addRule("div.game .question-feedback-vertical-shift", design['margin_top_for_questions_feedback'], "height: $vpx");

        dynamicCssInstance.addCompiled("div.game div.logo1", design.logo1);
        dynamicCssInstance.addCompiled("div.game div.logo2", design.logo2);
        dynamicCssInstance.addCompiled("div.game div.logo3", design.logo3);

        if(!empty(design.question_screen)) {
            var object = dozerMapper(design.question_screen, ["width", "height", "X", "Y", "padding", "paddingX", "paddingY","margin","marginX","marginY","marginTop","marginBottom","marginLeft","marginRight"]);
            dynamicCssInstance.addCompiled("div.game .vertical .question-choose-wrapper", object);
            dynamicCssInstance.addCompiled("div.game .vertical .question-block-wrapper", object);
            dynamicCssInstance.addCompiled("div.game .vertical .question-answered-block-wrapper", object);
        }

        if(!empty(design.question_choose_wrapper)) {
            dynamicCssInstance.addCompiled("div.game .vertical .question-choose-wrapper", design.question_choose_wrapper);
        }
        if(!empty(design.dollars_block)) {
            dynamicCssInstance.addCompiled("div.game .dollars-block", design.dollars_block);
            dynamicCssInstance.addCompiled("div.game .lot_of_money", design.lot_of_money);
            dynamicCssInstance.addCompiled("div.game .shadow_money", design.shadow_money);
        }
         if(!empty(design.hint_button)) {
            dynamicCssInstance.addCompiled("div.game .hint", design.hint_button);
            dynamicCssInstance.addCompiled("div.game .hint:active", design.hint_hover);
            dynamicCssInstance.addCompiled("div.game .hint:hover", design.hint_hover);
            dynamicCssInstance.addCompiled("div.game .hint-box", design.hint_box);
            dynamicCssInstance.addCompiled("div.game .hint.inactive", design.hint_inactive);
        }

        dynamicCssInstance.addCompiled("div.game .question-choose .variant", design.question_button_up);
        dynamicCssInstance.addCompiled("div.game .question-choose .variant:active", design.question_button_down);
        dynamicCssInstance.addCompiled("div.game .question-choose .variant.choosed", design.question_button_selected);

        dynamicCssInstance.addCompiled("div.game a.button", design.button_up);
        dynamicCssInstance.addCompiled("div.game a.button:active", design.button_down);
        if(!empty(design.score_box)) {
            dynamicCssInstance.addCompiled("div.game div.score", design.score_box);
        }
        if(!empty(design.timer_box)) {
            dynamicCssInstance.addCompiled("div.game div.time", design.timer_box);
        }
        if(!empty(design.scoreboard_box)) {
            dynamicCssInstance.addCompiled("div.game div.scoreboard", design.scoreboard_box);
        }

        dynamicCssInstance.addCompiled("div.game .vertical .question-answered-block-wrapper", design.question_feedback_box);
        dynamicCssInstance.addCompiled("div.game .vertical .question-block-wrapper", design.question_box);
        var object = dozerMapper(design.question_box, ["width", "height", "X", "Y", "padding", "paddingX", "paddingY"]);
        applyDefaultQuestionBoxImage(dynamicCssInstance, design.question_box);

        dynamicCssInstance.addCompiled("div.game div.step-2-description", design.description_panel);
        dynamicCssInstance.addCompiled("div.game div.result-block-wrapper", design.result_panel);
        dynamicCssInstance.addCompiled("div.game .progressbar", design.progressbar_container);
        dynamicCssInstance.addCompiled("div.game .progressbar>div", design.progressbar_item);

        dynamicCssInstance.addCompiled("div.game .progressbar>div.answered", design.progressbar_answered_item);

        if(design.progressbar_answered_correct_item) {
            dynamicCssInstance.addCompiled("div.game .progressbar>div.answered.correct", design.progressbar_answered_correct_item);
        }
        if( design.progressbar_answered_incorrect_item) {
            dynamicCssInstance.addCompiled("div.game .progressbar>div.answered.incorrect", design.progressbar_answered_incorrect_item);
        }
        dynamicCssInstance.addRule("div.game .step-4.answered.correct .vertical .question-answered-block-wrapper h1", design.question_answer_correct_color, "color: $v");
        dynamicCssInstance.addRule("div.game .step-4.answered.incorrect .vertical .question-answered-block-wrapper h1", design.question_answer_incorrect_color, "color: $v");

        dynamicCssInstance.addRule("div.game .progressbar>div", design.progressbar_container.spacing, "margin-right: $vpx");
        dynamicCssInstance.addRule("div.game .progressbar>div:last-child", design.progressbar_container.spacing, "margin-right: 0px");

        $('div.game .step-4').addClass('vertical').removeClass('horizontal');


        dynamicCssInstance.addCompiled("div.game #step1continuebutton", design.splash_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step2continuebutton", design.intro_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step3continuebutton", design.questions_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step4continuebutton", design.question_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step4confirmbutton", design.question_confirmbutton);
        dynamicCssInstance.addCompiled("div.game #step5replaybutton", design.results_replaybutton);

        var qCount = 1;
        while (!empty(questions['q' + qCount])) {
            qCount++;
        }
        qCount--;

        var paddingTMP = design.progressbar_container.paddingX || design.progressbar_container.padding || 0;
        var totalWidth = 1*value(design.progressbar_container.width)-qCount*value(design.progressbar_container.spacing) - 2*paddingTMP;
        var elementWidth = Math.floor(totalWidth/qCount);
        dynamicCssInstance.addRule("div.game .progressbar>div", elementWidth, "width: $vpx");

        dynamicCssInstance.addRule("div.game .progressbar>div", design.progressbar_item.width, "width: $vpx");

        dynamicCssInstance.flush();
    }
    this.loadSounds = function () {
        if (questions.introduction_audio != null){
            sounds.introduction = createSound(questions.introduction_audio, true);
        }
        if (questions.conclusion_audio != null){
            sounds.conclusion = createSound(questions.conclusion_audio, true);
        }
        if (questions.conclusion_lost_audio != null){
            sounds.conclusion_lost = createSound(questions.conclusion_lost_audio, true);
        }
        if (onlyOneSound) {
            liveFastClick('.game a:not(#step4confirmbutton)', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            liveFastClick('.game .questions div.question:not(.answered):not(.hasOwnSound)', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            liveFastClick('div.game .type-multiple .question-choose .variant', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
        } else {
            liveFastClick('.game a, .game .questions div.question:not(.answered), div.game .question-choose .variant', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            if (!hoverDisable) {
                $('.game a, .game .questions div.question:not(.answered), div.game .question-choose .variant, div.hint:not(.inactive)').live('mouseenter', function () {
                    tPlay(sounds.hover, PRIORITY_LOW);
                });
            }
        }
    }
    this.loadData = function () {
        questions.randomize_question_order = stringToBoolean(questions.randomize_question_order);
        questions.randomize_answer_order = stringToBoolean(questions.randomize_answer_order);
        timeout = nvl(questions.timeout,0) * 1000;

        var i = 1;
        while (!empty(questions['q' + i])) {
            i++;
        }
        var qlength = i - 1;
        if (questions.randomize_question_order) {
            var newQ = [];
            var oldQ = [];
            var i = 1;
            while (!empty(questions['q' + i])) {
                newQ[newQ.length] = questions['q' + i];
                oldQ[oldQ.length] = empty(questions['q' + i].path) ? (((i) * 100 / qlength).toFixed(2) + "%") : questions['q' + i].path;
                i++;
            }

            newQ.sort(function () {
                return 0.5 - Math.random()
            });
            var ql = i;
            for (i = 1; i < ql; i++) {
                questions['q' + i] = newQ[i - 1];
                questions['q' + i].path = oldQ[i - 1];
            }

        }

        /* FILL GAME TEXT */
        $("div.game #step1continuebutton").html("" + value(questions.splash_page_button_continue_text));
        $("div.game #step2continuebutton").html("" + value(questions.intro_page_button_continue_text));
        $("div.game #step3continuebutton").html("" + value(questions.questions_button_continue_text));
        $("div.game #step4continuebutton").html("" + value(questions.question_page_button_continue_text));
        $("div.game #step4confirmbutton").html("" + value(questions.question_page_button_confirm_text));
        $("div.game #step5replaybutton").html("" + value(questions.result_page_button_replay_text));
        //conditionalShow($('div.step-2-description h1'), questions.introduction_title);
        $('div.game div.step-2-description div.description div').html("" + value(questions.introduction_text));
        //$('div.step-2-description div.racer-description').html("" + value(questions.introduction_racer_description));

        //$('div.result-block h1').html("" + value(questions.conclusion_title));
        //$('div.result-block div.description').html("" + value(questions.conclusion_text));
/*         conditionalShow($('div.result-block div.score-description'), questions.finish_score_description); */


        var qCount = 1;
        while (!empty(questions['q' + qCount])) {
            qCount++;
        }
        questionCount = defaultCutQuestionCount(questions, questions.questions_displayed_from_count);

        $('div.game div.progressbar').html("");
        for(i=0;i<questionCount;i++)
            $('div.game div.progressbar').append("<div class='blue-box'></div>");
        //$(".blue-box").css({width: $('div.progressbar').width()/questionCount});
    }
};

$(document).ready(function () {
    game.readConfig();
    $('div.game .dollars-block').hide();
    $('.game').css('opacity', 0.1)
});


$(window).load(function () {

});

$(document).bind('gameLoaded', function () {
    SCOPreInitialize();
    SCOInitialize();
    $('.game').css('opacity', 1);
   
    game.start();
});

//var $overflow_auto = $('*').filter(function() {
//    return $(this).css('display') == 'none';
//});
//console.log($overflow_auto);