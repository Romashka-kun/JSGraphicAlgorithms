function init() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    //заведем параметры анимации
    var x = 150;
    var y = 150;

    var balloons = [{x: 150, y: 150, dx: 1, dy: 1, color: "red"},
                    {x: 420, y: 340, dx: -1, dy: 0.3, color: "green"},
                    {x: 250, y: 250, dx: -0.1, dy: -1.1, color: "blue"}];

    const WIDTH = 480;
    const HEIGHT = 320;
    const XCORNER = 80;
    const YCORNER = 80;
    const RADIUS = 25;
    var last_redraw_time = get_time();

    const SPEED_x = 50;

    // r = ...;

    // function isIntersect(point, circle) {
    //     return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < 25;
    // }
    //
    // canvas.addEventListener('click', (e) => {
    //     const mouseClick = {
    //         x: e.clientX,
    //         y: e.clientY
    //     };
    //     balloons.forEach(circle => {
    //         if (isIntersect(mouseClick, circle)) {
    //             alert('click on circle: ' + circle.color);
    //         }
    //     });
    // });

    requestAnimationFrame(animation_step);



    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(XCORNER, YCORNER, WIDTH, HEIGHT);

        for (var i = 0; i < balloons.length; i++) {
            ctx.fillStyle = balloons[i].color;
            ctx.beginPath();
            ctx.arc(balloons[i].x, balloons[i].y, RADIUS, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function update_animation_parameters(elapsed_time_sec) {

        for (var i = 0; i < balloons.length; i++) {

            if (balloons[i].y + RADIUS >= YCORNER + HEIGHT || balloons[i].y - RADIUS <= YCORNER)
                balloons[i].dy = -balloons[i].dy;

            if (balloons[i].x + RADIUS >= XCORNER + WIDTH || balloons[i].x - RADIUS <= XCORNER)
                balloons[i].dx = -balloons[i].dx;

            balloons[i].x += balloons[i].dx * elapsed_time_sec * SPEED_x;
            balloons[i].y += balloons[i].dy * elapsed_time_sec * SPEED_x;
        }


    }

    function animation_step() {
        //эта функция должна постоянно вызываться
        requestAnimationFrame(animation_step); //сразу просим повторить

        var current_time = get_time();
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time;

        update_animation_parameters(elapsed_time / 1000);
        draw();
    }

    function get_time() {
        //return Date.now();
        return new Date().getTime();
    }

//константы для всех значений
}

