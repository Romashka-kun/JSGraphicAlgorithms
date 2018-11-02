function init() {
    console.info("page loaded");
    var stage = new createjs.Stage("game");

    //хотим добавить спрайт на сцену. Спрайт Sprite - это объект, который показывает анимацию. Анимация настраивается
    //с помощью объекта SpriteSheet

    var earthSpriteSheet = new createjs.SpriteSheet({ //объект с настройками
        images: ["earth_and_explosion.png"], //набор картинок
        frames: { //объект с описанием размеров и положений кадров. Можно вместо объекта указать массив, и перечислить
            //каждый спрайт по-отдельности (см. документацию)
            width: 100,
            height: 100,
            regX: 50, //опорная точка. Эта точка картинки (центр) будет рисоваться в координатах (0, 0) спрайта.
            regY: 50
            //margin: границы картинки
            //spaces: пропуски между спрайтами
        },
        animations: { //набор анимаций, названия придумаем сами
            rotate: [0, 47, "rotate"], //с 0 по 47, а после этого перейти к анимации rotate
            explode: [48, 83, null] //с 48 по 83, и остановиться.
            //можно можно указать вручную последовательность кадров (см. документацию)
        }
        , framerate: 20 //частота кадров
    });

    var WIDTH = 400;
    var HEIGHT = 280;
    var R = 50;

    var field = new createjs.Container();
    var background = new createjs.Shape();
    background.graphics
        .beginStroke("blue")
        .beginFill("#EEE")
        .drawRect(0, 0, WIDTH, HEIGHT);

    stage.addChild(field);
    field.addChild(background);

    function ball_tick(e) {
        var ball = e.target; //e - информация о событии, e.target - для кого вызвано
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x > WIDTH - R || ball.x < R)
            ball.dx *= -1;
        if (ball.y > HEIGHT - R || ball.y < R)
            ball.dy *= -1;
    }

    function ball_click(e) {
        var ball = e.target;

        if (ball.exploded)
            return;

        ball.gotoAndPlay("explode");
        ball.dx = 0;
        ball.dy = 0;
        ball.exploded = true;
        ball.addEventListener('animationend', function () {
            field.removeChild(ball);
        });
    }

    function add_ball(x, y, dx, dy) {
        if (x > WIDTH - R || x < R || y > HEIGHT - R || y < R)
            return;

        var ball = new createjs.Sprite(earthSpriteSheet);
        ball.gotoAndPlay("rotate");
        field.addChild(ball);
        ball.x = x; //параметры ball.x, .y задают положение шарика на родителе
        ball.y = y;
        ball.dx = dx; //у спрайта нет параметров dx, dy, но это JavaScript, поэтому что хотим, то и дописываем
        ball.dy = dy;
        ball.addEventListener('tick', ball_tick);
        ball.addEventListener('click', ball_click);
    }

    field.addEventListener('click', function (e) {
        //Это событие ловит все нажатия на содержимое контейнера: фон и шарики
        if (e.target === background) {
            //нажали на фон
            var random_angle = Math.random() * 2 * Math.PI;
            add_ball(e.localX, e.localY, Math.cos(random_angle), Math.sin(random_angle));
        }
    });

    add_ball(50, 50, 1, 1);
    add_ball(100, 100, 1, 1);
    add_ball(200, 150, 1, 1);

    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;
}