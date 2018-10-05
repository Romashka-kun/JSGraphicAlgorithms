function init() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    //заведем параметры анимации
    //константы для всех значений
    // x = ...;
    // y = ...;
    requestAnimationFrame(animation_step);

    // r = ...;

    function draw() {
        //перерисовывается содержимое экрана
        //используем значения параметров анимации

        //ctx.clearReact(0, 0, canvas.width, canvas.height)
        //это полная очистка canvas
    }

    function update_animation_parameters() {
        //здесь обновляем значение всех анимируемых параметров

        //простейшее обновление - изменение на фиксированную величину
        //x += 0.1 // сдвигаем на 0.1 пикселя
    }

    function animation_step() {
        //эта функция должна постоянно вызываться
        requestAnimationFrame(animation_step); //сразу просим повторить

        update_animation_parameters();
        draw();
    }

    // Анимация с точным заданием скорости изменения параметра
    // сначала научимся определять, сколько точно времени прошло с прошлой перерисовки. Добавим глобальную функцию


    function get_time() {
        //return Date.now();
        return new Date().getTime();
    }
    //Она возвращает количество миллисекунд, прошедших с начала эпохи Unix (1 января 1970);
    //Можно делать так:
    var time1 = get_time();
    //долгое вычисление
    var time2 = get_time();
    console.log("долгое вычисление", time2 - time1, "мс");

    //Заведем глобальную переменную
    var last_redraw_time = get_time();

    //Изменим методы animation_step и update_animation_parameters

    function update_animation_parameters(elapsed_time_sec) {
        //обновить параметры, зная прошедшее время.
        //допустим, скорость изменения x - это SPEED_x. Для определенности SPEED_x = 10 пикселей в секунду.
        x += SPEED_x * elapsed_time_sec;
    }

    function animation_step() {
        requestAnimationFrame(animation_step);
        var current_time = get_time()
        var elapsed_time = current_time - last_redraw_time;
        last_redraw_time = current_time
        update_animation_parameters(elapsed_time / 1000);
        draw();
    }
}

