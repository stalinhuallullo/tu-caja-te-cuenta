/**
 * Copyright eLearning Brothers LLC 2012 All Rights Reserved
 */

var game = new function () {
    var designFile = "design.ini",
        questionsFile = "questions.ini",
        soundsFile = "sounds.ini",
        questions,
        questionCount = 0,
        design,
        sounds,
        instance = this,
        score = 0,
        answers = {},
        questionIndex = 0,
        timerOn = false,
        timerPrev = null,
        timerCount = 0,
        gameScore = 0,
        curRacer = {},
        gameTime = 0,
        timeout = 0, /* NO TIMEOUT */
        positionsCount = 0,
        currentQuestionSound = null,
        statistic = {},
        current_time = 0,
        start_time,
        totalPercent = 0,
        gamefee = 0,
        on_last_point_in_path = false,
        srcpositions,
        $game = {};

    if (!empty(GAMEPREFIX)) {
        soundsFile = GAMEPREFIX + "-sounds.ini";
        questionsFile = GAMEPREFIX + "-questions.ini";
        designFile = GAMEPREFIX + "-design.ini";
    }

    /* -----------------------  LOADING ------------------------- */

    this.reloadStyles = function () {
        $.get("config/" + designFile, function (iniData) {
            design = parseIni(iniData);
            loadStyles();
        });
    };

    this.readQuestions = function (iniData) {
        iniData += prepareIni(iniData, standartQuestionPattern);
        questions = parseIni(iniData);
        setOriginalQuestions(questions);
    };
    this.readDesign = function (iniData) {
        design = parseIni(iniData);
        srcpositions = $.parseJSON("[" + value(design.path) + "]");
    };
    this.readSounds = function (iniData) {
        sounds = parseIni(iniData, function (val) {
            return createSound(val);
        });
    };

    /* A handler for getting config from other window from different domain
     *  Does exactly same as readConfig, but from strings */
    window.addEventListener("message", receiveExternalConfig, false);
    function receiveExternalConfig(event) {
        var data = JSON.parse(event.data);
        instance.readQuestions(data.questions);
        instance.readDesign(data.design);
        instance.readSounds(data.sounds);
        $(document).trigger('gameLoaded');
    }

    this.readConfig = function () {
        $.when(
                $.get("config/" + questionsFile, function (iniData) {
                    instance.readQuestions(iniData);
                }),
                $.get("config/" + designFile, function (iniData) {
                    instance.readDesign(iniData);
                }),
                $.get("config/" + soundsFile, function (iniData) {
                    instance.readSounds(iniData);
                })
            ).then(function () {
                $(document).trigger('gameLoaded');
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
        $game = $("#game");
        loadStyles();
        bindSounds();
        fillData();

        $game.addClass('step-1');
        instance.onGameLoaded();
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
        var answeredCount = 0; var correctAnsweredCount = 0;
        var answeredScore = 0;
        for (var k in answers) {
            answeredCount++;
            answeredScore += answers[k]; if(answers[k]>0) correctAnsweredCount++;
        }
        gameScore = answeredScore-gamefee;
        instance.onUpdateScore(gameScore);
        instance.updateQuizPercent(correctAnsweredCount);
        instance.updateProgressText();
    }

    this.updateQuizPercent = function(count) {
        var p = (100*count/questionCount).toFixed(2);
        statistic.game_percent = (100*count/questionCount).toFixed(0);
        $('.quiz-percent-value').html(p+"%");
        totalPercent = (100*count/questionCount).toFixed(0);
    };

    this.updateProgressText = function() {
        if (questionIndex>questionCount) questionIndex=questionCount;
        $('.progressbar').html("TIRADA: "+questionIndex+" de "+questionCount+"");
    };

    function startTimer() {
        timerPrev = new Date().getTime();
        timerOn = true;
    }

    function stopTimer() {
        timerOn = false;
    }

    /* -----------------------  STEP-0 game start, reset all ------------------------- */
    this.start = function () {
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
        gamefee=0;

        gameTime = 0;
        gameScore = 0;
        on_last_point_in_path=false;

        stopTimer();

        $('div.score').html(0);
        $('div.progressbar').html("");
        $('div.time').html(0);

        $game.removeClass('step-0').addClass('step-1');
        $(document).trigger('gameStarted');
    };

    this.onGameLoaded = function () {
        instance.prepareAnimationFrame();
        instance.runAnimationToQuestion(0);
    };

    /* -----------------------  STEP-1 Logo, Splash screen ------------------------- */

    liveFastClick('a.button-game-start-1', function () {
        $game.removeClass('step-1').addClass('step-2');
        if (onlyOneSound) {
            tRewind(sounds.start);
            if (web_audio_api_player.init()){
                if (sounds.introduction!=null){
                    tPlay(sounds.start, PRIORITY_NORMAL);
                    if ($game.hasClass('step-2')) {
                        tRewind(sounds.start, 3, 1);
                        tPlay(sounds.introduction, PRIORITY_NORMAL,4);
                    }
                }
                else {tPlay(sounds.start, PRIORITY_NORMAL);}
            }
            else{
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

    /* Choose racer */
    liveFastClick('.choose-racer .racer-variant', function() {
        curRacer['racer'] = $(this).attr('racer');
        curRacer['dx'] = parseInt(design['char'+curRacer['racer']+"_dragging_point_X"]);
        curRacer['dy'] = parseInt(design['char'+curRacer['racer']+"_dragging_point_Y"]);

        $('div.board .racer-variant').removeClass('racer-variant-1 racer-variant-2 racer-variant-3 racer-variant-4').addClass('racer-variant-' + curRacer['racer']);

        tRewind(sounds.start);
        tRewind(sounds.introduction);

        $game.removeClass('step-2');

        questionIndex = 0;
        instance.onQuestionChooseRequired();

    });


    this.onQuestionChooseRequired = function() {
        questionIndex++;
        $game.addClass('step-3').removeClass('step-4');
        $('div.dice').addClass('needsrolling');
        $('div.card-stack').removeClass('active');
    };
    /* -----------------------  STEP-3 Questions choosing board ------------------------- */
    liveFastClick('div.dice', function () {
        if(!$(this).is(':.needsrolling')) {
            return false
       }
            $(this).removeClass('needsrolling');
            instance.rollDice();
        setTimeout(function () {
            instance.stopDice();
            if (!empty(questions['q' + questionIndex]))
                instance.setDiceNumber(questions['q' + questionIndex]['diceNumber']);
            instance.runAnimationToQuestion(questionIndex);
        }, 1000);
    });
    liveFastClick('div.card-question, div.card0,div.card-stack div.marker, div.card-stack>div.marker>div', function(e) {
        e.stopPropagation();
        if($(".card-stack").hasClass('active')){
        questionShow(questionIndex);}
    });
    /**
     * New question index is set, show it and start timers
      */
    function onQuestionIndexApplied() {
        if (!empty(questions['q' + questionIndex])) {
            startTimer();
            start_time= new Date().getTime();
            $game.removeClass('step-3');
            questionShow(questionIndex);
        } else {
            finishGame();
        }
    }

    /**
     * On animation end
     */
    $(document).bind('endDraw', function () {
        questionIndex++;
        $game.addClass('step-3');
    });

    /**
     * On pressing continue button on question board screen
     */
    liveFastClick('#step3continuebutton', function () {
        onQuestionIndexApplied();
    });

    /**
     * No more questions available, go to finish screen, send score to SCROM
     */
    function finishGame() {
        statistic.full_Time=(new Date().getTime()-start_time);
        $game.removeClass('step-3').removeClass('step-4').addClass('step-5');
        flashBackground('start');
        $('.score-description').html('Nota (máximo 20): <span>'+(2*totalPercent/10)+'</span></br>Puntos: <span>'+score+'</span>');

        (sounds.conclusion != null) ? tPlay(sounds.conclusion, PRIORITY_NORMAL) : tPlay(sounds.finish, PRIORITY_NORMAL);

        conditionalShow($('div.result-block h1'),questions.conclusion_title);
        $('div.result-block div.description').html("" + value(questions.conclusion_text));

        recalculateScore();
        try {
            SCOSetValue("time", gameTime);
            SCOSetValue("score", (2*totalPercent/10));
			SCOSetValue("data", "Nota: " + (2*totalPercent/10) + "; Puntos: " + score);
            SCOSetValue("completed", 1);
            SCOCommit();
        } catch (e) {
            console.error("Scorm failed -", e);
        }
        if ('undefined' !== typeof gameloader)
            gameloader.send_results(statistic);
        $('#animation').fadeOut();
        $(document).trigger('gameFinished',[statistic]);
    }

    /* -----------------------  STEP-4 Answers ------------------------- */

    /**
     * Show question board for index i
     * @param i
     */
    function questionShow(i) {
        game.updateProgressText();
        $game.addClass('step-4');
        var question = questions['q' + i];
        var score=($(".board-small").eq(question.diceStep-1).children().text());
        if (on_last_point_in_path){
            score=100;
        }else if (score=='double_points'){
            score = parseInt($('.score').html());
        } else {
            score=parseInt(score);
        }
        current_time= (new Date().getTime());
        if (statistic.questions_answers['q' + i] != 0) statistic.questions_time['q' + i] = 0;//reset question time on start/correct/fail (don't reset on incorrect)
        $game.data('question', question).data('score', score);
        $('.step-4').removeClass("type-multiple");
        conditionalShow($('.question-block h1'),question.title);
        $('.question-block div').html(value(question.text));
        $('.question-choose').html("");

        var correct = value(question.correct_answer).split(',');

        var i = 1;
        var order = [];

        // optionally include eli animbutton and clickalert state when specified by ini settings
        var eliAnimButtonDivOpen = (design.eli_anim_button_enabled) ? "<div class='eli-button'>" : "";
        var eliAnimButtonDivClose = (design.eli_anim_button_enabled) ? "</div>" : "";
        var eliAnimClickAlertDiv = (design.eli_anim_clickalert_enabled) ? "<div class='eli-clickalert'></div>" : "";

        while (!empty(value(question['answer_' + i]))) {
            var variant = $("<div class='variant'>" + eliAnimButtonDivOpen + "<div class='table'><div>" + value(question['answer_' + i]) + "</div></div>" + eliAnimClickAlertDiv + eliAnimButtonDivClose + "</div>");
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
            $('.question-choose').append(order[k]);
        }

        if (!empty(question.type)) {
            $('.step-4').addClass("type-" + value(question.type));
        }
        if(!empty(question.audio)) {
            currentQuestionSound = createSound(value(question.audio), true);
            tPlay(currentQuestionSound, PRIORITY_HI);
        } else {
            currentQuestionSound = null;
        }

        $('.question-block-wrapper').removeClass('transparent');
        removeBackgroundApply($('.question-block-wrapper'), question);
        if (!empty(question.image)) {
            var image = value(question.image);
            var removeBackground = true;
            if (!empty(question.removeBackground)) {
                removeBackground |= stringToBoolean(value(question.removeBackground));
            }


            $('.question-block-wrapper>div.question-image').css('background-image', 'url("' + parseImgPath(image, true) + '")');
        } else {
            $('.question-block-wrapper>div.question-image').css('background-image', 'none');

        }
        $('.question-block-wrapper').css({opacity:0}).animate({opacity:1}, 0);

        $('#game .step-4').removeClass('answered correct incorrect').addClass('unanswered');
        instance.setupAnimationForQuestion(i);

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

    liveFastClick('div.question-choose .variant', function () {
        $(this).toggleClass('choosed');
        answerChanged();
    });

    /**
     * Answer is changed
     */
    var answerChanged = function () {
        if (!$('div.step-4').hasClass('type-multiple')) {
            answerConfirmed();
        }
    };

    liveFastClick('div.unanswered a.button-question-confirm', function () {
        answerConfirmed();
    });

    /**
     * Answer is confirmed
     */
    var answerConfirmed = function () {
        if (currentQuestionSound)
            tRewind(currentQuestionSound);
        var question = $game.data('question'),
            lscore = $game.data('score'),
            answerIndex = -1,
            answerNumber = 0,
            allCorrectRequired = $('div.step-4').hasClass('type-multiple'),
            correct = allCorrectRequired;
        statistic.questions_time['q'+questionIndex]+= (new Date().getTime())-current_time;

        $('div.question-choose').find('.variant').each(function () {

            /* If required all correct answers to be choosed */
            if (allCorrectRequired && $(this).hasClass('choosed') != $(this).data('correct'))
                correct = false;

            /* If required one correct answers to be choosed */
            if (!allCorrectRequired && $(this).hasClass('choosed') && $(this).data('correct'))
                correct = true;

            if($(this).hasClass('choosed')) {
                answerIndex=$(this).index();
                answerNumber=$(this).data('number');
            }
        });

        if (correct) {
            stopTimer();

            tRewind(sounds.correct);
            tPlay(sounds.correct, PRIORITY_NORMAL);

            answers[questionIndex] = parseInt(lscore);
            score = parseInt($('div.score').html()) + parseInt(lscore);
            statistic.questions_answers['q' + questionIndex] = 1;
            statistic.correct_answers++;

            $('div.game .question-answered-block div').html((allCorrectRequired) ? value(question.correct_feedback_text) : value(question['answer_' + answerNumber].feedback_text));
            $('#game .step-4').addClass('correct');
        } else {

            tRewind(sounds.incorrect);
            tPlay(sounds.incorrect, PRIORITY_NORMAL);

            answers[questionIndex] = 0;
            statistic.questions_answers['q' + questionIndex] = 0;
            statistic.incorrect_answers++;
            statistic.fail_answers++;

            $('div.game .question-answered-block div').html((allCorrectRequired) ? value(question.incorrect_feedback_text) : value(question['answer_' + answerNumber].feedback_text));

            $('#game .step-4').addClass('incorrect');
        }

        $('#game .step-4').removeClass('unanswered').addClass('answered');
        recalculateScore();

        instance.onAnswerConfirmed(correct, answerIndex);
    };

    /**
     * Answer is confirmed, run custom actions like animations
     * @param correct
     * @param answerIndex
     */
    this.onAnswerConfirmed = function(correct, answerIndex) {
        this.runAnimationToQuestion(questionIndex, {correct: correct, answer: answerIndex});
    };

    liveFastClick('a.button-question-continue', function () {
        recalculateScore();
        if (on_last_point_in_path){
            finishGame()
        } else {
        instance.onQuestionChooseRequired();}
    });

    /* -----------------------  STEP-5 Results ------------------------- */

    liveFastClick('a.button-result-continue', function () {
        $game.removeClass('step-5');
        flashBackground('stop');
        game.resetAnimation();
        game.start();
    });

    /* ----------------- ANIMATIONS ----------------- */
    var dicePos = 0;

    this.rollDice=function() {
        var int_1 = setInterval(function() {
            dicePos++;
            $('div.dice').removeClass('r0 r1 r2 r3 rolled').addClass('r' + (dicePos % 4));
            game.setDiceNumber(Math.floor(Math.random()*6+1));
        }, 100);
        $('div.dice').data("interval",int_1);
    };

    this.stopDice=function() {
        $('div.dice').removeClass('r0').removeClass('r1').removeClass('r2').removeClass('r3').addClass('rolled');
        clearInterval($('div.dice').data("interval"));
    };

    this.setDiceNumber = function(n) {
        for(var i=1;i<=6;i++) {
            $('div.dice').removeClass('dice-'+i);
        }
        $('div.dice').addClass('dice-'+n);
    }
    /**
     * Init canvas
     */
    var positions = [];
    this.prepareAnimationFrame = function () {
        questions = getOriginalQuestions();
        boardgameQuestionPostProcesor(questions);
        questionCount = defaultCutQuestionCount(questions, questions.questions_displayed_from_count);
        var sq = $('.board .sequence');

        dynamicCssInstance.flushIntoId("dnCustom");
        var pieceSize = 1*nvl(design.board_piece_size, 60);
        positions = [];
        sq.html("");

        for(var pos=1;pos<srcpositions.length-1;pos++) {
            var p = {x: srcpositions[pos][0], y: srcpositions[pos][1]};
            positions[positions.length]=p;
            var sm = $("<div class='board-small' pos="+pos+"></div>");
            sm.css({top:p.y, left:p.x});
            sq.append(sm);
        }

        positionsCount = positions.length;

        /* Finishing point */
        var p = {x: srcpositions[srcpositions.length-1][0]+65, y: srcpositions[srcpositions.length-1][1]+45};
        positions[positions.length]=p;

        var minQue = Math.ceil(positions.length/6.0);
        if(questionCount<minQue) {
           alert("FATAL CONFIG ERROR: This game requires at least "+minQue+" questions");
        }
        if(questionCount>positions.length-1) {
            alert("FATAL CONFIG ERROR: This game allowes max "+(positions.length-1)+" questions");
        }
        var curStep = 0;
        var curPos = 0;


        sq.find("div").each(function(i) {
            if (i==3||i==13||i==22){
                $(this).html("<span>lose_points</span>").addClass("x");
            } else if (i==10||i==21||i==30||i==35||i==46){
                $(this).html("<span>double_points</span>").addClass("x2");
            } else {
            var  c = ["violet","blue","yellow"][i%3];
            if($(this).find("span").size()==0) {
                $(this).html("<span>"+(100+i%3*200)+"</span>").addClass(c);
            }}
        });
        game.preparePath();

    };


    this.preparePath = function() {

        var questionLeft = questionCount;
        var dice_step= [];
        dice_step[0]= 3;
        var dice_count= dice_step[0];
        for (i=1;i<=questionCount/2;i++){
            var minStep = Math.max(1, Math.floor((positionsCount-dice_count)/questionLeft));
            var maxStep = Math.min(6, (positionsCount-questionLeft-dice_count));
            var step = Math.floor((maxStep-minStep)*Math.random()+minStep);
            step=Math.max(step, minStep);
            step=Math.min(step, maxStep);
            dice_step [i]=step;
            dice_count+=dice_step [i];
            questionLeft--;
        }
        var last_steps = Math.max(1,((srcpositions.length-1-dice_count)/(questionCount/2))|0);
        for (i=Math.floor(questionCount/2)+1;i<questionCount;i++){
            dice_step [i]=last_steps;
            dice_count+=dice_step [i];
        }
        //dice_step[0]= 0;
        dice_step.sort(function () {
            return 0.5 - Math.random()
        });
        dice_count=0;
        var fields=$('.board-small');
        for (i=1;i<(questionCount-3);i++){
            questions['q'+i]['diceNumber']=dice_step[i];
            dice_count+=dice_step[i];
            questions['q'+i]['diceStep']=dice_count;
            check_if_in_lose();
        }
        var new_number =Math.min(6,Math.max(1,(srcpositions.length-2-dice_count)/3|0));
        for (i=questionCount-3;i<questionCount-1;i++){
            questions['q'+i]['diceNumber']=new_number;
            dice_count+=new_number;
            questions['q'+i]['diceStep']=dice_count;
        }

        questions['q'+i]['diceNumber']=Math.min(6,Math.max(1,((srcpositions.length-2-dice_count)/2)|0));
        dice_count+=questions['q'+i]['diceNumber'];
        questions['q'+i]['diceStep']=dice_count;
        i++;
        questions['q'+i]['diceNumber']=Math.min(6,Math.max(1,(srcpositions.length-2-dice_count)|0));
        dice_count+=questions['q'+i]['diceNumber'];
        questions['q'+i]['diceStep']=dice_count;


        function check_if_in_lose(){

            if (fields.eq(dice_count-1).hasClass('x')){
                var new_diceNumber = Math.floor(Math.random() * (6) + 1);
                while (new_diceNumber==questions['q'+i]['diceNumber']){//делаем новый индекс, до тех пор, пока он не старый
                    new_diceNumber = Math.floor(Math.random() * (6) + 1);
                }
                questions['q'+i]['new_diceNumber']=new_diceNumber;
                dice_count+=new_diceNumber;
                questions['q'+i]['new_diceStep']=dice_count;
            }
        }
    };
    /**
     * Prepare frame for animation
     */
    this.setupAnimationForQuestion = function (i) {

    };
    /**
     * Run animation
     */
    this.runRacerToPosition = function(i) {
        if(currentPosition<i) {
            currentPosition++;
        }
        if(currentPosition>i) {
            currentPosition--;
        }
        $('div.board .racer-variant').animate({top: positions[currentPosition-1].y+30, left: positions[currentPosition-1].x+30}, function() {
            if ((currentPosition==($.parseJSON("["+value(design.path)+"]")).length-1)){
                on_last_point_in_path=true;
            }
            if(currentPosition!=i) {
                game.runRacerToPosition(i);
            } else if (empty(questions['q' + questionIndex])) {
                    finishGame();
                $game.removeClass('step-3');
            } else if($('.board-small').eq(i-1).hasClass('x')){
                    questions["q"+questionIndex].diceNumber=questions["q"+questionIndex].new_diceNumber;
                    questions["q"+questionIndex].diceStep=questions["q"+questionIndex].new_diceStep;
                    questionIndex--;
                    gamefee+=parseInt($('.score').html());
                    recalculateScore();
                    $('div.lose_text').html(value(questions.conclusion_lost_text)+"<span>X</span>");
                    $('.step-3').addClass('lose');
                }else {
                    $('div.card-stack').addClass('active');
                }
        });
    };
    liveFastClick("#losecontinuebutton", function(){
        $('.step-3').removeClass('lose');
        instance.onQuestionChooseRequired()
    });


    var currentPosition = 0;
    this.runAnimationToQuestion = function (i, data) {
        $('div.card-stack').removeClass('active');
        if(i==0) {
            $('div.board .racer-variant').css({top: 520, left: 68});
            currentPosition = 0;
            return false;
        }
        if(i<=questionCount) {
            game.runRacerToPosition(questions['q'+i]['diceStep']);
            return false;
        }
        game.runRacerToPosition(positionsCount+1);
    };

    this.resetAnimation = function () {
        this.prepareAnimationFrame();
        this.runAnimationToQuestion(0);
    };

    /* ----------------- TIMER ------------------- */
    this.onTimePassed = function (deltaTime) {
        gameTime+=deltaTime;
        $('div.time').html((timeout/1000-parseFloat(gameTime)/1000).toFixed(1));
        if(timeout && gameTime>timeout) {
            this.onTimeOut();
        }
    };

    this.onTimeOut = function () {
        stopTimer();
        tPlay(sounds.incorrect, PRIORITY_NORMAL);
        finishGame();
    };

    /* ----------------- SCORE ------------------- */
    this.onUpdateScore = function(score) {
        $('div.score').html(score);
    };

    /* ----------------- GAME SPECIFIC LOADERS ------------------- */
    this.loadStyles = function () {
        applyDefaultStyles(design);

        /* eli sprite anims */
        loadEliSpriteAnimStyles(dynamicCssInstance, design);

        /* Load positions */
        var cardstackpositions = $.parseJSON("["+value(design.cardstack_position)+"]");
        var dicepositions = $.parseJSON("["+value(design.dice_position)+"]");

        dynamicCssInstance.cleanId("dnCustom");

        dynamicCssInstance.addRule("div.card-stack",cardstackpositions[0][0],"left: $vpx");
        dynamicCssInstance.addRule("div.card-stack",cardstackpositions[0][1],"top: $vpx");

        dynamicCssInstance.addRule("div.board div.dice",dicepositions[0][0],"left: $vpx");
        dynamicCssInstance.addRule("div.board div.dice",dicepositions[0][1],"top: $vpx");

        dynamicCssInstance.addRule("div.board-start",srcpositions[0][0],"left: $vpx");
        dynamicCssInstance.addRule("div.board-start",srcpositions[0][1],"top: $vpx");
        dynamicCssInstance.addRule("div.board-finish",srcpositions[srcpositions.length-1][0],"left: $vpx");
        dynamicCssInstance.addRule("div.board-finish",srcpositions[srcpositions.length-1][1],"top: $vpx");

        dynamicCssInstance.addRule("div.board-small",design.board_piece_size,"width: $vpx");
        dynamicCssInstance.addRule("div.board-small",design.board_piece_size,"height: $vpx");
        dynamicCssInstance.addRule("div.board-small span",design.board_piece_size,"line-height: $vpx");
        dynamicCssInstance.addRule("div.board-small span",0.8*design.board_piece_size,"height: $vpx");
        dynamicCssInstance.addRule("div.board-small span",0.75*design.board_piece_size,"width: $vpx");
        dynamicCssInstance.addRule("div.board-small span",0.75*design.board_piece_size,"width: $vpx");
        dynamicCssInstance.addRule("div.board-small span",0.2*design.board_piece_size,"margin-left: $vpx");
        dynamicCssInstance.addRule("div.board-small span",0.4*design.board_piece_size,"font-size: $vpx");

        if (!hoverDisable) {
            dynamicCssInstance.addCompiled("div.game .question-choose .variant:hover", design.question_button_over);
            dynamicCssInstance.addCompiled("div.game a.button:hover", design.button_over);
        }

        dynamicCssInstance.addCompiled("div.game div.lose_panel", design.lose_panel);

        dynamicCssInstance.addRule("div.game .question-vertical-shift", design['margin_top_for_questions_screen'], "height: $vpx");
        dynamicCssInstance.addRule("div.game .question-feedback-vertical-shift", design['margin_top_for_questions_feedback'], "height: $vpx");

        dynamicCssInstance.addCompiled('div.game', prepareBackground(design));

        dynamicCssInstance.addCompiled("div.game div.logo1", design.logo1);
        dynamicCssInstance.addCompiled("div.game div.logo2", design.logo2);
        dynamicCssInstance.addCompiled("div.game div.logo3", design.logo3);

        for(var i=1;i<=4;i++) {
            dynamicCssInstance.addRule("div.game .racer-variant-"+i, design['char'+i+'_width'], "width: $vpx");
            dynamicCssInstance.addRule("div.game .racer-variant-"+i, design['char'+i+'_height'], "height: $vpx");
            dynamicCssInstance.addRule("div.game .racer-variant-"+i+" div.marker", design['char'+i+'_dragging_point_X'], "left: $vpx");
            dynamicCssInstance.addRule("div.game .racer-variant-"+i+" div.marker", design['char'+i+'_dragging_point_Y'], "top: $vpx");
            dynamicCssInstance.addRuleForImage("div.game .racer-variant-"+i, design['char'+i+'_image'], "background: url('$v') 0 0 no-repeat;");
            dynamicCssInstance.addRule("div.game div.board .racer-variant-"+i+"", design['char'+i+'_dragging_point_X'], "margin-left: -$vpx");
            dynamicCssInstance.addRule("div.game div.board .racer-variant-"+i+"", design['char'+i+'_dragging_point_Y'], "margin-top: -$vpx");
        }

        if(!empty(design.question_screen)) {
            var object = dozerMapper(design.question_screen, ["width", "height", "X", "Y", "padding", "paddingX", "paddingY","margin","marginX","marginY","marginTop","marginBottom","marginLeft","marginRight"]);
            dynamicCssInstance.addCompiled("div.game .question-choose-wrapper", object);
            dynamicCssInstance.addCompiled("div.game .question-block-wrapper", object);
            dynamicCssInstance.addCompiled("div.game .question-answered-block-wrapper", object);
        }

        if(!empty(design.question_choose_wrapper)) {
            dynamicCssInstance.addCompiled("div.game .question-choose-wrapper", design.question_choose_wrapper);
        }

        dynamicCssInstance.addCompiled("div.game .question-choose .variant", design.question_button_up);
        dynamicCssInstance.addCompiled("div.game .question-choose .variant:active", design.question_button_down);
        dynamicCssInstance.addCompiled("div.game .question-choose .variant.choosed", design.question_button_selected);

        dynamicCssInstance.addCompiled("div.game a.button", design.button_up);
        dynamicCssInstance.addCompiled("div.game a.button:active", design.button_down);
        if(!empty(design.score_box)) {
            dynamicCssInstance.addCompiled("div.game div.score", design.score_box);
        }
        if(!empty(design.time_box)) {
            dynamicCssInstance.addCompiled("div.game div.time", design.time_box);
        }

        dynamicCssInstance.addCompiled("div.game .question-answered-block-wrapper", design.question_feedback_box);
        dynamicCssInstance.addCompiled("div.game .question-block-wrapper>div.question-block-wrapper-inner", design.question_box);
        var object = dozerMapper(design.question_box, ["width", "height", "X", "Y", "padding", "paddingX", "paddingY"]);
        dynamicCssInstance.addCompiled("div.game .question-block-wrapper>div.question-image", object);
        applyDefaultQuestionBoxImage(dynamicCssInstance, design.question_box);

        dynamicCssInstance.addCompiled("div.game .step-2-description", design.description_panel);
        dynamicCssInstance.addCompiled("div.game .result-block-wrapper", design.result_panel);
        dynamicCssInstance.addCompiled("div.game .progressbar", design.progressbar_container);
        dynamicCssInstance.addRule(".step-4.answered.correct .question-answered-block-wrapper h1", design.question_answer_correct_color, "color: $v");
        dynamicCssInstance.addRule(".step-4.answered.incorrect .question-answered-block-wrapper h1", design.question_answer_incorrect_color, "color: $v");

        $('.step-4').addClass('vertical').removeClass('horizontal');

        dynamicCssInstance.addCompiled("div.game #step1continuebutton", design.splash_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step2continuebutton", design.intro_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step3continuebutton", design.questions_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step4continuebutton", design.question_continuebutton);
        dynamicCssInstance.addCompiled("div.game #step4confirmbutton", design.question_confirmbutton);
        dynamicCssInstance.addCompiled("div.game #step5replaybutton", design.results_replaybutton);
        dynamicCssInstance.addCompiled("div.game #losecontinuebutton", design.lose_continuebutton);

        if (onlyOneSound)
            $('div.card-stack').css({'opacity': 1});

        var qCount = 1;
        while (!empty(questions['q' + qCount])) {
            qCount++;
        }
        qCount--;
        dynamicCssInstance.flush();
        };
    this.loadSounds = function () {
        if (questions.introduction_audio != null)
            sounds.introduction = createSound(questions.introduction_audio, true);
        if (questions.conclusion_audio != null)
            sounds.conclusion = createSound(questions.conclusion_audio, true);
        if (onlyOneSound) {
            liveFastClick('.game a:not(#step4confirmbutton)', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            liveFastClick('.game .questions div.question:not(.answered):not(.hasOwnSound)', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            liveFastClick('.type-multiple .question-choose .variant', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
        } else {
            liveFastClick('.game a, .game .questions div.question:not(.answered), .question-choose .variant', function () {
                tPlay(sounds.select, PRIORITY_LOW);
            });
            if (!hoverDisable) {
                $('.game a, .game .questions div.question:not(.answered), .question-choose .variant, .choose-racer > .racer-variant ,.dice.needsrolling, .card-stack.active').live('mouseenter', function () {
                    tPlay(sounds.hover, PRIORITY_LOW);
                });
                $('.card-stack.active').live('mouseenter', function () {
                    $(this).addClass('in_hover');
                });
                $('.card-stack.active').live('mouseleave', function () {
                    $(this).removeClass('in_hover');
                });
            }
        }
    };
    this.loadData = function () {
        $("#step1continuebutton").html("" + value(questions.splash_page_button_continue_text));
        $("#losecontinuebutton").html("" + value(questions.lose_button_continue_text));
        $("#step4continuebutton").html("" + value(questions.question_page_button_continue_text));
        $("#step4confirmbutton").html("" + value(questions.question_page_button_confirm_text));
        $("#step5replaybutton").html("" + value(questions.result_page_button_replay_text));
        questions.randomize_question_order = stringToBoolean(questions.randomize_question_order);
        questions.randomize_answer_order = stringToBoolean(questions.randomize_answer_order);
        timeout = nvl(questions.timeout,0) * 1000;

        var i = 1;
        while (!empty(questions['q' + i])) {
            i++;
        }
        var qlength = i - 1;
        $('div.step-2-description div.description div').html("" + value(questions.introduction_text));
        $('div.result-block div.description').html("" + value(questions.conclusion_text));

        var qCount = 1;
        while (!empty(questions['q' + qCount])) {
            qCount++;
        }
    }
};

$(document).ready(function () {
    if (window.location.hash.indexOf("#load_config_from_parent") == 0) {
        /* We tell parent window that we are ready not to accept config */
        /* Origin of parent window is passed with hash */
        var origin = window.location.hash.substring(window.location.hash.indexOf("/") + 1);
        window.parent.postMessage("ready_to_accept_config", origin);
    } else {
        game.readConfig();
    }
   // $('.game').css('opacity', 0.1);
});

$(window).load(function () {

});

$(document).bind('gameLoaded', function () {
    var focusAnimate = function($el) {
        $el.css({
            width: '10px',
            height: '10px',
            'margin-left':'-5px',
            'margin-top':'-5px',
            opacity: 0.00
        }).animate({
                width: '20px',
                height: '20px',
                'margin-left':'-10px',
                'margin-top':'-10px',
                opacity: 0.3
            }, 'fast', function() {
                $(this).animate({
                    width: '50px',
                    height: '50px',
                    'margin-left':'-25px',
                    'margin-top':'-25px',
                    opacity: 0.0
                }, 'slow', function() {
                    focusAnimate($(this));
                });
            })
    };
    $('.racer-variant div.marker div').each(function() {
        focusAnimate($(this));
    });
    $('.with-marker div.marker div').each(function() {
        focusAnimate($(this));
    });

    SCOPreInitialize();
    SCOInitialize();
    $('.game').css('opacity', 1);
    game.start();
});

/**
 * Applies question randomization, applies question count
 * @param questions
 */
var boardgameQuestionPostProcesor = function(questions) {
    defaultCutQuestionCount(questions, questions['question_count']); /* Cut out question count. Forever. */
    var randomize_question_order = stringToBoolean(nvl(questions.randomize_question_order,"false"));
    if(!empty(questions['questions_displayed_from_count'])) {
        randomize_question_order = true;
    }
    if (randomize_question_order) {
        var newQ = [];
        var i = 1;
        while (!empty(questions['q' + i])) {
            newQ[newQ.length] = questions['q' + i];
            i++;
        }
        newQ.sort(function () {
            return 0.5 - Math.random()
        });
        var ql = i;
        for (i = 1; i < ql; i++) {
            questions['q' + i] = newQ[i - 1];
        }
    }
    defaultCutQuestionCount(questions, defaultQuestionCount(questions));
};