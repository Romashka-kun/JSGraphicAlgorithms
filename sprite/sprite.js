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
    var img = document.getElementById("img");

    var anim_frame = 0;
    var x = 25;
    var y = 50;
    var dx = 1;
    var dy = 1;
    var fps = 15;
    var frames = 10;
    var current_frame = 0;

    const WIDTH = 480;
    const HEIGHT = 320;
    const XCORNER = 80;
    const YCORNER = 80;
    const SPEED = 100;

    const animation_start_time = get_time() / 1000;
    var last_redraw_time = animation_start_time;

    var balloons = [{x: 150, y: 150, dx: 1, dy: 1, anim_frame_y: 0},
                    {x: 420, y: 340, dx: -1, dy: 0.3, anim_frame_y: 50},
                    {x: 250, y: 250, dx: -0.1, dy: -1.1, anim_frame_y: 100},
                    {x: 300, y: 250, dx: -0.8, dy: 0.3, anim_frame_y: 150}];

    requestAnimationFrame(animation_step);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(XCORNER, YCORNER, WIDTH, HEIGHT);
        for (var i = 0; i < balloons.length; i++)
            ctx.drawImage(img, anim_frame, balloons[i].anim_frame_y, 50, 50,
                balloons[i].x, balloons[i].y, 50, 50);
    }

    function update_animation_parameters(elapsed_time, current_time) {
        var delta = current_time - animation_start_time;
        var frame_index = Math.floor((delta * fps) % frames);
        if (current_frame !== frame_index) {
            current_frame = frame_index;
            if (anim_frame > 440)
                anim_frame = 0;
            else
                anim_frame += 50;

            for (var i = 0; i < balloons.length; i++) {

                if (balloons[i].y + 50 >= YCORNER + HEIGHT || balloons[i].y <= YCORNER)
                    balloons[i].dy = -balloons[i].dy;

                if (balloons[i].x + 50 >= XCORNER + WIDTH || balloons[i].x <= XCORNER)
                    balloons[i].dx = -balloons[i].dx;

                balloons[i].x += balloons[i].dx * elapsed_time * SPEED;
                balloons[i].y += balloons[i].dy * elapsed_time * SPEED;
            }
        }
    }

    function animation_step() {
        requestAnimationFrame(animation_step);

        var current_time = get_time();
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time;

        update_animation_parameters(elapsed_time / 1000, current_time / 1000);
        draw();
    }

    function get_time() {
        return new Date().getTime();
    }
}