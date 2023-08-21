// Global vars

var playing = false;
var score;
var lives;
var step;
var currentObject;

var showFlag = false;


var idCount;
var objects = [];


var createEnemyTimer;
var moveObjectsTimer;

var lastObjectId;

var currentMousePos = { x: -1, y: -1 };

var createObjectInterval;
var moveObjectsInterval;
var wizardPhasingInterval;

$(function () {

    // Handlers

    // track mouse position
    $(document).mousemove(function (event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    // init game
    $("#start").click(function () {
        if (playing) location.reload();
        else {
            startGame();
        }
    })

    // handle clicking an object
    $(document).on('mousedown', '.object', function () {
        if($(this).attr('id') != lastObjectId){
            lastObjectId = $(this).attr('id');
            let name = $(this).attr('name');
            switch (name != null) {
                case name == 'heart':
                    addLife();
                    break;
                case name == 'kevinbacon':
                    score += 2;
                    break;
                case name == 'baconwizard':
                    $(this).css({'opacity': 100})
                    score++;
                    break;
                case name == 'bomb':
                    // TODO blow up nearby objects when bomb is clicked
                    break;
                default:
                    score++;
            }
            
            $("#" + lastObjectId).hide("explode", 500);
            $("#score").html(score);
        }
    });

    $(".close").click(function () {

        $("#gameover").hide();
    });


    // Functionality

    // generate objects at specified interval until game ends
    function generateObject(objectId) {
        let rng = Math.random() * 100;
        switch (rng != null) {
            case rng < 5:
                currentObject = 'kevinbacon';
                step = 16 + Math.round(3 * Math.random());
                break;
            case rng < 13:
                currentObject = 'heart';
                step = 8 + Math.round(3 * Math.random());
                break;
            case rng < 21:
                currentObject = 'bomb';
                step = 8 + Math.round(2 * Math.random());
                break;
            case rng < 40:
                currentObject = 'baconwizard';
                step = 4 + Math.round(2 * Math.random());
                break;
            default:
                currentObject = 'baconwarrior';
                step = 4 + Math.round(3 * Math.random());
        }
        //TODO add customizable height/width for object
        let object = {
            id: "object" + objectId,
            name: currentObject,
            src: 'img/' + currentObject + '.png',
            step: step,
            active: true
        };
        return object;
    }

    function startGame() {
        playing = true;
        score = 0;
        $("#score").html(score);
        $("#livescontainer").show();
        lives = 3;
        addLives();
        
        objects = [];
        playing=true;

        // Hide start button
        $("#start").hide();

        idCount = 0;
        createObjectInterval = setInterval(createObject, 1000);
        moveObjectsInterval = setInterval(moveObjects, 30);
        wizardPhasingInterval = setInterval(wizardPhasing, 1500);
        
    }

    function wizardPhasing(){
        if (playing) {
            if (showFlag) showFlag = false;
            else showFlag = true;
            for (const object of objects) {
                if (object.name == 'baconwizard' && object.active) {
                    showFlag ? $("#" + object.id).css({'opacity': 100}) : $("#" + object.id).css({'opacity':0});
                }

            }


        }
    }

    // create objects until game ends
    function createObject() {
        if (playing) {
            objects.push(generateObject(idCount));
            $("#gamecontainer").append("<img id='" + objects[idCount].id + "' src='" + objects[idCount].src + "' class='object' name='" + objects[idCount].name + "'></img>");
            $("#" + objects[idCount].id).css({
                'left': Math.round($("#gamecontainer").width() * Math.random()) - 100,
                'top': -50,
                'width': 120,
                'height': 120
            });
            idCount++;
        }
    }

    function moveObjects() {
        if (playing) {
            for (const object of objects) {
                if (object.active) {
                    $("#" + object.id).css('top', $("#" + object.id).position().top + object.step);

                    if ($("#" + object.id).position().top + 100 > $("#gamecontainer").height()) {
                        if (lives > 1 && object.name != 'bomb') {

                            object.active = false;
                            $("#" + object.id).hide();
                            adjustLives(object);
                            $("#" + object.id).remove();
                            const indexOfObect = objects.findIndex(o => {
                                return o.id === object.id
                            });
                        } else {
                            endGame();
                        }
                    }
                }
            }
        }
    }

    // Life manipulation methods
    function adjustLives(object) {
        switch (object != null) {
            case object.name == 'heart':
                break;
            default:
                lives--;
                addLives();
        }
    };
    function addLives() {
        $("#livescontainer").empty();
        for (i = 0; i < lives; i++) {
            $("#livescontainer").append('<img src="img/heart.png" class="heart">');
        }
    }
    function addLife() {
        if (lives < 5) {
            lives++;
            addLives();
        }
    }

    // End game
    function endGame() {
        playing = false;
        for (const object of objects) {
            $("#" + object.id).remove();
        }
        objects = [];
        clearInterval(moveObjectsInterval);
        clearInterval(createObjectInterval);
        clearInterval(wizardPhasingInterval);
        $("#livescontainer").hide();
        $("#start").show();

        //show modal
        $("#gameover").show();
        $("#gameovermessage").html('Your final score is <b>' + score + '</b>!');

    }



});