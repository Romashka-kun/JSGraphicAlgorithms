function init() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');

    /*
    Если у вас есть изображение (обычно png, jpg), вы можете рисовать на canvas это изображение или его части.
    Можно при рисовании применять эффекты по изменению формы и цвета.

    Как загрузить
    1. Вставить изображение в HTML и дождаться, когда оно загрузится вместе со страницей. Мы используем событие onload,
    чтобы начать выполнять скрипт, и мы можем быть уверены, что когда событие произошло и скрипт начал выполняться,
    наше изображение уже загружено.
    В HTML надо вставить тэг <img src="a.png" id="a-png">
    В CSS пишем что-то вроде {display: none;}
    В JS: var aImg = document.getElementById("a-png");


    2. Изображение можно загрузить программно:
    var img = new Image();
    img.src = “ссылка на картинку”;

    Но в этом случае изображение загрузится не сразу, и при попытке нарисовать ничего не будет видно.

    Как дождаться по-нормальному загрузки картинки - обсудим лично. Или используйте библиотеку preloadjs из набора
    библиотек CreateJS, который изучим позже.

    Когда изображение загружено, его можно рисовать:

        ctx - контекст для рисования
        ctx.drawImage(img, x, y); //что рисовать и где.

        ctx.drawImage(img, x, y, width, height); //можно указать размер

        drawImage(
            image,                  что рисовать
            sx, sy,                 координаты на исходной картинке (source)
            sWidth, sHeight,        размер на исходной картинке
            dx, dy,                 координаты на canvas (destination)
            dWidth, dHeight         размер на canvas
        )


        В ней, зная, сколько прошло времени с прошлого кадра, можно вычислить новые значения параметров.

    Чтобы посчитать номер кадра, нужно знать сколько прошло времени с момента запуска анимации.
    Здесь elapsed_time_sec не поможет, лучше так:

	function update_animation_parameters(elapsed_time_sec) {
	    x += SPEED_x * elapsed_time_sec;
	    frame_index = Math.floor((get_time() - animation_start_time) * FPS) % num_frames
    }

    Совет, поменяйте animation_step, чтобы он передавал текущее время

    function animation_step() {
        requestAnimationFrame(animation_step);

        var current_time = get_time();
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time;

        update_animation_parameters(elapsed_time / 1000, current_time / 1000);
        draw();
    }


    */
    // var img = new Image();
    // img.src = "https://st2.depositphotos.com/2001755/5408/i/450/depositphotos_54081723-stock-photo-beautiful-nature-landscape.jpg";
    var img1 = document.getElementById("img1");
    var img2 = document.getElementById("img2");

    var x = 25;
    var y = 50;
    var dx = 1;
    var dy = 1;
    var animation_frame = 0;
    var frames = 10;

    const FPS = 15;
    const WIDTH = 480;
    const HEIGHT = 320;
    const XCORNER = 80;
    const YCORNER = 80;

    const animation_start_time = get_time();
    var last_redraw_time = get_time();

    var balls = [{x: 150, y: 150, dx: 1, dy: 1, srcY: 0, findex: 0, step: 50},
                    {x: 420, y: 340, dx: -1, dy: 0.3, srcY: 50, findex: 0, step: 50},
                    {x: 250, y: 250, dx: -0.1, dy: -0.9, srcY: 100, findex: 0, step: 50},
                    {x: 300, y: 250, dx: -0.8, dy: 0.3, srcY: 150, findex: 0, step: 50}];

    function isIntersect(mPoint, ball) {
        return Math.sqrt((mPoint.x - ball.x - 25) ** 2 + (mPoint.y - ball.y - 25) ** 2) < 25;
    }

    canvas.addEventListener('click', (e) => {
        const mouseClick = {
            x: e.offsetX,
            y: e.offsetY
        };

        for (var i = 0; i < balls.length; i++)
            if (isIntersect(mouseClick, balls[i])) {
                balls.splice(i, 1);
                return;
            }

        balls.push({x: mouseClick.x, y: mouseClick.y, dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1,
                    srcY: Math.floor(Math.random() * 4) * 50, findex: 0, step: 50});
    });

    requestAnimationFrame(animation_step);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rotate(5 * Math.PI / 180);
        ctx.strokeStyle = "black";
        ctx.strokeRect(XCORNER, YCORNER, WIDTH, HEIGHT);
        for (var i = 0; i < balls.length; i++)
            ctx.drawImage(img1, animation_frame, balls[i].srcY, 50, 50,
                balls[i].x, balls[i].y, 50, 50);
    }

    function update_animation_parameters(elapsed_time, current_time) {
        var frame_index = Math.floor(((current_time - animation_start_time) * FPS) % frames);
        for (var i = 0; i < balls.length; i++) {
            balls[i].findex = frame_index;
            animation_frame = balls[i].findex * balls[i].step;
            if (balls[i].y + 50 >= YCORNER + HEIGHT || balls[i].y <= YCORNER)
                balls[i].dy = -balls[i].dy;

            if (balls[i].x + 50 >= XCORNER + WIDTH || balls[i].x <= XCORNER)
                balls[i].dx = -balls[i].dx;

            balls[i].x += balls[i].dx;
            balls[i].y += balls[i].dy;

        }
    }

    function animation_step() {
        requestAnimationFrame(animation_step);

        var current_time = get_time();
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time;

        if (elapsed_time > 1)
            elapsed_time = 0;

        update_animation_parameters(elapsed_time, current_time);
        draw();
    }

    function get_time() {
        return new Date().getTime() / 1000;
    }

    //добавим в конец преобразования для нашего canvas. Код, который написан ниже, выполняется до того, как начнется
    //анимация. Анимацию мы попросили начать попозже, когда удобно браузеру, это у нас сделано с помощью
    //requestAnimationFrame().

    ctx.translate(100, 20); //перенести начало координат относительно своего положения
    ctx.rotate(Math.PI / 6); //повернуть систему координат
    ctx.scale(2, 1); //растянуть x и y
    //есть ещё, можно менять угол между осями

    //нарисовали домик
    //преобразования (ctx.translate, ctx.rotate, ...)
    //(домик остался на месте)
    //нарисовали домик ещё раз с теми же координатами
    //(домик нарисуется в новом месте, потому что теперь координаты уже считаются по другой системе координат)

    //как возвращать систему координат?
    ctx.save(); //сохраняет весь контекст рисования. Система координат, strokeStyle, fillStyle и многие другие
    //глобальные пераметры
    //дальше можно изменять систему координат, менять стили рисования
    ctx.restore(); //все сохраненные значения восстанавливаются

    //можно сохранять и восстанавливать несколько раз
    ctx.save(); //(1)
    ctx.save(); //(2)
    ctx.save(); //(3)
    ctx.restore(); //восстанавилвает (3)
    ctx.restore(); //восстанавливает (2)
    ctx.restore(); //восстанавливает (1)

    //если у вас есть функция, которая что-то рисует, то принято сохранить и восстановить ctx
    function draw_something() {
        ctx.save();
        //рисуем
        ctx.restore();
    }

    //TODO что ещё есть в canvas
    //Рисование текста: ctx.fillText(), ctx.strokeText(). Обратите внимание на выравнивание.
    //Стили заливки: можно заливать не только цветом, а ещё градиентом. Или шаблоном на основе картинки.
    //Стили линий: можно делать пунктиры, управлять тем, как выглядит конец линии и излом и т.п.
    //Есть цветовые фильтры, можно указать, как изменяется цвет каждого пикселя при рисовании.
    //И вообще, можно напрямую обращаться к пикселям изображения, читать их и изменять.
}