function init() {

    var stage = new createjs.Stage("game");
    var canvas = document.getElementById('game');

    const ARENA_H = 48;
    const ARENA_W = 64;

    const MOVE_LEFT = "KeyA";
    const MOVE_RIGHT = "KeyD";
    const MOVE_UP = "KeyW";
    const MOVE_DOWN = "KeyS";

    //****************************Создание уровня************************************

    var arena = new createjs.Container();

    var floor = new createjs.Shape();
    floor.graphics
        .beginFill("beige")
        .drawRect(0, 0, ARENA_W * 10, ARENA_H * 10);

    const wallThickness = 10;

    var levelGrid = new Array(58);

    function buildAWall(i, j) {
        var wallCell = new createjs.Shape();
        wallCell.graphics
            .beginFill("grey")
            // .drawRect(i * wallThickness, j * wallThickness, wallThickness, wallThickness);
            .drawRect(0, 0, wallThickness, wallThickness);
        wallCell.x = i * wallThickness;
        wallCell.y = j * wallThickness;

        return wallCell;
    }

    for (let i = 0; i < ARENA_W; i++) {
        levelGrid[i] = new Array(ARENA_H);
        for (let j = 0; j < ARENA_H; j++) {
            if (i === 0 || i === ARENA_W - 1 || j === 0 || j === ARENA_H - 1
                || (i === ARENA_W / 4 || i === 3 * ARENA_W / 4) && j > ARENA_H / 4 && j < 3 * ARENA_H / 4) {
                arena.addChild(buildAWall(i, j));
                levelGrid[i][j] = 1;

            } else
                levelGrid[i][j] = 0;
        }
    }

    //******************Создание персонажа***************************************************************

    var charBody = new createjs.Shape();
    charBody.graphics
        .beginFill('green')
        .drawRect(0, 0, 20, 20);

    var charGun = new createjs.Shape();
    charGun.graphics
        .beginFill('black')
        .drawRect(13, 2, 7, -15);

    var mainChar = new createjs.Container();
    mainChar.addChild(charGun, charBody);
    mainChar.setTransform(ARENA_W * 5, ARENA_H * 5, 1, 1, 0, 0, 0, 10, 10);
    const mainCharIntersectParam = 10;

    stage.addChild(floor, arena, mainChar);

    //******************Управление персонажем**********************************************************

    var map = {};
    map[MOVE_LEFT] = false;
    map[MOVE_RIGHT] = false;
    map[MOVE_DOWN] = false;
    map[MOVE_UP] = false;

    document.addEventListener('keydown', key_up_down_handler);
    document.addEventListener('keyup', key_up_down_handler);

    function key_up_down_handler(e) {
        if (!(e.code in map)) // если в словаре map нет записи с таким ключом
            return;

        map[e.code] = e.type === 'keydown';

        // e.preventDefault();
    }

    var prevPosition = [0, 0];

    createjs.Ticker.addEventListener("tick", function() {

        if (isIntersect(mainChar, mainCharIntersectParam)) {
            mainChar.x = prevPosition[0];
            mainChar.y = prevPosition[1];
            return;
        }

        prevPosition[0] = mainChar.x;
        prevPosition[1] = mainChar.y;

        if (map[MOVE_UP] && map[MOVE_LEFT]) {
            mainChar.x -= 5;
            mainChar.y -= 5;
        } else if (map[MOVE_UP] && map[MOVE_RIGHT]) {
            mainChar.x += 5;
            mainChar.y -= 5;
        } else if (map[MOVE_DOWN] && map[MOVE_LEFT]) {
            mainChar.x -= 5;
            mainChar.y += 5;
        } else if (map[MOVE_DOWN] && map[MOVE_RIGHT]) {
            mainChar.x += 5;
            mainChar.y += 5;
        } else if (map[MOVE_DOWN])
            mainChar.y += 5;
        else if (map[MOVE_UP])
            mainChar.y -= 5;
        else if (map[MOVE_LEFT])
            mainChar.x -= 5;
        else if (map[MOVE_RIGHT])
            mainChar.x += 5;
    });


    stage.addEventListener('stagemousemove', function (e) {
        mainChar.rotation = Math.atan2(e.localX - mainChar.x, -(e.localY - mainChar.y)) * (180 / Math.PI);
    });

    stage.addEventListener('click', function (e) {
        mainChar.rotation = Math.atan2(e.localX - mainChar.x, -(e.localY - mainChar.y)) * (180 / Math.PI);
    });

    //**************************Пересечение стен**********************************

    function isIntersect(shape, param) {
        for (let i = 0; i < arena.numChildren; i++) {
            let wall = arena.getChildAt(i);
            if (Math.max(shape.x - param, wall.x) < Math.min(shape.x + param, wall.x + wallThickness) &&
                Math.max(shape.y - param, wall.y) < Math.min(shape.y + param, wall.y + wallThickness))
                return true;
        }
        return false;
    }

    //****************************Стрельба********************************************

    const bulletSpeed = 5;
    const bulletRadius = 2;
    const bulletIntersectParam = 0.1;

    function fireBullet(dx, dy) {
        let bullet = new createjs.Shape();
        bullet.graphics
            .beginFill('red')
            .drawCircle(0, 0, bulletRadius);
        bullet.x = mainChar.x;
        bullet.y = mainChar.y;

        stage.addChild(bullet);
        bullet.addEventListener('tick', function () {
            bulletTick(bullet, dx, dy);
        });
    }

    function bulletTick(bullet, dx, dy) {
        let distance = Math.sqrt(dx * dx + dy * dy);
        bullet.x += dx / distance * bulletSpeed;
        bullet.y += dy / distance * bulletSpeed;
        if (isIntersect(bullet, bulletIntersectParam))
            stage.removeChild(bullet);
        if (outsideOfCanvas(bullet))
            stage.removeChild(bullet);
    }

    stage.addEventListener('click', function (e) {
        fireBullet(e.localX - mainChar.x, e.localY - mainChar.y);
    });

    function outsideOfCanvas(shape) {
        if (shape.x > canvas.width || shape.x < 0 || shape.y > canvas.height || shape.y < 0)
            stage.removeChild(shape);
    }


    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;
}