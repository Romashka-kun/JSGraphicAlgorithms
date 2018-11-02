function init() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    var last_redraw_time = get_time();
    const MAIN_RADIUS = 90;
    const MINOR_RADIUS = 20;
    const ROPE_LENGTH = 60;
    var alpha = Math.PI / 18;

    requestAnimationFrame(animation_step);

    function drawStick() {
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, MINOR_RADIUS);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    function drawPropeller() {
        ctx.save();
        for (var i = 0; i < 12; i++) {
            drawStick();
            ctx.rotate(Math.PI / 6);
        }
        ctx.restore();
    }

    function drawRope() {
        ctx.save();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, ROPE_LENGTH);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    function drawFan() {
        ctx.save();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, MAIN_RADIUS);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    function draw() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(320, 240);
        for (var i = 0; i < 12; i++) {
            ctx.save();
            ctx.rotate(alpha + i * 2 * Math.PI / 12);
            drawFan();
            ctx.translate(0, MAIN_RADIUS);
            ctx.rotate(-(alpha + i * 2 * Math.PI / 12));
            drawRope();
            ctx.translate(0, ROPE_LENGTH);
            ctx.rotate(alpha * 4);
            drawPropeller();
            ctx.restore();
        }

        ctx.restore();
    }


    function update_animation_parameters(elapsed_time_sec) {
        alpha += Math.PI / 18 * elapsed_time_sec;
    }

    function animation_step() {
        requestAnimationFrame(animation_step);
        var current_time = get_time();
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time;
        update_animation_parameters(elapsed_time);
        draw();
    }

    function get_time() {
        //return Date.now();
        return new Date().getTime() / 1000;
    }
}

