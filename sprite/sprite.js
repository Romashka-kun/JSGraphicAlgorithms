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
    var img_rotation = document.getElementById("img1");
    var img_explosion = document.getElementById("img2");

    var x = 25;
    var y = 50;
    var dx = 1;
    var dy = 1;
    // var balls[i].srcX = 0;
    var frames = 10;
    var explosion_frame = 14;

    const FPS = 10;
    const WIDTH = 480;
    const HEIGHT = 320;
    const XCORNER = 80;
    const YCORNER = 80;

    const animation_start_time = get_time();
    var last_redraw_time = get_time();

    var balls = [{img: img_rotation, x: 150, y: 150, dx: 1, dy: 1, srcX: 0, srcY: 0, step: 50}, //step - frame-size
                    {img: img_rotation, x: 420, y: 340, dx: -1, dy: 0.3, srcX: 0, srcY: 50, step: 50},
                    {img: img_rotation, x: 250, y: 250, dx: -0.1, dy: -0.9, srcX: 0, srcY: 100, step: 50},
                    {img: img_rotation, x: 300, y: 250, dx: -0.8, dy: 0.3, srcX: 0, srcY: 150, step: 50}];

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
                balls[i].img = img_explosion;
                balls[i].step = 128;
                balls[i].animation_start = get_time();
                return;
            }

        balls.push({img: img_rotation, x: mouseClick.x, y: mouseClick.y, dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1,
                    srcX: 0, srcY: Math.floor(Math.random() * 4) * 50, findex: 0, step: 50});
    });

    requestAnimationFrame(animation_step);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(XCORNER, YCORNER, WIDTH, HEIGHT);
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].img === img_rotation)
                var draw_size = balls[i].step;
            else
                draw_size = balls[i].step / 2;
            // balls[i].animation_start = get_time();

            ctx.drawImage(
                balls[i].img,
                balls[i].srcX, balls[i].srcY, balls[i].step, balls[i].step,
                balls[i].x, balls[i].y, draw_size, draw_size
            );
        }
    }

    function update_animation_parameters(elapsed_time, current_time) {
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].img === img_rotation) {
                var findex = Math.floor(((current_time - animation_start_time) * FPS)) % frames;
                balls[i].srcX = findex * balls[i].step;

                if (balls[i].y + 50 >= YCORNER + HEIGHT || balls[i].y <= YCORNER)
                    balls[i].dy = -balls[i].dy;

                if (balls[i].x + 50 >= XCORNER + WIDTH || balls[i].x <= XCORNER)
                    balls[i].dx = -balls[i].dx;

                balls[i].x += balls[i].dx;
                balls[i].y += balls[i].dy;
            } else {
                findex = Math.floor(((current_time - balls[i].animation_start) * FPS));
                if (findex >= explosion_frame) {
                    balls.splice(i, 1);
                    continue;
                }

                var fline = Math.floor(findex / 4);
                var fcol = findex % 4;
                balls[i].srcX = fcol * balls[i].step;
                balls[i].srcY = fline * balls[i].step;
            }
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
}