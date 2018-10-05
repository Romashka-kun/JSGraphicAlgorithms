function init() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "red"; //Цвета как в css. Можно так #FF0000. Или "rgb(255, 0, 0)". Или "rgba(rgba(255, 0, 0, 0.5))"
                           //это полупрозрачный
    ctx.fillRect(0, 0, 100, 100); //координаты левого верхнего угла, и потом высоту и ширину.
    ctx.strokeStyle = "blue";
    ctx.strokeRect(10.5, 10.5, 100, 100); //нарисовали прямоугольник по границе
    ctx.clearRect(0, 0, 640, 480); //очистить прямоугольник
    ctx.beginPath(); //обязательная команда, она говорит, что надо начать новый путь. Без нее вы продолжите старый путь
                     //и будете удивляться тому, что нарисовалось.
    ctx.moveTo(120, 120); //переместить карандаш в такую-то точку
    ctx.lineTo(200, 140); //провести карандаш в точку
    ctx.lineTo(140, 200); //опять провести карандаш
    ctx.closePath(); //провести карандаш в начало пути. Это можно не делать.
    ctx.fill(); //закрасить внутренность. Используется цвет, который указали в fillStyle.
    ctx.stroke(); //используется цвет strokeStyle

    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI);
    ctx.lineTo(200, 220);
    ctx.bezierCurveTo(210, 210, 240, 240, 250, 270);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.strokeRect(300, 75, 255, 25);
    for (var i = 25; i < 256; i++) {
        ctx.fillRect(i + 275, 75, 25, 25);
        ctx.fillStyle = "rgb(" + i + "," + i +"," + i + ")";
    }

    ctx.fillStyle = "black";
    for (i = 0; i < 51; i++) {
        ctx.beginPath();
        ctx.arc(550, 370, 51 - i, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(" + i * 5 + "," + i * 5 +"," + i * 5 + ")";
        ctx.fill();
    }

    //Простейшая анимация
    //Функция задержки выполнения
    //setInterval(действие, через сколько миллисекунд);
    //setTimeout(действие, через сколько миллисекунд);
    //setTimeout выполнит действие один раз, а setInterval будет повторять действие с указанной периодичностью.

    //Как остановить действие
    //var id1 = setTimeout(действие, мс)
    //var id2 = setInterval(действие, мс)

    //clearTimeout(id1)
    //clearInterval(id2)

    //если останавливать не нужно, то и переменные id1, id2 тоже не нужны

    //Ну а действие - это функция
    //setInterval(function() { console.log('hello');}, 1000);

    //Тогда каждую секунду будет печататься hello.

    //Простейшая анимация устроена так:

    ctx.fillStyle = "red";
    var x = 10;
    function draw() {
        ctx.clearRect(0, 0, 640, 480);
        x += 3;
        ctx.fillRect(x, 50, 80, 80);
    }
    setInterval(draw, 1000 / 60); //60 раз в секунду
}