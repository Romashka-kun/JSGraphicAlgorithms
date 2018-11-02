function init() {
    console.info("page loaded");
    var stage = new createjs.Stage("game"); //указываем id для canvas

    var wall = new createjs.Shape();
    wall.graphics
        .beginFill("beige")
        .moveTo(0, 0)
        .lineTo(300, 0)
        .lineTo(300, 200)
        .lineTo(0, 200);
    wall.x = 100;
    wall.y = 200;

    var window = new createjs.Shape();
    window.graphics
        .beginFill("aqua")
        .moveTo(40, 40)
        .lineTo(180, 40)
        .lineTo(180, 140)
        .lineTo(40, 140);
    window.x = 100;
    window.y = 200;

    var pipe = new createjs.Shape();
    pipe.graphics
        .beginFill("grey")
        .moveTo(240, 0)
        .lineTo(240, -90)
        .lineTo(260, -90)
        .lineTo(260, 0);
    pipe.x = 100;
    pipe.y = 200;

    var roof = new createjs.Shape();
    roof.graphics
        .beginFill("brown")
        .moveTo(-20, 0)
        .lineTo(320, 0)
        .lineTo(150, -100);
    roof.x = 100;
    roof.y = 200;

    var smoke = new createjs.Shape();
    smoke.graphics
        .beginFill("lightgray")
        .drawCircle(250, -95, 10);
    smoke.x = 100;
    smoke.y = 200;

    var container = new createjs.Container();
    container.addChild(wall, window, smoke, pipe, roof);

    var house1 = container.clone(true);
    var house2 = container.clone(true);
    var house3 = container.clone(true);

    // container.setTransform(30, 70, 0.5, 0.5, 0, 0, 0);
    container.regX = 140;
    container.regY = 50;
    house1.setTransform(320, 120, 0.8, 0.8);
    house2.setTransform(480, 20, 0.2, 0.2);
    house3.setTransform(70, 220, 0.6, 0.6);
    console.log(container.regX, container.regY);

    stage.addChild(container, house1, house2, house3);

    stage.update();
}