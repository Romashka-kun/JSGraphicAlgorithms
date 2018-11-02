function init() {
    console.info("page loaded");
    var stage = new createjs.Stage("game"); //указываем id для canvas

    var wall = new createjs.Shape();
    var window = new createjs.Shape();
    var roof = new createjs.Shape();
    var pipe = new createjs.Shape();
    var smoke = new createjs.Shape();

    var container = new createjs.Container();

    wall.graphics
        .beginFill("beige")
        .moveTo(0, 0)
        .lineTo(300, 0)
        .lineTo(300, 200)
        .lineTo(0, 200);
    wall.x = 100;
    wall.y = 200;

    window.graphics
        .beginFill("aqua")
        .moveTo(40, 40)
        .lineTo(180, 40)
        .lineTo(180, 140)
        .lineTo(40, 140);
    window.x = 100;
    window.y = 200;

    pipe.graphics
        .beginFill("grey")
        .moveTo(240, 0)
        .lineTo(240, -90)
        .lineTo(260, -90)
        .lineTo(260, 0);
    pipe.x = 100;
    pipe.y = 200;

    roof.graphics
        .beginFill("brown")
        .moveTo(-20, 0)
        .lineTo(320, 0)
        .lineTo(150, -100);
    roof.x = 100;
    roof.y = 200;

    smoke.graphics
        .beginFill("lightgray")
        .drawCircle(250, -95, 10);
    smoke.x = 100;
    smoke.y = 200;

    container.addChild(wall, window, smoke, pipe, roof);
    stage.addChild(container);

    container.x = 60;

    stage.update();
}