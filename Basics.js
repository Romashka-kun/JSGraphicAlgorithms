var x = 5; //int x = 5;
for (var i = 0; i < 10; i++) { //let заводит переменную для конкретного блока (ES 6)

}
//var - переменная заводится на всю функцию, второй раз в for не надо писать var перед i;
console.log("...");  //типа sout
console.debug("...");
console.time();
console.info();

//Функция

function f(x, y) {
    return x + y;
}
console.log(f(1, 2)); //выведет 2

function f1( ) { //вложенные функции

    function g(){
        //функцией g можно пользоваться только внутри функции f1
    }
}

//Функции в JS - это объекты 1-го рода, т.е. можно хранить в переменных

function f2(x, y) {
    return x + y;
}
function f3(x, y) {
    return x - y;
}
var h;
if (x > y)
    h = f2;
else
    h = f3;

h(1, 2);

// Анонимная функция

// function(arg) {
//     //тело
// }

var f = function(x){
    return x + 1;
};

//Замыкание - используем внешние переменные внутри функции
var a = 1;
function add(x) { return x + a;}
console.log(add(10));

a = 2; //изменили внешнюю переменную
console.log(add(10)); //зависит от внеш. переменной

var print = [null, null, null];
for (var i = 0; i < 3; i++) {
    print[i] = function() {
        console.log(i);
    };
}
// что напечатает
// print[1]()  - напечатает 3;
// исправить, чтобы print[i], печатал i

// Массивы
// Создание

a1 = [];
a2 = ["xyz", 1, 10, [1, 2, 3]];
a3 = new Array(10);

// a2[1] -->  1
// a2[2] -->  10
a2[2] = "ooo";
a2.length; // длина

// Операции

a = [10, 20, 30];
a.push(40); //добавить новый элемент в конец
b = a.slice();  //копия части массива (или всего, если нет аргументов)
a.splice(1, 1, "abc", "def");

a = [10, 20, 30];
b = a;
b[1] = 21;

// Объекты в JS

var o1 = {"name": "Ilya", "age": 42};
// или = {name: "Roma", age: 20};
//o1.name  - обратиться к полю
o1.name = "Roma";
o1.surname = "wow";
// o1["name"] - как будто это ассоциативный массив
// o1["na" + "me"] - тоже самое

// Помощь JS - MDN. Тут же учебник по консоли